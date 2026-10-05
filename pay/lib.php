<?php
/**
 * Reserved LA — Square payments helper.
 * Server-side total calculation (anti-tamper) + Square Payments API call (HTTPS).
 */

function rl_square_base() {
    $cfg = rl_square_config();
    return ($cfg['SQUARE_ENV'] === 'production')
        ? 'https://connect.squareup.com'
        : 'https://connect.squareupsandbox.com';
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
    $cfg = rl_square_config();
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
 * Create a Square payment from a tokenized card (source_id).
 * @return array {ok, status, payment_id, receipt_url, error}
 */
function rl_square_create_payment($sourceId, $amountCents, $idempotencyKey) {
    $cfg = rl_square_config();
    $token = $cfg['SQUARE_ACCESS_TOKEN'] ?? '';
    if ($token === '' || strpos($token, 'YOUR_') === 0) {
        return ['ok' => false, 'status' => 500, 'payment_id' => null, 'error' => 'Square access token not set in config.php'];
    }
    $payload = json_encode([
        'source_id'       => $sourceId,
        'idempotency_key' => $idempotencyKey,
        'location_id'     => $cfg['SQUARE_LOCATION_ID'],
        'amount_money'    => ['amount' => (int)$amountCents, 'currency' => $cfg['CURRENCY'] ?? 'USD'],
    ]);
    $url = rl_square_base() . '/v2/payments';
    $headers = [
        'Square-Version: ' . ($cfg['SQUARE_VERSION'] ?? '2024-10-17'),
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
    ];

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => $headers, CURLOPT_TIMEOUT => 25,
        ]);
        $body = curl_exec($ch); $status = curl_getinfo($ch, CURLINFO_HTTP_CODE); $err = curl_error($ch);
        if ($body === false) return ['ok' => false, 'status' => 0, 'payment_id' => null, 'error' => 'cURL: ' . $err];
    } else {
        $ctx = stream_context_create(['http' => [
            'method' => 'POST', 'header' => implode("\r\n", $headers), 'content' => $payload,
            'timeout' => 25, 'ignore_errors' => true,
        ]]);
        $body = @file_get_contents($url, false, $ctx);
        $status = 0;
        $h = function_exists('http_get_last_response_headers') ? http_get_last_response_headers() : ($GLOBALS['http_response_header'] ?? []);
        if (!empty($h[0]) && preg_match('/\s(\d{3})\s/', $h[0], $m)) $status = (int)$m[1];
        if ($body === false) return ['ok' => false, 'status' => 0, 'payment_id' => null, 'error' => 'HTTP request failed (no cURL)'];
    }

    $d = json_decode($body, true);
    if ($status >= 200 && $status < 300 && !empty($d['payment'])) {
        $pay = $d['payment'];
        return ['ok' => true, 'status' => $status, 'payment_id' => $pay['id'] ?? null,
                'receipt_url' => $pay['receipt_url'] ?? null,
                'card_last4' => $pay['card_details']['card']['last_4'] ?? null, 'error' => null];
    }
    $msg = 'Payment declined.';
    if (!empty($d['errors'][0])) $msg = $d['errors'][0]['detail'] ?? ($d['errors'][0]['code'] ?? $msg);
    return ['ok' => false, 'status' => $status, 'payment_id' => null, 'error' => $msg];
}
