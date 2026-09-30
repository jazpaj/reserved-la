# Reserved LA — Order Confirmation Email (Resend)

Sends the order-confirmation email through [Resend](https://resend.com) over its
HTTPS API. We use Resend (not SMTP) because **GoDaddy shared hosting blocks
outbound SMTP ports** but allows outbound HTTPS, which Resend uses. Runs as PHP.

## Files
```
mail/
  place-order.php               ← browser-facing handler (checkout POSTs here)
  send-order-confirmation.php   ← token-gated endpoint (tests / server-to-server)
  lib.php                       ← template renderer + Resend send
  config.sample.php             ← copy to config.php and fill in
  templates/order-confirmation.html
  index.html (blank)            ← in each folder, prevents directory listing
```

## One-time setup

1. **Create a Resend account** → https://resend.com
2. **Create an API key** → https://resend.com/api-keys (starts with `re_`).
3. **Verify your domain** so mail can come from `@reservedla.com`:
   Resend → **Domains → Add Domain** → `reservedla.com` → add the SPF/DKIM DNS
   records it gives you inside GoDaddy (Domains → DNS). These coexist fine with
   your Microsoft 365 email.
   *(To test before verifying, set `FROM` to `Reserved LA <onboarding@resend.dev>`.)*
4. **Make your config:** copy `config.sample.php` → `config.php` and fill in:
   - `RESEND_API_KEY` — your `re_...` key
   - `FROM` — `Reserved LA <orders@reservedla.com>` (or the resend.dev address for a first test)
   - `SEND_TOKEN` — a long random string
5. **Upload the `mail/` folder** to your site root so it's at `https://reservedla.com/mail/`.

## Test it
```
https://reservedla.com/mail/send-order-confirmation.php?test=1&token=YOUR_TOKEN
```
Sends a sample confirmation to `TEST_RECIPIENT`. Expect `{"ok":true,...}` and the
email in your inbox (check spam the first time).

## It's wired to checkout
On checkout, `checkout.html` builds the order and POSTs it to `mail/place-order.php`,
which sends via Resend. No secret is exposed in the page; `place-order.php` accepts
**same-origin POSTs only** and emails just the address on the order. Only the card
**last 4 digits** are ever sent (`Card ending 1234`) — never the full number/CVC.

## Notes
- `config.php` is safe from the web because PHP is executed (fetching it runs the
  file and outputs nothing). It is also git-ignored.
- Customer replies go to `REPLY_TO` (your Outlook `support@` inbox), so you keep
  using Outlook for support while Resend handles automated order mail.
- Demo checkout has no tax engine, so the email shows `Tax $0.00`; a promo discount
  isn't itemized. Ask if you want those added.
