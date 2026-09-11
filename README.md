# RESERVED LA — Streetwear Storefront

A complete, processor-compliant e-commerce storefront for **Reserved LA**, a DBA of **ZA Distribution LLC**.
Built as a fast static site (HTML/CSS/JS) modeled on the kidsetoys.com structure, in the streetwear niche.

## Structure

```
/index.html            Homepage (hero, collections, best sellers, editorial, reviews, FAQ)
/shop.html             Shop All — category filter + sort (?cat=Hoodies, ?sort=new, etc.)
/product.html          Product detail template (?id=<product-id>)
/about.html            Brand story
/contact.html          Contact form + full business details
/faq.html              Full FAQ
/styles.css            Design system (all styling)
/js/data.js            BRAND config + product catalog + placeholder image generator
/js/site.js            Header, footer, cart drawer, cookie banner, toast (shared on every page)
/js/shop.js            Product cards, grids, filtering, product-detail logic
/pages/
    privacy-policy.html
    terms.html
    refund-policy.html
    shipping-policy.html      (Fulfillment Policy)
    sms-terms.html
    business-disclaimer.html
    track-order.html
```

## Compliance checklist (what processors look for) — all included
- ✅ Full legal footer: **Reserved LA — a DBA of ZA Distribution LLC**, registered address, EIN 88-1123884
- ✅ Contact page with business name, physical address, email, phone, hours
- ✅ Privacy Policy (incl. CCPA/CPRA), Terms & Conditions, Refund/Return Policy
- ✅ Fulfillment/Shipping Policy with processing + delivery timeframes and costs
- ✅ SMS Terms & Privacy, Business Disclaimer
- ✅ Prices clearly in **USD**, secure-checkout messaging, SSL wording, payment badges
- ✅ Cookie consent banner (accept/decline)
- ✅ Working cart, product pages, categories, reviews

## ⚠️ Replace before launch
Edit **`/js/data.js`** → the `BRAND` object:
- `phone` and `phoneHref` — currently `[YOUR PHONE NUMBER]` placeholder. A working phone strengthens approval.
- `instagram` / `tiktok` — point to your real profiles (or remove the icons in `js/site.js`).
- `email` — currently `support@reservedla.com` (make sure this inbox exists and is monitored).

Other:
- **Product photos** — every product uses a branded SVG placeholder. Replace by setting `p.img` / `p.gallery`
  to real image URLs/paths in `data.js` (drop photos in `/assets/` and reference them).
- **Checkout** — the "Checkout" button is a front-end stub. Connect it to your payment processor / cart backend
  (Stripe, Shopify, Snipcart, etc.) in `checkout()` inside `js/site.js`.
- **Newsletter/contact forms** — currently show a confirmation toast only. Wire them to your email provider.

## Hosting
The site uses **root-relative paths** (`/styles.css`, `/js/...`), so serve it from the **domain root**
(e.g. reservedla.com). Any static host works: Netlify, Vercel, Cloudflare Pages, or classic cPanel/Apache.

Local preview:
```bash
python3 -m http.server 8099
# then open http://localhost:8099/index.html
```

## Shorts collection (real photography)
The `Shorts` category holds 7 real-photo products (images in `/assets/products/`, sourced and
rebuilt into Reserved LA styling). These were hand-screened so **none carry visible brand logos**
— a large number of candidates were rejected because they had "Supermade"/"SUBM" embroidery,
printed graphics, or emblem logos on the garment. Homepage lifestyle imagery lives in
`/assets/lifestyle/` and is also logo-free. If you want more shorts, add clean product photos to
`/assets/products/` and a matching entry in `js/data.js` (use the `photos:[...]` field — any product
with `photos` uses real images instead of the generated placeholder).

## Editing the catalog
All products live in the `PRODUCTS` array in `js/data.js` — each has id, name, cat, price, was (sale), color,
tag (NEW / BEST SELLER / SALE), rating, reviews, sizes, oos (out-of-stock sizes), and desc. Add/remove freely.
