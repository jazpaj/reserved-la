<?php
/**
 * Reserved LA — charge an NMI payment (browser-facing).
 *
 * The checkout tokenizes the card with NMI Collect.js (card data never touches
 * us) and POSTs the token + cart here. We recompute the total server-side and
 * charge via the NMI Payment API using the Security Key in config.php.
 *
 * POST JSON: { token, items:[{id,qty}], promo, email, firstName, lastName,
 *              address, city, state, zip }
 * Returns:   { ok, transaction_id, card_last4, total, error }
 */
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405); echo json_encode(['ok' => false, 'error' => 'POST only.']); exit;
}
if (!is_file(__DIR__ . '/config.php')) {
    http_response_code(500); echo json_encode(['ok' => false, 'error' => 'NMI config.php is missing. Copy config.sample.php to config.php and fill it in.']); exit;
}
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib.php';

/* --- same-origin guard (stops cross-site abuse) --------------------- */
$cfg = rl_nmi_config();
$allowed = ['localhost','127.0.0.1'];
$host = strtolower($_SERVER['HTTP_HOST'] ?? ''); if ($host) $allowed[] = $host;
$allowed[] = 'reservedla.com'; $allowed[] = 'www.reservedla.com';
$src = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$srcHost = $src ? strtolower((string)parse_url($src, PHP_URL_HOST)) : '';
if ($srcHost === '' || !in_array($srcHost, array_unique(array_filter($allowed)), true)) {
    http_response_code(403); echo json_encode(['ok' => false, 'error' => 'Cross-origin requests are not allowed.']); exit;
}

/* --- read + validate ------------------------------------------------ */
$raw = file_get_contents('php://input');
$in  = ($raw !== '' && ($j = json_decode($raw, true)) && is_array($j)) ? $j : [];
$token = isset($in['token']) ? trim((string)$in['token']) : '';
$items = isset($in['items']) && is_array($in['items']) ? $in['items'] : [];
$promo = isset($in['promo']) ? (string)$in['promo'] : '';

if ($token === '') { http_response_code(422); echo json_encode(['ok' => false, 'error' => 'Missing card token.']); exit; }

$calc = rl_compute_total($items, $promo);
if (!$calc['ok']) { http_response_code(422); echo json_encode(['ok' => false, 'error' => $calc['error']]); exit; }
if ($calc['total'] < 0.50) { http_response_code(422); echo json_encode(['ok' => false, 'error' => 'Order total too low.']); exit; }

/* --- charge --------------------------------------------------------- */
$info = [
    'orderid'    => 'RL-' . date('ymd') . '-' . substr(bin2hex(random_bytes(3)), 0, 6),
    'email'      => $in['email']     ?? '',
    'first_name' => $in['firstName'] ?? '',
    'last_name'  => $in['lastName']  ?? '',
    'address1'   => $in['address']   ?? '',
    'city'       => $in['city']      ?? '',
    'state'      => $in['state']     ?? '',
    'zip'        => $in['zip']       ?? '',
];
$res = rl_nmi_sale($token, $calc['total'], $info);

if (!$res['ok']) {
    // Keys off/unset -> tell the browser so it can fall back to demo mode.
    if (!empty($res['key_error'])) { echo json_encode(['ok' => false, 'key_error' => true, 'error' => $res['error']]); exit; }
    http_response_code($res['status'] && $res['status'] >= 400 ? 402 : 502);
    echo json_encode(['ok' => false, 'error' => $res['error']]); exit;
}

echo json_encode([
    'ok'             => true,
    'transaction_id' => $res['transaction_id'],
    'card_last4'     => $res['card_last4'] ?? null,
    'order_id'       => $info['orderid'],
    'total'          => number_format($calc['total'], 2, '.', ''),
]);
