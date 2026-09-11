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
        <div class="lbl">Size ${p.sizes.length>1?'':'· One Size'}</div>
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
