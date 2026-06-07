// ═══════════════════════════════════════════
//  CONFIG v3 — SO Perlengkapan Umroh
// ═══════════════════════════════════════════

const API_URL = 'https://script.google.com/macros/s/AKfycbxfwQxkYw9olV8LFfOqcV3bjzwbRF_NWOlGPUgV1hXxKrX4ibPut68LxHRzBA9e2-DqFQ/exec';

const BLN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

// ── API helpers ───────────────────────────
async function apiGet(params) {
  const url = API_URL + '?' + new URLSearchParams(params);
  const res = await fetch(url);
  return res.json();
}
async function apiPost(body) {
  const res = await fetch(API_URL, { method:'POST', body: JSON.stringify(body) });
  return res.json();
}

// ── Session ───────────────────────────────
function getUser()  { const u = sessionStorage.getItem('so_user'); return u ? JSON.parse(u) : null; }
function setUser(d) { sessionStorage.setItem('so_user', JSON.stringify(d)); }
function clearUser(){ sessionStorage.removeItem('so_user'); }
function requireLogin() { if (!getUser()) { window.location.href = 'index.html'; return false; } return true; }

// ── Helpers ───────────────────────────────
function rp(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }
function initials(n) { return n.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(); }

function showToast(msg, type='info') {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.className = 'toast show ' + type;
  clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}
function showLoading(v) { const el = document.getElementById('loading'); if(el) el.style.display = v?'flex':'none'; }

function doLogout() {
  if (!confirm('Yakin ingin keluar?')) return;
  clearUser(); window.location.href = 'index.html';
}

// ── Navbar renderer ───────────────────────
const NAV_PAGES = [
  { href:'dashboard.html', icon:'🏠', label:'Dashboard' },
  { href:'stok.html',      icon:'📦', label:'Stok' },
  { href:'ambil.html',     icon:'🛍️', label:'Ambil' },
  { href:'history.html',   icon:'📋', label:'History' },
  { href:'laporan.html',   icon:'📄', label:'Laporan' },
];

function renderNavbar(activePage) {
  const user = getUser();
  if (!user) return;
  const el = document.getElementById('navbar');
  if (!el) return;

  const links = NAV_PAGES.map(p => `
    <a href="${p.href}" class="nav-link ${activePage===p.href?'active':''}">
      <span class="nav-icon">${p.icon}</span>${p.label}
    </a>`).join('');

  const mobileLinks = NAV_PAGES.map(p => `
    <a href="${p.href}" class="nav-link ${activePage===p.href?'active':''}" onclick="closeMobileNav()">
      <span class="nav-icon">${p.icon}</span>${p.label}
    </a>`).join('');

  el.innerHTML = `
    <div class="navbar-inner">
      <a href="dashboard.html" class="navbar-brand">
        <span class="brand-icon">🧳</span>
        <div>
          <div class="brand-name">SO Perlengkapan</div>
          <div class="brand-sub">Travel Umroh</div>
        </div>
      </a>
      <nav class="nav-links">${links}</nav>
      <div class="navbar-right">
        <button class="user-chip" onclick="doLogout()" title="Keluar">
          <div class="avatar">${initials(user.username)}</div>
          <span class="uname">${user.username.split(' ')[0]}</span>
        </button>
        <button class="hamburger" onclick="toggleMobileNav()" aria-label="Menu">☰</button>
      </div>
    </div>
    <div class="mobile-nav" id="mobile-nav">${mobileLinks}</div>`;
}

function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('open');
}
function closeMobileNav() {
  const mn = document.getElementById('mobile-nav');
  if (mn) mn.classList.remove('open');
}

// ── Full Set items ────────────────────────
const FULLSET_ITEMS_LK = ['Koper','Tas Gendong','Tas Slempang','Tas Sendal','Kain Ihrom','Batik LK','Tumbler','Botol Spray','Buku Panduan','Topi LK'];
const FULLSET_ITEMS_PR = ['Koper','Tas Gendong','Tas Slempang','Tas Sendal','Mukena','Batik PR','Tumbler','Botol Spray','Buku Panduan','Topi PR'];
