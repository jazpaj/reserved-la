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
  {id:"rl-sp260813qpa7", name:"Chunky Rib Knit Beanie", cat:"Headwear", price:32, was:0, color:"Cream / Black", tag:"BEST SELLER", rating:4.9, reviews:134, sizes:["OS"], oos:[], photos:["rl-sp260813qpa7-hero2.jpg"], desc:"Soft chunky-rib acrylic beanie with a deep cuff. Warm, stretchy, one-size-fits-most. Shown in cream and black."},
  {id:"rl-sp260813zdsh", name:"Corduroy Slouchy Beanie", cat:"Headwear", price:30, was:0, color:"Black / Cream", tag:"NEW", rating:4.7, reviews:58, sizes:["OS"], oos:[], photos:["rl-sp260813zdsh-hero2.jpg"], desc:"Lightweight corduroy-knit slouchy beanie with a longline fit. Wear it cuffed or slouched."},
  {id:"rl-sp2606081gvu", name:"Vintage Washed Dad Cap", cat:"Headwear", price:28, was:0, color:"Washed Blue / Tan", tag:"", rating:4.7, reviews:96, sizes:["OS"], oos:[], photos:["rl-sp2606081gvu-hero2.jpg"], desc:"Six-panel dad cap in a vintage washed cotton with hand-distressed edges and a curved brim. Adjustable strap back."},
  {id:"rl-sp260303bd5k", name:"Distressed Panel Cap", cat:"Headwear", price:28, was:0, color:"Washed Blue / Cream", tag:"NEW", rating:4.6, reviews:41, sizes:["OS"], oos:[], photos:["rl-sp260303bd5k-hero2.jpg"], desc:"Low-profile washed cap with a soft unstructured crown and distressed panels. Everyday, broken-in headwear."},
  {id:"rl-sp260224ui92", name:"Distressed Denim Cap", cat:"Headwear", price:30, was:0, color:"Washed Denim", tag:"", rating:4.6, reviews:52, sizes:["OS"], oos:[], photos:["rl-sp260224ui92-hero.jpg"], desc:"Washed denim baseball cap with frayed distressing and contrast repair stitching. Adjustable back, curved brim."},

  /* ---- Catalog expansion (placeholder imagery — real photos to be added) ---- */
  {id:"rl-parachute-cargo-shorts", name:"Parachute Cargo Shorts", cat:"Shorts", price:78, was:0, color:"Slate Grey", tag:"NEW", rating:4.7, reviews:34, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Lightweight nylon parachute shorts with cinch toggles, bellowed cargo pockets, and a relaxed drop. Built for movement."},
  {id:"rl-mesh-panel-shorts", name:"Mesh Panel Basketball Shorts", cat:"Shorts", price:52, was:0, color:"Black / White", tag:"", rating:4.6, reviews:57, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Breathable double-layer mesh shorts with contrast side panels and an above-the-knee cut. A warm-weather staple."},
  {id:"rl-raw-hem-denim-shorts", name:"Raw-Hem Denim Shorts", cat:"Shorts", price:64, was:78, color:"Mid Blue", tag:"SALE", rating:4.5, reviews:41, sizes:["S","M","L","XL"], oos:[], desc:"Rigid denim shorts chopped to a raw, frayed hem with a relaxed knee-length fit and vintage whiskering."},
  {id:"rl-stacked-flare-jeans", name:"Stacked Flare Jeans", cat:"Denim", price:132, was:0, color:"Washed Blue", tag:"NEW", rating:4.8, reviews:63, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Extra-long flared denim built to stack over your sneakers, with subtle whiskering and a mid-rise waist."},
  {id:"rl-carpenter-wideleg-jeans", name:"Carpenter Wide-Leg Jeans", cat:"Denim", price:126, was:0, color:"Mid Indigo", tag:"", rating:4.7, reviews:48, sizes:["S","M","L","XL","XXL"], oos:[], desc:"14oz carpenter jeans with a hammer loop, utility pockets, and a true wide-leg drape. Rigid denim that breaks in."},
  {id:"rl-coated-flare-jeans", name:"Coated Skinny-Flare Jeans", cat:"Denim", price:128, was:0, color:"Coated Black", tag:"", rating:4.6, reviews:29, sizes:["S","M","L","XL"], oos:[], desc:"Waxed-coating denim with a slim top block and dramatic flared hem for a sleek, leather-like finish."},
  {id:"rl-patchwork-repair-denim", name:"Patchwork Repair Denim", cat:"Denim", price:144, was:168, color:"Vintage Patch", tag:"SALE", rating:4.8, reviews:52, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Repair-detailed denim pieced from contrasting washes with visible darning and a relaxed straight leg."},
  {id:"rl-waxed-trucker-jacket", name:"Waxed Trucker Jacket", cat:"Jackets", price:168, was:0, color:"Waxed Black", tag:"NEW", rating:4.8, reviews:37, sizes:["S","M","L","XL"], oos:[], desc:"Structured trucker in waxed cotton with a broken-in sheen, chest flap pockets, and a boxy modern cut."},
  {id:"rl-nylon-ma1-bomber", name:"Nylon MA-1 Bomber", cat:"Jackets", price:148, was:0, color:"Sage", tag:"", rating:4.7, reviews:44, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Classic MA-1 silhouette in matte nylon with a utility sleeve pocket and ribbed collar, cuffs and hem."},
  {id:"rl-hooded-puffer-jacket", name:"Hooded Puffer Jacket", cat:"Jackets", price:198, was:0, color:"Jet Black", tag:"NEW", rating:4.9, reviews:51, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Oversized baffle puffer with a high funnel hood and matte finish. Warm, roomy, and built for layering."},
  {id:"rl-suede-western-jacket", name:"Suede Western Jacket", cat:"Jackets", price:214, was:0, color:"Tobacco", tag:"", rating:4.7, reviews:22, sizes:["S","M","L","XL"], oos:[], desc:"Faux-suede western jacket with yoke seams, snap front, and a soft brushed hand. A refined layering piece."},
  {id:"rl-distressed-denim-trucker", name:"Distressed Denim Trucker", cat:"Jackets", price:156, was:184, color:"Faded Indigo", tag:"SALE", rating:4.6, reviews:39, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Vintage-washed denim trucker with hand-done distressing and a cropped, boxy fit."},
  {id:"rl-nylon-coach-jacket-2", name:"Nylon Coach Jacket", cat:"Jackets", price:118, was:0, color:"Black", tag:"", rating:4.6, reviews:47, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Lightweight water-repellent coach jacket with a snap front and elasticated cuffs. An everyday shell."},
  {id:"rl-fleece-work-jacket", name:"Fleece-Lined Work Jacket", cat:"Jackets", price:176, was:0, color:"Washed Olive", tag:"", rating:4.8, reviews:31, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Cotton-canvas chore jacket lined in sherpa fleece, with triple-needle stitching and utility pockets."},
  {id:"rl-nylon-parachute-pants", name:"Nylon Parachute Pants", cat:"Bottoms", price:98, was:0, color:"Black", tag:"NEW", rating:4.7, reviews:66, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Billowy nylon parachute pants with adjustable toggles at the waist and hem. Techwear-ready volume."},
  {id:"rl-flared-track-pants", name:"Flared Track Pants", cat:"Bottoms", price:82, was:0, color:"Charcoal", tag:"", rating:4.6, reviews:58, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Jersey track pants with a stacked flare leg and side stripe. Elastic waist with a drawcord."},
  {id:"rl-wool-wideleg-trousers", name:"Wide-Leg Wool Trousers", cat:"Bottoms", price:112, was:0, color:"Grey Marl", tag:"", rating:4.7, reviews:33, sizes:["S","M","L","XL"], oos:[], desc:"Drapey wool-blend trousers with front pleats and a wide, fluid leg. Smart-casual done street."},
  {id:"rl-ripstop-cargo-jogger", name:"Ripstop Cargo Jogger", cat:"Bottoms", price:88, was:0, color:"Field Olive", tag:"BEST SELLER", rating:4.8, reviews:121, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Tapered ripstop joggers with bellowed cargo pockets and adjustable hem toggles. Everyday utility."},
  {id:"rl-balloon-sweatpants", name:"Balloon-Fit Sweatpants", cat:"Bottoms", price:84, was:0, color:"Ash Grey", tag:"", rating:4.6, reviews:44, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Heavyweight fleece sweatpants with a rounded balloon leg and ribbed cuff. Cozy, sculptural comfort."},
  {id:"rl-heavyweight-box-hoodie", name:"Heavyweight Box-Fit Hoodie", cat:"Hoodies", price:98, was:0, color:"Bone", tag:"BEST SELLER", rating:4.9, reviews:143, sizes:["S","M","L","XL","XXL"], oos:[], desc:"420gsm brushed-back fleece in a boxy, cropped fit with dropped shoulders and a double-lined hood."},
  {id:"rl-washed-zip-hoodie", name:"Washed Zip-Up Hoodie", cat:"Hoodies", price:108, was:0, color:"Washed Black", tag:"NEW", rating:4.7, reviews:62, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Garment-washed full-zip hoodie with matte hardware and a heavyweight, lived-in hand."},
  {id:"rl-acid-wash-hoodie", name:"Acid-Wash Pullover Hoodie", cat:"Hoodies", price:104, was:0, color:"Acid Grey", tag:"", rating:4.7, reviews:48, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Acid-washed heavyweight fleece with a faded, one-of-one finish and a kangaroo pocket."},
  {id:"rl-raw-edge-hoodie", name:"Distressed Raw-Edge Hoodie", cat:"Hoodies", price:112, was:0, color:"Vintage Black", tag:"", rating:4.6, reviews:37, sizes:["S","M","L","XL"], oos:[], desc:"Deconstructed hoodie with raw exposed seams, subtle distressing and an oversized drape."},
  {id:"rl-cropped-hoodie", name:"Cropped Boxy Hoodie", cat:"Hoodies", price:88, was:0, color:"Cement", tag:"", rating:4.6, reviews:41, sizes:["S","M","L","XL"], oos:[], desc:"Shortened, boxy hoodie with a wide ribbed hem. Layers clean over longline tees."},
  {id:"rl-sherpa-hoodie", name:"Sherpa-Lined Hoodie", cat:"Hoodies", price:124, was:0, color:"Chocolate", tag:"NEW", rating:4.8, reviews:29, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Heavy hoodie lined with plush sherpa through the body and hood. Serious cold-weather warmth."},
  {id:"rl-half-zip-hoodie", name:"Half-Zip Hoodie", cat:"Hoodies", price:96, was:0, color:"Slate", tag:"", rating:4.6, reviews:35, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Mock-neck half-zip in brushed fleece with a clean, minimal front and a boxy fit."},
  {id:"rl-contrast-stitch-hoodie", name:"Contrast-Stitch Hoodie", cat:"Hoodies", price:102, was:0, color:"Off White", tag:"", rating:4.5, reviews:26, sizes:["S","M","L","XL"], oos:[], desc:"Inside-out construction with exposed contrast stitching and a heavyweight loopback interior."},
  {id:"rl-heavy-fleece-hoodie", name:"Heavy Fleece Pullover Hoodie", cat:"Hoodies", price:94, was:112, color:"Faded Navy", tag:"SALE", rating:4.7, reviews:73, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Everyday pullover in dense brushed fleece with a roomy hood and ribbed trims."},
  {id:"rl-nylon-5panel-cap", name:"Nylon 5-Panel Cap", cat:"Headwear", price:36, was:0, color:"Black", tag:"NEW", rating:4.7, reviews:52, sizes:["OS"], oos:[], desc:"Lightweight nylon 5-panel with a flat brim and hidden zip pocket. Adjustable strap back."},
  {id:"rl-trucker-mesh-cap", name:"Trucker Mesh Cap", cat:"Headwear", price:34, was:0, color:"Stone / Black", tag:"", rating:4.6, reviews:63, sizes:["OS"], oos:[], desc:"Foam-front trucker with a breathable mesh back and structured crown. Snapback closure."},
  {id:"rl-fisherman-beanie", name:"Fisherman Beanie", cat:"Headwear", price:30, was:0, color:"Charcoal", tag:"BEST SELLER", rating:4.8, reviews:98, sizes:["OS"], oos:[], desc:"Short-cuff fisherman beanie in a tight rib knit. Sits high, warm and stretchy."},
  {id:"rl-reversible-bucket-hat", name:"Reversible Bucket Hat", cat:"Headwear", price:42, was:0, color:"Camo / Black", tag:"", rating:4.6, reviews:37, sizes:["OS"], oos:[], desc:"Two hats in one — camo on one side, solid on the other, with embroidered eyelets."},
  {id:"rl-knit-balaclava", name:"Knit Balaclava Hood", cat:"Headwear", price:38, was:0, color:"Black", tag:"", rating:4.5, reviews:24, sizes:["OS"], oos:[], desc:"Ribbed knit balaclava that wears as a hood or neck gaiter. A winter techwear essential."},
  {id:"rl-corduroy-shorts", name:"Corduroy Shorts", cat:"Shorts", price:62, was:0, color:"Tan", tag:"", rating:4.6, reviews:31, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Mid-wale corduroy shorts with a relaxed straight leg and clean five-pocket build. Soft, warm-weather texture."},
  {id:"rl-terry-sweat-shorts", name:"Terry Sweat Shorts", cat:"Shorts", price:48, was:0, color:"Heather Grey", tag:"", rating:4.7, reviews:64, sizes:["S","M","L","XL","XXL"], oos:[], desc:"French-terry sweat shorts with an elastic drawcord waist and above-the-knee cut. Everyday comfort."},
  {id:"rl-belted-utility-shorts", name:"Belted Utility Shorts", cat:"Shorts", price:74, was:0, color:"Khaki", tag:"NEW", rating:4.7, reviews:28, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Cotton-twill utility shorts with an integrated web belt and stacked cargo pockets."},
  {id:"rl-two-tone-panel-shorts", name:"Two-Tone Panel Shorts", cat:"Shorts", price:58, was:0, color:"Black / Grey", tag:"", rating:4.5, reviews:22, sizes:["S","M","L","XL"], oos:[], desc:"Colour-blocked panel shorts with contrast stitching and a mid-length drop."},
  {id:"rl-tie-dye-sweat-shorts", name:"Tie-Dye Sweat Shorts", cat:"Shorts", price:54, was:0, color:"Washed Purple", tag:"", rating:4.6, reviews:37, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Hand-dyed fleece shorts with a one-of-one wash and ribbed drawcord waist."},
  {id:"rl-pinstripe-tailored-shorts", name:"Pinstripe Tailored Shorts", cat:"Shorts", price:68, was:0, color:"Charcoal Pinstripe", tag:"", rating:4.6, reviews:19, sizes:["S","M","L","XL"], oos:[], desc:"Pleated tailored shorts in a tonal pinstripe with a longer, dressed-up length."},
  {id:"rl-windbreaker-shorts", name:"Windbreaker Shorts", cat:"Shorts", price:56, was:0, color:"Black", tag:"NEW", rating:4.5, reviews:24, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Lightweight water-repellent nylon shorts with a mesh liner and zip pockets."},
  {id:"rl-bootcut-selvedge-jeans", name:"Bootcut Selvedge Jeans", cat:"Denim", price:138, was:0, color:"Raw Indigo", tag:"", rating:4.7, reviews:34, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Raw selvedge denim with a subtle bootcut leg and clean chain-stitch hem. Ages beautifully."},
  {id:"rl-double-knee-denim", name:"Double-Knee Denim", cat:"Denim", price:134, was:0, color:"Mid Blue", tag:"NEW", rating:4.8, reviews:41, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Workwear-inspired denim with reinforced double-knee panels and a relaxed straight leg."},
  {id:"rl-bleached-baggy-jeans", name:"Bleached Baggy Jeans", cat:"Denim", price:122, was:0, color:"Bleach Wash", tag:"", rating:4.6, reviews:29, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Heavily bleached baggy denim with a faded, sun-worn finish and wide-leg drape."},
  {id:"rl-loose-tapered-jeans", name:"Loose Tapered Jeans", cat:"Denim", price:118, was:0, color:"Dark Indigo", tag:"", rating:4.6, reviews:47, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Roomy through the thigh with a tapered ankle. A versatile everyday dark-wash jean."},
  {id:"rl-contrast-stitch-jeans", name:"Contrast-Stitch Jeans", cat:"Denim", price:126, was:0, color:"Ecru", tag:"", rating:4.5, reviews:26, sizes:["S","M","L","XL"], oos:[], desc:"Off-white denim with bold contrast stitching and a straight, structured leg."},
  {id:"rl-faded-straight-jeans", name:"Faded Straight Jeans", cat:"Denim", price:116, was:136, color:"Faded Blue", tag:"SALE", rating:4.7, reviews:58, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Classic straight-leg denim in a soft faded wash with light whiskering. An everyday staple."},
  {id:"rl-varsity-letterman", name:"Varsity Letterman Jacket", cat:"Jackets", price:188, was:0, color:"Black / Cream", tag:"NEW", rating:4.8, reviews:33, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Wool-blend body with vegan-leather sleeves, chenille patches and a satin lining. A modern varsity."},
  {id:"rl-cropped-moto-jacket", name:"Cropped Moto Jacket", cat:"Jackets", price:196, was:0, color:"Black", tag:"", rating:4.7, reviews:21, sizes:["S","M","L","XL"], oos:[], desc:"Cropped faux-leather moto with asymmetric zip, padded shoulders and zip cuffs."},
  {id:"rl-quilted-liner-jacket", name:"Quilted Liner Jacket", cat:"Jackets", price:138, was:0, color:"Olive", tag:"", rating:4.6, reviews:27, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Lightweight quilted liner jacket with a snap front. Layers under a shell or wears solo."},
  {id:"rl-pinstripe-suit-trouser", name:"Pinstripe Suit Trouser", cat:"Bottoms", price:108, was:0, color:"Charcoal", tag:"", rating:4.6, reviews:24, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Relaxed pleated suit trouser in a tonal pinstripe. Tailored on top, easy through the leg."},
  {id:"rl-double-knee-work-pant", name:"Double-Knee Work Pant", cat:"Bottoms", price:96, was:0, color:"Duck Brown", tag:"", rating:4.7, reviews:52, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Durable canvas work pant with reinforced double knees, a hammer loop and relaxed fit."},
  {id:"rl-corduroy-wideleg-pant", name:"Corduroy Wide-Leg Pant", cat:"Bottoms", price:102, was:0, color:"Rust", tag:"NEW", rating:4.7, reviews:30, sizes:["S","M","L","XL"], oos:[], desc:"Wide-wale corduroy trousers with a fluid wide leg and soft, brushed hand."},
  {id:"rl-tech-zipoff-pant", name:"Tech Zip-Off Pant", cat:"Bottoms", price:116, was:0, color:"Graphite", tag:"", rating:4.6, reviews:36, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Ripstop tech pant with zip-off lower legs that convert to shorts. Multiple secure pockets."},
  {id:"rl-rugby-sweatpant", name:"Rugby Sweatpant", cat:"Bottoms", price:78, was:0, color:"Navy", tag:"", rating:4.6, reviews:43, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Heavy loopback sweatpant with a tapered leg and ribbed cuff. Weekend essential."},
  {id:"rl-overdyed-pullover-hoodie", name:"Overdyed Pullover Hoodie", cat:"Hoodies", price:100, was:0, color:"Overdyed Green", tag:"", rating:4.7, reviews:38, sizes:["S","M","L","XL","XXL"], oos:[], desc:"Piece-dyed heavyweight hoodie with a rich tonal depth and a boxy, relaxed fit."},
  {id:"rl-corduroy-6panel-cap", name:"Corduroy 6-Panel Cap", cat:"Headwear", price:34, was:0, color:"Brown", tag:"", rating:4.6, reviews:41, sizes:["OS"], oos:[], desc:"Six-panel cap in soft corduroy with a curved brim and adjustable strap back."},
  {id:"rl-distressed-trucker-cap", name:"Distressed Trucker Cap", cat:"Headwear", price:32, was:0, color:"Washed Black", tag:"", rating:4.5, reviews:35, sizes:["OS"], oos:[], desc:"Sun-faded trucker with frayed brim edges and a breathable mesh back."},
  {id:"rl-pom-beanie", name:"Pom Beanie", cat:"Headwear", price:30, was:0, color:"Cream", tag:"", rating:4.6, reviews:29, sizes:["OS"], oos:[], desc:"Cuffed rib-knit beanie topped with a soft faux-fur pom. Warm and stretchy."},
  {id:"rl-boonie-hat", name:"Wide-Brim Boonie Hat", cat:"Headwear", price:40, was:0, color:"Olive Camo", tag:"NEW", rating:4.5, reviews:18, sizes:["OS"], oos:[], desc:"Packable ripstop boonie with a wide shade brim and chin drawcord."},
  {id:"rl-trapper-hat", name:"Earflap Trapper Hat", cat:"Headwear", price:46, was:0, color:"Black", tag:"", rating:4.7, reviews:22, sizes:["OS"], oos:[], desc:"Sherpa-lined trapper with fold-down earflaps and a snap chin strap. Deep winter warmth."},
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
