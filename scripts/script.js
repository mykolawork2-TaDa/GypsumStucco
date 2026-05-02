// ─── DATA ───────────────────────────────────────────────────────
const CATS = [
  {id:'columns',name:'Columns',icon:'🏛'},
  {id:'cornices',name:'Cornices',icon:'🌿'},
  {id:'medallions',name:'Medallions',icon:'⚜️'},
  {id:'frames',name:'Frames',icon:'🪟'},
  {id:'facade',name:'Façade',icon:'🏠'},
  {id:'balustrades',name:'Balustrades',icon:'✨'},
];

const PRODUCTS = [
  {id:1,name:'Classic Cornice KC-105',cat:'cornices',price:480,oldPrice:620,icon:'🌿',badge:'Best Seller',desc:'Elegant classical cornice in pure gypsum. Width 105mm, ideal for rooms with 2.7–3.5m ceilings. Available in any length.',specs:{Material:'Gypsum',Width:'105mm',Length:'2000mm',Weight:'1.8 kg/m','Finish':'Raw (paintable)'}},
  {id:2,name:'Ceiling Medallion MD-32',cat:'medallions',price:1250,icon:'⚜️',desc:'Decorative ceiling rose for chandeliers. Diameter 320mm. Classical floral motif.',specs:{Material:'Gypsum',Diameter:'320mm',Thickness:'18mm',Weight:'2.1 kg','Finish':'Raw (paintable)'}},
  {id:3,name:'Pilaster PL-48',cat:'columns',price:3200,oldPrice:4000,icon:'🌿',badge:'-20%',desc:'Full decorative pilaster with capital and base. Height 2400mm, width 480mm.',specs:{Material:'Gypsum',Height:'2400mm',Width:'480mm',Weight:'28 kg','Finish':'Raw (paintable)'}},
  {id:4,name:'Ceiling Rose RS-18',cat:'medallions',price:750,icon:'🏠',desc:'Small decorative ceiling rose for pendant lights. Diameter 180mm.',specs:{Material:'Gypsum',Diameter:'180mm',Thickness:'12mm',Weight:'0.9 kg','Finish':'Raw (paintable)'}},
  {id:5,name:'Balustrade BL-22',cat:'balustrades',price:890,icon:'✨',badge:'New',desc:'Classical balustrade spindle. Height 220mm, for railings and balconies.',specs:{Material:'Gypsum',Height:'220mm',Diameter:'80mm',Weight:'1.4 kg','Finish':'Raw (paintable)'}},
  {id:6,name:'Arch Frame NL-07',cat:'frames',price:2100,icon:'🪟',badge:'New',desc:'Decorative arch surround for doorways. Width 70mm, custom lengths available.',specs:{Material:'Gypsum',Width:'70mm',Length:'Custom',Weight:'2.2 kg/m','Finish':'Raw (paintable)'}},
  {id:7,name:'Ionic Column KL-120',cat:'columns',price:12500,icon:'🏛',badge:'New',desc:'Full ionic column set: shaft, capital and base. Height 1200mm.',specs:{Material:'Gypsum',Height:'1200mm',Diameter:'180mm',Weight:'65 kg','Finish':'Raw (paintable)'}},
  {id:8,name:'Cartouche KT-15',cat:'facade',price:1450,icon:'⚜️',badge:'New',desc:'Wall-mounted decorative cartouche. 350×220mm, for interiors and exteriors.',specs:{Material:'Gypsum',Size:'350×220mm',Thickness:'40mm',Weight:'2.8 kg','Finish':'Raw (paintable)'}},
  {id:9,name:'Façade Cornice FC-200',cat:'facade',price:680,icon:'🏠',desc:'Weather-resistant façade cornice. Width 200mm, reinforced gypsum composite.',specs:{Material:'Reinforced gypsum',Width:'200mm',Length:'2000mm',Weight:'3.2 kg/m','Finish':'White primer'}},
  {id:10,name:'Rosette Window Frame',cat:'frames',price:3600,icon:'🪟',desc:'Circular window surround with rosette motif. Inner diameter 600mm.',specs:{Material:'Gypsum',Size:'800×800mm',Thickness:'55mm',Weight:'12 kg','Finish':'Raw (paintable)'}},
  {id:11,name:'Modillion Block MB-12',cat:'cornices',price:320,icon:'🌿',desc:'Decorative bracket for cornice systems. 120×80×60mm.',specs:{Material:'Gypsum',Size:'120×80×60mm',Weight:'0.6 kg','Finish':'Raw (paintable)'}},
  {id:12,name:'Balustrade Rail',cat:'balustrades',price:1100,icon:'✨',desc:'Top and bottom rail for balustrade systems. Length 2000mm.',specs:{Material:'Gypsum',Length:'2000mm',Height:'80mm',Weight:'4.1 kg','Finish':'Raw (paintable)'}},
];

const NEWS = [
  {title:'New Riviera Façade Collection Launched',date:'April 12, 2026',excerpt:'Our stunning new outdoor collection is inspired by Mediterranean architecture. 47 new products now in stock.',icon:'🏠'},
  {title:'Spring Sale — Up to 30% Off Selected Items',date:'March 28, 2026',excerpt:'Limited-time discounts on our most popular interior décor pieces. Order before May 1st.',icon:'🎉'},
  {title:'New Showroom Opens in Kyiv',date:'March 5, 2026',excerpt:'Visit our brand-new 400m² showroom at Khreshchatyk 15 to see the full range of products in person.',icon:'🏛'},
  {title:'Wholesale Partnership Programme',date:'February 14, 2026',excerpt:'We are expanding our partner network. Special pricing for architects, builders, and interior designers.',icon:'🤝'},
  {title:'How to Choose the Right Cornice',date:'January 22, 2026',excerpt:'Expert guide to selecting cornice proportions for different room heights and architectural styles.',icon:'📐'},
  {title:'Installation Workshop — Poltava',date:'January 8, 2026',excerpt:'Free hands-on installation workshop for professionals. Register now — limited places available.',icon:'🔧'},
];

// ─── STATE ───────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('adg-cart')||'[]');
let wishlist = JSON.parse(localStorage.getItem('adg-wish')||'[]');
let currentPage = 'home';
let heroIdx = 0;
let catImages = {};
let prodImages = {};
let imgTarget = null;
let imgTargetType = null;
let payMethod = 'card';
let activeChannel = 'email';
let activeChannelM = 'email';
let discount = 0;
let galImages = [];
let filteredCat = 'all';

// ─── NAV ─────────────────────────────────────────────────────────
function nav(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg = document.getElementById('page-'+page);
  if(pg){pg.classList.add('active');}
  currentPage = page;
  document.querySelectorAll('.nav-ul a').forEach(a=>{
    a.classList.toggle('cur', a.dataset.page===page);
  });
  window.scrollTo({top:0,behavior:'smooth'});
  if(page==='home'){renderHome();}
  if(page==='catalog'){renderCatalog();}
  if(page==='news'){renderNews();}
  if(page==='gallery'){renderGallery();}
  if(page==='checkout'){renderCheckout();}
}

// ─── HERO ─────────────────────────────────────────────────────────
function heroSlide(d){heroIdx=(heroIdx+d+3)%3;updateHero();}
function heroGo(n){heroIdx=n;updateHero();}
function updateHero(){
  document.getElementById('heroSlides').style.transform=`translateX(-${heroIdx*100}%)`;
  document.querySelectorAll('.hero-dot').forEach((d,i)=>d.classList.toggle('active',i===heroIdx));
}
setInterval(()=>heroSlide(1),7500);

// ─── RENDER HOME ─────────────────────────────────────────────────
function renderHome(){
  //renderCatsMini();
  renderProductGrid('home-recs', PRODUCTS.slice(0,4));
  renderProductGrid('home-new', PRODUCTS.slice(4,8));
}

function renderCatsMini(){
  const el=document.getElementById('home-cats');
  if(!el)return;
  el.innerHTML=CATS.map(c=>`
    <div class="cat-card" onclick="filterCat('${c.id}',null);nav('catalog')">
      <div class="cat-img">
        ${catImages[c.id]?`<img src="${catImages[c.id]}" alt="${c.name}">`:`<span>${c.icon}</span>`}
        <button class="change-img-btn" onclick="event.stopPropagation();openImgUp('cat','${c.id}')">Change Image</button>
      </div>
      <p class="cat-nm">${c.name}</p>
    </div>`).join('');
}

function renderProductGrid(containerId, products){
  const el=document.getElementById(containerId);
  if(!el)return;
  el.innerHTML=products.map(p=>prodCardHTML(p)).join('');
}

function prodCardHTML(p){
  const inW=wishlist.includes(p.id);
  const inC=cart.find(i=>i.id===p.id);
  const img=prodImages[p.id];
  return`<div class="prod-card">
    ${p.badge?`<span class="prod-badge">${p.badge}</span>`:''}
    <button class="wish-btn${inW?' active':''}" onclick="toggleWish(${p.id},this)" title="Wishlist">♡</button>
    <div class="prod-img" onclick="openProduct(${p.id})">
      ${img?`<img src="${img}" alt="${p.name}">`:`<span>${p.icon}</span>`}
      <div class="prod-img-overlay">
        <button onclick="event.stopPropagation();openProduct(${p.id})">Quick View</button>
        <button onclick="event.stopPropagation();openImgUp('prod',${p.id})">Change Image</button>
      </div>
    </div>
    <div class="prod-body">
      <p class="prod-nm">${p.name}</p>
      <div class="prod-prc">
        <span class="prc-now">₴${p.price.toLocaleString()}</span>
        ${p.oldPrice?`<span class="prc-old">₴${p.oldPrice.toLocaleString()}</span>`:''}
      </div>
      <button class="btn-add${inC?' added':''}" onclick="addToCart(${p.id},this)">${inC?'✓ In Cart':'Add to Cart'}</button>
    </div>
  </div>`;
}

// ─── CATALOG ─────────────────────────────────────────────────────
function renderCatalog(){
  let products=[...PRODUCTS];
  if(filteredCat!=='all') products=products.filter(p=>p.cat===filteredCat);
  const el=document.getElementById('catalog-grid');
  if(el) el.innerHTML=products.map(p=>prodCardHTML(p)).join('');
}

function filterCat(cat, btn){
  filteredCat=cat;
  document.querySelectorAll('#filter-bar .filter-tag').forEach(b=>{
    b.classList.toggle('active', b.dataset.cat===cat);
  });
  if(btn){btn.classList.add('active');}
  renderCatalog();
}

function sortProducts(val){
  if(!val)return;
  let products=[...PRODUCTS];
  if(filteredCat!=='all') products=products.filter(p=>p.cat===filteredCat);
  if(val==='price-asc') products.sort((a,b)=>a.price-b.price);
  if(val==='price-desc') products.sort((a,b)=>b.price-a.price);
  if(val==='name') products.sort((a,b)=>a.name.localeCompare(b.name));
  const el=document.getElementById('catalog-grid');
  if(el) el.innerHTML=products.map(p=>prodCardHTML(p)).join('');
}

// ─── PRODUCT DETAIL ───────────────────────────────────────────────
function openProduct(id){
  const p=PRODUCTS.find(x=>x.id===id);
  if(!p)return;
  const img=prodImages[id];
  document.getElementById('pdp-crumb').innerHTML=
    `<a href="#" onclick="nav('home');return false">Home</a> <span>/ <a href="#" onclick="nav('catalog');return false">Catalogue</a></span> <span>/ ${p.name}</span>`;
  document.getElementById('pdp-content').innerHTML=`
    <div class="pdp-imgs">
      <div class="pdp-main-img" id="pdp-main">
        ${img?`<img src="${img}" alt="${p.name}">`:`<span>${p.icon}</span>`}
      </div>
      <div class="pdp-thumbs">
        <div class="pdp-thumb active" onclick="selectThumb(this,${id})">
          ${img?`<img src="${img}" alt="">`:`<span>${p.icon}</span>`}
        </div>
        <div class="pdp-thumb" style="opacity:.4;cursor:pointer" onclick="openImgUp('prod',${id})">
          <span style="font-size:20px;color:var(--gold)">+</span>
        </div>
      </div>
      <div class="upload-zone" onclick="openImgUp('prod',${id})">
        <p>📸 Upload / change product image</p>
      </div>
    </div>
    <div class="pdp-info">
      <span class="sec-lbl">${CATS.find(c=>c.id===p.cat)?.name||''}</span>
      <h1 style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;margin-bottom:8px">${p.name}</h1>
      <div style="display:flex;align-items:baseline;gap:0">
        <span class="price-big">₴${p.price.toLocaleString()}</span>
        ${p.oldPrice?`<span class="old-p">₴${p.oldPrice.toLocaleString()}</span>`:''}
      </div>
      <p class="desc">${p.desc}</p>
      <div class="pdp-specs">
        <table>${Object.entries(p.specs).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
      </div>
      <div class="qty-row">
        <label style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--stone)">Qty</label>
        <div class="qty-ctrl">
          <button onclick="pdpQty(-1)">−</button>
          <span id="pdp-qty">1</span>
          <button onclick="pdpQty(1)">+</button>
        </div>
      </div>
      <div style="display:flex;gap:14px">
        <button class="btn-p" style="flex:1" onclick="addToCartPDP(${id})">Add to Cart</button>
        <button class="btn-o" onclick="toggleWish(${id},this)">♡ Wishlist</button>
      </div>
    </div>`;
  nav('product');
}

function pdpQty(d){
  const el=document.getElementById('pdp-qty');
  if(!el)return;
  const v=parseInt(el.textContent)+d;
  if(v>=1)el.textContent=v;
}

function addToCartPDP(id){
  const qty=parseInt(document.getElementById('pdp-qty')?.textContent||1);
  const p=PRODUCTS.find(x=>x.id===id);
  if(!p)return;
  const ex=cart.find(i=>i.id===id);
  if(ex){ex.qty+=qty;}else{cart.push({id,name:p.name,price:p.price,icon:p.icon,qty});}
  saveCart();
  toast(`${p.name} added to cart`,'success');
}

// ─── CART ─────────────────────────────────────────────────────────
function addToCart(id, btn){
  const p=PRODUCTS.find(x=>x.id===id);
  if(!p)return;
  const ex=cart.find(i=>i.id===id);
  if(ex){ex.qty++;}else{cart.push({id,name:p.name,price:p.price,icon:p.icon,qty:1});}
  saveCart();
  if(btn){btn.textContent='✓ In Cart';btn.classList.add('added');}
  toast(`${p.name} added to cart`,'success');
}

function saveCart(){
  localStorage.setItem('adg-cart',JSON.stringify(cart));
  updateCartBadge();
  renderCartPanel();
}

function updateCartBadge(){
  const total=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cart-badge').textContent=total;
}

function renderCartPanel(){
  const el=document.getElementById('cart-items');
  if(!cart.length){
    el.innerHTML='<div class="cart-empty">🛒<br><br>Your cart is empty</div>';
    document.getElementById('cart-foot').style.opacity='.4';
    return;
  }
  document.getElementById('cart-foot').style.opacity='1';
  el.innerHTML=cart.map(item=>{
    const img=prodImages[item.id];
    return`<div class="cart-item">
      <div class="ci-img">${img?`<img src="${img}" alt="">`:`<span>${item.icon}</span>`}</div>
      <div class="ci-info">
        <p class="ci-nm">${item.name}</p>
        <p class="ci-prc">₴${item.price.toLocaleString()} each</p>
        <div class="ci-qty">
          <button onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="ci-del" onclick="removeFromCart(${item.id})">✕</button>
    </div>`;
  }).join('');
  const sub=cartSubtotal();
  const total=Math.round(sub*(1-discount));
  document.getElementById('cart-total-val').textContent=`₴${total.toLocaleString()}`;
}

function cartSubtotal(){return cart.reduce((s,i)=>s+i.price*i.qty,0);}

function changeQty(id,d){
  const item=cart.find(i=>i.id===id);
  if(!item)return;
  item.qty+=d;
  if(item.qty<=0)cart=cart.filter(i=>i.id!==id);
  saveCart();
}

function removeFromCart(id){
  cart=cart.filter(i=>i.id!==id);
  saveCart();
  if(currentPage==='catalog'){renderCatalog();}
  if(currentPage==='home'){renderHome();}
}

function toggleCart(){
  document.getElementById('cart-overlay').classList.toggle('open');
  document.getElementById('cart-panel').classList.toggle('open');
  renderCartPanel();
}

function applyCoupon(){
  const code=document.getElementById('coupon-input').value.trim().toUpperCase();
  if(code==='SAVE10'){discount=.1;toast('Coupon applied: 10% off','success');}
  else if(code==='SAVE20'){discount=.2;toast('Coupon applied: 20% off','success');}
  else{discount=0;toast('Invalid coupon code','error');}
  renderCartPanel();
}

// ─── WISHLIST ─────────────────────────────────────────────────────
function toggleWish(id, btn){
  const idx=wishlist.indexOf(id);
  if(idx>=0){wishlist.splice(idx,1);toast('Removed from wishlist','info');}
  else{wishlist.push(id);toast('Added to wishlist','info');}
  localStorage.setItem('adg-wish',JSON.stringify(wishlist));
  if(btn){btn.classList.toggle('active',wishlist.includes(id));btn.textContent=wishlist.includes(id)?'♥':'♡';}
}

// ─── SEARCH ───────────────────────────────────────────────────────
function doSearch(){
  const q=document.getElementById('srch-input').value.trim().toLowerCase();
  if(!q)return;
  const results=PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q));
  document.getElementById('srch-ttl').textContent=`"${q}"`;
  const el=document.getElementById('search-grid');
  el.innerHTML=results.length?results.map(p=>prodCardHTML(p)).join(''):'<p style="color:var(--stone)">No products found for this query.</p>';
  nav('search');
}

// ─── GALLERY ─────────────────────────────────────────────────────
const GAL_ITEMS=[
  {icon:'/images/logo.',cat:'interior',label:'Living room columns — Kyiv'},
  {icon:'🌿',cat:'interior',label:'Cornice installation — Lviv'},
  {icon:'🏠',cat:'exterior',label:'Façade décor — Odessa'},
  {icon:'⚜️',cat:'interior',label:'Ceiling medallion — Dnipro'},
  {icon:'✨',cat:'exterior',label:'Balustrade terrace — Kharkiv'},
  {icon:'🪟',cat:'custom',label:'Custom arch frames — Zaporizhzhia'},
  {icon:'🏛',cat:'exterior',label:'Column portico — Poltava'},
  {icon:'🌿',cat:'interior',label:'Dining room cornice — Kyiv'},
  {icon:'⚜️',cat:'custom',label:'Bespoke ceiling — Lviv'},
];
let galFilter='all';
function filterGal(cat,btn){
  galFilter=cat;
  document.querySelectorAll('#page-gallery .filter-tag').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase().includes(cat)||cat==='all'&&b.textContent==='All'));
  renderGallery();
}
function renderGallery(){
  const el=document.getElementById('gallery-grid');
  if(!el)return;
  let items=[...GAL_ITEMS,...galImages.map((src,i)=>({src,icon:'🖼',cat:'interior',label:'Your upload'}))];
  if(galFilter!=='all') items=items.filter(i=>i.cat===galFilter);
  el.innerHTML=items.map((item,i)=>`
    <div class="gal-item${i===0?' gal-item-big':''}" onclick="openLightbox('${item.src||''}','${item.icon}')">
      ${item.src?`<img src="${item.src}" alt="${item.label}">`:`<span>${item.icon}</span>`}
    </div>`).join('');
}
function uploadGallery(input){
  Array.from(input.files).forEach(f=>{
    const r=new FileReader();
    r.onload=e=>{galImages.push(e.target.result);renderGallery();};
    r.readAsDataURL(f);
  });
}
function openLightbox(src,icon){
  if(!src)return;
  document.getElementById('lb-img').src=src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(){document.getElementById('lightbox').classList.remove('open');}

// ─── CHECKOUT ─────────────────────────────────────────────────────
function renderCheckout(){
  const el=document.getElementById('checkout-items');
  if(!el)return;
  el.innerHTML=cart.map(i=>`
    <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--stone);margin-bottom:8px">
      <span>${i.name} ×${i.qty}</span>
      <span>₴${(i.price*i.qty).toLocaleString()}</span>
    </div>`).join('');
  const sub=cartSubtotal();
  const del=80;
  const total=Math.round(sub*(1-discount))+del;
  document.getElementById('co-sub').textContent='₴'+Math.round(sub*(1-discount)).toLocaleString();
  document.getElementById('co-del').textContent='₴'+del;
  document.getElementById('co-total').textContent='₴'+total.toLocaleString();
  document.getElementById('order-total-btn').textContent=total.toLocaleString();
}

function checkoutStep(n){
  for(let i=1;i<=3;i++){
    document.getElementById('step'+i).classList.toggle('active',i===n);
    const tab=document.getElementById('step'+i+'-tab');
    tab.classList.toggle('active',i===n);
    if(i<n)tab.classList.add('done'); else tab.classList.remove('done');
  }
  renderCheckout();
}

function selectPay(el,method){
  document.querySelectorAll('.pay-m').forEach(m=>m.classList.remove('active'));
  el.classList.add('active');
  payMethod=method;
  document.getElementById('card-fields').classList.toggle('show',method==='card');
}

function fmtCard(input){
  let v=input.value.replace(/\D/g,'').substring(0,16);
  input.value=v.replace(/(.{4})/g,'$1 ').trim();
}

function placeOrder(){
  if(payMethod==='card'){
    const cn=document.getElementById('ch-cnum').value.replace(/\s/g,'');
    if(cn.length<16){toast('Please enter a valid card number','error');return;}
    const cvv=document.getElementById('ch-cvv').value;
    if(cvv.length<3){toast('Please enter CVV','error');return;}
  }
  const fn=document.getElementById('ch-fname').value;
  const ln=document.getElementById('ch-lname').value;
  if(!fn||!ln){toast('Please fill in your name on step 1','error');checkoutStep(1);return;}
  // Simulate payment processing
  toast('Processing payment...','info');
  setTimeout(()=>{
    const orderNum='ADG-'+Date.now().toString().slice(-6);
    document.getElementById('order-confirm-num').textContent='Order number: '+orderNum;
    cart=[];saveCart();
    toast('Order placed successfully!','success');
    nav('success');
  },1800);
}

// ─── NEWS ─────────────────────────────────────────────────────────
function renderNews(){
  const el=document.getElementById('news-grid');
  if(!el)return;
  el.innerHTML=NEWS.map(n=>`
    <div class="news-card">
      <div class="news-img"><span>${n.icon}</span></div>
      <div class="news-body">
        <p class="news-dt">${n.date}</p>
        <h3 class="news-ttl">${n.title}</h3>
        <p class="news-ex">${n.excerpt}</p>
      </div>
    </div>`).join('');
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────
function openImgUp(type, id){
  imgTargetType=type;
  imgTarget=id;
  document.getElementById('img-url-input').value='';
  openModal('modal-imgup');
}

function handleImgFile(input){
  const file=input.files[0];
  if(!file)return;
  const r=new FileReader();
  r.onload=e=>{applyImg(e.target.result);};
  r.readAsDataURL(file);
  closeModal('modal-imgup');
}

function applyImgUrl(){
  const url=document.getElementById('img-url-input').value.trim();
  if(!url){toast('Please enter a URL','error');return;}
  applyImg(url);
  closeModal('modal-imgup');
}

function applyImg(src){
  if(imgTargetType==='cat'){catImages[imgTarget]=src;}
  else if(imgTargetType==='prod'){prodImages[imgTarget]=src;}
  toast('Image updated successfully','success');
  if(currentPage==='home'){renderHome();}
  else if(currentPage==='catalog'){renderCatalog();}
  else if(currentPage==='product'){openProduct(imgTarget);}
}

// ─── MESSAGING ────────────────────────────────────────────────────
function setChannel(btn){
  document.querySelectorAll('#contact-channels .ch-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  activeChannel=btn.dataset.ch;
}
function setChannelM(btn){
  btn.closest('.modal').querySelectorAll('.ch-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  activeChannelM=btn.dataset.ch;
}

function sendContactMsg(){
  const name=document.getElementById('c-name').value.trim();
  const contact=document.getElementById('c-contact').value.trim();
  const msg=document.getElementById('c-msg').value.trim();
  if(!name||!contact||!msg){toast('Please fill all fields','error');return;}
  dispatchMessage(activeChannel,name,contact,msg,'contact-status');
}

function sendModalMsg(){
  const name=document.getElementById('m-name').value.trim();
  const contact=document.getElementById('m-contact').value.trim();
  const msg=document.getElementById('m-msg').value.trim();
  if(!name||!contact||!msg){toast('Please fill all fields','error');return;}
  dispatchMessage(activeChannelM,name,contact,msg,'modal-msg-status');
}

function dispatchMessage(channel,name,contact,msg,statusId){
  const el=document.getElementById(statusId);
  if(channel==='telegram'){
    const text=encodeURIComponent(`New inquiry from ${name} (${contact}):\n${msg}`);
    window.open(`https://t.me/share/url?url=https://artdegypse.com&text=${text}`,'_blank');
    showStatus(el,true,'Message prepared for Telegram');
  } else if(channel==='whatsapp'){
    const text=encodeURIComponent(`Hi, I'm ${name} (${contact}). ${msg}`);
    window.open(`https://wa.me/380996812205?text=${text}`,'_blank');
    showStatus(el,true,'Message prepared for WhatsApp');
  } else if(channel==='viber'){
    const text=encodeURIComponent(`Hi, I'm ${name} (${contact}). ${msg}`);
    window.open(`viber://chat?number=%2B380996812205&text=${text}`,'_blank');
    showStatus(el,true,'Opening Viber...');
  } else {
    // Email simulation
    setTimeout(()=>{
      showStatus(el,true,`Email sent to ermitagedecor@gmail.com! We'll reply within 1 business day.`);
      toast('Message sent successfully','success');
    },800);
  }
}

function submitCall(){
  const name=document.getElementById('rc-name').value.trim();
  const phone=document.getElementById('rc-phone').value.trim();
  if(!name||!phone){toast('Please fill all fields','error');return;}
  setTimeout(()=>{
    showStatus(document.getElementById('call-status'),true,`Thank you, ${name}! We'll call you at ${phone} soon.`);
    toast('Call request sent','success');
  },600);
}

function showStatus(el,ok,msg){
  if(!el)return;
  el.className='msg-status '+(ok?'msg-ok':'msg-err');
  el.textContent=msg;
}

// ─── SUBSCRIBE ────────────────────────────────────────────────────
function subscribeEmail(){
  const em=document.getElementById('f-email').value.trim();
  if(!em||!em.includes('@')){toast('Please enter a valid email','error');return;}
  toast('Subscribed! Your 5% discount code: SAVE5','success');
  document.getElementById('f-email').value='';
}

// ─── MODAL ────────────────────────────────────────────────────────
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');});
});

// ─── TOAST ────────────────────────────────────────────────────────
function toast(msg,type='info'){
  const w=document.getElementById('toast-wrap');
  const t=document.createElement('div');
  t.className='toast '+type;
  t.textContent=msg;
  w.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .4s';setTimeout(()=>t.remove(),400);},3000);
}

// ─── EXTERNAL PRODUCT DATA (Open Library API demo) ───────────────
async function loadExternalData(){
  try{
    const r=await fetch('https://openlibrary.org/subjects/architecture.json?limit=3');
    const d=await r.json();
    if(d.works&&d.works.length){
      const titles=d.works.slice(0,3).map(w=>w.title).join(', ');
      console.log('Architecture books from Open Library:',titles);
      toast('📚 External data loaded: architecture references','info');
    }
  }catch(e){console.log('External API note:',e.message);}
}

// ─── INIT ─────────────────────────────────────────────────────────
renderHome();
updateCartBadge();
renderCartPanel();
setTimeout(loadExternalData,2000);