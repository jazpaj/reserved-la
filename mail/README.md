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

## Triggering it automatically

The site's checkout is currently a front-end demo (no payment processor / order
storage), so nothing calls this yet. To fire it when a customer checks out, the
checkout needs to POST the order data to this endpoint **server-side**. Ask and
this can be wired up once a real order/payment step exists.

## Security notes
- The endpoint refuses any request without the correct `SEND_TOKEN` (returns 403),
  so it can't be abused as an open spam relay.
- Keep `SEND_TOKEN` and `RESEND_API_KEY` server-side only — never put them in
  browser JavaScript. If you ever call this from the browser, put a server-side
  proxy in front so the token isn't exposed.
- `config.php` is blocked from the web by `.htaccess` and is git-ignored.
