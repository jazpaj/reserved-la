<?php
/**
 * Reserved LA — Square payment config.
 *
 * SETUP:
 *   1. Copy this file to  config.php  (same folder).
 *   2. Fill in your Square IDs/token.  Never commit config.php — it holds the secret token.
 *
 * Get these from the Square Developer Dashboard (https://developer.squareup.com):
 *   - Application ID  (public — used in the browser)
 *   - Location ID     (public — used in the browser)
 *   - Access Token    (SECRET — server-side only)
 * Start with the SANDBOX credentials to test, then switch to Production.
 */
function rl_square_config() {
    return [
        // 'sandbox' while testing, 'production' when you go live.
        'SQUARE_ENV'          => 'sandbox',

        // Public IDs (safe to expose to the browser):
        'SQUARE_APP_ID'       => 'YOUR_SANDBOX_APPLICATION_ID',
        'SQUARE_LOCATION_ID'  => 'YOUR_SANDBOX_LOCATION_ID',

        // SECRET — server-side only. Use the token that matches SQUARE_ENV.
        'SQUARE_ACCESS_TOKEN' => 'YOUR_SANDBOX_ACCESS_TOKEN',

        // Square API version (date string). Bump if Square asks you to.
        'SQUARE_VERSION'      => '2024-10-17',

        // --- Order math (must match the storefront's checkout rules) ---------
        'CURRENCY'            => 'USD',
        'FREE_SHIP_THRESHOLD' => 150,
        'SHIP_FEE'            => 6.95,
        'PROMOS'              => ['RESERVED10' => 0.10, 'FW26' => 0.15],
    ];
}
