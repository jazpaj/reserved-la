<?php
/**
 * Public Square config for the browser (NO secret token here).
 * The checkout fetches this to initialize the Square Web Payments SDK.
 */
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (!is_file(__DIR__ . '/config.php')) {
    echo json_encode(['configured' => false, 'error' => 'config.php missing']); exit;
}
require_once __DIR__ . '/config.php';
$cfg = rl_square_config();
$configured = !empty($cfg['SQUARE_APP_ID']) && strpos($cfg['SQUARE_APP_ID'], 'YOUR_') !== 0
           && !empty($cfg['SQUARE_LOCATION_ID']) && strpos($cfg['SQUARE_LOCATION_ID'], 'YOUR_') !== 0;

echo json_encode([
    'configured' => $configured,
    'env'        => $cfg['SQUARE_ENV'] ?? 'sandbox',
    'appId'      => $cfg['SQUARE_APP_ID'] ?? '',
    'locationId' => $cfg['SQUARE_LOCATION_ID'] ?? '',
]);
