# Reserved LA — NMI Payments (Collect.js)

Real card payments on reservedla.com. Buyers stay on your domain; card data goes
straight into NMI's secure Collect.js fields (you never see or store card numbers).
Works on GoDaddy because NMI's API is over HTTPS.

## How it works
1. `checkout.html` loads NMI's **Collect.js** and shows NMI's secure card fields.
2. On "Pay", the card is **tokenized** by NMI (card data never touches us).
3. The token + cart are POSTed to `pay/process-payment.php`.
4. The server **recomputes the total from `prices.json`** (so a tampered price
   can't be charged) and calls NMI's Payment API (`transact.php`) with the secret
   Security Key.
5. On success, the order-confirmation email fires (via `mail/`).

On hosts without PHP (e.g. the GitHub Pages preview), checkout runs a **demo**
flow — a simulated confirmation, no real charge. Real NMI runs only where
`pay/config.php` is present with keys (reservedla.com).

## Files
```
pay/
  process-payment.php   ← charges the card (server-side, uses Security Key)
  public-config.php     ← serves ONLY the public Tokenization Key + Collect.js URL
  lib.php               ← total calc + NMI transact.php call
  prices.json           ← {product id: price} (regenerate if prices change)
  config.sample.php     ← copy to config.php and fill in
```

## One-time setup
1. **NMI merchant dashboard** → Settings:
   - **Security Keys** → create/copy your **Security Key** (SECRET).
   - **Collect.js / Tokenization** → copy your **Tokenization Key** (public).
2. Copy `config.sample.php` → `config.php` and fill in:
   - `NMI_SECURITY_KEY`     (secret — server-side only)
   - `NMI_TOKENIZATION_KEY` (public — used by Collect.js)
   - `NMI_GATEWAY` — leave as `secure.nmi.com` for a standard NMI account. If your
     account is white-labeled through a reseller, set this to that gateway's host
     (both the Collect.js URL and the charge URL are built from it).
3. Upload to GoDaddy: the whole **`pay/`** folder (except your real `config.php`,
   which you create on the server), plus the updated **`checkout.html`** and
   **`styles.css`**, into `public_html`.

## Test
Use NMI's test card in your sandbox/test MID:
- Card **4111 1111 1111 1111**, any future expiry, CVV **123**.
A successful test shows the Thank You screen and the sale appears in your NMI
dashboard. (Amounts/responses depend on your test MID's settings.)

## Notes & security
- `config.php` holds the **Security Key** — it's git-ignored and never sent to the
  browser. `public-config.php` exposes only the public Tokenization Key.
- The charge amount is always **recomputed on the server**; the browser's total is
  never trusted.
- The charge POST requires a **same-origin** request (Origin/Referer must be a
  reservedla.com host or localhost).
- **Keep `prices.json` in sync** with the catalog. Regenerate after price changes:
  ```bash
  node -e "global.window={};var fs=require('fs');eval(fs.readFileSync('js/data.js','utf8').replace(/const /g,'var '));var m={};PRODUCTS.forEach(p=>m[p.id]=p.price);fs.writeFileSync('pay/prices.json',JSON.stringify(m));"
  ```
- Shipping/promo rules in `config.php` must match the storefront's checkout rules.
```
