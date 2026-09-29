<?php
/**
 * Reserved LA — order confirmation email config.
 *
 * SETUP:
 *   1. Copy this file to  config.php  (same folder).
 *   2. Fill in the values.  Never commit config.php — it holds secrets.
 */
function rl_config() {
    return [
        // Resend API key — create at https://resend.com/api-keys (starts with "re_")
        'RESEND_API_KEY' => 'YOUR_RESEND_API_KEY',

        // Verified sender. Verify reservedla.com in Resend first
        // (Domains → Add domain → add the DNS records at GoDaddy).
        // For a first test before the domain is verified, use: 'Reserved LA <onboarding@resend.dev>'
        'FROM'     => 'Reserved LA <orders@reservedla.com>',
        'REPLY_TO' => 'support@reservedla.com',

        // Shared secret that callers must present to use the endpoint.
        // Make this long and random. Keep it server-side only (never in browser JS).
        'SEND_TOKEN' => 'change-this-to-a-long-random-string',

        // Where GET ?test=1 sends a sample confirmation.
        'TEST_RECIPIENT' => 'support@reservedla.com',
    ];
}
