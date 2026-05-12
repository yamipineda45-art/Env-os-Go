
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── CONSTANTS ───────────────────────────────────────────── */
const PASSWORD = "624662";
const ROUTES_SPS = ["Ruta 1 – Centro", "Ruta 2 – Col. Kennedy", "Ruta 3 – Col. Alameda", "Ruta 4 – Zona Norte", "Ruta 5 – Zona Sur", "Ruta 6 – Periferia", "Otra zona"];

const WORK_STATUS = {
  pending:   { label: "Por hacer",      color: "#b89a6a", bg: "#fdf5e4" },
  inprogress:{ label: "En proceso",     color: "#5a7ab8", bg: "#e4ecfd" },
  done:      { label: "Listo",          color: "#5a8c6e", bg: "#d4edda" },
  shipped:   { label: "Enviado",        color: "#7a4db8", bg: "#ede4fd" },
  pickup:    { label: "Recoge/tienda",  color: "#c4705a", bg: "#fde8e2" },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');
:root{
  --cr:#faf7f3;--dp:#1c1208;--rs:#b85c3a;--gd:#9e7d45;--sg:#5f7a52;
  --bl:#d4b896;--ls:#eaf0e6;--cb:#fff8f2;--bd:#ddd0bf;
  --pd:#5a8c6e;--up:#b85c3a;--cn:#999;
  --sh:0 6px 28px rgba(28,18,8,.11);
}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--cr);font-family:'Outfit',sans-serif;color:var(--dp);min-height:100vh;}
/* LOGIN */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#1c1208 0%,#3a2010 50%,#1c1208 100%);}
.login-box{background:var(--cb);border:1px solid var(--bd);border-radius:6px;
  padding:2.5rem 2.2rem;width:340px;text-align:center;box-shadow:var(--sh);}
.login-logo{font-family:'Playfair Display',serif;font-size:2rem;color:var(--dp);margin-bottom:.3rem;}
.login-logo span{color:var(--rs);font-style:italic;}
.login-sub{font-size:.78rem;color:var(--cn);letter-spacing:.1em;text-transform:uppercase;margin-bottom:2rem;}
.login-input{width:100%;padding:.7rem 1rem;border:1px solid var(--bd);border-radius:3px;
  font-size:1rem;font-family:'Outfit',sans-serif;text-align:center;letter-spacing:.3em;
  background:#fff;outline:none;margin-bottom:1rem;}
.login-input:focus{border-color:var(--rs);}
.login-btn{width:100%;padding:.75rem;background:var(--dp);color:var(--cr);border:none;
  border-radius:3px;font-size:.88rem;font-family:'Outfit',sans-serif;cursor:pointer;
  letter-spacing:.08em;transition:background .2s;}
.login-btn:hover{background:var(--rs);}
.login-err{color:var(--rs);font-size:.8rem;margin-top:.5rem;}
/* LAYOUT */
header{background:var(--dp);height:62px;display:flex;align-items:center;
  justify-content:space-between;padding:0 1.8rem;position:sticky;top:0;z-index:300;
  border-bottom:2px solid var(--gd);}
.logo{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--cr);font-weight:400;}
.logo em{color:var(--bl);font-style:italic;}
.nav{display:flex;gap:.3rem;flex-wrap:wrap;}
.nb{background:transparent;border:1px solid rgba(255,255,255,.18);color:var(--cr);
  padding:.38rem .9rem;border-radius:2px;font-size:.78rem;cursor:pointer;
  font-family:'Outfit',sans-serif;transition:all .18s;letter-spacing:.04em;}
.nb:hover,.nb.act{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.38);}
.nb.new{background:var(--rs)!important;border-color:var(--rs)!important;}
.nb.new:hover{background:#a04e30!important;}
/* STATS */
.statsbar{background:var(--ls);padding:.55rem 1.8rem;display:flex;gap:1.5rem;
  flex-wrap:wrap;border-bottom:1px solid var(--bd);align-items:center;}
.sv{font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:600;line-height:1;}
.sl{font-size:.6rem;color:var(--sg);letter-spacing:.1em;text-transform:uppercase;margin-top:.1rem;}
.sdiv{width:1px;height:28px;background:var(--bd);}
/* VIEW */
.view{padding:1.4rem 1.8rem;}
/* SEARCH BAR */
.search-wrap{position:relative;max-width:520px;}
.search-input{width:100%;padding:.6rem 1rem .6rem 2.4rem;border:1px solid var(--bd);
  border-radius:3px;font-family:'Outfit',sans-serif;font-size:.88rem;background:#fff;outline:none;}
.search-input:focus{border-color:var(--rs);}
.search-ico{position:absolute;left:.7rem;top:50%;transform:translateY(-50%);color:var(--cn);font-size:.9rem;}
.search-results{background:#fff;border:1px solid var(--bd);border-radius:3px;
  margin-top:.3rem;box-shadow:var(--sh);max-height:380px;overflow-y:auto;}
.sr-item{padding:.75rem 1rem;border-bottom:1px solid var(--bd);cursor:pointer;
  display:flex;align-items:center;gap:.8rem;transition:background .12s;}
.sr-item:last-child{border:none;}
.sr-item:hover{background:var(--ls);}
.sr-num{font-size:.65rem;background:var(--dp);color:var(--cr);padding:.18rem .45rem;
  border-radius:20px;font-weight:600;white-space:nowrap;}
.sr-name{font-weight:500;font-size:.88rem;}
.sr-meta{font-size:.74rem;color:var(--cn);}
/* TOPBAR */
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.6rem;}
.sec-title{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:400;}
.fbar{display:flex;gap:.3rem;flex-wrap:wrap;}
.fb{padding:.25rem .75rem;border:1px solid var(--bd);border-radius:20px;
  background:#fff;font-size:.72rem;cursor:pointer;transition:all .13s;}
.fb.act{background:var(--dp);color:#fff;border-color:var(--dp);}
.fb.fp.act{background:var(--pd);border-color:var(--pd);}
.fb.fu.act{background:var(--up);border-color:var(--up);}
.fb.fc.act{background:var(--cn);border-color:var(--cn);}
.fb.fd.act{background:#4a7ab0;border-color:#4a7ab0;}
.fb.fs.act{background:var(--sg);border-color:var(--sg);}
/* GRID */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(258px,1fr));gap:.9rem;}
/* CARD */
.ocard{background:var(--cb);border:1px solid var(--bd);border-radius:4px;
  overflow:hidden;position:relative;transition:transform .18s,box-shadow .18s;}
.ocard:hover{transform:translateY(-3px);box-shadow:var(--sh);}
.ocard.cancelled{opacity:.58;filter:grayscale(.3);}
.card-photos{display:flex;height:120px;overflow:hidden;}
.card-photos img{flex:1;object-fit:cover;min-width:0;}
.card-photos img+img{border-left:2px solid #fff;}
.card-ph{height:120px;background:linear-gradient(135deg,var(--ls),var(--bl));
  display:flex;align-items:center;justify-content:center;font-size:1.9rem;}
.onum{position:absolute;top:.45rem;left:.45rem;background:rgba(28,18,8,.82);
  color:#fff;font-size:.6rem;padding:.16rem .44rem;border-radius:20px;
  letter-spacing:.05em;font-weight:600;backdrop-filter:blur(4px);}
.dtype-badge{position:absolute;top:.45rem;right:.45rem;font-size:.58rem;
  font-weight:600;letter-spacing:.06em;padding:.2rem .5rem;border-radius:20px;
  text-transform:uppercase;}
.dtype-dom{background:#dbeafe;color:#1d4ed8;}
.dtype-sto{background:#fef9c3;color:#854d0e;}
.cbody{padding:.8rem .9rem .9rem;}
.ctop{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.3rem;gap:.35rem;}
.cname{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:600;line-height:1.2;}
.badge{font-size:.58rem;font-weight:600;letter-spacing:.06em;padding:.16rem .48rem;
  border-radius:20px;text-transform:uppercase;white-space:nowrap;flex-shrink:0;}
.bp{background:#d4edda;color:var(--pd);}
.bu{background:#fde8e2;color:var(--up);}
.bx{background:#e9e9e9;color:#666;}
.cdesc{font-size:.79rem;color:#555;margin-bottom:.55rem;line-height:1.4;}
.cmeta{display:flex;flex-direction:column;gap:.22rem;}
.mrow{display:flex;align-items:center;gap:.38rem;font-size:.73rem;color:var(--sg);}
.cactions{display:flex;gap:.3rem;margin-top:.7rem;padding-top:.65rem;border-top:1px solid var(--bd);flex-wrap:wrap;}
.ca{flex:1;padding:.32rem .2rem;border:1px solid var(--bd);border-radius:2px;
  background:#fff;font-size:.68rem;cursor:pointer;font-family:'Outfit',sans-serif;
  transition:all .13s;text-align:center;white-space:nowrap;min-width:44px;}
.ca:hover{background:var(--ls);}
.ca.pay:hover{background:#d4edda!important;border-color:var(--pd)!important;color:var(--pd)!important;}
.ca.edit:hover{background:#fdf5e4!important;border-color:var(--gd)!important;color:var(--gd)!important;}
.ca.canc:hover{background:#f0f0f0!important;border-color:var(--cn)!important;color:var(--cn)!important;}
.ca.del:hover{background:#fde8e2!important;border-color:var(--rs)!important;color:var(--rs)!important;}
/* EMPTY */
.empty{text-align:center;padding:3rem;color:var(--cn);grid-column:1/-1;}
.empty-ico{font-size:2.5rem;margin-bottom:.6rem;}
.empty p{font-family:'Playfair Display',serif;font-style:italic;font-size:.95rem;}
/* MODAL */
.ov{position:fixed;inset:0;background:rgba(28,18,8,.56);backdrop-filter:blur(5px);
  display:flex;align-items:center;justify-content:center;z-index:600;padding:1rem;}
.modal{background:var(--cb);border:1px solid var(--bd);border-radius:5px;
  width:100%;max-width:580px;max-height:94vh;overflow-y:auto;
  animation:mIn .2s ease;}
@keyframes mIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
.mh{padding:1rem 1.3rem;border-bottom:1px solid var(--bd);display:flex;
  align-items:center;justify-content:space-between;position:sticky;top:0;
  background:var(--cb);z-index:2;}
.mh h2{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:600;}
.mclose{background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--cn);padding:.2rem .35rem;}
.mclose:hover{color:var(--rs);}
.mb{padding:1.2rem 1.3rem;}
.mf{padding:.85rem 1.3rem;border-top:1px solid var(--bd);display:flex;gap:.5rem;
  justify-content:flex-end;position:sticky;bottom:0;background:var(--cb);}
/* FORM */
.fg{margin-bottom:.85rem;display:flex;flex-direction:column;gap:.25rem;}
.fg label{font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--sg);font-weight:500;}
.fg input,.fg textarea,.fg select{background:#fff;border:1px solid var(--bd);border-radius:2px;
  padding:.5rem .7rem;font-family:'Outfit',sans-serif;font-size:.85rem;color:var(--dp);
  width:100%;outline:none;transition:border-color .18s;}
.fg input:focus,.fg textarea:focus,.fg select:focus{border-color:var(--rs);}
.fg textarea{resize:vertical;min-height:65px;line-height:1.5;}
.tc{display:grid;grid-template-columns:1fr 1fr;gap:.7rem;}
.ptog{display:flex;gap:.4rem;}
.ptbtn{flex:1;padding:.45rem;border:1px solid var(--bd);border-radius:2px;
  background:#fff;font-family:'Outfit',sans-serif;font-size:.79rem;cursor:pointer;transition:all .18s;font-weight:500;}
.ptbtn.pa{background:var(--pd);color:#fff;border-color:var(--pd);}
.ptbtn.ua{background:var(--up);color:#fff;border-color:var(--up);}
/* UPLOAD */
.upzone{border:2px dashed var(--bd);border-radius:3px;padding:1rem;text-align:center;
  cursor:pointer;background:#fff;position:relative;transition:border-color .18s,background .18s;}
.upzone:hover{border-color:var(--rs);background:#fdf5f2;}
.upzone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;}
.photo-previews{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.5rem;}
.photo-thumb{position:relative;width:72px;height:72px;border-radius:3px;overflow:hidden;}
.photo-thumb img{width:100%;height:100%;object-fit:cover;}
.photo-del{position:absolute;top:2px;right:2px;background:rgba(0,0,0,.65);
  color:#fff;border:none;border-radius:50%;width:18px;height:18px;
  font-size:.65rem;cursor:pointer;display:flex;align-items:center;justify-content:center;}
/* BUTTONS */
.btn-c{padding:.52rem 1.1rem;background:#fff;border:1px solid var(--bd);border-radius:2px;
  cursor:pointer;font-size:.82rem;font-family:'Outfit',sans-serif;}
.btn-c:hover{background:var(--ls);}
.btn-s{padding:.52rem 1.3rem;background:var(--dp);color:var(--cr);border:none;
  border-radius:2px;cursor:pointer;font-size:.82rem;font-family:'Outfit',sans-serif;transition:background .18s;}
.btn-s:hover{background:var(--rs);}
/* DETAIL MODAL */
.dgrid{display:grid;grid-template-columns:1fr 1fr;gap:.4rem .7rem;margin-bottom:.8rem;}
.di strong{display:block;font-size:.63rem;letter-spacing:.09em;text-transform:uppercase;color:var(--rs);margin-bottom:.1rem;}
.di{font-size:.84rem;line-height:1.5;}
.dphoto-row{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.8rem;}
.dphoto-row img{height:100px;border-radius:3px;object-fit:cover;cursor:pointer;}
.quick-acts{display:flex;gap:.4rem;flex-wrap:wrap;}
.qa{padding:.35rem .8rem;border:1px solid var(--bd);border-radius:2px;
  font-size:.74rem;cursor:pointer;background:#fff;font-family:'Outfit',sans-serif;transition:all .13s;}
.qa:hover{background:var(--ls);}
.qa.qp:hover{background:#d4edda;border-color:var(--pd);color:var(--pd);}
.qa.qe{color:var(--gd);}
.qa.qe:hover{background:#fdf5e4;border-color:var(--gd);}
.qa.qc:hover{background:#f0f0f0;border-color:var(--cn);color:var(--cn);}
.qa.qd:hover{background:#fde8e2;border-color:var(--rs);color:var(--rs);}
.qa.qpr{color:#1d4ed8;}
.qa.qpr:hover{background:#dbeafe;border-color:#1d4ed8;}
/* WORKERS */
.wgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(225px,1fr));gap:.9rem;margin-bottom:1.8rem;}
.wcard{background:var(--cb);border:1px solid var(--bd);border-radius:4px;padding:1rem;
  cursor:pointer;transition:transform .18s,box-shadow .18s;}
.wcard:hover{transform:translateY(-2px);box-shadow:var(--sh);}
.wav{width:42px;height:42px;border-radius:50%;background:var(--dp);color:var(--cr);
  display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;
  font-size:1.15rem;margin-bottom:.65rem;}
.wn{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;margin-bottom:.15rem;}
.wr{font-size:.74rem;color:var(--cn);}
.wstats{display:flex;gap:1rem;margin-top:.5rem;}
.wsv{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:600;}
.wsl{font-size:.6rem;color:var(--sg);letter-spacing:.08em;text-transform:uppercase;}
.wmini{display:flex;gap:.3rem;flex-wrap:wrap;margin-top:.6rem;}
.ws-chip{font-size:.62rem;padding:.15rem .45rem;border-radius:20px;font-weight:500;}
/* WORKER PROFILE MODAL */
.wp-header{display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem;}
.wp-av{width:56px;height:56px;border-radius:50%;background:var(--dp);color:var(--cr);
  display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.5rem;}
.wp-name{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:600;}
.wp-role{font-size:.78rem;color:var(--cn);}
.wp-stats-row{display:flex;gap:.8rem;flex-wrap:wrap;margin-bottom:1rem;}
.wp-stat{background:var(--ls);border-radius:3px;padding:.5rem .9rem;text-align:center;}
.wp-stat-val{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:600;}
.wp-stat-label{font-size:.6rem;color:var(--sg);text-transform:uppercase;letter-spacing:.08em;}
.wp-orders{display:flex;flex-direction:column;gap:.5rem;}
.wp-order-row{background:#fff;border:1px solid var(--bd);border-radius:3px;
  padding:.65rem .9rem;display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;}
.wp-onum{font-size:.62rem;background:var(--dp);color:#fff;padding:.16rem .42rem;
  border-radius:20px;font-weight:600;white-space:nowrap;flex-shrink:0;}
.wp-oname{font-size:.85rem;font-weight:500;flex:1;min-width:100px;}
.wp-ometa{font-size:.72rem;color:var(--cn);}
.ws-select{padding:.28rem .5rem;border:1px solid var(--bd);border-radius:2px;
  font-size:.72rem;font-family:'Outfit',sans-serif;background:#fff;cursor:pointer;outline:none;}
/* ROUTE SECTION */
.route-sec{margin-bottom:1.2rem;}
.route-title{font-family:'Playfair Display',serif;font-size:1rem;margin-bottom:.5rem;
  color:var(--dp);display:flex;align-items:center;gap:.5rem;}
.route-tag{font-size:.62rem;background:var(--ls);color:var(--sg);padding:.15rem .45rem;border-radius:20px;}
/* PRINT */
@media print{
  .no-print{display:none!important;}
  .print-area{display:block!important;}
  body{background:#fff;}
  .print-wrap{padding:1.5cm;font-family:'Outfit',sans-serif;color:#000;max-width:100%;}
  .print-header{text-align:center;margin-bottom:1.5rem;border-bottom:2px solid #000;padding-bottom:1rem;}
  .print-logo{font-size:1.8rem;font-weight:700;letter-spacing:.05em;}
  .print-num{font-size:3rem;font-weight:700;letter-spacing:.1em;color:#b85c3a;}
  .print-section{margin-bottom:1rem;}
  .print-label{font-size:.65rem;text-transform:uppercase;letter-spacing:.12em;color:#666;margin-bottom:.2rem;}
  .print-val{font-size:1rem;font-weight:500;}
  .print-photos{display:flex;gap:.5rem;flex-wrap:wrap;}
  .print-photos img{height:120px;border:1px solid #ddd;}
  .print-footer{margin-top:1.5rem;padding-top:.8rem;border-top:1px solid #ccc;
    font-size:.75rem;color:#666;text-align:center;}
}
.print-area{display:none;}
/* TOAST */
.toast{position:fixed;bottom:1.3rem;right:1.3rem;background:var(--dp);color:var(--cr);
  padding:.6rem 1.1rem;border-radius:3px;font-size:.8rem;z-index:9999;
  border-left:3px solid var(--gd);pointer-events:none;
  animation:toastIn .28s ease;}
@keyframes toastIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
`;

/* ─── STORAGE HELPERS ─────────────────────────────────────── */
async function loadData() {
  try {
    const o = await window.storage.get("flo_orders", true);
    const w = await window.storage.get("flo_workers", true);
    return {
      orders:  o ? JSON.parse(o.value) : [],
      workers: w ? JSON.parse(w.value) : [],
    };
  } catch { return { orders: [], workers: [] }; }
}
async function persistOrders(orders) {
  try { await window.storage.set("flo_orders", JSON.stringify(orders), true); } catch {}
}
async function persistWorkers(workers) {
  try { await window.storage.set("flo_workers", JSON.stringify(workers), true); } catch {}
}

/* ─── HELPERS ─────────────────────────────────────────────── */
function pad(n) { return String(n).padStart(4, "0"); }
function esc(s) {
  const d = document.createElement("div"); d.textContent = s; return d.innerHTML;
}
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-HN", { weekday:"short", day:"2-digit", month:"short", year:"numeric" }) +
    " · " + d.toLocaleTimeString("es-HN", { hour:"2-digit", minute:"2-digit" });
}

/* ─── PRINT FUNCTION ─────────────────────────────────────── */
function printOrder(o, workers) {
  const worker = o.workerId ? workers.find(w => w.id === o.workerId) : null;
  const photos = (o.photos || []).map(p => `<img src="${p}" style="height:120px;margin-right:8px;border:1px solid #ddd;border-radius:3px;"/>`).join("");
  const win = window.open("", "_blank");
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>
    body{font-family:'Segoe UI',sans-serif;padding:2cm;color:#111;max-width:800px;margin:auto;}
    h1{font-size:2rem;letter-spacing:.05em;margin-bottom:.3rem;}
    .num{font-size:3.5rem;font-weight:700;color:#b85c3a;letter-spacing:.12em;
      border:3px solid #b85c3a;display:inline-block;padding:.3rem 1.2rem;border-radius:4px;margin-bottom:1rem;}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem 1.5rem;margin:1rem 0;}
    .item label{font-size:.62rem;text-transform:uppercase;letter-spacing:.12em;color:#888;display:block;}
    .item span{font-size:.97rem;font-weight:500;}
    hr{border:none;border-top:1.5px solid #ddd;margin:1rem 0;}
    .photos{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem;}
    .footer{margin-top:1.5rem;font-size:.72rem;color:#aaa;text-align:center;border-top:1px solid #ddd;padding-top:.8rem;}
    .badge{display:inline-block;padding:.2rem .7rem;border-radius:20px;font-size:.72rem;font-weight:600;}
    .paid{background:#d4edda;color:#5a8c6e;}.unpaid{background:#fde8e2;color:#b85c3a;}
    .dom{background:#dbeafe;color:#1d4ed8;}.sto{background:#fef9c3;color:#854d0e;}
  </style></head><body>
  <h1>✿ Flores &amp; Arreglos · Siguatepeque</h1>
  <div class="num">#${pad(o.id)}</div>
  <hr/>
  <div class="grid">
    <div class="item"><label>Cliente</label><span>${esc(o.name)}</span></div>
    <div class="item"><label>Teléfono</label><span>${o.phone ? esc(o.phone) : "—"}</span></div>
    <div class="item"><label>Entrega</label><span>${fmtDate(o.time)}</span></div>
    <div class="item"><label>Modalidad</label>
      <span class="badge ${o.delivery==='dom'?'dom':'sto'}">${o.delivery==='dom'?'🏠 Domicilio':'🏪 Recoger en tienda'}</span>
    </div>
    ${o.delivery==='dom'&&o.route?`<div class="item"><label>Ruta</label><span>${esc(o.route)}</span></div>`:''}
    ${o.delivery==='dom'&&o.addr?`<div class="item"><label>Dirección</label><span>${esc(o.addr)}</span></div>`:''}
    <div class="item"><label>Pago</label>
      <span class="badge ${o.paid?'paid':'unpaid'}">${o.paid?'✓ Pagado':'✗ Pendiente'}</span>
    </div>
    <div class="item"><label>Asignado a</label><span>${worker?esc(worker.name):'Sin asignar'}</span></div>
  </div>
  <hr/>
  <div class="item"><label>Descripción del arreglo</label><span>${esc(o.desc)}</span></div>
  ${o.notes?`<div class="item" style="margin-top:.5rem"><label>Notas</label><span>${esc(o.notes)}</span></div>`:''}
  ${photos?`<hr/><div class="item"><label>Fotos de referencia</label></div><div class="photos">${photos}</div>`:''}
  <div class="footer">Flores &amp; Arreglos · Siguatepeque, Honduras · Pedido #${pad(o.id)} · Impreso ${new Date().toLocaleString('es-HN')}</div>
  <script>window.onload=()=>{window.print();}<\/script>
  </body></html>`);
  win.document.close();
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [authed, setAuthed]   = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwErr, setPwErr]     = useState(false);

  const [orders,  setOrders]  = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView]         = useState("orders");
  const [filter, setFilter]     = useState("all");
  const [searchQ, setSearchQ]   = useState("");
  const [searchRes, setSearchRes] = useState([]);

  const [toast, setToast]       = useState(null);
  const toastRef = useRef();

  // modals
  const [modalOrder, setModalOrder]   = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalWorker, setModalWorker] = useState(false); // edit worker
  const [modalProfile, setModalProfile] = useState(false); // worker profile

  const [editingId, setEditingId]     = useState(null);
  const [detailId, setDetailId]       = useState(null);
  const [workerEditId, setWorkerEditId] = useState(null);
  const [profileId, setProfileId]     = useState(null);

  // counters
  const orderCtr  = useRef(1);
  const workerCtr = useRef(1);

  // form state
  const [fName,  setFName]  = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fDesc,  setFDesc]  = useState("");
  const [fTime,  setFTime]  = useState("");
  const [fAddr,  setFAddr]  = useState("");
  const [fNotes, setFNotes] = useState("");
  const [fPaid,  setFPaid]  = useState(true);
  const [fDelivery, setFDelivery] = useState("dom");
  const [fRoute, setFRoute] = useState(ROUTES_SPS[0]);
  const [fWorker, setFWorker] = useState("");
  const [fPhotos, setFPhotos] = useState([]); // base64 array

  // worker form
  const [wName, setWName] = useState("");
  const [wRole, setWRole] = useState("");
  const [newWName, setNewWName] = useState("");
  const [newWRole, setNewWRole] = useState("");

  /* ── LOAD ── */
  useEffect(() => {
    loadData().then(({ orders: o, workers: w }) => {
      setOrders(o);
      setWorkers(w);
      if (o.length) orderCtr.current  = Math.max(...o.map(x => x.id)) + 1;
      if (w.length) workerCtr.current = Math.max(...w.map(x => x.id)) + 1;
      setLoading(false);
    });
  }, []);

  /* ── TOAST ── */
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2600);
  };

  /* ── SAVE HELPERS ── */
  const saveOrders = (list) => { setOrders(list); persistOrders(list); };
  const saveWorkers = (list) => { setWorkers(list); persistWorkers(list); };

  /* ── STATS ── */
  const active     = orders.filter(o => o.status !== "cancelled");
  const statPaid   = active.filter(o => o.paid).length;
  const statUnpaid = active.filter(o => !o.paid).length;
  const statCan    = orders.filter(o => o.status === "cancelled").length;
  const today      = new Date().toDateString();
  const statToday  = active.filter(o => o.time && new Date(o.time).toDateString() === today).length;
  const statDom    = active.filter(o => o.delivery === "dom").length;
  const statSto    = active.filter(o => o.delivery === "sto").length;

  /* ── SEARCH ── */
  useEffect(() => {
    if (!searchQ.trim()) { setSearchRes([]); return; }
    const q = searchQ.toLowerCase();
    const res = orders.filter(o =>
      pad(o.id).includes(q) ||
      o.name.toLowerCase().includes(q) ||
      (o.phone && o.phone.replace(/\D/g,"").includes(q.replace(/\D/g,"")))
    ).slice(0, 12);
    setSearchRes(res);
  }, [searchQ, orders]);

  /* ── PHOTOS ── */
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => setFPhotos(prev => [...prev, ev.target.result]);
      r.readAsDataURL(f);
    });
  };
  const removePhoto = (idx) => setFPhotos(p => p.filter((_, i) => i !== idx));

  /* ── CLEAR FORM ── */
  const clearForm = () => {
    setFName(""); setFPhone(""); setFDesc(""); setFTime("");
    setFAddr(""); setFNotes(""); setFPaid(true);
    setFDelivery("dom"); setFRoute(ROUTES_SPS[0]);
    setFWorker(""); setFPhotos([]);
  };

  /* ── OPEN NEW ── */
  const openNew = () => {
    setEditingId(null); clearForm(); setModalOrder(true);
  };

  /* ── OPEN EDIT ── */
  const openEdit = (id) => {
    const o = orders.find(x => x.id === id); if (!o) return;
    setEditingId(id);
    setFName(o.name || ""); setFPhone(o.phone || "");
    setFDesc(o.desc || ""); setFTime(o.time || "");
    setFAddr(o.addr || ""); setFNotes(o.notes || "");
    setFPaid(o.paid); setFDelivery(o.delivery || "dom");
    setFRoute(o.route || ROUTES_SPS[0]);
    setFWorker(o.workerId ? String(o.workerId) : "");
    setFPhotos(o.photos || []);
    setModalDetail(false);
    setModalOrder(true);
  };

  /* ── SAVE ORDER ── */
  const saveOrder = () => {
    if (!fName.trim() || !fDesc.trim() || !fTime || (fDelivery === "dom" && !fAddr.trim())) {
      showToast("⚠️ Completa los campos obligatorios"); return;
    }
    let list;
    if (editingId !== null) {
      list = orders.map(o => o.id === editingId ? {
        ...o, name: fName, phone: fPhone, desc: fDesc, time: fTime,
        addr: fAddr, notes: fNotes, paid: fPaid, delivery: fDelivery,
        route: fDelivery === "dom" ? fRoute : null,
        workerId: fWorker ? parseInt(fWorker) : null,
        photos: fPhotos,
      } : o);
      showToast(`✓ Pedido #${pad(editingId)} actualizado`);
    } else {
      const id = orderCtr.current++;
      const newO = {
        id, name: fName, phone: fPhone, desc: fDesc, time: fTime,
        addr: fAddr, notes: fNotes, paid: fPaid, delivery: fDelivery,
        route: fDelivery === "dom" ? fRoute : null,
        workerId: fWorker ? parseInt(fWorker) : null,
        photos: fPhotos, status: "active",
        createdAt: new Date().toISOString(),
      };
      list = [newO, ...orders];
      showToast(`✓ Pedido #${pad(id)} registrado`);
    }
    saveOrders(list); setModalOrder(false);
  };

  /* ── ORDER ACTIONS ── */
  const togglePay = (id) => {
    const list = orders.map(o => o.id === id ? { ...o, paid: !o.paid } : o);
    saveOrders(list);
    const o = list.find(x => x.id === id);
    showToast(o.paid ? "✓ Marcado pagado" : "⏳ Marcado pendiente");
  };
  const cancelOrder = (id) => {
    if (!confirm("¿Cancelar este pedido?")) return;
    saveOrders(orders.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
    showToast("✗ Pedido cancelado");
  };
  const reactivate = (id) => {
    saveOrders(orders.map(o => o.id === id ? { ...o, status: "active" } : o));
    showToast("↩ Pedido reactivado");
  };
  const deleteOrder = (id) => {
    if (!confirm("¿Eliminar permanentemente?")) return;
    saveOrders(orders.filter(o => o.id !== id));
    setModalDetail(false); showToast("🗑 Pedido eliminado");
  };

  /* ── WORKER ACTIONS ── */
  const addWorker = () => {
    if (!newWName.trim()) { showToast("⚠️ Ingresa el nombre"); return; }
    const id = workerCtr.current++;
    const list = [...workers, { id, name: newWName, role: newWRole }];
    saveWorkers(list); setNewWName(""); setNewWRole("");
    showToast("✓ Colaborador agregado");
  };
  const openWorkerEdit = (id) => {
    const w = workers.find(x => x.id === id); if (!w) return;
    setWorkerEditId(id); setWName(w.name); setWRole(w.role || "");
    setModalWorker(true);
  };
  const saveWorker = () => {
    const list = workers.map(w => w.id === workerEditId ? { ...w, name: wName || w.name, role: wRole } : w);
    saveWorkers(list); setModalWorker(false); showToast("✓ Colaborador actualizado");
  };
  const removeWorker = (id) => {
    if (!confirm("¿Eliminar colaborador?")) return;
    saveWorkers(workers.filter(w => w.id !== id));
    saveOrders(orders.map(o => o.workerId === id ? { ...o, workerId: null } : o));
    showToast("🗑 Colaborador eliminado");
  };
  const updateWorkStatus = (orderId, ws) => {
    saveOrders(orders.map(o => o.id === orderId ? { ...o, workStatus: ws } : o));
  };

  /* ── FILTERED ORDERS ── */
  const filteredOrders = orders.filter(o => {
    if (filter === "paid")      return o.status !== "cancelled" && o.paid;
    if (filter === "unpaid")    return o.status !== "cancelled" && !o.paid;
    if (filter === "cancelled") return o.status === "cancelled";
    if (filter === "dom")       return o.status !== "cancelled" && o.delivery === "dom";
    if (filter === "sto")       return o.status !== "cancelled" && o.delivery === "sto";
    return true;
  });

  /* ── DOM ORDERS BY ROUTE ── */
  const domOrders = filteredOrders.filter(o => o.delivery === "dom");
  const byRoute = {};
  ROUTES_SPS.forEach(r => { byRoute[r] = []; });
  domOrders.forEach(o => { const r = o.route || ROUTES_SPS[6]; if (byRoute[r]) byRoute[r].push(o); });

  /* ── LOGIN ── */
  if (!authed) return (
    <>
      <style>{css}</style>
      <div className="login-wrap">
        <div className="login-box">
          <div className="login-logo">✿ Flores &amp; <span>Arreglos</span></div>
          <div className="login-sub">Siguatepeque, Honduras</div>
          <input className="login-input" type="password" placeholder="• • • • • •"
            value={pwInput} onChange={e => { setPwInput(e.target.value); setPwErr(false); }}
            onKeyDown={e => e.key === "Enter" && (pwInput === PASSWORD ? setAuthed(true) : setPwErr(true))}/>
          <button className="login-btn"
            onClick={() => pwInput === PASSWORD ? setAuthed(true) : setPwErr(true)}>
            Acceder
          </button>
          {pwErr && <div className="login-err">Contraseña incorrecta</div>}
        </div>
      </div>
    </>
  );

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"var(--cn)", fontFamily:"'Outfit',sans-serif" }}>
        Cargando datos…
      </div>
    </>
  );

  const detailOrder = detailId ? orders.find(o => o.id === detailId) : null;
  const profileWorker = profileId ? workers.find(w => w.id === profileId) : null;

  /* ── RENDER ── */
  return (
    <>
      <style>{css}</style>

      {/* HEADER */}
      <header className="no-print">
        <div className="logo">✿ Flores &amp; <em>Arreglos</em></div>
        <div className="nav">
          <button className={`nb${view==="orders"?" act":""}`} onClick={() => setView("orders")}>📋 Pedidos</button>
          <button className={`nb${view==="search"?" act":""}`} onClick={() => setView("search")}>🔍 Buscar</button>
          <button className={`nb${view==="workers"?" act":""}`} onClick={() => setView("workers")}>👥 Personal</button>
          <button className="nb new" onClick={openNew}>+ Nuevo Pedido</button>
        </div>
      </header>

      {/* STATS */}
      <div className="statsbar no-print">
        {[["statTotal", active.length, "Activos"], ["statPaid", statPaid, "Pagados", "var(--pd)"],
          ["statUnpaid", statUnpaid, "Pendientes", "var(--up)"],
          ["statCan", statCan, "Cancelados", "var(--cn)"],
          ["statToday", statToday, "Para hoy"],
          ["statDom", statDom, "Domicilio", "#1d4ed8"],
          ["statSto", statSto, "Tienda", "#854d0e"]].map(([k, v, l, c], i) => (
          <span key={k} style={{ display:"contents" }}>
            {i > 0 && <span className="sdiv"/>}
            <span className="stat">
              <span className="sv" style={{ color: c || "var(--dp)" }}>{v}</span>
              <span className="sl">{l}</span>
            </span>
          </span>
        ))}
      </div>

      {/* ═══ ORDERS VIEW ═══ */}
      {view === "orders" && (
        <div className="view no-print">
          <div className="topbar">
            <span className="sec-title">Pedidos agendados</span>
            <div className="fbar">
              {[["all","Todos",""],["paid","✓ Pagados","fp"],["unpaid","⏳ Pendientes","fu"],
                ["cancelled","✗ Cancelados","fc"],["dom","🏠 Domicilio","fd"],["sto","🏪 Tienda","fs"]
              ].map(([f,l,cls]) => (
                <button key={f} className={`fb ${cls} ${filter===f?"act":""}`}
                  onClick={() => setFilter(f)}>{l}</button>
              ))}
            </div>
          </div>

          {/* DOM split by route */}
          {filter === "dom" ? (
            <div>
              {ROUTES_SPS.map(r => byRoute[r]?.length ? (
                <div key={r} className="route-sec">
                  <div className="route-title">
                    🗺 {r} <span className="route-tag">{byRoute[r].length} pedido{byRoute[r].length>1?"s":""}</span>
                  </div>
                  <div className="grid">{byRoute[r].map(o => <OrderCard key={o.id} o={o} workers={workers}
                    onView={() => { setDetailId(o.id); setModalDetail(true); }}
                    onPay={() => togglePay(o.id)}
                    onEdit={() => openEdit(o.id)}
                    onCancel={() => cancelOrder(o.id)}
                    onReactivate={() => reactivate(o.id)}
                    onDelete={() => deleteOrder(o.id)}/>)}
                  </div>
                </div>
              ) : null)}
            </div>
          ) : (
            <div className="grid">
              {filteredOrders.length === 0
                ? <div className="empty"><div className="empty-ico">🌷</div><p>No hay pedidos aquí</p></div>
                : filteredOrders.map(o => <OrderCard key={o.id} o={o} workers={workers}
                    onView={() => { setDetailId(o.id); setModalDetail(true); }}
                    onPay={() => togglePay(o.id)}
                    onEdit={() => openEdit(o.id)}
                    onCancel={() => cancelOrder(o.id)}
                    onReactivate={() => reactivate(o.id)}
                    onDelete={() => deleteOrder(o.id)}/>)
              }
            </div>
          )}
        </div>
      )}

      {/* ═══ SEARCH VIEW ═══ */}
      {view === "search" && (
        <div className="view no-print">
          <div className="topbar"><span className="sec-title">🔍 Buscar pedido</span></div>
          <div className="search-wrap" style={{ marginBottom: "1rem" }}>
            <span className="search-ico">🔍</span>
            <input className="search-input" placeholder="Número de pedido, nombre o teléfono…"
              value={searchQ} onChange={e => setSearchQ(e.target.value)} autoFocus/>
          </div>
          {searchQ && (
            <div className="search-results">
              {searchRes.length === 0
                ? <div style={{ padding:"1rem", textAlign:"center", color:"var(--cn)", fontSize:".84rem" }}>Sin resultados</div>
                : searchRes.map(o => {
                    const worker = o.workerId ? workers.find(w => w.id === o.workerId) : null;
                    return (
                      <div key={o.id} className="sr-item"
                        onClick={() => { setDetailId(o.id); setModalDetail(true); setSearchQ(""); setSearchRes([]); }}>
                        <span className="sr-num">#{pad(o.id)}</span>
                        <span className={`dtype-badge ${o.delivery==="dom"?"dtype-dom":"dtype-sto"}`} style={{fontSize:".58rem",padding:".15rem .45rem",borderRadius:"20px"}}>
                          {o.delivery==="dom"?"🏠":"🏪"}
                        </span>
                        <div style={{ flex:1 }}>
                          <div className="sr-name">{o.name}</div>
                          <div className="sr-meta">
                            {o.phone && `📞 ${o.phone} · `}
                            {fmtDate(o.time)}
                            {worker && ` · 👤 ${worker.name}`}
                          </div>
                        </div>
                        <span className={`badge ${o.status==="cancelled"?"bx":o.paid?"bp":"bu"}`}>
                          {o.status==="cancelled"?"Cancelado":o.paid?"Pagado":"Pendiente"}
                        </span>
                      </div>
                    );
                  })
              }
            </div>
          )}
          {!searchQ && (
            <div style={{ color:"var(--cn)", fontSize:".85rem", fontStyle:"italic", marginTop:"2rem", textAlign:"center" }}>
              <div style={{ fontSize:"2rem", marginBottom:".5rem" }}>🌸</div>
              Escribe un nombre, teléfono o número de pedido para buscar
            </div>
          )}
        </div>
      )}

      {/* ═══ WORKERS VIEW ═══ */}
      {view === "workers" && (
        <div className="view no-print">
          <div className="topbar"><span className="sec-title">👥 Personal</span></div>
          <div className="wgrid">
            {workers.length === 0
              ? <div style={{ color:"var(--cn)", fontStyle:"italic", fontSize:".88rem" }}>No hay colaboradores registrados.</div>
              : workers.map(w => {
                  const wOrds = orders.filter(o => o.workerId === w.id && o.status !== "cancelled");
                  const initials = w.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
                  const done = wOrds.filter(o => o.workStatus === "done" || o.workStatus === "shipped").length;
                  const pending = wOrds.filter(o => !o.workStatus || o.workStatus === "pending" || o.workStatus === "inprogress").length;
                  return (
                    <div key={w.id} className="wcard" onClick={() => { setProfileId(w.id); setModalProfile(true); }}>
                      <div className="wav">{initials}</div>
                      <div className="wn">{w.name}</div>
                      <div className="wr">{w.role || "Colaborador"}</div>
                      <div className="wstats">
                        <div><div className="wsv">{wOrds.length}</div><div className="wsl">Pedidos</div></div>
                        <div><div className="wsv" style={{color:"var(--pd)"}}>{done}</div><div className="wsl">Listos</div></div>
                        <div><div className="wsv" style={{color:"var(--up)"}}>{pending}</div><div className="wsl">Pendientes</div></div>
                      </div>
                      <div className="wmini">
                        {Object.entries(WORK_STATUS).map(([k,v]) => {
                          const cnt = wOrds.filter(o => (o.workStatus||"pending") === k).length;
                          return cnt > 0 ? <span key={k} className="ws-chip" style={{background:v.bg,color:v.color}}>{v.label}: {cnt}</span> : null;
                        })}
                      </div>
                      <div style={{fontSize:".72rem",color:"var(--cn)",marginTop:".5rem"}}>Ver perfil completo →</div>
                    </div>
                  );
                })
            }
          </div>

          <div style={{ marginBottom:".75rem" }}><span className="sec-title" style={{fontSize:"1.05rem"}}>Agregar colaborador</span></div>
          <div className="add-worker-box" style={{background:"var(--cb)",border:"1px solid var(--bd)",borderRadius:"4px",padding:"1.1rem",maxWidth:"360px"}}>
            <div className="fg"><label>Nombre completo</label>
              <input type="text" value={newWName} onChange={e=>setNewWName(e.target.value)} placeholder="Ej. Laura Pérez"/></div>
            <div className="fg"><label>Rol / Especialidad</label>
              <input type="text" value={newWRole} onChange={e=>setNewWRole(e.target.value)} placeholder="Ej. Diseñadora floral"/></div>
            <button className="btn-s" style={{width:"100%"}} onClick={addWorker}>Agregar</button>
          </div>
        </div>
      )}

      {/* ═══ MODAL: NEW/EDIT ORDER ═══ */}
      {modalOrder && (
        <div className="ov" onClick={e => e.target.classList.contains("ov") && setModalOrder(false)}>
          <div className="modal">
            <div className="mh">
              <h2>{editingId ? `Editar Pedido #${pad(editingId)}` : "Nuevo Pedido"}</h2>
              <button className="mclose" onClick={() => setModalOrder(false)}>✕</button>
            </div>
            <div className="mb">
              <div className="tc">
                <div className="fg"><label>Nombre del cliente *</label>
                  <input type="text" value={fName} onChange={e=>setFName(e.target.value)} placeholder="María González"/></div>
                <div className="fg"><label>Teléfono</label>
                  <input type="tel" value={fPhone} onChange={e=>setFPhone(e.target.value)} placeholder="9999-0000"/></div>
              </div>
              <div className="fg"><label>Descripción del arreglo *</label>
                <textarea value={fDesc} onChange={e=>setFDesc(e.target.value)} placeholder="Ej. Arreglo de rosas rojas con listón blanco…"/></div>

              {/* FOTOS MÚLTIPLES */}
              <div className="fg">
                <label>Fotos de referencia (puedes subir varias)</label>
                <div className="upzone">
                  <input type="file" accept="image/*" multiple onChange={handlePhotos}/>
                  <div style={{fontSize:"1.6rem"}}>🌸</div>
                  <div style={{fontSize:".75rem",color:"var(--cn)"}}>Clic o arrastra — múltiples fotos permitidas</div>
                </div>
                {fPhotos.length > 0 && (
                  <div className="photo-previews">
                    {fPhotos.map((p,i) => (
                      <div key={i} className="photo-thumb">
                        <img src={p} alt=""/>
                        <button className="photo-del" onClick={() => removePhoto(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="tc">
                <div className="fg"><label>Fecha y hora de entrega *</label>
                  <input type="datetime-local" value={fTime} onChange={e=>setFTime(e.target.value)}/></div>
                <div className="fg">
                  <label>Modalidad de entrega</label>
                  <div className="ptog">
                    <button className={`ptbtn${fDelivery==="dom"?" pa":""}`} onClick={()=>setFDelivery("dom")}>🏠 Domicilio</button>
                    <button className={`ptbtn${fDelivery==="sto"?" ua":""}`} onClick={()=>setFDelivery("sto")}>🏪 Tienda</button>
                  </div>
                </div>
              </div>

              {fDelivery === "dom" && (
                <div className="tc">
                  <div className="fg"><label>Dirección *</label>
                    <input type="text" value={fAddr} onChange={e=>setFAddr(e.target.value)} placeholder="Colonia, calle, casa…"/></div>
                  <div className="fg"><label>Ruta de entrega</label>
                    <select value={fRoute} onChange={e=>setFRoute(e.target.value)}>
                      {ROUTES_SPS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="tc">
                <div className="fg"><label>Asignar a colaborador</label>
                  <select value={fWorker} onChange={e=>setFWorker(e.target.value)}>
                    <option value="">— Sin asignar —</option>
                    {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label>Estado de pago</label>
                  <div className="ptog">
                    <button className={`ptbtn${fPaid?" pa":""}`} onClick={()=>setFPaid(true)}>✓ Pagado</button>
                    <button className={`ptbtn${!fPaid?" ua":""}`} onClick={()=>setFPaid(false)}>✗ Pendiente</button>
                  </div>
                </div>
              </div>

              <div className="fg"><label>Notas adicionales</label>
                <input type="text" value={fNotes} onChange={e=>setFNotes(e.target.value)} placeholder="Ej. Timbre B, entregar antes del mediodía…"/></div>
            </div>
            <div className="mf">
              <button className="btn-c" onClick={() => setModalOrder(false)}>Cancelar</button>
              <button className="btn-s" onClick={saveOrder}>{editingId ? "Guardar cambios" : "Registrar pedido"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: DETAIL ═══ */}
      {modalDetail && detailOrder && (
        <div className="ov" onClick={e => e.target.classList.contains("ov") && setModalDetail(false)}>
          <div className="modal">
            <div className="mh">
              <h2>#{pad(detailOrder.id)} · {detailOrder.name}</h2>
              <button className="mclose" onClick={() => setModalDetail(false)}>✕</button>
            </div>
            <div className="mb">
              {detailOrder.photos?.length > 0 && (
                <div className="dphoto-row">
                  {detailOrder.photos.map((p,i) => <img key={i} src={p} alt="" style={{maxHeight:"110px"}}/>)}
                </div>
              )}
              <div className="dgrid">
                <div className="di"><strong>Cliente</strong>{detailOrder.name}</div>
                <div className="di"><strong>Teléfono</strong>{detailOrder.phone || "—"}</div>
                <div className="di"><strong>Entrega</strong>{fmtDate(detailOrder.time)}</div>
                <div className="di"><strong>Modalidad</strong>
                  <span className={`dtype-badge ${detailOrder.delivery==="dom"?"dtype-dom":"dtype-sto"}`} style={{display:"inline-block"}}>
                    {detailOrder.delivery==="dom"?"🏠 Domicilio":"🏪 Recoger en tienda"}
                  </span>
                </div>
                {detailOrder.delivery==="dom" && <div className="di"><strong>Ruta</strong>{detailOrder.route || "—"}</div>}
                {detailOrder.delivery==="dom" && <div className="di"><strong>Dirección</strong>{detailOrder.addr}</div>}
                <div className="di"><strong>Pago</strong>
                  <span style={{color:detailOrder.paid?"var(--pd)":"var(--up)",fontWeight:600}}>
                    {detailOrder.paid?"✓ Pagado":"✗ Pendiente"}
                  </span>
                </div>
                <div className="di"><strong>Asignado a</strong>
                  {detailOrder.workerId ? (workers.find(w=>w.id===detailOrder.workerId)?.name||"—") : "Sin asignar"}
                </div>
              </div>
              <div className="di" style={{marginBottom:".5rem"}}><strong>Arreglo</strong>{detailOrder.desc}</div>
              {detailOrder.notes && <div className="di"><strong>Notas</strong>{detailOrder.notes}</div>}

              <div style={{marginTop:"1rem",paddingTop:"1rem",borderTop:"1px solid var(--bd)"}}>
                <div style={{fontSize:".63rem",letterSpacing:".1em",textTransform:"uppercase",color:"var(--cn)",marginBottom:".55rem"}}>Acciones</div>
                <div className="quick-acts">
                  {detailOrder.status!=="cancelled" && (
                    <button className="qa qp" onClick={() => { togglePay(detailOrder.id); setDetailId(detailOrder.id); }}>
                      {detailOrder.paid?"↩ Pendiente":"✓ Pagado"}
                    </button>
                  )}
                  <button className="qa qe" onClick={() => openEdit(detailOrder.id)}>✏️ Editar</button>
                  {detailOrder.status!=="cancelled"
                    ? <button className="qa qc" onClick={() => { cancelOrder(detailOrder.id); setModalDetail(false); }}>✗ Cancelar</button>
                    : <button className="qa" onClick={() => { reactivate(detailOrder.id); }}>↩ Reactivar</button>
                  }
                  <button className="qa qpr" onClick={() => printOrder(detailOrder, workers)}>🖨 Imprimir</button>
                  <button className="qa qd" onClick={() => deleteOrder(detailOrder.id)}>🗑 Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: WORKER PROFILE ═══ */}
      {modalProfile && profileWorker && (() => {
        const wOrds = orders.filter(o => o.workerId === profileWorker.id && o.status !== "cancelled");
        const initials = profileWorker.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
        const counts = {};
        Object.keys(WORK_STATUS).forEach(k => { counts[k] = wOrds.filter(o=>(o.workStatus||"pending")===k).length; });
        const domPending = wOrds.filter(o => o.delivery==="dom" && (!o.workStatus||o.workStatus==="pending"||o.workStatus==="inprogress")).length;
        const stoPending = wOrds.filter(o => o.delivery==="sto" && (!o.workStatus||o.workStatus==="pending"||o.workStatus==="inprogress")).length;
        return (
          <div className="ov" onClick={e => e.target.classList.contains("ov") && setModalProfile(false)}>
            <div className="modal" style={{maxWidth:"640px"}}>
              <div className="mh">
                <h2>Perfil · {profileWorker.name}</h2>
                <button className="mclose" onClick={()=>setModalProfile(false)}>✕</button>
              </div>
              <div className="mb">
                <div className="wp-header">
                  <div className="wp-av">{initials}</div>
                  <div><div className="wp-name">{profileWorker.name}</div>
                    <div className="wp-role">{profileWorker.role||"Colaborador"}</div></div>
                </div>

                <div className="wp-stats-row">
                  <div className="wp-stat"><div className="wp-stat-val">{wOrds.length}</div><div className="wp-stat-label">Total</div></div>
                  {Object.entries(WORK_STATUS).map(([k,v]) => (
                    <div key={k} className="wp-stat" style={{background:v.bg}}>
                      <div className="wp-stat-val" style={{color:v.color,fontSize:"1.1rem"}}>{counts[k]}</div>
                      <div className="wp-stat-label" style={{color:v.color}}>{v.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{display:"flex",gap:"1rem",marginBottom:"1rem",fontSize:".78rem"}}>
                  <span style={{background:"#dbeafe",color:"#1d4ed8",padding:".2rem .65rem",borderRadius:"20px",fontWeight:500}}>
                    🏠 Domicilio pendientes: {domPending}
                  </span>
                  <span style={{background:"#fef9c3",color:"#854d0e",padding:".2rem .65rem",borderRadius:"20px",fontWeight:500}}>
                    🏪 Recoge en tienda: {stoPending}
                  </span>
                </div>

                <div style={{fontSize:".65rem",letterSpacing:".1em",textTransform:"uppercase",color:"var(--cn)",marginBottom:".5rem"}}>
                  Pedidos asignados — actualiza el estado de cada uno
                </div>

                <div className="wp-orders">
                  {wOrds.length === 0
                    ? <div style={{color:"var(--cn)",fontStyle:"italic",fontSize:".85rem"}}>Sin pedidos asignados</div>
                    : wOrds.map(o => {
                        const ws = o.workStatus || "pending";
                        const wsInfo = WORK_STATUS[ws];
                        return (
                          <div key={o.id} className="wp-order-row">
                            <span className="wp-onum">#{pad(o.id)}</span>
                            <span className={`dtype-badge ${o.delivery==="dom"?"dtype-dom":"dtype-sto"}`} style={{position:"static",fontSize:".58rem",padding:".14rem .4rem"}}>
                              {o.delivery==="dom"?"🏠":"🏪"}
                            </span>
                            <div style={{flex:1}}>
                              <div className="wp-oname">{o.name}</div>
                              <div className="wp-ometa">{fmtDate(o.time)}{o.delivery==="dom"&&o.route?` · ${o.route}`:""}</div>
                            </div>
                            <span style={{background:wsInfo.bg,color:wsInfo.color,fontSize:".62rem",padding:".15rem .45rem",borderRadius:"20px",fontWeight:500,marginRight:".4rem",whiteSpace:"nowrap"}}>
                              {wsInfo.label}
                            </span>
                            <select className="ws-select" value={ws}
                              onChange={e => { updateWorkStatus(o.id, e.target.value); }}>
                              {Object.entries(WORK_STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                          </div>
                        );
                      })
                  }
                </div>
              </div>
              <div className="mf">
                <button className="btn-c" onClick={() => { openWorkerEdit(profileWorker.id); setModalProfile(false); }}>✏️ Editar datos</button>
                <button className="btn-c" style={{color:"var(--rs)"}} onClick={() => { removeWorker(profileWorker.id); setModalProfile(false); }}>Eliminar</button>
                <button className="btn-s" onClick={() => setModalProfile(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ MODAL: EDIT WORKER ═══ */}
      {modalWorker && (
        <div className="ov" onClick={e => e.target.classList.contains("ov") && setModalWorker(false)}>
          <div className="modal" style={{maxWidth:"380px"}}>
            <div className="mh"><h2>Editar colaborador</h2>
              <button className="mclose" onClick={()=>setModalWorker(false)}>✕</button></div>
            <div className="mb">
              <div className="fg"><label>Nombre</label><input type="text" value={wName} onChange={e=>setWName(e.target.value)}/></div>
              <div className="fg"><label>Rol</label><input type="text" value={wRole} onChange={e=>setWRole(e.target.value)}/></div>
            </div>
            <div className="mf">
              <button className="btn-c" onClick={()=>setModalWorker(false)}>Cancelar</button>
              <button className="btn-s" onClick={saveWorker}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast no-print">{toast}</div>}
    </>
  );
}

/* ─── ORDER CARD COMPONENT ─────────────────────────────── */
function OrderCard({ o, workers, onView, onPay, onEdit, onCancel, onReactivate, onDelete }) {
  const worker = o.workerId ? workers.find(w => w.id === o.workerId) : null;
  const isCancelled = o.status === "cancelled";
  const dt = o.time ? new Date(o.time) : null;
  const dateStr = dt
    ? dt.toLocaleDateString("es-HN",{day:"2-digit",month:"short"}) + " " +
      dt.toLocaleTimeString("es-HN",{hour:"2-digit",minute:"2-digit"})
    : "—";

  return (
    <div className={`ocard${isCancelled?" cancelled":""}`}>
      <span className="onum">#{pad(o.id)}</span>
      <span className={`dtype-badge ${o.delivery==="dom"?"dtype-dom":"dtype-sto"}`}>
        {o.delivery==="dom"?"🏠 Domicilio":"🏪 Tienda"}
      </span>

      {o.photos?.length > 0
        ? <div className="card-photos">{o.photos.slice(0,3).map((p,i)=><img key={i} src={p} alt=""/>)}</div>
        : <div className="card-ph">🌸</div>
      }

      <div className="cbody">
        <div className="ctop">
          <div className="cname">{o.name}</div>
          <span className={`badge ${isCancelled?"bx":o.paid?"bp":"bu"}`}>
            {isCancelled?"Cancelado":o.paid?"Pagado":"Pendiente"}
          </span>
        </div>
        <div className="cdesc">{o.desc.length>70?o.desc.slice(0,70)+"…":o.desc}</div>
        <div className="cmeta">
          {o.phone && <div className="mrow">📞 {o.phone}</div>}
          <div className="mrow">📅 {dateStr}</div>
          {o.delivery==="dom" && o.addr && <div className="mrow">📍 {o.addr.length>36?o.addr.slice(0,36)+"…":o.addr}</div>}
          {o.delivery==="dom" && o.route && <div className="mrow">🗺 {o.route}</div>}
          {worker && <div className="mrow">👤 {worker.name}</div>}
          {o.workStatus && <div className="mrow">
            <span style={{background:WORK_STATUS[o.workStatus]?.bg,color:WORK_STATUS[o.workStatus]?.color,
              padding:".1rem .4rem",borderRadius:"20px",fontSize:".66rem",fontWeight:500}}>
              {WORK_STATUS[o.workStatus]?.label}
            </span>
          </div>}
        </div>
        <div className="cactions">
          <button className="ca" onClick={onView}>Ver</button>
          {!isCancelled && <button className="ca pay" onClick={onPay}>{o.paid?"↩":"✓"}</button>}
          <button className="ca edit" onClick={onEdit}>✏️</button>
          {!isCancelled
            ? <button className="ca canc" onClick={onCancel}>✗</button>
            : <button className="ca" onClick={onReactivate}>↩</button>
          }
          <button className="ca del" onClick={onDelete}>🗑</button>
        </div>
      </div>
    </div>
  );
}
