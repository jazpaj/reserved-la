<?php
/**
 * Reserved LA — order confirmation email config (Microsoft Graph API).
 *
 * Sends as your Outlook mailbox over HTTPS (GoDaddy allows HTTPS; it blocks SMTP).
 *
 * SETUP:
 *   1. Copy this file to  config.php  (same folder).
 *   2. Paste your CLIENT_SECRET value.  Never commit config.php — it holds the secret.
 */
function rl_config() {
    return [
        // --- Microsoft Graph (Entra app registration) ----------------------
        'TENANT_ID'     => '95d41746-b2de-443c-a982-8b27a62e4a14',
        'CLIENT_ID'     => '7e386f53-f9b3-4f0f-9acd-9b3aca4a4a8d',
        'CLIENT_SECRET' => 'YOUR_CLIENT_SECRET_VALUE',   // <-- paste the secret VALUE from Entra

        // The mailbox that sends (must exist in your tenant; the app has Mail.Send).
        'SENDER'   => 'support@reservedla.com',
        'REPLY_TO' => 'support@reservedla.com',          // customer replies land in this inbox

        // Store copy: BCC'd on every real order confirmation so the team sees new
        // orders. The customer never sees this address. OPTIONAL — if you leave
        // this key out entirely, it defaults to the SENDER mailbox above, so the
        // store copy works without any edit here. Set it to send the copy to a
        // different inbox, an array for several, or '' to turn the store copy off.
        'BCC_STORE' => 'support@reservedla.com',

        // --- Site / security -----------------------------------------------
        'SITE_URL'       => 'https://reservedla.com',
        'SEND_TOKEN'     => 'change-this-to-a-long-random-string',
        'TEST_RECIPIENT' => 'support@reservedla.com',
    ];
}
