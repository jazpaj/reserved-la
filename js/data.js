/* =========================================================
   RESERVED LA — Site config + product catalog
   ========================================================= */

const BRAND = {
  name: "RESERVED LA",
  legalName: "ZA Distribution LLC",
  dba: "Reserved LA is a DBA of ZA Distribution LLC",
  ein: "88-1123884",
  email: "support@reservedla.com",
  phone: "[YOUR PHONE NUMBER]",            // <-- replace before launch
  phoneHref: "tel:+1",                      // <-- replace before launch
  address1: "2930 Shawn Way",
  address2: "Rancho Cordova, California 95670",
  country: "United States",
  hours: "Customer Service: 7 days a week, 8AM–8PM PT",
  instagram: "https://instagram.com/reservedla",
  instagramHandle: "@reservedla",
  tiktok: "https://tiktok.com/@reservedla",
  freeShipThreshold: 150,
  currency: "USD"
};

/* ---- Branded SVG placeholder generator (crisp, on-brand, swappable) ---- */
function phSvg(label, sub, opts){
  opts = opts || {};
  const bg = opts.bg || "#17150f";
  const fg = opts.fg || "#f5f2ec";
  const w = opts.w || 800, h = opts.h || 1000;
  const big = (sub || "").toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
  <defs>
    <pattern id='p' width='34' height='34' patternTransform='rotate(45)' patternUnits='userSpaceOnUse'>
      <rect width='34' height='34' fill='${bg}'/>
      <line x1='0' y1='0' x2='0' y2='34' stroke='${fg}' stroke-opacity='0.05' stroke-width='2'/>
    </pattern>
    <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='${bg}'/><stop offset='1' stop-color='#000'/>
    </linearGradient>
  </defs>
  <rect width='${w}' height='${h}' fill='url(#g)'/>
  <rect width='${w}' height='${h}' fill='url(#p)'/>
  <text x='50%' y='16%' fill='${fg}' fill-opacity='0.5' font-family="Arial,Helvetica,sans-serif" font-size='20' font-weight='700' letter-spacing='8' text-anchor='middle'>RESERVED LA</text>
  <text x='50%' y='50%' fill='${fg}' font-family="Arial Narrow,Impact,sans-serif" font-size='${Math.min(150, 1300/Math.max(big.length,4))}' font-weight='900' letter-spacing='2' text-anchor='middle' dominant-baseline='middle'>${big}</text>
  <text x='50%' y='90%' fill='${fg}' fill-opacity='0.6' font-family="Arial,Helvetica,sans-serif" font-size='22' font-weight='600' letter-spacing='3' text-anchor='middle'>${(label||"").toUpperCase()}</text>
</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* ---- Category color themes for placeholders ---- */
const CAT_BG = {
  "Hoodies":"#17150f", "T-Shirts":"#1a1a1a", "Jackets":"#12140f",
  "Denim":"#141821", "Bottoms":"#1b1712", "Headwear":"#161311", "Accessories":"#181818"
};

/* ---- Product catalog ---- */
const PRODUCTS = [
  {id:"rl-essential-hoodie-bone", name:"Essential Box-Logo Hoodie", cat:"Hoodies", price:118, was:0, color:"Bone", tag:"BEST SELLER", rating:4.9, reviews:214, sizes:["S","M","L","XL","XXL"], oos:["XXL"], desc:"Heavyweight 420gsm brushed-back fleece with a boxy, cropped fit and dropped shoulders. Puff-print box logo across the chest. Pre-shrunk, garment-dyed for a lived-in tone."},
  {id:"rl-shadow-hoodie", name:"Shadow Pullover Hoodie", cat:"Hoodies", price:124, was:0, color:"Washed Black", tag:"NEW", rating:4.8, reviews:96, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Oversized silhouette in acid-washed heavyweight fleece. Double-lined hood, ribbed cuffs, and a tonal embroidered wordmark."},
  {id:"rl-arc-hoodie", name:"Arc Logo Zip Hoodie", cat:"Hoodies", price:132, was:158, color:"Ash Grey", tag:"SALE", rating:4.7, reviews:63, sizes:["S","M","L","XL"], oos:["S"], desc:"Full-zip fleece with matte metal hardware and a screen-printed arc logo down the sleeve. Relaxed through the body."},
  {id:"rl-flame-tee", name:"Flame Graphic Tee", cat:"T-Shirts", price:52, was:0, color:"Vintage Black", tag:"BEST SELLER", rating:4.9, reviews:341, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Boxy 240gsm cotton tee with a hand-drawn flame graphic on the back and a small chest hit. Garment-washed for softness."},
  {id:"rl-angel-tee", name:"Fallen Angel Tee", cat:"T-Shirts", price:56, was:0, color:"Off White", tag:"NEW", rating:4.8, reviews:88, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Oversized heavyweight tee featuring a full-back cherub print. Ribbed collar, dropped shoulder seams."},
  {id:"rl-script-tee", name:"LA Script Logo Tee", cat:"T-Shirts", price:48, was:0, color:"Sand", tag:"", rating:4.7, reviews:127, sizes:["S","M","L","XL"], oos:[], desc:"Clean everyday tee with a puff-print LA script across the chest. Mid-weight combed cotton."},
  {id:"rl-work-jacket", name:"Reserved Work Jacket", cat:"Jackets", price:188, was:0, color:"Faded Olive", tag:"NEW", rating:4.9, reviews:47, sizes:["S","M","L","XL"], oos:["S"], desc:"Structured cotton-canvas chore jacket with triple-needle stitching, corozo buttons, and three utility pockets. Boxy modern cut."},
  {id:"rl-varsity", name:"Varsity Bomber Jacket", cat:"Jackets", price:214, was:248, color:"Black / Cream", tag:"SALE", rating:4.8, reviews:59, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Wool-blend body with vegan-leather sleeves, chenille patches, and satin lining. A modern take on the classic varsity."},
  {id:"rl-puffer", name:"Cropped Puffer Vest", cat:"Jackets", price:142, was:0, color:"Jet Black", tag:"", rating:4.6, reviews:34, sizes:["S","M","L","XL"], oos:[], desc:"Insulated cropped vest with matte finish, two-way zip, and tonal branding. Layers over everything."},
  {id:"rl-baggy-denim", name:"Baggy Carpenter Denim", cat:"Denim", price:128, was:0, color:"Mid Indigo", tag:"BEST SELLER", rating:4.8, reviews:156, sizes:["28","30","32","34","36"], oos:["28"], desc:"14oz rigid denim in a true baggy carpenter fit with a hammer loop and utility pockets. Contrast stitching."},
  {id:"rl-stacked-denim", name:"Stacked Flare Jeans", cat:"Denim", price:136, was:0, color:"Washed Blue", tag:"NEW", rating:4.7, reviews:71, sizes:["28","30","32","34","36"], oos:[], desc:"Extra-long stacked flare with subtle whiskering and fading. Built to stack over your favourite sneakers."},
  {id:"rl-black-denim", name:"Distressed Straight Denim", cat:"Denim", price:124, was:148, color:"Faded Black", tag:"SALE", rating:4.6, reviews:52, sizes:["28","30","32","34"], oos:["34"], desc:"Straight-leg denim with hand-done distressing and repair details. Mid-rise, roomy through the thigh."},
  {id:"rl-cargo-pant", name:"Tactical Cargo Pants", cat:"Bottoms", price:96, was:0, color:"Charcoal", tag:"BEST SELLER", rating:4.8, reviews:189, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Ripstop cargos with bellowed pockets, adjustable hem toggles, and a relaxed taper. Everyday utility."},
  {id:"rl-sweatpant", name:"Heavyweight Sweatpants", cat:"Bottoms", price:88, was:0, color:"Bone", tag:"", rating:4.7, reviews:143, sizes:["S","M","L","XL","XXL"], oos:["S"], desc:"420gsm brushed fleece joggers to match the Essential Hoodie. Tapered leg, ribbed cuff, embroidered mark."},
  {id:"rl-mesh-short", name:"Mesh Basketball Shorts", cat:"Bottoms", price:64, was:0, color:"Washed Black", tag:"NEW", rating:4.6, reviews:60, sizes:["S","M","L","XL"], oos:[], desc:"Breathable double-layer mesh shorts with side stripes and a screen-printed logo. Above-the-knee cut."},
  {id:"rl-trucker-cap", name:"Structured Trucker Cap", cat:"Headwear", price:42, was:0, color:"Black / White", tag:"", rating:4.8, reviews:98, sizes:["OS"], oos:[], desc:"Five-panel trucker with foam front, breathable mesh back, and a raised 3D-embroidered logo. Snapback closure."},
  {id:"rl-beanie", name:"Cuffed Rib Beanie", cat:"Headwear", price:34, was:0, color:"Charcoal", tag:"BEST SELLER", rating:4.9, reviews:176, sizes:["OS"], oos:[], desc:"Soft acrylic-knit cuffed beanie with a woven label. Warm, stretchy, one-size-fits-most."},
  {id:"rl-bucket", name:"Reversible Bucket Hat", cat:"Headwear", price:46, was:0, color:"Sand / Black", tag:"NEW", rating:4.7, reviews:41, sizes:["OS"], oos:[], desc:"Two hats in one — canvas on one side, tonal jacquard on the other. Embroidered eyelets."},
  {id:"rl-crossbody", name:"Utility Crossbody Bag", cat:"Accessories", price:58, was:0, color:"Black", tag:"", rating:4.7, reviews:87, sizes:["OS"], oos:[], desc:"Water-resistant nylon crossbody with magnetic buckle, multiple compartments, and adjustable webbing strap."},
  {id:"rl-beanie-set", name:"Ribbed Scarf", cat:"Accessories", price:54, was:0, color:"Oatmeal", tag:"", rating:4.6, reviews:29, sizes:["OS"], oos:[], desc:"Chunky ribbed knit scarf with fringed ends and a tonal woven label. Oversized length."},
  {id:"rl-socks", name:"Logo Crew Socks (3-Pack)", cat:"Accessories", price:26, was:0, color:"Mixed", tag:"", rating:4.8, reviews:112, sizes:["OS"], oos:[], desc:"Cushioned cotton-blend crew socks with ribbed logo cuff. Three colourways per pack."},
  {id:"rl-longsleeve", name:"Ribbed Thermal Longsleeve", cat:"T-Shirts", price:68, was:0, color:"Faded Brown", tag:"NEW", rating:4.7, reviews:38, sizes:["S","M","L","XL"], oos:[], desc:"Waffle-knit thermal with a slim-boxy fit, thumbholes, and tonal chest embroidery. Great as a base layer."},
  {id:"rl-coach-jacket", name:"Nylon Coach Jacket", cat:"Jackets", price:118, was:0, color:"Black", tag:"", rating:4.6, reviews:44, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Lightweight water-repellent coach jacket with snap front, back print, and elasticated cuffs."},
  {id:"rl-flare-sweat", name:"Flare Sweatpants", cat:"Bottoms", price:92, was:0, color:"Ash Grey", tag:"NEW", rating:4.7, reviews:57, sizes:["S","M","L","XL"], oos:["XL"], desc:"Fleece flare-leg sweatpants with a stacked hem and side zip vents. The comfort of sweats, the shape of denim."},

  /* ---- Shorts collection (real photography, verified logo-free) ---- */
  {id:"rl-sp260310pmh6", name:"Light Wash Distressed Denim Shorts", cat:"Shorts", price:70, was:0, color:"Light Wash", tag:"BEST SELLER", rating:4.7, reviews:88, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp260310pmh6-2.jpg","rl-sp260310pmh6-6.jpg","rl-sp260310pmh6-4.jpg"], desc:"Loose wide-leg denim jorts in a light wash, finished with heavy rips and an irregular frayed hem for real streetwear grit."},
  {id:"rl-sp26061297av", name:"Camo 3/4 Cargo Shorts", cat:"Shorts", price:86, was:0, color:"Green Camo", tag:"NEW", rating:4.8, reviews:42, sizes:["S","M","L","XL"], oos:[], photos:["rl-sp26061297av-1.jpg","rl-sp26061297av-4.jpg","rl-sp26061297av-5.jpg"], desc:"Cotton ripstop camo cargos in a longer 3/4 length. Relaxed straight fit, reinforced flap pockets, and bar-tack stitching at the stress points."},
  {id:"rl-sp260616fa60", name:"Military Wide-Leg Cargo Shorts", cat:"Shorts", price:92, was:0, color:"Bone / Black", tag:"NEW", rating:4.8, reviews:61, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp260616fa60-1.jpg","rl-sp260616fa60-2.jpg","rl-sp260616fa60-3.jpg","rl-sp260616fa60-4.jpg"], desc:"Wide-leg military cargos in a heavy cotton with pleated volume, button-tab waist detailing, and oversized cargo pockets. A dramatic, runway-ready short."},
  {id:"rl-sp260602ah0q", name:"Cargo Multi-Pocket Denim Jorts", cat:"Shorts", price:72, was:88, color:"Washed Denim", tag:"SALE", rating:4.6, reviews:64, sizes:["M","L","XL","XXL"], oos:[], photos:["rl-sp260602ah0q-1.jpg","rl-sp260602ah0q-5.jpg"], desc:"Cotton denim cargo jorts with a soft wash, wide-leg silhouette, raw hem, and a reinforced multi-pocket layout. Utility with an attitude."},
  {id:"rl-sp260514qcbq", name:"Industrial Cargo Shorts", cat:"Shorts", price:116, was:0, color:"Waxed Black", tag:"", rating:4.9, reviews:37, sizes:["M","L","XL","XXL"], oos:[], photos:["rl-sp260514qcbq-1.jpg","rl-sp260514qcbq-5.jpg","rl-sp260514qcbq-6.jpg"], desc:"Heavyweight waxed-denim cargos with a multi-dimensional pocket build, distressed raw hem, and a faded charcoal finish. A premium, lived-in statement."},
  {id:"rl-sp2607079rsc", name:"Drawstring Distressed Shorts", cat:"Shorts", price:82, was:0, color:"Faded Black", tag:"", rating:4.7, reviews:49, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp2607079rsc-1.jpg","rl-sp2607079rsc-2.jpg","rl-sp2607079rsc-3.jpg"], desc:"Relaxed cotton-blend shorts with a brushed hand-feel, elastic drawstring waist, back patch pockets, and a subtle faded wash. Easy everyday comfort."},
  {id:"rl-sp250320sflm", name:"Zipper Slit Denim Jorts", cat:"Shorts", price:68, was:0, color:"Black / Olive", tag:"", rating:4.6, reviews:58, sizes:["M","L","XL","XXL","XXXL"], oos:[], photos:["rl-sp250320sflm-2.jpg","rl-sp250320sflm-1.jpg","rl-sp250320sflm-3.jpg"], desc:"Contemporary jorts with a front zip closure, side slit vents, and secure zip pockets. Durable metal hardware and a clean urban silhouette."}
];

/* attach images: real photos when provided, else generated placeholder */
PRODUCTS.forEach(p=>{
  if(p.photos && p.photos.length){
    p.gallery = p.photos.map(f=>"assets/products/"+f);
    p.img = p.gallery[0];
    return;
  }
  const bg = CAT_BG[p.cat] || "#17150f";
  p.img = phSvg(p.color + " · " + p.cat, p.name.split(" ").slice(0,2).join(" "), {bg});
  p.gallery = [
    p.img,
    phSvg("Front View", p.name.split(" ")[0], {bg}),
    phSvg("Back View", "Back", {bg}),
    phSvg("Detail", "Detail", {bg})
  ];
});

function fmt(n){ return "$" + Number(n).toFixed(Number.isInteger(n)?0:2); }
function getProduct(id){ return PRODUCTS.find(p=>p.id===id); }
