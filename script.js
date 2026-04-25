/* ==========================================================
    ⚙️  НАЛАШТУВАННЯ — замініть на свої дані
    ⚙️  SETTINGS — replace with your own data
    ========================================================== */
const CONFIG = {
  // Telegram Bot: створіть бота через @BotFather, отримайте токен і chat_id
  // Create bot via @BotFather, get token + your chat_id from @userinfobot
  TELEGRAM_BOT_TOKEN: 'YOUR_BOT_TOKEN',       // напр. '1234567890:AAHabc...'
  TELEGRAM_CHAT_ID:   'YOUR_CHAT_ID',          // напр. '123456789'

  // Email — куди надсилати заявки
  EMAIL_TO: 'info@lepnina-cotedazur.ua',

  // Телефон для Viber / WhatsApp (міжнародний формат, без +)
  PHONE: '380996812205',

  // Telegram username для прямого чату (без @)
  TG_USERNAME: 'GreedPig',
};

/* ==========================================================
    LANGUAGE SWITCHER
    ========================================================== */
function setLang(lang) {
  document.documentElement.lang = lang;
  document.getElementById('btn-uk').classList.toggle('active', lang === 'uk');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  localStorage.setItem('lca-lang', lang);
}

// Restore saved language on page load
(function () {
  const saved = localStorage.getItem('lca-lang');
  if (saved === 'en') setLang('en');
})();

/* ==========================================================
    MOBILE MENU
    ========================================================== */
const mobileMenuEl = document.getElementById('mobileMenu');
document.getElementById('menuToggle').addEventListener('click', () => mobileMenuEl.classList.add('open'));
document.getElementById('menuClose').addEventListener('click',  () => mobileMenuEl.classList.remove('open'));

function closeMobileMenu() { mobileMenuEl.classList.remove('open'); }

/* ==========================================================
    SCROLL REVEAL
    ========================================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ==========================================================
    TOAST NOTIFICATION
    ========================================================== */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ==========================================================
    MODAL
    ========================================================== */
const modal = document.getElementById('sendModal');

function openSendModal() {
  const name  = document.getElementById('cf-name').value.trim();
  const phone = document.getElementById('cf-phone').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const lang  = document.documentElement.lang;

  if (!phone) {
    showToast(lang === 'en' ? '⚠ Please enter your phone number.' : '⚠ Будь ласка, введіть номер телефону.');
    return;
  }

  // Show preview text in modal
  const preview = lang === 'en'
    ? `Name: ${name || '—'}  |  Phone: ${phone}${email ? '  |  Email: ' + email : ''}`
    : `Ім'я: ${name || '—'}  |  Телефон: ${phone}${email ? '  |  Email: ' + email : ''}`;
  document.getElementById('modal-preview').textContent = preview;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSendModal(event, force) {
  if (force || (event && event.target === modal)) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ESC key closes modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSendModal(null, true);
});

/* ==========================================================
    HELPERS — collect form data & build message
    ========================================================== */
function getFormData() {
  return {
    name:  document.getElementById('cf-name').value.trim(),
    phone: document.getElementById('cf-phone').value.trim(),
    email: document.getElementById('cf-email').value.trim(),
  };
}

function buildMessage(data) {
  return `🏛 Нова заявка — Lepnina Côte d'Azur\n`
        + `👤 Ім'я: ${data.name || 'не вказано'}\n`
        + `📞 Телефон: ${data.phone}\n`
        + (data.email ? `📧 Email: ${data.email}\n` : '')
        + `🕐 ${new Date().toLocaleString('uk-UA')}`;
}

function clearForm() {
  document.getElementById('cf-name').value  = '';
  document.getElementById('cf-phone').value = '';
  document.getElementById('cf-email').value = '';
}

function afterSend() {
  const lang = document.documentElement.lang;
  closeSendModal(null, true);
  clearForm();
  showToast(lang === 'en' ? '✓ Request sent! We will contact you soon.' : '✓ Заявку відправлено! Ми зв\'яжемося найближчим часом.');
}

/* ==========================================================
    SEND VIA TELEGRAM BOT (HTTP API)
    — Потрібно: TOKEN та CHAT_ID у CONFIG вище
    — Required: TOKEN and CHAT_ID in CONFIG above
    ========================================================== */
async function sendViaTelegram() {
  const data = getFormData();
  const text = buildMessage(data);
  const lang = document.documentElement.lang;

  // If bot not configured — open direct TG chat as fallback
  if (CONFIG.TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN') {
    const tgText = encodeURIComponent(
      `Замовлення дзвінка\nІм'я: ${data.name || '—'}\nТелефон: ${data.phone}`
    );
    window.open(`https://t.me/${CONFIG.TG_USERNAME}?text=${tgText}`, '_blank');
    afterSend();
    return;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CONFIG.TELEGRAM_CHAT_ID, text }),
      }
    );
    const json = await res.json();
    if (json.ok) {
      afterSend();
    } else {
      throw new Error(json.description);
    }
  } catch (err) {
    console.error('Telegram error:', err);
    showToast(lang === 'en' ? '✗ Error. Try another method.' : '✗ Помилка. Спробуйте інший спосіб.');
  }
}

/* ==========================================================
    SEND VIA EMAIL (mailto — відкриває поштовий клієнт)
    For server-side email, replace with a fetch() to your backend
    ========================================================== */
function sendViaEmail() {
  const data    = getFormData();
  const subject = encodeURIComponent(`Замовлення дзвінка — Lepnina Côte d'Azur`);
  const body    = encodeURIComponent(buildMessage(data));
  window.location.href = `mailto:${CONFIG.EMAIL_TO}?subject=${subject}&body=${body}`;
  afterSend();
}

/* ==========================================================
    SEND VIA VIBER
    ========================================================== */
function sendViaViber() {
  const data = getFormData();
  const text = encodeURIComponent(
    `Замовлення дзвінка\nІм'я: ${data.name || '—'}\nТелефон: ${data.phone}`
  );
  window.open(`viber://chat?number=%2B${CONFIG.PHONE}&text=${text}`, '_blank');
  afterSend();
}

/* ==========================================================
    SEND VIA WHATSAPP
    ========================================================== */
function sendViaWhatsApp() {
  const data = getFormData();
  const text = encodeURIComponent(
    `Замовлення дзвінка — Lepnina Côte d'Azur\nІм'я: ${data.name || '—'}\nТелефон: ${data.phone}`
  );
  window.open(`https://wa.me/${CONFIG.PHONE}?text=${text}`, '_blank');
  afterSend();
}