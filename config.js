// ═══════════════════════════════════════════
//  KONFIGURASI SISTEM SO PERLENGKAPAN UMROH
//  Edit file ini saja kalau ada perubahan URL
// ═══════════════════════════════════════════

const API_URL = 'https://script.google.com/macros/s/AKfycbzwcRKy3rbnD5czY_s0VXrO84Hejx_auY9qpFOwbzkb5rgy-M3R0_GVamOZOdy11_qlMA/exec';

// ── Helper: GET request ke Apps Script ──────
async function apiGet(params) {
  const url = API_URL + '?' + new URLSearchParams(params);
  const res = await fetch(url);
  return res.json();
}

// ── Helper: POST request ke Apps Script ─────
async function apiPost(body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.json();
}

// ── Session: simpan & ambil user login ──────
function getUser() {
  const u = sessionStorage.getItem('so_user');
  return u ? JSON.parse(u) : null;
}
function setUser(data) {
  sessionStorage.setItem('so_user', JSON.stringify(data));
}
function clearUser() {
  sessionStorage.removeItem('so_user');
}
function requireLogin() {
  if (!getUser()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// ── Helper: format rupiah ────────────────────
function rp(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }

// ── Helper: inisial nama ────────────────────
function initials(n) { return n.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(); }

// ── Helper: bulan singkat ───────────────────
const BLN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

// ── Helper: toast notifikasi ────────────────
function showToast(msg, type='info') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Helper: loading overlay ─────────────────
function showLoading(v) {
  let el = document.getElementById('loading');
  if (el) el.style.display = v ? 'flex' : 'none';
}

// ── Render topbar dengan nama user ──────────
function renderTopbar(title, subtitle) {
  const user = getUser();
  if (!user) return;
  const tb = document.getElementById('topbar');
  if (!tb) return;
  tb.innerHTML = `
    <div class="tb-left">
      <button class="back-btn" onclick="history.back()" aria-label="Kembali">&#8592;</button>
      <div>
        <div class="tb-title">${title}</div>
        <div class="tb-sub">${subtitle||''}</div>
      </div>
    </div>
    <div class="tb-right">
      <div class="user-chip" onclick="doLogout()">
        <div class="avatar">${initials(user.username)}</div>
        <span class="uname">${user.username.split(' ')[0]}</span>
      </div>
    </div>`;
}

// ── Logout ───────────────────────────────────
function doLogout() {
  if (!confirm('Yakin ingin keluar?')) return;
  clearUser();
  window.location.href = 'index.html';
}
