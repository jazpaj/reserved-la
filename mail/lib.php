<?php
/**
 * Reserved LA — minimal helpers: template rendering + Resend sending.
 */

/* ---------- Template rendering ---------------------------------------- */
/* Supports {{variable}} and {{#each list}} ... {{/each}} (the subset used by
   the order-confirmation template). Values are HTML-escaped by default. */

function rl_esc($v) { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); }

function rl_replace_vars($tpl, array $ctx, array $globals = []) {
    return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($m) use ($ctx, $globals) {
        $k = $m[1];
        if (array_key_exists($k, $ctx))        $v = $ctx[$k];
        elseif (array_key_exists($k, $globals)) $v = $globals[$k];
        else return '';
        return strpos($k, 'raw_') === 0 ? (string)$v : rl_esc($v);
    }, $tpl);
}

function rl_render($tpl, array $data) {
    $tpl = preg_replace_callback('/\{\{\s*#each\s+([a-zA-Z0-9_]+)\s*\}\}(.*?)\{\{\s*\/each\s*\}\}/s',
        function ($m) use ($data) {
            $rows = (isset($data[$m[1]]) && is_array($data[$m[1]])) ? $data[$m[1]] : [];
            $out = '';
            foreach ($rows as $row) if (is_array($row)) $out .= rl_replace_vars($m[2], $row, $data);
            return $out;
        }, $tpl);
    return rl_replace_vars($tpl, $data, $data);
}

function rl_render_file($name, array $data) {
    $path = __DIR__ . '/templates/' . basename($name);
    if (!is_file($path)) throw new RuntimeException("Template not found: $name");
    return rl_render(file_get_contents($path), $data);
}

/* ---------- Resend ---------------------------------------------------- */

function rl_resend_send(array $opts) {
    $cfg = rl_config();
    $key = $cfg['RESEND_API_KEY'] ?? '';
    if ($key === '' || strpos($key, 'YOUR_') === 0) {
        return ['ok' => false, 'status' => 0, 'id' => null, 'error' => 'Resend API key not set in config.php'];
    }
    $payload = [
        'from'    => $opts['from'] ?? $cfg['FROM'],
        'to'      => is_array($opts['to']) ? $opts['to'] : [$opts['to']],
        'subject' => $opts['subject'] ?? '',
        'html'    => $opts['html'] ?? '',
    ];
    if (!empty($cfg['REPLY_TO'])) $payload['reply_to'] = $cfg['REPLY_TO'];

    $json = json_encode($payload);
    $url  = 'https://api.resend.com/emails';

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_POSTFIELDS => $json,
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
            CURLOPT_TIMEOUT => 20,
        ]);
        $body = curl_exec($ch); $status = curl_getinfo($ch, CURLINFO_HTTP_CODE); $err = curl_error($ch); curl_close($ch);
        if ($body === false) return ['ok' => false, 'status' => 0, 'id' => null, 'error' => 'cURL: ' . $err];
    } else {
        $ctx = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Authorization: Bearer $key\r\nContent-Type: application/json\r\n",
            'content' => $json, 'timeout' => 20, 'ignore_errors' => true,
        ]]);
        $body = @file_get_contents($url, false, $ctx);
        $status = 0;
        $hdrs = function_exists('http_get_last_response_headers')
            ? http_get_last_response_headers()
            : ($GLOBALS['http_response_header'] ?? []);
        if (!empty($hdrs[0]) && preg_match('/\s(\d{3})\s/', $hdrs[0], $mm)) $status = (int)$mm[1];
        if ($body === false) return ['ok' => false, 'status' => 0, 'id' => null, 'error' => 'HTTP request failed (no cURL)'];
    }
    $d = json_decode($body, true);
    if ($status >= 200 && $status < 300) return ['ok' => true, 'status' => $status, 'id' => $d['id'] ?? null, 'error' => null];
    return ['ok' => false, 'status' => $status, 'id' => null, 'error' => $d['message'] ?? $d['error'] ?? ('HTTP ' . $status)];
}

/* ---------- Order confirmation (shared by both endpoints) ------------- */

/**
 * Render + send the order-confirmation email.
 * Expects $data['customer_email']; derives item_count if missing.
 * @return array result from rl_resend_send() plus 'subject'
 */
function rl_send_order_confirmation(array $data) {
    if (empty($data['customer_email']) || !filter_var($data['customer_email'], FILTER_VALIDATE_EMAIL)) {
        return ['ok' => false, 'status' => 422, 'id' => null, 'error' => 'A valid customer_email is required.'];
    }
    if (empty($data['item_count']) && !empty($data['items']) && is_array($data['items'])) {
        $data['item_count'] = count($data['items']);
    }
    $subject = 'Your Reserved LA order ' . ($data['order_number'] ?? '') . ' is confirmed';
    try {
        $html = rl_render_file('order-confirmation.html', $data);
    } catch (Throwable $e) {
        return ['ok' => false, 'status' => 500, 'id' => null, 'error' => 'Template error: ' . $e->getMessage()];
    }
    $res = rl_resend_send(['to' => $data['customer_email'], 'subject' => $subject, 'html' => $html]);
    $res['subject'] = $subject;
    return $res;
}

/* ---------- Sample data (for the test send) -------------------------- */

function rl_sample_order() {
    $items = [
        ['name'=>'Washed Hooded Chore Jacket','color'=>'Washed Black','size'=>'L','quantity'=>1,'line_total'=>'$148.00',
         'image_url'=>'https://reservedla.com/assets/products/rl-jk-0142-front.jpg'],
        ['name'=>'Baggy Multi-Pocket Cargo Jeans','color'=>'Mid Indigo','size'=>'32','quantity'=>1,'line_total'=>'$118.00',
         'image_url'=>'https://reservedla.com/assets/products/rl-dn-0088-front.jpg'],
    ];
    return [
        'customer_first_name'=>'Alex','customer_email'=>'alex@example.com',
        'order_number'=>'RL-100482','order_date'=>date('M j, Y'),
        'payment_method'=>'Visa ending 4242','estimated_delivery'=>date('M j, Y', strtotime('+7 days')),
        'item_count'=>count($items),'items'=>$items,
        'subtotal'=>'$266.00','shipping'=>'Free','tax'=>'$24.19','total'=>'$290.19',
        'shipping_name'=>'Alex Rivera','shipping_address_line1'=>'742 Sunset Blvd',
        'shipping_city'=>'Los Angeles','shipping_state'=>'CA','shipping_zip'=>'90026',
        'shipping_method'=>'Standard US','order_url'=>'https://reservedla.com/track-order.html',
    ];
}
