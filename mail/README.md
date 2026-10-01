# Reserved LA — Order Confirmation Email (Microsoft Graph)

Sends the order-confirmation email **as your Outlook mailbox** via the Microsoft
Graph API over HTTPS. We use Graph (not SMTP) because **GoDaddy shared hosting
blocks outbound SMTP** but allows outbound HTTPS, which Graph uses.

## Files
```
mail/
  place-order.php               ← browser-facing handler (checkout POSTs here)
  send-order-confirmation.php   ← token-gated endpoint (tests / server-to-server)
  lib.php                       ← template renderer + Graph send (OAuth2 + sendMail)
  config.sample.php             ← copy to config.php and paste your client secret
  templates/order-confirmation.html
  index.html (blank)            ← in each folder, prevents directory listing
```

## One-time setup

The Entra app registration is already done. Finish with:

1. **Copy config:** `config.sample.php` → `config.php`.
   `TENANT_ID`, `CLIENT_ID`, and `SENDER` are already filled in. Set:
   - `CLIENT_SECRET` — the secret **Value** you copied from Entra (Certificates & secrets)
   - `SEND_TOKEN` — a long random string
2. **Upload the `mail/` folder** to your site root so it's at `https://reservedla.com/mail/`.

## Test it
```
https://reservedla.com/mail/send-order-confirmation.php?test=1&token=YOUR_TOKEN
```
Expect `{"ok":true,...}` and the sample email in `TEST_RECIPIENT`'s inbox.

## It's wired to checkout
On checkout, `checkout.html` builds the order and POSTs it to `mail/place-order.php`,
which sends via Graph. No secret is exposed in the page; `place-order.php` accepts
**same-origin POSTs only** and emails just the address on the order. Only the card
**last 4 digits** are ever sent (`Card ending 1234`).

## Notes
- `config.php` is safe from the web because PHP is executed (fetching it outputs
  nothing). It is also git-ignored.
- The **client secret expires** (you chose 24 months). Before it expires, create a
  new secret in Entra and update `CLIENT_SECRET` in `config.php`, or sends will fail.
- Security hardening (optional, recommended): restrict the app so it can only send
  as `support@reservedla.com` using an Exchange "Application Access Policy".
- Demo checkout has no tax engine, so the email shows `Tax $0.00`; a promo discount
  isn't itemized. Ask if you want those added.
