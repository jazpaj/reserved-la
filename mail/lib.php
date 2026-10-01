<?php
/**
 * Reserved LA — helpers: template rendering + Microsoft Graph (HTTPS) sending.
 *
 * Sends as the Outlook mailbox via the Microsoft Graph API over HTTPS (port 443),
 * which GoDaddy allows (unlike SMTP, which GoDaddy blocks). Uses the OAuth2
 * client-credentials flow with an Entra app registration (Mail.Send permission).
 */

/* ---------- Template rendering --------------------------------------- */
function rl_esc($v) { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); }

function rl_replace_vars($tpl, array $ctx, array $globals = []) {
    return preg_replace_callback('/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/', function ($m) use ($ctx, $globals) {
        $k = $m[1];
        if (array_key_exists($k, $ctx))         $v = $ctx[$k];
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

/* ---------- small HTTPS helper (cURL w/ fallback) -------------------- */
function rl_http_post($url, $body, array $headers) {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers, CURLOPT_TIMEOUT => 20,
        ]);
        $resp = curl_exec($ch); $status = curl_getinfo($ch, CURLINFO_HTTP_CODE); $err = curl_error($ch);
        if ($resp === false) return ['status' => 0, 'body' => '', 'error' => 'cURL: ' . $err];
        return ['status' => $status, 'body' => $resp, 'error' => null];
    }
    $ctx = stream_context_create(['http' => [
        'method' => 'POST', 'header' => implode("\r\n", $headers), 'content' => $body,
        'timeout' => 20, 'ignore_errors' => true,
    ]]);
    $resp = @file_get_contents($url, false, $ctx);
    $status = 0;
    $hdrs = function_exists('http_get_last_response_headers') ? http_get_last_response_headers() : ($GLOBALS['http_response_header'] ?? []);
    if (!empty($hdrs[0]) && preg_match('/\s(\d{3})\s/', $hdrs[0], $m)) $status = (int)$m[1];
    if ($resp === false) return ['status' => 0, 'body' => '', 'error' => 'HTTP request failed (no cURL)'];
    return ['status' => $status, 'body' => $resp, 'error' => null];
}

/* ---------- Microsoft Graph: get token + send ----------------------- */

function rl_graph_token() {
    $cfg = rl_config();
    $secret = $cfg['CLIENT_SECRET'] ?? '';
    if ($secret === '' || strpos($secret, 'YOUR_') === 0) {
        return ['ok' => false, 'error' => 'Graph client secret not set in config.php'];
    }
    $url = 'https://login.microsoftonline.com/' . rawurlencode($cfg['TENANT_ID']) . '/oauth2/v2.0/token';
    $body = http_build_query([
        'client_id'     => $cfg['CLIENT_ID'],
        'client_secret' => $secret,
        'scope'         => 'https://graph.microsoft.com/.default',
        'grant_type'    => 'client_credentials',
    ]);
    $r = rl_http_post($url, $body, ['Content-Type: application/x-www-form-urlencoded']);
    if ($r['error']) return ['ok' => false, 'error' => $r['error']];
    $d = json_decode($r['body'], true);
    if ($r['status'] >= 200 && $r['status'] < 300 && !empty($d['access_token'])) {
        return ['ok' => true, 'token' => $d['access_token']];
    }
    $msg = $d['error_description'] ?? ($d['error'] ?? ('HTTP ' . $r['status']));
    // first line only (Azure error_description is long)
    $msg = trim(strtok((string)$msg, "\r\n"));
    return ['ok' => false, 'error' => 'Token request failed: ' . $msg];
}

function rl_send_graph(array $opts) {
    $cfg = rl_config();
    $tok = rl_graph_token();
    if (!$tok['ok']) return ['ok' => false, 'status' => 502, 'id' => null, 'error' => $tok['error']];

    $to = is_array($opts['to']) ? $opts['to'] : [$opts['to']];
    $message = [
        'subject'      => $opts['subject'] ?? '',
        'body'         => ['contentType' => 'HTML', 'content' => $opts['html'] ?? ''],
        'toRecipients' => array_map(fn($a) => ['emailAddress' => ['address' => $a]], $to),
    ];
    if (!empty($cfg['REPLY_TO'])) {
        $message['replyTo'] = [['emailAddress' => ['address' => $cfg['REPLY_TO']]]];
    }
    $payload = json_encode(['message' => $message, 'saveToSentItems' => true]);

    $url = 'https://graph.microsoft.com/v1.0/users/' . rawurlencode($cfg['SENDER']) . '/sendMail';
    $r = rl_http_post($url, $payload, [
        'Authorization: Bearer ' . $tok['token'],
        'Content-Type: application/json',
    ]);
    if ($r['error']) return ['ok' => false, 'status' => 0, 'id' => null, 'error' => $r['error']];
    if ($r['status'] === 202) return ['ok' => true, 'status' => 202, 'id' => null, 'error' => null];

    $d = json_decode($r['body'], true);
    $msg = $d['error']['message'] ?? ($d['error'] ?? ('HTTP ' . $r['status']));
    return ['ok' => false, 'status' => $r['status'], 'id' => null, 'error' => is_string($msg) ? $msg : json_encode($msg)];
}

/* ---------- Order confirmation (shared by both endpoints) ------------ */

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
    $res = rl_send_graph(['to' => $data['customer_email'], 'subject' => $subject, 'html' => $html]);
    $res['subject'] = $subject;
    return $res;
}

/* ---------- Sample data (for the test send) ------------------------- */

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
