<?php
/**
 * Reserved LA — charge a Square payment (browser-facing).
 *
 * The checkout tokenizes the card with Square's SDK (card data never touches us)
 * and POSTs the token + cart here. We recompute the total server-side and charge
 * via the Square Payments API using the secret access token in config.php.
 *
 * POST JSON: { token, items:[{id,qty}], promo }
 * Returns:   { ok, payment_id, total, error }
 */
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405); echo json_encode(['ok' => false, 'error' => 'POST only.']); exit;
}
if (!is_file(__DIR__ . '/config.php')) {
    http_response_code(500); echo json_encode(['ok' => false, 'error' => 'Square config.php is missing. Copy config.sample.php to config.php and fill it in.']); exit;
}
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib.php';

/* --- same-origin guard (stops cross-site abuse) --------------------- */
$cfg = rl_square_config();
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
$srcId = isset($in['token']) ? trim((string)$in['token']) : '';
$items = isset($in['items']) && is_array($in['items']) ? $in['items'] : [];
$promo = isset($in['promo']) ? (string)$in['promo'] : '';

if ($srcId === '') { http_response_code(422); echo json_encode(['ok' => false, 'error' => 'Missing card token.']); exit; }

$calc = rl_compute_total($items, $promo);
if (!$calc['ok']) { http_response_code(422); echo json_encode(['ok' => false, 'error' => $calc['error']]); exit; }
$amountCents = (int) round($calc['total'] * 100);
if ($amountCents < 50) { http_response_code(422); echo json_encode(['ok' => false, 'error' => 'Order total too low.']); exit; }

/* --- charge --------------------------------------------------------- */
$idem = bin2hex(random_bytes(16));
$res  = rl_square_create_payment($srcId, $amountCents, $idem);

if (!$res['ok']) { http_response_code($res['status'] && $res['status'] >= 400 ? 402 : 502);
    echo json_encode(['ok' => false, 'error' => $res['error']]); exit; }

echo json_encode([
    'ok'          => true,
    'payment_id'  => $res['payment_id'],
    'receipt_url' => $res['receipt_url'] ?? null,
    'card_last4'  => $res['card_last4'] ?? null,
    'total'       => number_format($calc['total'], 2, '.', ''),
]);
