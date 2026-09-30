<?php
/**
 * Reserved LA — send an order confirmation via Microsoft 365 / Outlook SMTP.
 *
 * AUTH: every request must present the shared secret from config.php
 *       (POST field "token", or header X-Send-Token).
 *
 * TEST (sample to TEST_RECIPIENT):
 *   GET  /mail/send-order-confirmation.php?test=1&token=YOUR_TOKEN
 *
 * REAL SEND: POST JSON with the order data (see README).  X-Send-Token header required.
 */

ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

header('Content-Type: application/json; charset=utf-8');

if (!is_file(__DIR__ . '/config.php')) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'config.php is missing. In mail/, copy config.sample.php to config.php and fill it in.']);
    exit;
}
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib.php';

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
    $data['customer_email'] = $cfg['TEST_RECIPIENT'];
} else {
    $raw  = file_get_contents('php://input');
    $data = [];
    if ($raw !== '' && ($j = json_decode($raw, true)) && is_array($j)) {
        $data = $j;
    } elseif (!empty($_POST)) {
        $data = $_POST; unset($data['token']);
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
}

/* --- send ------------------------------------------------------------ */
$res = rl_send_order_confirmation($data);
if (!$res['ok']) http_response_code($res['status'] && $res['status'] >= 400 ? $res['status'] : 502);
echo json_encode([
    'ok'      => $res['ok'],
    'id'      => $res['id'] ?? null,
    'error'   => $res['error'] ?? null,
    'to'      => $data['customer_email'],
    'subject' => $res['subject'] ?? null,
]);
