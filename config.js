// ═══════════════════════════════════════════
//  SO Perlengkapan Umroh — Assyifa Tour & Travel
//  Config v7 · Emerald Green
// ═══════════════════════════════════════════

const API_URL = 'https://script.google.com/macros/s/AKfycbxfwQxkYw9olV8LFfOqcV3bjzwbRF_NWOlGPUgV1hXxKrX4ibPut68LxHRzBA9e2-DqFQ/exec';

const BLN      = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const BLN_FULL = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const TAHUN_LIST = [2025,2026,2027,2028,2029,2030];

const ITEMS_LK = ['Koper','Tas Gendong','Tas Slempang','Tas Sendal','Kain Ihrom','Batik LK','Tumbler','Botol Spray','Buku Panduan','Topi LK'];
const ITEMS_PR = ['Koper','Tas Gendong','Tas Slempang','Tas Sendal','Mukena','Batik PR','Tumbler','Botol Spray','Buku Panduan','Topi PR'];

// ── API ───────────────────────────────────
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
function getUser()   { const u = sessionStorage.getItem('so_user'); return u ? JSON.parse(u) : null; }
function setUser(d)  { sessionStorage.setItem('so_user', JSON.stringify(d)); }
function clearUser() { sessionStorage.removeItem('so_user'); }
function requireLogin() { if (!getUser()) { window.location.href = 'index.html'; return false; } return true; }

// ── Helpers ───────────────────────────────
function rp(n) { return 'Rp ' + Number(n).toLocaleString('id-ID'); }
function initials(n) { return n.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
function fmtDate(tgl) { const d=new Date(tgl); if(isNaN(d)) return tgl||'—'; return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`; }
function isoToday() { return new Date().toISOString().split('T')[0]; }

function normBulanJS(val) {
  if (!val) return '';
  const s = String(val).trim();
  if (BLN_FULL.some(b => s.startsWith(b))) return s;
  const d = new Date(s);
  if (!isNaN(d)) return BLN_FULL[d.getMonth()] + ' ' + d.getFullYear();
  return s;
}
function normalizeLogs(data) {
  return data.map(l => {
    let tgl = l.tanggal || '';
    if (tgl) { const d=new Date(tgl); if(!isNaN(d)){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),dd=String(d.getDate()).padStart(2,'0');tgl=`${y}-${m}-${dd}`;} }
    return { ...l, tanggal:tgl, bulan_keberangkatan: normBulanJS(l.bulan_keberangkatan) };
  });
}

function showToast(msg, type='info') {
  let t = document.getElementById('toast');
  if (!t) { t=document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
  t.textContent=msg; t.className='toast show '+type;
  clearTimeout(t._timer); t._timer=setTimeout(()=>t.classList.remove('show'),2800);
}
function showLoading(v) { const el=document.getElementById('loading'); if(el) el.style.display=v?'flex':'none'; }
function doLogout() { if(!confirm('Yakin ingin keluar?')) return; clearUser(); window.location.href='index.html'; }

// ── Navbar ────────────────────────────────
const NAV_PAGES = [
  { href:'dashboard.html', icon:'🏠', label:'Dashboard' },
  { href:'stok.html',      icon:'📦', label:'Stok' },
  { href:'ambil.html',     icon:'🛍️', label:'Ambil' },
  { href:'restock.html',   icon:'📥', label:'Restock' },
  { href:'history.html',   icon:'📋', label:'History' },
  { href:'laporan.html',   icon:'📄', label:'Laporan' },
];
function renderNavbar(activePage) {
  const user=getUser(); if(!user) return;
  const el=document.getElementById('navbar'); if(!el) return;
  const links=NAV_PAGES.map(p=>`<a href="${p.href}" class="nav-link ${activePage===p.href?'active':''}">${p.icon} ${p.label}</a>`).join('');
  const mlinks=NAV_PAGES.map(p=>`<a href="${p.href}" class="nav-link ${activePage===p.href?'active':''}" onclick="closeMobileNav()">${p.icon} ${p.label}</a>`).join('');
  el.innerHTML=`
    <div class="navbar-inner">
      <a href="dashboard.html" class="navbar-brand">
        <div class="brand-icon">🧳</div>
        <div><div class="brand-name">SO Perlengkapan</div><div class="brand-sub">Assyifa Tour & Travel</div></div>
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
    <div class="mobile-nav" id="mobile-nav">${mlinks}</div>`;
}
function toggleMobileNav() { document.getElementById('mobile-nav').classList.toggle('open'); }
function closeMobileNav() { const mn=document.getElementById('mobile-nav'); if(mn) mn.classList.remove('open'); }

// ── Badge helpers ─────────────────────────
function tipeBadge(tipe) {
  const map = {
    'satuan':              '<span class="badge b-blue" style="margin-left:4px">Satuan</span>',
    'standby_lk':         '<span class="badge b-blue" style="margin-left:4px">Standby LK</span>',
    'standby_pr':         '<span class="badge b-danger" style="margin-left:4px">Standby PR</span>',
    'standby_siapkan_lk': '<span class="badge b-warn" style="margin-left:4px">Siapkan LK</span>',
    'standby_siapkan_pr': '<span class="badge b-warn" style="margin-left:4px">Siapkan PR</span>',
    'rombongan':          '<span class="badge b-purple" style="margin-left:4px">Rombongan</span>',
    'rombongan_lk':       '<span class="badge b-purple" style="margin-left:4px">Rombongan</span>',
    'rombongan_pr':       '<span class="badge b-purple" style="margin-left:4px">Rombongan</span>',
    'restock':            '<span class="badge b-green" style="margin-left:4px">Restock</span>',
  };
  return map[tipe] || '<span class="badge b-blue" style="margin-left:4px">Satuan</span>';
}
function isSiapkan(tipe) { return tipe && tipe.startsWith('standby_siapkan'); }
function isRestock(tipe) { return tipe === 'restock'; }
function isRombongan(tipe) { return tipe && tipe.startsWith('rombongan'); }

// ── Dropdown bulan+tahun ──────────────────
function bulanSelect(idBln, idThn, label='Bulan Keberangkatan') {
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div class="fr" style="margin-bottom:0">
      <label>${label}</label>
      <select id="${idBln}">
        <option value="">— Pilih bulan —</option>
        ${BLN_FULL.map(b=>`<option value="${b}">${b}</option>`).join('')}
      </select>
    </div>
    <div class="fr" style="margin-bottom:0">
      <label>Tahun</label>
      <select id="${idThn}">
        ${TAHUN_LIST.map(y=>`<option value="${y}" ${y===2026?'selected':''}>${y}</option>`).join('')}
      </select>
    </div>
  </div>`;
}
function getBln(idBln, idThn) {
  const b=document.getElementById(idBln)?.value;
  const t=document.getElementById(idThn)?.value;
  return b ? `${b} ${t}` : '';
}
