<?php
/**
 * Reserved LA — send an order confirmation email via Resend.
 *
 * AUTH: every request must present the shared secret from config.php
 *       (POST field "token", or header  X-Send-Token). This stops the
 *       endpoint being abused as an open spam relay.
 *
 * TEST (send a sample to TEST_RECIPIENT):
 *   GET  /mail/send-order-confirmation.php?test=1&token=YOUR_TOKEN
 *
 * REAL SEND (JSON body):
 *   POST /mail/send-order-confirmation.php      (header X-Send-Token: YOUR_TOKEN)
 *   Content-Type: application/json
 *   {
 *     "customer_email": "buyer@email.com",
 *     "customer_first_name": "Sam",
 *     "order_number": "RL-100501",
 *     "order_date": "Sep 30, 2026",
 *     "payment_method": "Visa ending 4242",
 *     "estimated_delivery": "Oct 7, 2026",
 *     "subtotal": "$120.00", "shipping": "Free", "tax": "$10.90", "total": "$130.90",
 *     "shipping_name": "Sam Lee", "shipping_address_line1": "1 Main St",
 *     "shipping_city": "LA", "shipping_state": "CA", "shipping_zip": "90001",
 *     "shipping_method": "Standard US", "order_url": "https://reservedla.com/track-order.html",
 *     "items": [
 *       {"name":"Box-Fit Hoodie","color":"Bone","size":"L","quantity":1,
 *        "line_total":"$120.00","image_url":"https://reservedla.com/assets/products/xxx-front.jpg"}
 *     ]
 *   }
 *
 * Returns JSON: {"ok":true,"id":"..."} or {"ok":false,"error":"..."}
 */

// JSON API: never let a PHP notice/deprecation leak into the response body.
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');

$cfg = rl_config();

/* --- authenticate ---------------------------------------------------- */
$token = $_POST['token'] ?? ($_GET['token'] ?? ($_SERVER['HTTP_X_SEND_TOKEN'] ?? ''));
$want  = (string)($cfg['SEND_TOKEN'] ?? '');
if ($want === '' || $want === 'change-this-to-a-long-random-string' || !hash_equals($want, (string)$token)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Forbidden: missing or invalid token.']);
    exit;
}

/* --- gather data ----------------------------------------------------- */
$isTest = isset($_GET['test']) && $_GET['test'] === '1';

if ($isTest) {
    $data = rl_sample_order();
    $to   = $cfg['TEST_RECIPIENT'];
} else {
    // Accept a JSON body, or a normal form POST.
    $raw  = file_get_contents('php://input');
    $data = [];
    if ($raw !== '' && ($j = json_decode($raw, true)) && is_array($j)) {
        $data = $j;
    } elseif (!empty($_POST)) {
        $data = $_POST;
        unset($data['token']);
        if (isset($data['items']) && is_string($data['items'])) {
            $items = json_decode($data['items'], true);
            $data['items'] = is_array($items) ? $items : [];
        }
    }
    if (empty($data['customer_email']) || !filter_var($data['customer_email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'A valid customer_email is required.']);
        exit;
    }
    if (empty($data['item_count']) && !empty($data['items']) && is_array($data['items'])) {
        $data['item_count'] = count($data['items']);
    }
    $to = $data['customer_email'];
}

/* --- render + send --------------------------------------------------- */
$subject = 'Your Reserved LA order ' . ($data['order_number'] ?? '') . ' is confirmed';
try {
    $html = rl_render_file('order-confirmation.html', $data);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Template error: ' . $e->getMessage()]);
    exit;
}

$res = rl_resend_send(['to' => $to, 'subject' => $subject, 'html' => $html]);

if (!$res['ok']) http_response_code(502);
echo json_encode([
    'ok'      => $res['ok'],
    'id'      => $res['id'] ?? null,
    'error'   => $res['error'] ?? null,
    'to'      => $to,
    'subject' => $subject,
]);
