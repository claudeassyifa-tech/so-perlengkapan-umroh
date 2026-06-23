// ═══════════════════════════════════════════
//  SO Perlengkapan Umroh — Assyifa Tour & Travel
//  Config v8
// ═══════════════════════════════════════════

const API_URL = 'https://script.google.com/macros/s/AKfycbxfwQxkYw9olV8LFfOqcV3bjzwbRF_NWOlGPUgV1hXxKrX4ibPut68LxHRzBA9e2-DqFQ/exec';

const BLN      = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const BLN_FULL = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const TAHUN_LIST = [2025,2026,2027,2028,2029,2030];

const SEMUA_BARANG = ['Koper','Tas Gendong','Tas Slempang','Tas Sendal','Kain Ihrom','Mukena',
  'Batik LK','Batik PR','Tumbler','Botol Spray','Buku Panduan','Topi LK','Topi PR',
  'Kalung ID Card','Case ID Card','Sampul Paspor','Tali Label Koper'];

// ── API ───────────────────────────────────
async function apiGet(params) {
  const res = await fetch(API_URL + '?' + new URLSearchParams(params));
  return res.json();
}
async function apiPost(body) {
  const res = await fetch(API_URL, { method:'POST', body: JSON.stringify(body) });
  return res.json();
}

// ── Session ───────────────────────────────
function getUser()    { const u=sessionStorage.getItem('so_user'); return u?JSON.parse(u):null; }
function setUser(d)   { sessionStorage.setItem('so_user', JSON.stringify(d)); }
function clearUser()  { sessionStorage.removeItem('so_user'); }
function requireLogin() { if(!getUser()){window.location.href='index.html';return false;} return true; }

// ── Helpers ───────────────────────────────
function initials(n) { return (n||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
function isoToday()  { return new Date().toISOString().split('T')[0]; }
function fmtDate(tgl) {
  if (!tgl) return '—';
  const d = new Date(tgl);
  if (isNaN(d)) return tgl;
  return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`;
}
function fmtDateLong(tgl) {
  if (!tgl) return '—';
  const d = new Date(tgl);
  if (isNaN(d)) return tgl;
  const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  return `${hari[d.getDay()]}, ${d.getDate()} ${BLN_FULL[d.getMonth()]} ${d.getFullYear()}`;
}

function showToast(msg, type='info') {
  let t = document.getElementById('toast');
  if (!t) { t=document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
  t.textContent=msg; t.className='toast show '+type;
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'), 2800);
}
function showLoading(v) { const el=document.getElementById('loading'); if(el) el.style.display=v?'flex':'none'; }
function doLogout()  { if(!confirm('Yakin keluar?')) return; clearUser(); window.location.href='index.html'; }

// ── Petugas chip ──────────────────────────
function petugasColor(nama) {
  const n=(nama||'').toLowerCase();
  if(n.includes('admin'))  return '#185FA5';
  if(n.includes('azhar'))  return '#1B6B45';
  if(n.includes('dedi'))   return '#7B3FA0';
  return '#888';
}
function petugasChip(nama) {
  const col = petugasColor(nama);
  const short = (nama||'').split(' ')[0];
  return `<span style="display:inline-flex;align-items:center;gap:4px;background:#f0f0f0;border-radius:99px;padding:2px 8px 2px 3px;font-size:11px">
    <span style="width:16px;height:16px;border-radius:50%;background:${col};color:#fff;font-size:8px;font-weight:700;display:inline-flex;align-items:center;justify-content:center">${initials(nama)}</span>
    <span style="font-weight:600;color:#333">${short}</span>
  </span>`;
}

// ── Navbar ────────────────────────────────
const NAV_PAGES = [
  { href:'dashboard.html', icon:'🏠', label:'Dashboard' },
  { href:'stok.html',      icon:'📦', label:'Stok' },
  { href:'keluar.html',    icon:'📤', label:'Keluar' },
  { href:'masuk.html',     icon:'📥', label:'Masuk' },
  { href:'cabang.html',    icon:'🏪', label:'Cabang' },
  { href:'history.html',   icon:'📋', label:'History' },
  { href:'laporan.html',   icon:'📄', label:'Laporan' },
];

function renderNavbar(activePage) {
  const user = getUser(); if (!user) return;
  const el = document.getElementById('navbar'); if (!el) return;
  const active = NAV_PAGES.find(p=>p.href===activePage) || {icon:'📦', label:'SO Perlengkapan'};
  const links = NAV_PAGES.map(p=>`<a href="${p.href}" class="nav-link ${activePage===p.href?'active':''}">${p.icon} ${p.label}</a>`).join('');
  const mlinks = NAV_PAGES.map(p=>`<a href="${p.href}" class="nav-link ${activePage===p.href?'active':''}" onclick="closeMobileNav()">${p.icon} ${p.label}</a>`).join('');
  el.innerHTML=`
    <div class="navbar-inner">
      <a href="dashboard.html" class="navbar-brand">
        <div class="brand-icon">🧳</div>
        <div class="brand-text-desktop">
          <div class="brand-name">SO Perlengkapan</div>
          <div class="brand-sub">Assyifa Tour & Travel</div>
        </div>
      </a>
      <div class="navbar-page-title">${active.icon} ${active.label}</div>
      <nav class="nav-links">${links}</nav>
      <div class="navbar-right">
        <button class="user-chip" onclick="doLogout()" title="Keluar">
          <div class="avatar" style="background:${petugasColor(user.username)}">${initials(user.username)}</div>
          <span class="uname">${user.username.split(' ')[0]}</span>
        </button>
        <button class="hamburger" onclick="toggleMobileNav()">☰</button>
      </div>
    </div>
    <div class="mobile-nav" id="mobile-nav">${mlinks}</div>`;
}
function toggleMobileNav() { document.getElementById('mobile-nav').classList.toggle('open'); }
function closeMobileNav()  { const mn=document.getElementById('mobile-nav'); if(mn) mn.classList.remove('open'); }

// ── Item qty input builder ─────────────────
function buildItemInputs(containerId, items) {
  document.getElementById(containerId).innerHTML = items.map((item,i)=>`
    <div class="item-input-row" id="irow-${i}">
      <div style="flex:1"><div class="item-input-label">${item}</div></div>
      <div class="item-qty-wrap">
        <button class="qty-btn" onclick="adjQty(${i},-1)">−</button>
        <input class="qty-num" type="number" id="iqty-${i}" min="0" value="0" oninput="updateQtyRow(${i})"/>
        <button class="qty-btn" onclick="adjQty(${i},1)">+</button>
      </div>
    </div>`).join('');
}
function adjQty(i, d) {
  const el=document.getElementById(`iqty-${i}`);
  el.value=Math.max(0,(parseInt(el.value)||0)+d);
  updateQtyRow(i);
}
function updateQtyRow(i) {
  const val=parseInt(document.getElementById(`iqty-${i}`)?.value)||0;
  const row=document.getElementById(`irow-${i}`);
  if(row) row.classList.toggle('item-row-active', val>0);
  if(typeof updateSummary==='function') updateSummary();
}
function getSelectedItems(items) {
  return items.map((nama,i)=>({nama,jumlah:parseInt(document.getElementById(`iqty-${i}`)?.value)||0}))
    .filter(x=>x.jumlah>0);
}
function resetAllQty(items) {
  items.forEach((_,i)=>{const el=document.getElementById(`iqty-${i}`);if(el)el.value=0;updateQtyRow(i);});
}
