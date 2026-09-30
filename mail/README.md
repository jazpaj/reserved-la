# Reserved LA — Order Confirmation Email (Microsoft 365 / Outlook SMTP)

Sends the order-confirmation email through your **GoDaddy Microsoft 365 / Outlook
mailbox** over authenticated SMTP (via [PHPMailer](https://github.com/PHPMailer/PHPMailer),
vendored in `lib/PHPMailer/`). Runs as PHP on GoDaddy.

## Files
```
mail/
  place-order.php               ← browser-facing handler (checkout POSTs here)
  send-order-confirmation.php   ← token-gated endpoint (tests / server-to-server)
  lib.php                       ← template renderer + SMTP send
  lib/PHPMailer/                ← vendored PHPMailer (do not edit)
  config.sample.php             ← copy to config.php and fill in
  templates/order-confirmation.html
  index.html (blank)            ← in each folder, prevents directory listing
```

## One-time setup

1. **Copy config:** `config.sample.php` → `config.php`, then fill in:
   - `SMTP_USER` — the full mailbox address that sends, e.g. `orders@reservedla.com`
   - `SMTP_PASS` — that mailbox's password (**or an App Password** if MFA is on — see below)
   - `FROM_EMAIL` — keep it **equal to `SMTP_USER`** (Office 365 requires the From
     address to be the mailbox you authenticate as, or one it has Send-As rights to)
   - `SEND_TOKEN` — a long random string
2. **Upload the `mail/` folder** to your site root in cPanel (so it's at
   `https://reservedla.com/mail/`).
3. **Make sure SMTP AUTH is allowed** on the mailbox (see below).

## Microsoft 365 gotchas (read this if sending fails)

Office 365 SMTP is `smtp.office365.com : 587` with STARTTLS (already set in config).
Two common blockers:

- **SMTP AUTH disabled.** Microsoft turns off "Authenticated SMTP" for many
  tenants by default. In the Microsoft 365 admin center → Users → the mailbox →
  Mail → *Manage email apps* → tick **Authenticated SMTP**. (Org-wide it's under
  Exchange admin → Settings → Mail flow / or via PowerShell
  `Set-CASMailbox -SmtpClientAuthenticationDisabled $false`.)
- **MFA on the mailbox.** If multi-factor auth is enabled, a normal password won't
  work for SMTP — create an **App Password** for this mailbox and use that as
  `SMTP_PASS`. (App passwords require security defaults off / per-user MFA.)

If a send fails, set `'SMTP_DEBUG' => true` in config.php temporarily and check your
host's PHP error log for the SMTP conversation, then turn it back off.

## Test it

```
https://reservedla.com/mail/send-order-confirmation.php?test=1&token=YOUR_TOKEN
```
Sends a sample confirmation to `TEST_RECIPIENT`. Expect `{"ok":true,...}` and the
email in your inbox. `{"ok":false,"error":"..."}` shows what to fix.

## It's wired to checkout

`checkout.html` sends the confirmation automatically. On checkout,
`confirmOrder()` builds the order from the cart and POSTs it to
**`mail/place-order.php`**, which sends via your mailbox.

- No secret is exposed in the page — `place-order.php` reads credentials from
  `config.php` server-side.
- It accepts **same-origin POSTs only** and only emails the address on the order,
  so it can't be used as an open relay.
- No card number or CVC is sent — only the last 4 digits (`Card ending 1234`).

> Security caveat: Origin/Referer can be spoofed by non-browser clients, so this
> stops casual abuse but isn't bulletproof. For full protection, verify the order
> against a real payment/order record once a processor is connected.

## Notes
- `config.php` is safe from the web because the server *executes* PHP (fetching
  it runs the file and outputs nothing — the password is never sent as text). It
  is also git-ignored. Blank `index.html` files stop directory listing.
  (We intentionally ship no `.htaccess` — some shared hosts 500 on its directives.)
- The demo checkout has no tax engine, so the email shows `Tax $0.00`; a promo
  discount isn't itemized in the email. Ask if you want those added.
- PHPMailer is bundled so you don't need Composer on the host.
