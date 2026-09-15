/* =========================================================
   RESERVED LA — Shared site engine
   Renders announcement bar, header, footer, cart drawer,
   cookie consent, toast. Cart persists in localStorage.
   ========================================================= */

/* ---------- SVG icons ---------- */
const ICON = {
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L5 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z"/><circle cx="7" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/></svg>',
  refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l5 5L20 6"/></svg>',
  ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  tiktok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.1 1.6 3.7 3.7 4v2.6c-1.4 0-2.7-.4-3.7-1.1V15a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.7a2.9 2.9 0 1 0 2 2.8V3z"/></svg>',
  threads:'<svg viewBox="0 0 192 192" fill="currentColor"><path d="M141.5 89c-.7-.3-1.4-.6-2.1-.9-1.2-22.9-13.8-36-34.9-36.2h-.3c-12.6 0-23.1 5.4-29.6 15.2l11.6 8c4.8-7.3 12.4-8.9 18-8.9h.2c7 .05 12.3 2.1 15.7 6.1 2.4 2.9 4 6.9 4.8 11.9-6-1-12.5-1.3-19.4-.9-19.5 1.1-32 12.5-31.2 28.3.4 8 4.4 14.9 11.2 19.4 5.8 3.8 13.2 5.7 21 5.3 10.3-.6 18.4-4.5 24-11.7 4.3-5.4 7-12.5 8.2-21.4 4.9 2.9 8.5 6.8 10.5 11.4 3.4 7.9 3.6 20.8-6.9 31.3-9.2 9.2-20.3 13.2-37 13.3-18.5-.1-32.5-6.1-41.6-17.7-8.5-10.9-12.9-26.6-13.1-46.7.2-20.1 4.6-35.8 13.1-46.7 9.1-11.6 23.1-17.6 41.6-17.7 18.6.1 32.9 6.1 42.4 17.8 4.7 5.8 8.2 13 10.5 21.4l13.6-3.6c-2.8-10.4-7.2-19.3-13.2-26.7C154.3 8.9 136.5.9 113.3.7h-.1C89.9.9 72.4 9 60.5 24 49.9 37.3 44.4 55.8 44.2 79.9v.2c.2 24.1 5.7 42.6 16.3 55.9 11.9 15 29.4 23.1 52.7 23.3h.1c20.7-.1 35.3-5.5 47.3-17.5 15.7-15.7 15.2-35.4 10-47.5-3.7-8.6-10.8-15.6-20.6-20.3zm-36.3 46.7c-8.6.5-17.5-3.4-18-11.5-.3-6 4.3-12.7 19.2-13.6 1.7-.1 3.4-.15 5-.15 5.4 0 10.5.5 15.1 1.5-1.7 21.4-11.8 23.3-21.3 23.8z"/></svg>'
};

/* ---------- Cart ---------- */
const CART_KEY = "rl_cart_v1";
function getCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch(e){return []} }
function saveCart(c){ try{localStorage.setItem(CART_KEY,JSON.stringify(c))}catch(e){} updateCartCount(); }
function cartQtyTotal(){ return getCart().reduce((s,i)=>s+i.qty,0); }
function cartSubtotal(){ return getCart().reduce((s,i)=>s+i.price*i.qty,0); }

function addToCart(id,size,qty){
  qty = qty||1;
  const p = getProduct(id); if(!p) return;
  const key = id + "|" + (size||"OS");
  const cart = getCart();
  const line = cart.find(l=>l.key===key);
  if(line){ line.qty += qty; }
  else{ cart.push({key,id,name:p.name,cat:p.cat,price:p.was&&p.price<p.was?p.price:p.price,img:p.img,size:size||"OS",qty}); }
  saveCart(cart);
  renderCart(); openCart();
  toast("Added to bag — " + p.name);
}
function setQty(key,delta){
  const cart=getCart(); const l=cart.find(x=>x.key===key); if(!l)return;
  l.qty+=delta; if(l.qty<1){ removeLine(key); return; }
  saveCart(cart); renderCart();
}
function removeLine(key){ saveCart(getCart().filter(l=>l.key!==key)); renderCart(); }

function updateCartCount(){
  const n=cartQtyTotal();
  document.querySelectorAll(".cart-count").forEach(el=>{ el.textContent=n; el.style.display=n>0?"flex":"none"; });
}

/* ---------- Announcement bar ---------- */
function announceHTML(){
  const items=[
    "<b>Free Shipping</b> on all US orders $150+",
    "<b>New Drop</b> — FW26 Collection Live Now",
    "100% Authentic · Designed in Los Angeles",
    "<b>30-Day</b> Easy Returns",
    "Secure SSL Checkout"
  ];
  const line=items.map(t=>`<span>${t}</span>`).join("");
  return `<div class="announce"><div class="track">${line}${line}</div></div>`;
}

/* ---------- Header ---------- */
// Active nav is derived from the CURRENT URL (page + ?cat / ?sort), not a
// hardcoded key — so category and New Arrivals links highlight correctly.
function navHrefActive(href){
  const cur = {
    page: (location.pathname.split('/').pop() || 'index.html'),
    cat: new URLSearchParams(location.search).get('cat'),
    sort: new URLSearchParams(location.search).get('sort')
  };
  if(cur.cat === 'All') cur.cat = null;
  const q = href.indexOf('?');
  const page = (q<0 ? href : href.slice(0,q)).split('/').pop();
  const hp = new URLSearchParams(q<0 ? '' : href.slice(q+1));
  if(page !== cur.page) return false;
  if(page !== 'shop.html') return true;
  const hCat = hp.get('cat'), hSort = hp.get('sort');
  if(!hCat && !hSort) return !cur.cat && !cur.sort;   // Shop All
  if(hCat) return hCat === cur.cat;                    // a category
  if(hSort) return hSort === cur.sort && !cur.cat;     // New Arrivals
  return false;
}
// Re-evaluate header underlines against the live URL (used after in-page filtering)
function syncHeaderNav(){
  document.querySelectorAll('.site-header .nav a').forEach(a=>{
    a.classList.toggle('active', navHrefActive(a.getAttribute('href')));
  });
}
function headerHTML(active){
  const link=(href,label)=>`<a href="${href}" class="${navHrefActive(href)?'active':''}">${label}</a>`;
  return `
  <header class="site-header">
    <div class="wrap hd">
      <button class="burger" aria-label="Menu" onclick="openMenu()">${ICON.menu}</button>
      <a href="index.html" class="brand" aria-label="Reserved LA home">RESERVED<span class="la">LA</span></a>
      <nav class="nav">
        ${link('shop.html','Shop All','shop')}
        ${link('shop.html?cat=Shorts','Shorts','')}
        ${link('shop.html?cat=Denim','Denim','')}
        ${link('shop.html?cat=Jackets','Jackets','')}
        ${link('shop.html?cat=Bottoms','Bottoms','')}
        ${link('shop.html?cat=Hoodies','Hoodies','')}
        ${link('shop.html?cat=Headwear','Headwear','')}
        ${link('shop.html?sort=new','New Arrivals','new')}
      </nav>
      <div class="hd-icons">
        <button class="icon-btn" aria-label="Search" onclick="location.href='shop.html'">${ICON.search}</button>
        <button class="icon-btn" aria-label="Bag" onclick="openCart()">${ICON.cart}<span class="cart-count">0</span></button>
      </div>
    </div>
  </header>
  <div class="mnav" id="mnav">
    <div class="scrim" onclick="closeMenu()"></div>
    <div class="panel">
      <div class="mhead">
        <span class="brand" style="font-size:22px">RESERVED<span class="la">LA</span></span>
        <button class="icon-btn" onclick="closeMenu()">${ICON.close}</button>
      </div>
      <a href="shop.html">Shop All</a>
      <a href="shop.html?cat=Shorts">Shorts</a>
      <a href="shop.html?cat=Denim">Denim</a>
      <a href="shop.html?cat=Jackets">Jackets</a>
      <a href="shop.html?cat=Bottoms">Bottoms</a>
      <a href="shop.html?cat=Hoodies">Hoodies</a>
      <a href="shop.html?cat=Headwear">Headwear</a>
      <a href="shop.html?sort=new">New Arrivals</a>
      <a href="about.html">About</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>`;
}

/* ---------- Footer (redesigned) ---------- */
function footerHTML(){
  return `
  <footer class="site-footer nf">
    <div class="nf-texture"></div>

    <div class="wrap nf-news">
      <div class="eyebrow">Reserved LA Club</div>
      <h3>Join The List</h3>
      <p>Early access to drops, restock alerts, and members-only discounts.</p>
      <form onsubmit="return newsSignup(event)">
        <input type="email" required placeholder="Enter your email" aria-label="Email">
        <button class="btn on-dark" type="submit">Subscribe</button>
      </form>
    </div>

    <div class="wrap nf-mark"><span>RESERVED&nbsp;LA</span></div>

    <div class="wrap nf-main">
      <div class="nf-contact">
        <p class="legal">
          <b>${BRAND.name}</b> — <b>${BRAND.legalName}</b><br>
          ${BRAND.address1}<br>
          ${BRAND.address2}<br>
          ${BRAND.country}<br><br>
          <a href="mailto:${BRAND.email}">${BRAND.email}</a><br>
          <a href="${BRAND.phoneHref}">${BRAND.phone}</a>
        </p>
        <div class="foot-social">
          <a href="${BRAND.instagram}" aria-label="Instagram" target="_blank" rel="noopener">${ICON.ig}</a>
          <a href="${BRAND.threads}" aria-label="Threads" target="_blank" rel="noopener">${ICON.threads}</a>
        </div>
      </div>

      <div class="nf-links">
        <div class="foot-col">
          <h4>Shop</h4>
          <a href="shop.html">Shop All</a>
          <a href="shop.html?cat=Shorts">Shorts</a>
          <a href="shop.html?cat=Denim">Denim</a>
          <a href="shop.html?cat=Jackets">Jackets</a>
          <a href="shop.html?cat=Bottoms">Bottoms</a>
          <a href="shop.html?cat=Headwear">Headwear</a>
          <a href="shop.html?sort=new">New Arrivals</a>
        </div>

        <div class="foot-col">
          <h4>Help</h4>
          <a href="contact.html">Contact Us</a>
          <a href="faq.html">FAQ</a>
          <a href="shipping-policy.html">Shipping &amp; Fulfillment</a>
          <a href="refund-policy.html">Returns &amp; Refunds</a>
          <a href="about.html">About Us</a>
          <a href="track-order.html">Track Your Order</a>
        </div>

        <div class="foot-col">
          <h4>Legal</h4>
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="terms.html">Terms &amp; Conditions</a>
          <a href="refund-policy.html">Refunds</a>
          <a href="shipping-policy.html">Fulfillment Policy</a>
        </div>
      </div>
    </div>

    <div class="wrap nf-pay">
      <div class="pay-badges">
        <span class="pb">VISA</span>
        <span class="pb">MASTERCARD</span>
        <span class="pb">AMEX</span>
        <span class="pb">DISCOVER</span>
        <span class="pb">APPLE&nbsp;PAY</span>
        <span class="pb">SHOP&nbsp;PAY</span>
        <span class="pb ssl">🛡 SSL SECURED</span>
      </div>
      <div class="secure-note">${ICON.lock} Secure Checkout · SSL Encrypted · All prices in USD</div>
    </div>

    <div class="wrap nf-bottom">
      <div class="tagline">DESIGNED IN LOS ANGELES · WORN WORLDWIDE</div>
      <div>© <span id="yr"></span> ${BRAND.legalName}. All rights reserved.</div>
    </div>
  </footer>`;
}

/* ---------- Cart drawer ---------- */
function cartDrawerHTML(){
  return `
  <div class="cart-drawer" id="cartDrawer">
    <div class="scrim" onclick="closeCart()"></div>
    <div class="panel">
      <div class="cart-head">
        <h3>Your Bag (<span id="cartHeadCount">0</span>)</h3>
        <button class="icon-btn" onclick="closeCart()">${ICON.close}</button>
      </div>
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-foot" id="cartFoot"></div>
    </div>
  </div>`;
}

function renderCart(){
  const cart=getCart();
  const wrap=document.getElementById("cartItems");
  const foot=document.getElementById("cartFoot");
  const hc=document.getElementById("cartHeadCount");
  if(!wrap) return;
  if(hc) hc.textContent=cartQtyTotal();
  if(cart.length===0){
    wrap.innerHTML=`<div class="cart-empty"><p style="font-family:var(--font-display);font-size:24px;text-transform:uppercase;color:var(--ink)">Your bag is empty</p><p>Add something worth reserving.</p><a class="btn" href="shop.html">Shop Now</a></div>`;
    foot.innerHTML="";
    updateCartCount(); return;
  }
  wrap.innerHTML=cart.map(l=>`
    <div class="cart-line">
      <img class="th" src="${l.img}" alt="${l.name}">
      <div class="cl-info">
        <div class="cl-name">${l.name}</div>
        <div class="cl-meta">${l.cat} · Size ${l.size}</div>
        <div class="qty">
          <button onclick="setQty('${l.key}',-1)" aria-label="Decrease">−</button>
          <span>${l.qty}</span>
          <button onclick="setQty('${l.key}',1)" aria-label="Increase">+</button>
        </div>
        <br><button class="cl-remove" onclick="removeLine('${l.key}')">Remove</button>
      </div>
      <div class="cl-price">${fmt(l.price*l.qty)}</div>
    </div>`).join("");
  const sub=cartSubtotal();
  const remaining=BRAND.freeShipThreshold-sub;
  foot.innerHTML=`
    <div class="subrow"><span>Subtotal</span><span>${fmt(sub)}</span></div>
    <div class="ship-note">${remaining>0?`Add <b>${fmt(remaining)}</b> for free shipping`:"🎉 You've unlocked free shipping!"}</div>
    <button class="btn block" onclick="checkout()">Checkout · ${fmt(sub)}</button>
    <div class="secure">${'🔒'} Secure SSL checkout — Visa · Mastercard · Amex · Apple Pay</div>`;
  updateCartCount();
}

function checkout(){
  if(getCart().length===0) return;
  const base = location.pathname.replace(/[^/]*$/, "");
  location.href = base + "checkout.html";
}

/* ---------- Drawer / menu open-close ---------- */
function openCart(){ document.getElementById("cartDrawer").classList.add("open"); document.body.style.overflow="hidden"; }
function closeCart(){ document.getElementById("cartDrawer").classList.remove("open"); document.body.style.overflow=""; }
function openMenu(){ document.getElementById("mnav").classList.add("open"); document.body.style.overflow="hidden"; }
function closeMenu(){ document.getElementById("mnav").classList.remove("open"); document.body.style.overflow=""; }

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg){
  let t=document.getElementById("toast");
  if(!t){ t=document.createElement("div"); t.id="toast"; t.className="toast"; document.body.appendChild(t); }
  t.innerHTML=ICON.check+"<span>"+msg+"</span>";
  requestAnimationFrame(()=>t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove("show"),2600);
}

/* ---------- Newsletter ---------- */
function newsSignup(e){ e.preventDefault(); e.target.reset(); toast("You're on the list. Welcome to Reserved LA."); return false; }

/* ---------- Cookie consent ---------- */
function cookieBanner(){
  if(localStorage.getItem("rl_cookie_ok")) return;
  const c=document.createElement("div");
  c.className="cookie";
  c.innerHTML=`<p>We use cookies to run this store, remember your bag, and improve your experience. See our <a href="privacy-policy.html">Privacy Policy</a>.</p>
    <div class="c-actions">
      <button class="btn sm ghost" style="color:#fff;border-color:rgba(255,255,255,.4)" onclick="cookieChoice(false)">Decline</button>
      <button class="btn sm on-dark" onclick="cookieChoice(true)">Accept</button>
    </div>`;
  document.body.appendChild(c);
  setTimeout(()=>c.classList.add("show"),600);
  window._ck=c;
}
function cookieChoice(ok){
  try{localStorage.setItem("rl_cookie_ok",ok?"all":"essential")}catch(e){}
  if(window._ck){ window._ck.classList.remove("show"); setTimeout(()=>window._ck.remove(),400); }
}

/* ---------- Boot ---------- */
function mountChrome(activeKey){
  const a=document.getElementById("announce-slot"); if(a) a.innerHTML=announceHTML();
  const h=document.getElementById("header-slot"); if(h) h.innerHTML=headerHTML(activeKey);
  const f=document.getElementById("footer-slot"); if(f) f.innerHTML=footerHTML();
  // cart drawer appended to body
  const cd=document.createElement("div"); cd.innerHTML=cartDrawerHTML(); document.body.appendChild(cd.firstElementChild);
  const y=document.getElementById("yr"); if(y) y.textContent=new Date().getFullYear();
  renderCart(); updateCartCount(); cookieBanner();
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"){closeCart();closeMenu();} });
}
