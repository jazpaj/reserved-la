<?php
/**
 * Reserved LA — NMI payment config.
 *
 * SETUP:
 *   1. Copy this file to  config.php  (same folder).
 *   2. Fill in your NMI keys.  Never commit config.php — it holds the Security Key.
 *
 * Get these from your NMI merchant dashboard (Settings → Security Keys, and
 * Settings → Collect.js / Tokenization):
 *   - Security Key      (SECRET — server-side only; authorizes the charge)
 *   - Tokenization Key  (PUBLIC — used in the browser by Collect.js)
 *
 * Collect.js tokenizes the card in the browser, so raw card data never touches
 * this server (PCI-light). The Security Key only lives here, server-side.
 */
function rl_nmi_config() {
    return [
        // --- Gateway host --------------------------------------------------
        // Standard NMI direct accounts use 'secure.nmi.com'.
        // If your NMI account is white-labeled through a reseller, set this to
        // THAT gateway's host (e.g. 'secure.yourgateway.com'). Both the Collect.js
        // URL and the charge URL (transact.php) are built from this one value.
        'NMI_GATEWAY'          => 'secure.nmi.com',

        // --- Keys ----------------------------------------------------------
        'NMI_SECURITY_KEY'     => 'YOUR_NMI_SECURITY_KEY',      // SECRET — server-side only
        'NMI_TOKENIZATION_KEY' => 'YOUR_NMI_TOKENIZATION_KEY',  // PUBLIC — safe in the browser

        // --- Order math (must match the storefront's checkout rules) ---------
        'CURRENCY'            => 'USD',
        'FREE_SHIP_THRESHOLD' => 150,
        'SHIP_FEE'            => 6.95,
        'PROMOS'              => ['RESERVED10' => 0.10, 'FW26' => 0.15],
    ];
}
