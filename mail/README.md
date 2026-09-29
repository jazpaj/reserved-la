# Reserved LA — Order Confirmation Email (Resend)

Sends the order-confirmation email through [Resend](https://resend.com).
Runs as PHP on your GoDaddy cPanel hosting (GitHub Pages can't run PHP).

## Files
```
mail/
  send-order-confirmation.php   ← the endpoint (renders + sends)
  lib.php                       ← template renderer + Resend call
  config.sample.php             ← copy to config.php and fill in
  templates/
    order-confirmation.html     ← your email design
  .htaccess                     ← hides config.php / lib.php, no dir listing
```

## One-time setup

1. **Create a Resend account** → https://resend.com
2. **Verify your domain** in Resend: Domains → Add Domain → `reservedla.com`, then
   add the SPF/DKIM DNS records it shows you inside GoDaddy (Domains → DNS).
   Verification is what lets mail from `orders@reservedla.com` land in the inbox.
   *(To test before the domain is verified, set `FROM` to `Reserved LA <onboarding@resend.dev>`.)*
3. **Create an API key** → https://resend.com/api-keys (starts with `re_`).
4. **Make your config:** copy `config.sample.php` to `config.php` and fill in:
   - `RESEND_API_KEY` — your `re_...` key
   - `FROM` — `Reserved LA <orders@reservedla.com>`
   - `SEND_TOKEN` — a long random string (the shared secret; keep it private)
5. **Upload the `mail/` folder** to your site root in cPanel (so it's at
   `https://reservedla.com/mail/`). Do **not** upload over an existing `config.php`
   if you already set one.

## Test it

Open in your browser (replace the token):
```
https://reservedla.com/mail/send-order-confirmation.php?test=1&token=YOUR_TOKEN
```
This sends a sample confirmation to `TEST_RECIPIENT`. You should get:
`{"ok":true,"id":"..."}` and the email in your inbox.

## Send a real confirmation

`POST` JSON to the endpoint with the secret in the `X-Send-Token` header:

```bash
curl -X POST https://reservedla.com/mail/send-order-confirmation.php \
  -H "Content-Type: application/json" \
  -H "X-Send-Token: YOUR_TOKEN" \
  -d '{
    "customer_email": "buyer@email.com",
    "customer_first_name": "Sam",
    "order_number": "RL-100501",
    "order_date": "Sep 30, 2026",
    "payment_method": "Visa ending 4242",
    "estimated_delivery": "Oct 7, 2026",
    "subtotal": "$120.00", "shipping": "Free", "tax": "$10.90", "total": "$130.90",
    "shipping_name": "Sam Lee", "shipping_address_line1": "1 Main St",
    "shipping_city": "Los Angeles", "shipping_state": "CA", "shipping_zip": "90001",
    "shipping_method": "Standard US",
    "order_url": "https://reservedla.com/track-order.html",
    "items": [
      {"name":"Box-Fit Hoodie","color":"Bone","size":"L","quantity":1,
       "line_total":"$120.00","image_url":"https://reservedla.com/assets/products/xxx-front.jpg"}
    ]
  }'
```

Returns `{"ok":true,"id":"..."}` on success.

## It's wired to checkout

`checkout.html` now sends the confirmation automatically. When a customer
completes the demo checkout, `confirmOrder()` builds the order payload from the
cart and POSTs it to **`mail/place-order.php`**, which sends the email via Resend.

- `place-order.php` is the **browser-facing** handler. It holds no secret in the
  page: it calls the Resend logic server-side using your `config.php` key.
- It only accepts **same-origin** POSTs (Origin/Referer must be one of your own
  hosts) and only emails the address on the order — so it can't be used as an
  open relay from other sites.
- No card number or CVC is ever sent — only the last 4 digits, as
  `Card ending 1234`.

Once you upload `mail/` (with a real `config.php`) to GoDaddy, checkout emails go
out on their own. `send-order-confirmation.php` remains available for
server-to-server / manual sends (token-gated).

> Security caveat: Origin/Referer can be spoofed by non-browser clients, so this
> stops casual abuse but is not bulletproof. For full protection, verify the
> order against a real payment/order record once a processor is connected.

## Security notes
- The endpoint refuses any request without the correct `SEND_TOKEN` (returns 403),
  so it can't be abused as an open spam relay.
- Keep `SEND_TOKEN` and `RESEND_API_KEY` server-side only — never put them in
  browser JavaScript. If you ever call this from the browser, put a server-side
  proxy in front so the token isn't exposed.
- `config.php` is blocked from the web by `.htaccess` and is git-ignored.
