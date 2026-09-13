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

  /* ---- Shorts collection (real photography, verified logo-free) ---- */
  {id:"rl-sp260310pmh6", name:"Light Wash Distressed Denim Shorts", cat:"Shorts", price:70, was:0, color:"Light Wash", tag:"BEST SELLER", rating:4.7, reviews:88, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp260310pmh6-hero.jpg"], desc:"Loose wide-leg denim jorts in a light wash, finished with heavy rips and an irregular frayed hem for real streetwear grit."},
  {id:"rl-sp26061297av", name:"Camo 3/4 Cargo Shorts", cat:"Shorts", price:86, was:0, color:"Green Camo", tag:"NEW", rating:4.8, reviews:42, sizes:["S","M","L","XL"], oos:[], photos:["rl-sp26061297av-hero.jpg"], desc:"Cotton ripstop camo cargos in a longer 3/4 length. Relaxed straight fit, reinforced flap pockets, and bar-tack stitching at the stress points."},
  {id:"rl-sp260616fa60", name:"Military Wide-Leg Cargo Shorts", cat:"Shorts", price:92, was:0, color:"Bone / Black", tag:"NEW", rating:4.8, reviews:61, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp260616fa60-hero.jpg"], desc:"Wide-leg military cargos in a heavy cotton with pleated volume, button-tab waist detailing, and oversized cargo pockets. A dramatic, runway-ready short."},
  {id:"rl-sp260602ah0q", name:"Cargo Multi-Pocket Denim Jorts", cat:"Shorts", price:72, was:88, color:"Washed Denim", tag:"SALE", rating:4.6, reviews:64, sizes:["M","L","XL","XXL"], oos:[], photos:["rl-sp260602ah0q-hero.jpg"], desc:"Cotton denim cargo jorts with a soft wash, wide-leg silhouette, raw hem, and a reinforced multi-pocket layout. Utility with an attitude."},
  {id:"rl-sp260514qcbq", name:"Industrial Cargo Shorts", cat:"Shorts", price:116, was:0, color:"Waxed Black", tag:"", rating:4.9, reviews:37, sizes:["M","L","XL","XXL"], oos:[], photos:["rl-sp260514qcbq-hero.jpg"], desc:"Heavyweight waxed-denim cargos with a multi-dimensional pocket build, distressed raw hem, and a faded charcoal finish. A premium, lived-in statement."},
  {id:"rl-sp2607079rsc", name:"Drawstring Distressed Shorts", cat:"Shorts", price:82, was:0, color:"Faded Black", tag:"", rating:4.7, reviews:49, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp2607079rsc-hero.jpg"], desc:"Relaxed cotton-blend shorts with a brushed hand-feel, elastic drawstring waist, back patch pockets, and a subtle faded wash. Easy everyday comfort."},
  {id:"rl-sp250320sflm", name:"Zipper Slit Denim Jorts", cat:"Shorts", price:68, was:0, color:"Black / Olive", tag:"", rating:4.6, reviews:58, sizes:["M","L","XL","XXL","XXXL"], oos:[], photos:["rl-sp250320sflm-hero.jpg"], desc:"Contemporary jorts with a front zip closure, side slit vents, and secure zip pockets. Durable metal hardware and a clean urban silhouette."},

  /* ---- Denim / Jackets / Hoodies / Bottoms (real photography, verified logo-free) ---- */
  {id:"rl-sp230804mvtd", name:"Baggy Multi-Pocket Cargo Jeans", cat:"Denim", price:118, was:0, color:"Vintage Blue", tag:"NEW", rating:4.8, reviews:64, sizes:["M","L","XL","XXL"], oos:[], photos:["rl-sp230804mvtd-hero.jpg"], desc:"Baggy multi-pocket cargo jeans in a vintage-washed indigo. Drawcord waist, a stack of utility pockets, and a huge wide-leg drape. Peak baggy denim."},
  {id:"rl-sp251013gasp", name:"Washed Workwear Barrel Jeans", cat:"Denim", price:124, was:0, color:"Faded Brown", tag:"BEST SELLER", rating:4.8, reviews:97, sizes:["M","L","XL","XXL"], oos:[], photos:["rl-sp251013gasp-hero.jpg"], desc:"Barrel-cut workwear jeans in a sun-faded brown wash. Curved seams, a rounded leg, and a broken-in hand-feel. A statement denim built to age well."},
  {id:"rl-sp251119we8r", name:"Distressed Shearling-Collar Bomber", cat:"Jackets", price:158, was:0, color:"Washed Grey", tag:"NEW", rating:4.9, reviews:41, sizes:["S","M","L","XL"], oos:[], photos:["rl-sp251119we8r-hero.jpg"], desc:"Cropped bomber in washed, distressed fabric with a plush shearling-style collar and a pleated body. Full-zip, boxy, and warm — winter's easiest layer."},
  {id:"rl-sp251204c5s2", name:"Patchwork Layered Hoodie", cat:"Hoodies", price:118, was:0, color:"Charcoal", tag:"NEW", rating:4.8, reviews:53, sizes:["S","M","L","XL"], oos:[], photos:["rl-sp251204c5s2-hero.jpg"], desc:"Two-tone patchwork hoodie with a layered raw-edge hem, distressed detailing, and a heavyweight brushed-back interior. Oversized and lived-in."},
  {id:"rl-sp260302osst", name:"Studded Utility Cargo Pants", cat:"Bottoms", price:98, was:0, color:"Field Olive", tag:"", rating:4.7, reviews:38, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp260302osst-hero.jpg"], desc:"Heavyweight utility cargo pants in a faded field olive, finished with decorative stud work and roomy flap pockets. Straight-leg, workwear-built."},
  {id:"rl-sp260311wpc1", name:"Rope-Detail Wide-Leg Sweatpants", cat:"Bottoms", price:88, was:0, color:"Heather Grey", tag:"", rating:4.7, reviews:59, sizes:["S","M","L","XL"], oos:[], photos:["rl-sp260311wpc1-hero.jpg"], desc:"Wide-leg heavyweight sweatpants with a chunky decorative rope drawcord and a rounded barrel leg. Elevated loungewear with a sculptural shape."},
  {id:"rl-sp251117fbbn", name:"Pinstripe Pleated Wide-Leg Pants", cat:"Bottoms", price:92, was:0, color:"Charcoal Pinstripe", tag:"NEW", rating:4.7, reviews:44, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp251117fbbn-hero.jpg"], desc:"Pleated wide-leg trousers in a tonal pinstripe with a dramatic barrel silhouette. Tailored on top, voluminous through the leg."},
  {id:"rl-sp2601263vsl", name:"Drawstring Wide-Leg Sweatpants", cat:"Bottoms", price:84, was:0, color:"Heather Grey", tag:"", rating:4.6, reviews:71, sizes:["S","M","L","XL"], oos:[], photos:["rl-sp2601263vsl-hero.jpg"], desc:"Relaxed wide-leg sweatpants in soft heather fleece with a clean drawstring waist. The everyday pair you'll reach for on repeat."},
  {id:"rl-sp250402sntq", name:"Pleated Drape Trousers", cat:"Bottoms", price:96, was:118, color:"Slate / Black", tag:"SALE", rating:4.7, reviews:36, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp250402sntq-hero.jpg"], desc:"Pleated drape trousers with a soft woven hand and an architectural wide leg. Clean-fit waist, fluid movement — smart-casual done street."},
  {id:"rl-sp260817for3", name:"Frayed Patchwork Bomber Jacket", cat:"Jackets", price:148, was:0, color:"Washed Grey", tag:"NEW", rating:4.8, reviews:37, sizes:["S","M","L","XL"], oos:[], photos:["rl-sp260817for3-hero.jpg"], desc:"Cropped bomber with raw-edge patchwork seams criss-crossing a washed heavyweight body. Ribbed hem and cuffs, boxy modern fit."},
  {id:"rl-sp260824suyi", name:"Convertible-Collar Bomber Jacket", cat:"Jackets", price:142, was:0, color:"Heather Grey", tag:"NEW", rating:4.7, reviews:29, sizes:["M","L","XL"], oos:[], photos:["rl-sp260824suyi-hero.jpg"], desc:"Boxy bomber in a heather cotton twill with a convertible stand collar, snap front, and elasticated hem. Clean, minimal everyday outerwear."},
  {id:"rl-sp251104soik", name:"Vintage Faded Wide Barrel Jeans", cat:"Denim", price:118, was:0, color:"Faded Olive", tag:"BEST SELLER", rating:4.8, reviews:112, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp251104soik-hero.jpg"], desc:"Wide barrel-leg jeans in a heavy sun-faded olive wash. Rounded silhouette, tapered hem, and a broken-in vintage finish."},
  {id:"rl-sp251117bhmv", name:"Crackle-Washed Barrel Jeans", cat:"Denim", price:116, was:0, color:"Crackle Blue", tag:"NEW", rating:4.7, reviews:64, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp251117bhmv-hero.jpg"], desc:"Barrel-cut jeans in a striking crackle wash. Voluminous through the thigh, tapered at the ankle — a real statement denim."},
  {id:"rl-sp250715s7eb", name:"Distressed Dirty-Wash Jeans", cat:"Denim", price:112, was:0, color:"Dirty Wash", tag:"", rating:4.6, reviews:73, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp250715s7eb-hero.jpg"], desc:"Straight-leg jeans with a dirty vintage wash, subtle repairs, and faded whiskering. Looks like you have had them for years."},
  {id:"rl-sp250612jts0", name:"Light Wash Barrel Jeans", cat:"Denim", price:114, was:134, color:"Light Wash", tag:"SALE", rating:4.7, reviews:88, sizes:["S","M","L","XL","XXL"], oos:[], photos:["rl-sp250612jts0-hero.jpg"], desc:"Baggy barrel jeans in a bright light wash with soft fading. Rounded leg, cropped cuff — peak Y2K denim."},
  {id:"rl-sp260813qpa7", name:"Chunky Rib Knit Beanie", cat:"Headwear", price:32, was:0, color:"Cream / Black", tag:"BEST SELLER", rating:4.9, reviews:134, sizes:["OS"], oos:[], photos:["rl-sp260813qpa7-1.jpg","rl-sp260813qpa7-2.jpg"], desc:"Soft chunky-rib acrylic beanie with a deep cuff. Warm, stretchy, one-size-fits-most. Shown in cream and black."},
  {id:"rl-sp260813zdsh", name:"Corduroy Slouchy Beanie", cat:"Headwear", price:30, was:0, color:"Black / Cream", tag:"NEW", rating:4.7, reviews:58, sizes:["OS"], oos:[], photos:["rl-sp260813zdsh-1.jpg","rl-sp260813zdsh-2.jpg"], desc:"Lightweight corduroy-knit slouchy beanie with a longline fit. Wear it cuffed or slouched."},
  {id:"rl-sp2606081gvu", name:"Vintage Washed Dad Cap", cat:"Headwear", price:28, was:0, color:"Washed Blue / Tan", tag:"", rating:4.7, reviews:96, sizes:["OS"], oos:[], photos:["rl-sp2606081gvu-1.jpg","rl-sp2606081gvu-2.jpg"], desc:"Six-panel dad cap in a vintage washed cotton with hand-distressed edges and a curved brim. Adjustable strap back."},
  {id:"rl-sp260303bd5k", name:"Distressed Panel Cap", cat:"Headwear", price:28, was:0, color:"Washed Blue / Cream", tag:"NEW", rating:4.6, reviews:41, sizes:["OS"], oos:[], photos:["rl-sp260303bd5k-1.jpg","rl-sp260303bd5k-2.jpg"], desc:"Low-profile washed cap with a soft unstructured crown and distressed panels. Everyday, broken-in headwear."},
  {id:"rl-sp260224ui92", name:"Distressed Denim Cap", cat:"Headwear", price:30, was:0, color:"Washed Denim", tag:"", rating:4.6, reviews:52, sizes:["OS"], oos:[], photos:["rl-sp260224ui92-1.jpg","rl-sp260224ui92-2.jpg"], desc:"Washed denim baseball cap with frayed distressing and contrast repair stitching. Adjustable back, curved brim."},
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
