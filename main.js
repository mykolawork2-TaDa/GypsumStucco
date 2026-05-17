// ─── DATA LOADING ─────────────────────────────────────────────────────────────
// Дані більше не хардкодяться — підтягуються з JSON-файлів
// Ці файли редагуються через Decap CMS адмінку (/admin/)

let PRODUCTS = [];
let NEWS = [];
let GAL_ITEMS = [];

// Категорії статичні — їх рідко міняють, тому залишаємо тут
const CATS = [
  {id:'columns',    name:'Columns',     icon:'images/category/cat-columns.png'},
  {id:'cornices',   name:'Cornices',    icon:'images/category/cat-cornices.png'},
  {id:'medallions', name:'Medallions',  icon:'images/category/cat-medallions.png'},
  {id:'frames',     name:'Frames',      icon:'images/category/cat-frames.png'},
  {id:'facade',     name:'Façade',      icon:'images/category/cat-facade.png'},
  {id:'balustrades',name:'Balustrades', icon:'images/category/cat-balustrades.png'},
];

// Завантаження всіх даних при старті сторінки
async function loadAllData() {
  try {
    // Паралельно завантажуємо всі три файли
    const [productsRes, newsRes, galleryRes] = await Promise.all([
      fetch('/data/products.json'),
      fetch('/data/news.json'),
      fetch('/data/gallery.json'),
    ]);

    // Перевірка що файли існують
    if (!productsRes.ok) throw new Error('products.json not found');
    if (!newsRes.ok)     throw new Error('news.json not found');
    if (!galleryRes.ok)  throw new Error('gallery.json not found');

    const productsData = await productsRes.json();
    const newsData     = await newsRes.json();
    const galleryData  = await galleryRes.json();

    // Записуємо в глобальні змінні (такий самий формат що й раніше)
    PRODUCTS  = productsData.items  || [];
    NEWS      = newsData.items      || [];
    GAL_ITEMS = galleryData.items   || [];

  } catch (err) {
    console.error('Помилка завантаження даних:', err);
    // Якщо файл не знайдено — просто порожні масиви, сайт не зламається
    PRODUCTS  = PRODUCTS.length  ? PRODUCTS  : [];
    NEWS      = NEWS.length      ? NEWS      : [];
    GAL_ITEMS = GAL_ITEMS.length ? GAL_ITEMS : [];
  }
}

// ─── STATE ───────────────────────────────────────────────────────
let cart        = JSON.parse(localStorage.getItem('adg-cart-en') || '[]');
let wishlist    = JSON.parse(localStorage.getItem('adg-wish-en') || '[]');
let currentPage = 'home';
let heroIdx     = 0;
let payMethod   = 'card';
let activeChannel  = 'email';
let activeChannelM = 'email';
let discount    = 0;
let filteredCat = 'all';

// ─── NAV ─────────────────────────────────────────────────────────
function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  currentPage = page;
  document.querySelectorAll('.nav-ul a').forEach(a => {
    a.classList.toggle('cur', a.dataset.page === page);
  });
  document.getElementById('nav-ul').classList.remove('open');
  document.getElementById('mob-nav-btn').textContent = '☰';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'home')     renderHome();
  if (page === 'catalog')  renderCatalog();
  if (page === 'news')     renderNews();
  if (page === 'gallery')  renderGallery();
  if (page === 'checkout') renderCheckout();
}

function toggleMobNav() {
  const ul  = document.getElementById('nav-ul');
  const btn = document.getElementById('mob-nav-btn');
  ul.classList.toggle('open');
  btn.textContent = ul.classList.contains('open') ? '✕' : '☰';
}

// ─── HERO ─────────────────────────────────────────────────────────
function heroSlide(d) { heroIdx = (heroIdx + d + 3) % 3; updateHero(); }
function heroGo(n)    { heroIdx = n; updateHero(); }
function updateHero() {
  document.getElementById('heroSlides').style.transform = `translateX(-${heroIdx * 100}%)`;
  document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === heroIdx));
}
setInterval(() => heroSlide(1), 5000);

// ─── PRICE FORMAT ─────────────────────────────────────────────────
function fmt(n) { return n.toLocaleString('fr-FR'); }

// ─── RENDER HOME ─────────────────────────────────────────────────
function renderHome() {
  renderCatsMini();
  renderProductGrid('home-recs', PRODUCTS.slice(0, 4));
  renderProductGrid('home-new',  PRODUCTS.slice(4, 8));
}

function renderCatsMini() {
  const el = document.getElementById('home-cats');
  if (!el) return;
  el.innerHTML = CATS.map(c => `
    <div class="cat-card" onclick="filterCat('${c.id}',null);nav('catalog')">
      <div class="cat-img"><img class="cat-img-obj" src="${c.icon}" alt="${c.name}"></div>
      <p class="cat-nm">${c.name}</p>
    </div>`).join('');
}

function renderProductGrid(containerId, products) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!products.length) {
    el.innerHTML = '<p style="color:var(--stone);text-align:center;padding:40px">No products yet.</p>';
    return;
  }
  el.innerHTML = products.map(p => prodCardHTML(p)).join('');
}

function prodCardHTML(p) {
  const inW = wishlist.includes(p.id);
  const inC = cart.find(i => i.id === p.id);
  return `<div class="prod-card">
    ${p.badge ? `<span class="prod-badge">${p.badge}</span>` : ''}
    <button class="wish-btn${inW ? ' active' : ''}" onclick="toggleWish(${p.id},this)" title="Favoris">${inW ? '♥' : '♡'}</button>
    <div class="prod-img" onclick="openProduct(${p.id})">
      <img src="${p.icon}" alt="${p.name}">
      <div class="prod-img-overlay">
        <button onclick="event.stopPropagation();openProduct(${p.id})">Quick View</button>
      </div>
    </div>
    <div class="prod-body">
      <p class="prod-nm">${p.name}</p>
      <div class="prod-prc">
        <span class="prc-now">${fmt(p.price)} €</span>
        ${p.oldPrice ? `<span class="prc-old">${fmt(p.oldPrice)} €</span>` : ''}
      </div>
    </div>
  </div>`;
}

// ─── CATALOG ─────────────────────────────────────────────────────
function renderCatalog() {
  let products = [...PRODUCTS];
  if (filteredCat !== 'all') products = products.filter(p => p.cat === filteredCat);
  const el = document.getElementById('catalog-grid');
  if (!el) return;
  if (!products.length) {
    el.innerHTML = '<p style="color:var(--stone);text-align:center;padding:60px">No products in this category yet.</p>';
    return;
  }
  el.innerHTML = products.map(p => prodCardHTML(p)).join('');
}

function filterCat(cat, btn) {
  filteredCat = cat;
  document.querySelectorAll('#filter-bar .filter-tag').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  renderCatalog();
}

function sortProducts(val) {
  if (!val) return;
  let products = [...PRODUCTS];
  if (filteredCat !== 'all') products = products.filter(p => p.cat === filteredCat);
  if (val === 'price-asc')  products.sort((a, b) => a.price - b.price);
  if (val === 'price-desc') products.sort((a, b) => b.price - a.price);
  if (val === 'name')       products.sort((a, b) => a.name.localeCompare(b.name));
  const el = document.getElementById('catalog-grid');
  if (el) el.innerHTML = products.map(p => prodCardHTML(p)).join('');
}

// ─── PRODUCT DETAIL ───────────────────────────────────────────────
function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  document.getElementById('pdp-crumb').innerHTML =
    `<a href="#" onclick="nav('home');return false">Home</a>
     <span>/ <a href="#" onclick="nav('catalog');return false">Catalogue</a></span>
     <span>/ ${p.name}</span>`;
  document.getElementById('pdp-content').innerHTML = `
    <div class="pdp-imgs">
      <div class="pdp-main-img"><img src="${p.icon}" alt="${p.name}"></div>
      <div class="pdp-thumbs">
        <div class="pdp-thumb active"><img src="${p.icon}" alt=""></div>
        ${(p.gallery || []).map(img => `
        <div class="pdp-thumb" onclick="document.querySelector('.pdp-main-img img').src='${img}'">
          <img src="${img}" alt="">
        </div>`).join('')}
      </div>
    </div>
    <div class="pdp-info">
      <span class="sec-lbl">${CATS.find(c => c.id === p.cat)?.name || ''}</span>
      <h1 style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;margin-bottom:8px">${p.name}</h1>
      <div style="display:flex;align-items:baseline;gap:0">
        <span class="price-big">${fmt(p.price)} €</span>
        ${p.oldPrice ? `<span class="old-p">${fmt(p.oldPrice)} €</span>` : ''}
      </div>
      <p class="desc">${p.desc}</p>
      <div class="pdp-specs">
        <table>
          ${Object.entries(p.specs || {})
            .filter(([k, v]) => v)
            .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
            .join('')}
        </table>
      </div>
    </div>`;
  nav('product');
}

function pdpQty(d) {
  const el = document.getElementById('pdp-qty');
  if (!el) return;
  const v = parseInt(el.textContent) + d;
  if (v >= 1) el.textContent = v;
}

function addToCartPDP(id) {
  const qty = parseInt(document.getElementById('pdp-qty')?.textContent || 1);
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(i => i.id === id);
  if (ex) { ex.qty += qty; } else { cart.push({ id, name: p.name, price: p.price, icon: p.icon, qty }); }
  saveCart();
  toast(`${p.name} added to cart`, 'success');
}

// ─── WISHLIST ─────────────────────────────────────────────────────
function toggleWish(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx >= 0) { wishlist.splice(idx, 1); toast('Removed from wishlist', 'info'); }
  else          { wishlist.push(id);        toast('Added to wishlist', 'info'); }
  localStorage.setItem('adg-wish-en', JSON.stringify(wishlist));
  if (btn) {
    btn.classList.toggle('active', wishlist.includes(id));
    btn.textContent = wishlist.includes(id) ? '♥' : '♡';
  }
}

// ─── SEARCH ───────────────────────────────────────────────────────
function doSearch() {
  const q = document.getElementById('srch-input').value.trim().toLowerCase();
  if (!q) return;
  runSearch(q);
}
function doSearchMob() {
  const q = document.getElementById('mob-srch-input').value.trim().toLowerCase();
  if (!q) return;
  document.getElementById('mob-search-bar').classList.remove('open');
  runSearch(q);
}
function runSearch(q) {
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
  );
  document.getElementById('srch-ttl').textContent = `"${q}"`;
  const el = document.getElementById('search-grid');
  el.innerHTML = results.length
    ? results.map(p => prodCardHTML(p)).join('')
    : '<p style="color:var(--stone)">No products found for this query.</p>';
  nav('search');
}

// ─── GALLERY ─────────────────────────────────────────────────────
let galFilter = 'all';

function filterGal(cat, btn) {
  galFilter = cat;
  document.querySelectorAll('#page-gallery .filter-tag').forEach(b => {
    b.classList.remove('active');
    if ((cat === 'all' && b.textContent === 'All') ||
        (b.textContent.toLowerCase().includes(cat))) b.classList.add('active');
  });
  renderGallery();
}

function renderGallery() {
  const el = document.getElementById('gallery-grid');
  if (!el) return;
  let items = [...GAL_ITEMS];
  if (galFilter !== 'all') items = items.filter(i => i.cat === galFilter);
  if (!items.length) {
    el.innerHTML = '<p style="color:var(--stone);text-align:center;padding:60px">No gallery items yet.</p>';
    return;
  }
  el.innerHTML = items.map((item, i) => `
    <div class="gal-item${i === 0 ? ' gal-item-big' : ''}"
         onclick="openLightbox('${item.image || ''}','${item.icon || '🏛'}','${item.label}')"
         style="cursor:pointer" title="${item.label}">
      ${item.image
        ? `<img src="${item.image}" alt="${item.label}" style="width:100%;height:100%;object-fit:cover">`
        : `<span>${item.icon}</span>`
      }
    </div>`).join('');
}

function openLightbox(image, icon, label) {
  const lb = document.getElementById('lightbox');
  // Якщо є фото — показуємо фото, інакше emoji
  document.getElementById('lb-icon').innerHTML = image
    ? `<img src="${image}" alt="${label}" style="max-width:80vw;max-height:70vh;border-radius:8px">`
    : `<span style="font-size:80px">${icon}</span>`;
  lb.style.opacity = '1';
  lb.style.pointerEvents = 'all';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.style.opacity = '0';
  lb.style.pointerEvents = 'none';
}

// ─── CART ─────────────────────────────────────────────────────────
function addToCart(id, btn) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(i => i.id === id);
  if (ex) { ex.qty++; } else { cart.push({ id, name: p.name, price: p.price, icon: p.icon, qty: 1 }); }
  saveCart();
  if (btn) { btn.textContent = '✓ In Cart'; btn.classList.add('added'); }
  toast(`${p.name} added to cart`, 'success');
}

function saveCart() {
  localStorage.setItem('adg-cart-en', JSON.stringify(cart));
  updateCartBadge();
  renderCartPanel();
}

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = total;
}

function renderCartPanel() {
  const el = document.getElementById('cart-items');
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = '<div class="cart-empty">🛒<br><br>Your cart is empty</div>';
    document.getElementById('cart-foot').style.opacity = '.4';
    return;
  }
  document.getElementById('cart-foot').style.opacity = '1';
  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-img"><img src="${item.icon}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover"></div>
      <div class="ci-info">
        <p class="ci-nm">${item.name}</p>
        <p class="ci-prc">${fmt(item.price)} € / each</p>
        <div class="ci-qty">
          <button onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="ci-del" onclick="removeFromCart(${item.id})">✕</button>
    </div>`).join('');
  const sub   = cartSubtotal();
  const total = Math.round(sub * (1 - discount));
  document.getElementById('cart-total-val').textContent = `${fmt(total)} €`;
}

function cartSubtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function changeQty(id, d) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  if (currentPage === 'catalog') renderCatalog();
  if (currentPage === 'home')    renderHome();
}

function toggleCart() {
  document.getElementById('cart-overlay').classList.toggle('open');
  document.getElementById('cart-panel').classList.toggle('open');
  renderCartPanel();
}

function applyCoupon() {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  if (code === 'SAVE10')      { discount = .1; toast('Coupon applied: 10% off', 'success'); }
  else if (code === 'SAVE20') { discount = .2; toast('Coupon applied: 20% off', 'success'); }
  else                        { discount = 0;  toast('Invalid coupon code', 'error'); }
  renderCartPanel();
}

// ─── CHECKOUT ─────────────────────────────────────────────────────
function renderCheckout() {
  const el = document.getElementById('checkout-items');
  if (!el) return;
  el.innerHTML = cart.map(i => `
    <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--stone);margin-bottom:8px">
      <span>${i.name} ×${i.qty}</span>
      <span>${fmt(i.price * i.qty)} €</span>
    </div>`).join('');
  const sub   = cartSubtotal();
  const del   = 8;
  const total = Math.round(sub * (1 - discount)) + del;
  document.getElementById('co-sub').textContent   = fmt(Math.round(sub * (1 - discount))) + ' €';
  document.getElementById('co-del').textContent   = del + ' €';
  document.getElementById('co-total').textContent = fmt(total) + ' €';
  document.getElementById('order-total-btn').textContent = fmt(total);
}

function checkoutStep(n) {
  for (let i = 1; i <= 3; i++) {
    document.getElementById('step' + i).classList.toggle('active', i === n);
    const tab = document.getElementById('step' + i + '-tab');
    tab.classList.toggle('active', i === n);
    if (i < n) tab.classList.add('done'); else tab.classList.remove('done');
  }
  renderCheckout();
}

function selectPay(el, method) {
  document.querySelectorAll('.pay-m').forEach(m => m.classList.remove('active'));
  el.classList.add('active');
  payMethod = method;
  document.getElementById('card-fields').classList.toggle('show', method === 'card');
}

function fmtCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function placeOrder() {
  if (payMethod === 'card') {
    const cn = document.getElementById('ch-cnum').value.replace(/\s/g, '');
    if (cn.length < 16) { toast('Please enter a valid card number', 'error'); return; }
    const cvv = document.getElementById('ch-cvv').value;
    if (cvv.length < 3) { toast('Please enter CVV', 'error'); return; }
  }
  const fn = document.getElementById('ch-fname').value;
  const ln = document.getElementById('ch-lname').value;
  if (!fn || !ln) { toast('Please fill in your details at Step 1', 'error'); checkoutStep(1); return; }
  toast('Processing payment...', 'info');
  setTimeout(() => {
    const orderNum = 'ADG-' + Date.now().toString().slice(-6);
    document.getElementById('order-confirm-num').textContent = 'Order number: ' + orderNum;
    cart = []; saveCart();
    toast('Order placed successfully!', 'success');
    nav('success');
  }, 1800);
}

// ─── NEWS ─────────────────────────────────────────────────────────
function renderNews() {
  const el = document.getElementById('news-grid');
  if (!el) return;
  if (!NEWS.length) {
    el.innerHTML = '<p style="color:var(--stone);text-align:center;padding:60px">No news yet.</p>';
    return;
  }
  el.innerHTML = NEWS.map(n => `
    <div class="news-card">
      <div class="news-img">
        ${n.image
          ? `<img src="${n.image}" alt="${n.title}" style="width:100%;height:100%;object-fit:cover">`
          : `<span>${n.icon}</span>`
        }
      </div>
      <div class="news-body">
        <p class="news-dt">${n.date}</p>
        <h3 class="news-ttl">${n.title}</h3>
        <p class="news-ex">${n.excerpt}</p>
      </div>
    </div>`).join('');
}

// ─── MESSAGING ────────────────────────────────────────────────────
function setChannel(btn) {
  document.querySelectorAll('#contact-channels .ch-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeChannel = btn.dataset.ch;
}
function setChannelM(btn) {
  btn.closest('.modal').querySelectorAll('.ch-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeChannelM = btn.dataset.ch;
}

function sendContactMsg() {
  const name    = document.getElementById('c-name').value.trim();
  const contact = document.getElementById('c-contact').value.trim();
  const msg     = document.getElementById('c-msg').value.trim();
  if (!name || !contact || !msg) { toast('Please fill all fields', 'error'); return; }
  dispatchMessage(activeChannel, name, contact, msg, 'contact-status');
}

function sendModalMsg() {
  const name    = document.getElementById('m-name').value.trim();
  const contact = document.getElementById('m-contact').value.trim();
  const msg     = document.getElementById('m-msg').value.trim();
  if (!name || !contact || !msg) { toast('Please fill all fields', 'error'); return; }
  dispatchMessage(activeChannelM, name, contact, msg, 'modal-msg-status');
}

function dispatchMessage(channel, name, contact, msg, statusId) {
  const el = document.getElementById(statusId);
  if (channel === 'telegram') {
    const text = encodeURIComponent(`New inquiry from ${name} (${contact}):\n${msg}`);
    window.open(`https://t.me/share/url?url=https://artdegypse.fr&text=${text}`, '_blank');
    showStatus(el, true, 'Message prepared for Telegram');
  } else if (channel === 'whatsapp') {
    const text = encodeURIComponent(`Bonjour, je suis ${name} (${contact}). ${msg}`);
    window.open(`https://wa.me/33142682205?text=${text}`, '_blank');
    showStatus(el, true, 'Message prepared for WhatsApp');
  } else {
    setTimeout(() => {
      showStatus(el, true, `Email sent to contact@artdegypse.fr! We will reply within 1 business day.`);
      toast('Message sent successfully', 'success');
    }, 800);
  }
}

function submitCall() {
  const name  = document.getElementById('rc-name').value.trim();
  const phone = document.getElementById('rc-phone').value.trim();
  if (!name || !phone) { toast('Please fill all fields', 'error'); return; }
  setTimeout(() => {
    showStatus(document.getElementById('call-status'), true, `Thank you, ${name}! We'll call you at ${phone} very soon.`);
    toast('Call request sent', 'success');
  }, 600);
}

function showStatus(el, ok, msg) {
  if (!el) return;
  el.className = 'msg-status ' + (ok ? 'msg-ok' : 'msg-err');
  el.textContent = msg;
}

function subscribeEmail() {
  const em = document.getElementById('f-email').value.trim();
  if (!em || !em.includes('@')) { toast('Please enter a valid email', 'error'); return; }
  toast('Subscribed! Your 5% discount code: SAVE5', 'success');
  document.getElementById('f-email').value = '';
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

function toast(msg, type = 'info') {
  const w = document.getElementById('toast-wrap');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  w.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transition = 'opacity .4s';
    setTimeout(() => t.remove(), 400);
  }, 3000);
}

// ─── Netlify Identity redirect ─────────────────────────────────────
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });
}

// ─── INIT ─────────────────────────────────────────────────────────
// Спочатку завантажуємо дані з JSON, потім рендеримо
(async () => {
  await loadAllData();   // ← чекаємо поки підтягнуться products/news/gallery
  renderHome();
  updateCartBadge();
  renderCartPanel();
})();
