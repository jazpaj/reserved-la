# Reserved LA — Square Payments (Web Payments SDK)

Real card payments on reservedla.com. Buyers stay on your domain; card data goes
straight into Square's secure fields (you never see or store card numbers). Works
on GoDaddy because Square's API is over HTTPS.

## How it works
1. `checkout.html` loads Square's SDK and shows Square's secure card field.
2. On "Pay", the card is **tokenized** by Square (card data never touches us).
3. The token + cart are POSTed to `pay/process-payment.php`.
4. The server **recomputes the total from `prices.json`** (so a tampered price
   can't be charged) and calls Square's Payments API with your secret access token.
5. On success, the order-confirmation email fires (via `mail/`).

## Files
```
pay/
  process-payment.php   ← charges the card (server-side, uses secret token)
  public-config.php     ← serves ONLY the public App/Location IDs to the browser
  lib.php               ← total calc + Square API call
  prices.json           ← {product id: price} (regenerate if prices change)
  config.sample.php     ← copy to config.php and fill in
```

## One-time setup
1. **Square Developer Dashboard** → https://developer.squareup.com → create an app.
2. Grab the **Sandbox** credentials first (top of the app page):
   - **Application ID**  (public)
   - **Location ID**     (Locations tab — public)
   - **Access Token**    (SECRET)
3. Copy `config.sample.php` → `config.php` and fill in:
   - `SQUARE_ENV` = `sandbox`
   - `SQUARE_APP_ID`, `SQUARE_LOCATION_ID`, `SQUARE_ACCESS_TOKEN`
4. Upload to GoDaddy: the whole **`pay/`** folder, plus the updated **`checkout.html`**
   and **`styles.css`**, into `public_html`.

## Test (Sandbox)
Go to checkout and use Square's sandbox test card:
- Card **4111 1111 1111 1111**, CVV **111**, any future expiry, ZIP **94103**.
A successful test shows the Thank You screen; you'll see the payment in your
Square Sandbox dashboard. Declined-card test numbers are in Square's docs.

## Go live (Production)
1. In `config.php` set `SQUARE_ENV` = `production`.
2. Replace the three IDs/token with your **Production** Application ID, Location ID,
   and Access Token.
3. That's it — the checkout automatically loads the production SDK.

## Notes & security
- `config.php` holds the **secret** access token — it's git-ignored and never sent
  to the browser. `public-config.php` exposes only the public App/Location IDs.
- The charge amount is always **recomputed on the server**; the browser's total is
  never trusted.
- **Keep `prices.json` in sync** with the catalog. Regenerate after price changes:
  ```bash
  node -e "global.window={};var fs=require('fs');eval(fs.readFileSync('js/data.js','utf8').replace(/const /g,'var '));var m={};PRODUCTS.forEach(p=>m[p.id]=p.price);fs.writeFileSync('pay/prices.json',JSON.stringify(m));"
  ```
- Shipping/promo rules in `config.php` must match the storefront's checkout rules.
