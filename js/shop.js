/* =========================================================
   RESERVED LA — Product rendering: cards, grids, filtering,
   product-detail page.
   ========================================================= */

function stars(rating,reviews){
  const full=Math.round(rating);
  return `<span class="stars">${"★".repeat(full)}${"☆".repeat(5-full)}<span class="rc">${rating} (${reviews})</span></span>`;
}

function cardHTML(p){
  const onSale = p.was && p.was>p.price;
  const badge = p.tag ? `<span class="badge ${p.tag==='SALE'?'sale':''}">${p.tag}</span>` : "";
  const price = onSale
    ? `<span class="was">${fmt(p.was)}</span><span class="now sale">${fmt(p.price)}</span>`
    : `<span class="now">${fmt(p.price)}</span>`;
  return `
  <div class="card">
    <div class="imgwrap">
      ${badge}
      <a href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy"></a>
      <div class="quick"><a class="btn block sm" href="product.html?id=${p.id}">View Product</a></div>
    </div>
    <div class="info">
      <div class="cat">${p.cat}</div>
      <div class="name"><a href="product.html?id=${p.id}">${p.name}</a></div>
      <div style="margin-bottom:7px">${stars(p.rating,p.reviews)}</div>
      <div class="price">${price}</div>
    </div>
  </div>`;
}

function renderGrid(targetId,list){
  const el=document.getElementById(targetId); if(!el) return;
  el.innerHTML=list.map(cardHTML).join("");
}

/* ---- Homepage helpers ---- */
function bestSellers(n){ return PRODUCTS.filter(p=>p.tag==="BEST SELLER").slice(0,n||4); }
function newArrivals(n){ return PRODUCTS.filter(p=>p.tag==="NEW").slice(0,n||4); }
function featured(n){
  const seen=new Set(); const out=[];
  for(const p of PRODUCTS){ if(!seen.has(p.cat)){ seen.add(p.cat); out.push(p);} }
  return out.slice(0,n||8);
}

/* ---- Shop page ---- */
const CATS=["All","Shorts","Denim","Jackets","Bottoms","Hoodies","Headwear"];

function initShop(){
  const params=new URLSearchParams(location.search);
  let activeCat=params.get("cat")||"All";
  let sort=params.get("sort")||"featured";
  if(!CATS.includes(activeCat)) activeCat="All";

  const chipWrap=document.getElementById("filters");
  const sortSel=document.getElementById("sortSelect");
  const grid=document.getElementById("shopGrid");
  const countNote=document.getElementById("countNote");
  const title=document.getElementById("shopTitle");

  chipWrap.innerHTML=CATS.map(c=>`<button class="chip ${c===activeCat?'active':''}" data-cat="${c}">${c==="All"?"All Products":c}</button>`).join("");
  if(sortSel) sortSel.value=sort;

  function apply(){
    let list=activeCat==="All"?PRODUCTS.slice():PRODUCTS.filter(p=>p.cat===activeCat);
    if(sort==="price-asc") list.sort((a,b)=>a.price-b.price);
    else if(sort==="price-desc") list.sort((a,b)=>b.price-a.price);
    else if(sort==="new") list.sort((a,b)=>(b.tag==="NEW")-(a.tag==="NEW"));
    else if(sort==="rating") list.sort((a,b)=>b.rating-a.rating);
    renderGrid("shopGrid",list);
    countNote.textContent=list.length+" product"+(list.length!==1?"s":"");
    title.textContent=activeCat==="All"?"Shop All":activeCat;
    chipWrap.querySelectorAll(".chip").forEach(ch=>ch.classList.toggle("active",ch.dataset.cat===activeCat));
    const u=new URL(location);
    u.searchParams.set("cat",activeCat);
    if(sort!=="featured") u.searchParams.set("sort",sort); else u.searchParams.delete("sort");
    history.replaceState({},"",u);
    if(typeof syncHeaderNav==="function") syncHeaderNav();
  }
  chipWrap.addEventListener("click",e=>{ const b=e.target.closest(".chip"); if(!b)return; activeCat=b.dataset.cat; apply(); });
  if(sortSel) sortSel.addEventListener("change",e=>{ sort=e.target.value; apply(); });
  apply();
}

/* ---- Product detail page ---- */
function initProduct(){
  const id=new URLSearchParams(location.search).get("id");
  const p=getProduct(id);
  const root=document.getElementById("pdRoot");
  if(!p){ root.innerHTML=`<div class="center" style="padding:80px 0"><h2 class="display" style="font-size:40px">Product not found</h2><p><a class="btn" href="shop.html">Back to Shop</a></p></div>`; return; }

  document.title=p.name+" · RESERVED LA";
  const onSale=p.was&&p.was>p.price;
  const sizeBtns=p.sizes.map(s=>`<button class="size ${p.oos.includes(s)?'oos':''}" data-size="${s}" ${p.oos.includes(s)?'disabled':''}>${s}</button>`).join("");
  const priceHTML=onSale?`<span class="was">${fmt(p.was)}</span><span class="now sale">${fmt(p.price)}</span>`:`<span class="now">${fmt(p.price)}</span>`;

  root.innerHTML=`
  <div class="crumbs wrap"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?cat=${encodeURIComponent(p.cat)}">${p.cat}</a> / ${p.name}</div>
  <div class="wrap pd">
    <div class="pd-media">
      <div class="pd-main"><img id="pdMain" src="${p.gallery[0]}" alt="${p.name}"></div>
      <div class="pd-thumbs">
        ${p.gallery.map((g,i)=>`<div class="t ${i===0?'active':''}" data-src="${g}"><img src="${g}" alt="view ${i+1}"></div>`).join("")}
      </div>
    </div>
    <div class="pd-info">
      <div class="cat">${p.cat} · ${p.color}</div>
      <h1>${p.name}</h1>
      ${stars(p.rating,p.reviews)}
      <div class="pd-price">${priceHTML}</div>
      <p class="pd-desc">${p.desc}</p>
      <div class="opt-group">
        <div class="opt-head">
          <div class="lbl">Size ${p.sizes.length>1?'':'· One Size'}</div>
          <button type="button" class="size-guide-link" onclick="openSizeGuide('${p.cat}')">📏 Size Guide</button>
        </div>
        <div class="sizes" id="sizes">${sizeBtns}</div>
      </div>
      <div class="pd-actions">
        <div class="qty" style="height:52px">
          <button onclick="pdQty(-1)" aria-label="Decrease">−</button>
          <span id="pdQ">1</span>
          <button onclick="pdQty(1)" aria-label="Increase">+</button>
        </div>
        <button class="btn block" id="pdAdd" style="flex:1">Add to Bag · ${fmt(p.price)}</button>
      </div>
      <div class="pd-feats">
        <div class="f">${ICON.truck} Free US shipping on orders $150+ · ships in 1–2 business days</div>
        <div class="f">${ICON.refresh} 30-day easy returns on unworn items</div>
        <div class="f">${ICON.lock} Secure SSL checkout · Visa, Mastercard, Amex, Apple Pay</div>
        <div class="f">${ICON.check} 100% authentic — designed in Los Angeles</div>
      </div>
    </div>
  </div>`;

  // thumbs
  root.querySelectorAll(".pd-thumbs .t").forEach(t=>t.addEventListener("click",()=>{
    document.getElementById("pdMain").src=t.dataset.src;
    root.querySelectorAll(".pd-thumbs .t").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
  }));
  // sizes
  let selectedSize=p.sizes.length===1?p.sizes[0]:null;
  if(p.sizes.length===1) root.querySelector(".size").classList.add("active");
  root.querySelectorAll(".size:not(.oos)").forEach(b=>b.addEventListener("click",()=>{
    root.querySelectorAll(".size").forEach(x=>x.classList.remove("active"));
    b.classList.add("active"); selectedSize=b.dataset.size;
  }));
  // qty
  window.pdQty=function(d){ const el=document.getElementById("pdQ"); let v=parseInt(el.textContent)+d; if(v<1)v=1; el.textContent=v; };
  // add
  document.getElementById("pdAdd").addEventListener("click",()=>{
    if(!selectedSize){ toast("Please select a size"); return; }
    addToCart(p.id,selectedSize,parseInt(document.getElementById("pdQ").textContent));
  });

  // related
  const rel=PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);
  const relList=rel.length>=4?rel:PRODUCTS.filter(x=>x.id!==p.id).slice(0,4);
  renderGrid("relatedGrid",relList);
}

/* =========================================================
   Size Guide — per-category charts (measurements in inches)
   ========================================================= */
const SIZE_CHARTS = {
  tops: {
    title: "Tops Size Guide",
    note: "Garment measurements taken flat. Our tops are cut boxy/oversized — size down for a closer fit.",
    cols: ["Size","Chest (pit-to-pit)","Length (HPS)","Shoulder","Sleeve"],
    rows: [
      ["S", 22, 27, 20, 23],
      ["M", 23, 28, 21, 23.5],
      ["L", 24, 29, 22, 24],
      ["XL", 25, 30, 23, 24.5],
      ["XXL", 26, 31, 24, 25],
      ["XXXL", 27, 32, 25, 25.5]
    ],
    tips: [
      "Chest is measured armpit-to-armpit and doubled for full circumference.",
      "Length is from the highest point of the shoulder straight down to the hem."
    ]
  },
  pants: {
    title: "Pants & Denim Size Guide",
    note: "Relaxed 'to-fit' body measurements. Waistbands stretch on drawcord styles. Fits are baggy/wide-leg.",
    cols: ["Size","Waist (to fit)","Hip","Inseam","Outseam"],
    rows: [
      ["S", 28, 42, 30, 40],
      ["M", 30, 44, 30.5, 41],
      ["L", 32, 46, 31, 42],
      ["XL", 34, 48, 31.5, 43],
      ["XXL", 36, 50, 32, 44],
      ["XXXL", 38, 52, 32, 44.5]
    ],
    tips: [
      "Waist is the body measurement the size is designed to fit.",
      "Inseam is the inner-leg seam; outseam runs from waist to hem."
    ]
  },
  shorts: {
    title: "Shorts Size Guide",
    note: "Relaxed 'to-fit' body measurements. Most shorts sit at a knee-length, wide-leg cut.",
    cols: ["Size","Waist (to fit)","Hip","Inseam","Outseam"],
    rows: [
      ["S", 28, 42, 8, 22],
      ["M", 30, 44, 8.5, 23],
      ["L", 32, 46, 9, 24],
      ["XL", 34, 48, 9.5, 25],
      ["XXL", 36, 50, 10, 26],
      ["XXXL", 38, 52, 10.5, 27]
    ],
    tips: [
      "Waist is the body measurement the size is designed to fit.",
      "Inseam is the inner-leg length; a longer outseam means a longer short."
    ]
  },
  headwear: {
    title: "Headwear Size Guide",
    note: "One size fits most. Beanies are stretch-knit; caps have an adjustable back strap.",
    cols: ["Size","Head Circumference","Fits"],
    rows: [
      ["One Size", "21.5 – 24 in", "Most adults"]
    ],
    tips: [
      "Measure around your head about 1 in above the ears for circumference.",
      "Beanies stretch to fit; caps adjust via the rear strap/snap."
    ],
    noUnits: true
  }
};

function sizeGuideType(cat){
  if(cat==="Denim"||cat==="Bottoms") return "pants";
  if(cat==="Shorts") return "shorts";
  if(cat==="Headwear") return "headwear";
  return "tops"; // Hoodies, Jackets, T-Shirts
}

let _sgUnit = "in";
function openSizeGuide(cat){
  const chart = SIZE_CHARTS[sizeGuideType(cat)];
  let modal = document.getElementById("sizeModal");
  if(!modal){
    modal = document.createElement("div");
    modal.id = "sizeModal";
    modal.className = "sgm";
    document.body.appendChild(modal);
  }
  _sgUnit = "in";
  modal._chart = chart;
  renderSizeGuide();
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeSizeGuide(){
  const m = document.getElementById("sizeModal");
  if(m){ m.classList.remove("open"); document.body.style.overflow=""; }
}
function sgSetUnit(u){ _sgUnit = u; renderSizeGuide(); }
function renderSizeGuide(){
  const m = document.getElementById("sizeModal"); if(!m) return;
  const chart = m._chart;
  const conv = v => {
    if(typeof v !== "number") return v;                 // text cells (headwear) untouched
    return _sgUnit==="cm" ? Math.round(v*2.54*10)/10 : v;
  };
  const head = chart.cols.map(c=>`<th>${c}</th>`).join("");
  const body = chart.rows.map(r=>"<tr>"+r.map(c=>`<td>${conv(c)}</td>`).join("")+"</tr>").join("");
  const units = chart.noUnits ? "" : `
    <div class="sg-units" role="group" aria-label="Units">
      <button class="${_sgUnit==='in'?'active':''}" onclick="sgSetUnit('in')">INCHES</button>
      <button class="${_sgUnit==='cm'?'active':''}" onclick="sgSetUnit('cm')">CM</button>
    </div>`;
  m.innerHTML = `
    <div class="scrim" onclick="closeSizeGuide()"></div>
    <div class="box" role="dialog" aria-modal="true" aria-label="${chart.title}">
      <div class="sg-head"><h3>${chart.title}</h3>
        <button class="icon-btn" aria-label="Close" onclick="closeSizeGuide()">${ICON.close}</button></div>
      <div class="sg-body">
        <p class="sg-note">${chart.note}</p>
        ${units}
        <div class="sg-table-wrap"><table class="sg-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
        <div class="sg-tips"><h4>How to measure</h4><ul>${chart.tips.map(t=>`<li>${t}</li>`).join("")}</ul>
          <p style="font-size:12px;color:var(--muted);margin-top:10px">Measurements are approximate and may vary ±0.5 in due to the washed, hand-finished nature of each piece.</p>
        </div>
      </div>
    </div>`;
}
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeSizeGuide(); });
