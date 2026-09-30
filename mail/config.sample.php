<?php
/**
 * Reserved LA — order confirmation email config (Microsoft 365 / Outlook SMTP).
 *
 * SETUP:
 *   1. Copy this file to  config.php  (same folder).
 *   2. Fill in the values.  Never commit config.php — it holds your password.
 */
function rl_config() {
    return [
        // --- Microsoft 365 / Outlook SMTP ----------------------------------
        // GoDaddy Microsoft 365 mailboxes use Office 365's SMTP server.
        'SMTP_HOST'   => 'smtp.office365.com',
        'SMTP_PORT'   => 587,
        'SMTP_SECURE' => 'tls',                       // STARTTLS on 587

        // The mailbox that logs in AND sends. On Office 365 the "From" address
        // must be this same mailbox (or one it has Send-As rights to).
        'SMTP_USER'   => 'orders@reservedla.com',
        'SMTP_PASS'   => 'YOUR_MAILBOX_PASSWORD',     // or an App Password if MFA is on

        'FROM_EMAIL'  => 'orders@reservedla.com',     // keep = SMTP_USER
        'FROM_NAME'   => 'Reserved LA',
        'REPLY_TO'    => 'support@reservedla.com',

        // --- Site / security -----------------------------------------------
        'SITE_URL'       => 'https://reservedla.com',
        // Shared secret for the token-gated endpoint (server-to-server / tests).
        'SEND_TOKEN'     => 'change-this-to-a-long-random-string',
        // Where GET ?test=1 sends a sample confirmation.
        'TEST_RECIPIENT' => 'support@reservedla.com',

        // Set true temporarily to see SMTP conversation in server logs when
        // debugging a connection problem. Leave false in production.
        'SMTP_DEBUG'     => false,
    ];
}
