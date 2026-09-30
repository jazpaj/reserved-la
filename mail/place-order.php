<?php
/**
 * Reserved LA — checkout order handler (browser-facing).
 *
 * The checkout page POSTs the order here after "payment". No secret lives in the
 * browser: this sends via Microsoft 365 / Outlook SMTP using config.php.
 *
 * Abuse protection: same-origin POSTs only (Origin/Referer must be one of the
 * site's own hosts) and it only emails the address on the order.
 * NOTE: Origin/Referer can be spoofed by non-browser clients; for production,
 * also verify the order against a real payment/order record.
 */

ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST only.']);
    exit;
}

/* --- same-origin check ---------------------------------------------- */
$cfg = rl_config();
$allowed = [];
$siteHost = parse_url($cfg['SITE_URL'] ?? 'https://reservedla.com', PHP_URL_HOST);
if ($siteHost) {
    $bare = strtolower(preg_replace('/^www\./', '', $siteHost));
    $allowed[] = $bare; $allowed[] = 'www.' . $bare;
}
$allowed[] = strtolower($_SERVER['HTTP_HOST'] ?? '');
$allowed[] = 'localhost'; $allowed[] = '127.0.0.1';
$allowed = array_values(array_unique(array_filter($allowed)));

$src = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$srcHost = $src ? strtolower((string)parse_url($src, PHP_URL_HOST)) : '';
if ($srcHost === '' || !in_array($srcHost, $allowed, true)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Cross-origin requests are not allowed.']);
    exit;
}

/* --- read order ----------------------------------------------------- */
$raw  = file_get_contents('php://input');
$data = ($raw !== '' && ($j = json_decode($raw, true)) && is_array($j)) ? $j : $_POST;

if (empty($data['customer_email']) || !filter_var($data['customer_email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'A valid customer_email is required.']);
    exit;
}
if (empty($data['items']) || !is_array($data['items'])) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Order has no items.']);
    exit;
}

/* --- send ----------------------------------------------------------- */
$res = rl_send_order_confirmation($data);
if (!$res['ok']) http_response_code($res['status'] && $res['status'] >= 400 ? $res['status'] : 502);
echo json_encode(['ok' => $res['ok'], 'id' => $res['id'] ?? null, 'error' => $res['error'] ?? null]);
