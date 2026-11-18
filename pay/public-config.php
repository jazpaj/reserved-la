<?php
/**
 * Public NMI config for the browser (NO security key here).
 * The checkout fetches this to initialize NMI Collect.js.
 *   - configured: true once a real Tokenization Key is set in config.php
 *   - tokenizationKey: PUBLIC Collect.js key (safe to expose)
 *   - collectJsUrl: Collect.js script URL on your gateway
 */
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (!is_file(__DIR__ . '/config.php')) {
    echo json_encode(['configured' => false, 'error' => 'config.php missing']); exit;
}
require_once __DIR__ . '/config.php';
$cfg = rl_nmi_config();

$tokKey = (string)($cfg['NMI_TOKENIZATION_KEY'] ?? '');
$configured = $tokKey !== '' && strpos($tokKey, 'YOUR_') !== 0;

$host = trim((string)($cfg['NMI_GATEWAY'] ?? 'secure.nmi.com'));
$host = rtrim(preg_replace('#^https?://#', '', $host), '/');
if ($host === '') $host = 'secure.nmi.com';

echo json_encode([
    'configured'      => $configured,
    'tokenizationKey' => $configured ? $tokKey : '',
    'collectJsUrl'    => 'https://' . $host . '/token/Collect.js',
]);
