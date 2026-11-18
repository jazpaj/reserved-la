<?php
/**
 * Reserved LA — NMI payments helper.
 * Server-side total calculation (anti-tamper) + NMI Payment API call (HTTPS).
 */

/** Full gateway base URL, e.g. https://secure.nmi.com */
function rl_nmi_base() {
    $cfg  = rl_nmi_config();
    $host = trim((string)($cfg['NMI_GATEWAY'] ?? 'secure.nmi.com'));
    $host = preg_replace('#^https?://#', '', $host);      // tolerate a full URL in config
    $host = rtrim($host, '/');
    if ($host === '') $host = 'secure.nmi.com';
    return 'https://' . $host;
}

/** Load the {id: price} map generated from the catalog. */
function rl_prices() {
    static $p = null;
    if ($p === null) {
        $f = __DIR__ . '/prices.json';
        $p = is_file($f) ? (json_decode(file_get_contents($f), true) ?: []) : [];
    }
    return $p;
}

/**
 * Recompute the authoritative order total from the server-side price list.
 * Never trust an amount sent by the browser.
 *
 * @param array  $items  [{id, qty}]
 * @param string $promo  optional promo code
 * @return array {ok, subtotal, discount, shipping, total, error}
 */
function rl_compute_total(array $items, $promo = '') {
    $cfg = rl_nmi_config();
    $prices = rl_prices();
    if (!$prices) return ['ok' => false, 'error' => 'Price list unavailable on server.'];

    $subtotal = 0.0; $count = 0;
    foreach ($items as $it) {
        $id  = isset($it['id']) ? (string)$it['id'] : '';
        $qty = isset($it['qty']) ? (int)$it['qty'] : 0;
        if ($id === '' || $qty < 1) continue;
        if (!isset($prices[$id])) return ['ok' => false, 'error' => 'Unknown item: ' . $id];
        $subtotal += ((float)$prices[$id]) * $qty;
        $count += $qty;
    }
    if ($count < 1) return ['ok' => false, 'error' => 'Cart is empty.'];

    $rate = 0.0;
    $code = strtoupper(trim((string)$promo));
    if ($code !== '' && isset($cfg['PROMOS'][$code])) $rate = (float)$cfg['PROMOS'][$code];
    $discount  = round($subtotal * $rate, 2);
    $afterDisc = $subtotal - $discount;
    $shipping  = ($afterDisc >= $cfg['FREE_SHIP_THRESHOLD'] || $afterDisc <= 0) ? 0.0 : (float)$cfg['SHIP_FEE'];
    $total     = round($afterDisc + $shipping, 2);

    return ['ok' => true, 'subtotal' => round($subtotal,2), 'discount' => $discount,
            'shipping' => $shipping, 'total' => $total, 'error' => null];
}

/**
 * Charge a tokenized card (Collect.js payment token) via the NMI Payment API.
 *
 * NMI's transact.php takes url-encoded fields and returns a url-encoded query
 * string: response=1 (approved) | 2 (declined) | 3 (error), plus transactionid,
 * authcode, responsetext, response_code, etc.
 *
 * @param string $token   Collect.js payment_token
 * @param float  $amount  order total in DOLLARS (NMI amount is dollars.cents)
 * @param array  $info    optional {orderid, email, first_name, last_name, address1, city, state, zip}
 * @return array {ok, status, transaction_id, auth_code, card_last4, error}
 */
function rl_nmi_sale($token, $amount, array $info = []) {
    $cfg = rl_nmi_config();
    $key = trim((string)($cfg['NMI_SECURITY_KEY'] ?? ''));
    if ($key === '' || strpos($key, 'YOUR_') === 0) {
        return ['ok' => false, 'status' => 500, 'transaction_id' => null,
                'error' => 'NMI security key not set in config.php', 'key_error' => true];
    }

    $fields = [
        'security_key' => $key,
        'type'         => 'sale',
        'payment_token'=> (string)$token,
        'amount'       => number_format((float)$amount, 2, '.', ''),
        'currency'     => $cfg['CURRENCY'] ?? 'USD',
    ];
    // Optional order/customer context (helps reporting + fraud tools).
    foreach (['orderid','email','first_name','last_name','address1','city','state','zip'] as $k) {
        if (!empty($info[$k])) $fields[$k] = substr((string)$info[$k], 0, 120);
    }
    $body = http_build_query($fields);
    $url  = rl_nmi_base() . '/api/transact.php';
    $headers = ['Content-Type: application/x-www-form-urlencoded'];

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers, CURLOPT_TIMEOUT => 25,
        ]);
        $resp = curl_exec($ch); $status = curl_getinfo($ch, CURLINFO_HTTP_CODE); $err = curl_error($ch);
        if ($resp === false) return ['ok' => false, 'status' => 0, 'transaction_id' => null, 'error' => 'cURL: ' . $err];
    } else {
        $ctx = stream_context_create(['http' => [
            'method' => 'POST', 'header' => implode("\r\n", $headers), 'content' => $body,
            'timeout' => 25, 'ignore_errors' => true,
        ]]);
        $resp = @file_get_contents($url, false, $ctx);
        $status = 0;
        $h = function_exists('http_get_last_response_headers') ? http_get_last_response_headers() : ($GLOBALS['http_response_header'] ?? []);
        if (!empty($h[0]) && preg_match('/\s(\d{3})\s/', $h[0], $m)) $status = (int)$m[1];
        if ($resp === false) return ['ok' => false, 'status' => 0, 'transaction_id' => null, 'error' => 'HTTP request failed (no cURL)'];
    }

    // NMI replies as a url-encoded query string.
    parse_str((string)$resp, $r);
    $code = isset($r['response']) ? (int)$r['response'] : 0;   // 1 approved, 2 declined, 3 error
    if ($code === 1) {
        return [
            'ok'             => true,
            'status'         => $status ?: 200,
            'transaction_id' => $r['transactionid'] ?? null,
            'auth_code'      => $r['authcode'] ?? null,
            'card_last4'     => (!empty($r['cc_number']) && preg_match('/(\d{4})\D*$/', $r['cc_number'], $mm)) ? $mm[1] : null,
            'error'          => null,
        ];
    }
    $msg = $r['responsetext'] ?? 'Your payment was declined. Please try another card.';
    return ['ok' => false, 'status' => $status ?: 402, 'transaction_id' => null, 'error' => $msg];
}
