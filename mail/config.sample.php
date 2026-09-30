<?php
/**
 * Reserved LA — order confirmation email config (Resend HTTPS API).
 *
 * Resend is used because GoDaddy shared hosting blocks outbound SMTP,
 * but allows outbound HTTPS — which Resend's API uses.
 *
 * SETUP:
 *   1. Copy this file to  config.php  (same folder).
 *   2. Fill in the values.  Never commit config.php — it holds your API key.
 */
function rl_config() {
    return [
        // --- Resend ---------------------------------------------------------
        // Create a key at https://resend.com/api-keys  (starts with "re_")
        'RESEND_API_KEY' => 'YOUR_RESEND_API_KEY',

        // The sender. To send from @reservedla.com you must verify the domain in
        // Resend first (Domains → Add domain → add the DNS records at GoDaddy).
        // BEFORE the domain is verified, you can test with: 'Reserved LA <onboarding@resend.dev>'
        'FROM'     => 'Reserved LA <orders@reservedla.com>',
        'REPLY_TO' => 'support@reservedla.com',   // customer replies go to your Outlook inbox

        // --- Site / security -----------------------------------------------
        'SITE_URL'       => 'https://reservedla.com',
        'SEND_TOKEN'     => 'change-this-to-a-long-random-string',
        'TEST_RECIPIENT' => 'support@reservedla.com',
    ];
}
