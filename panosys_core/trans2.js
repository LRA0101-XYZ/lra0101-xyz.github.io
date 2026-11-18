/* DARK 2.0 — transiciones como diagramas de flujo de datos (looks/transitions y looks/glitch).
   Cada transicion es el sistema enrutando al observador de un nodo al siguiente: el diagrama se traza de golpe, se desgarra y corta.
   Va encima de la pagina de transicion original, que sigue debajo con su audio y su estrobo (se alcanza a ver como textura).
   Modos: tracker (TERMINAL → SENSOR → OPERATOR, tres columnas con cintas) · alluvial (niveles que se abren hacia abajo) ·
          fan (una fila de columnas que se abre en abanico hacia nodos sueltos) · matrix (tabla de rayas y puntos + curvas a clases) ·
          radial (anillos, radios punteados y nodos concentricos) · topology (paneles con listas y haces de curvas) ·
          isostack (planos isometricos apilados con plomadas y relieve).
   Uso: TRANS2.run({ panes: [{ mode: 'tracker', at: [0, 0, 1, 1] }], hop: 'RELAY_HOP_01', from: 'INDUCTION_GATE', to: 'LENS_04_SWEEP', dur: 6 });
   Paleta unica de la serie: verde, rojo, blanco sobre negro. */
(function () {
  if (window.TRANS2) return;
  let inv = false;   // cuadro invertido: fondo claro, trazo negro, alerta roja (la paleta no se sale)
  const G = a => (inv ? 'rgba(0,0,0,' : 'rgba(0,255,85,') + a + ')', R = a => (inv ? 'rgba(210,0,0,' : 'rgba(255,42,42,') + a + ')', Wt = a => (inv ? 'rgba(0,0,0,' : 'rgba(232,255,232,') + a + ')';
  const BG = a => (inv ? 'rgba(232,255,232,' : 'rgba(0,0,0,') + a + ')';
  const COL = { g: G, r: R, w: Wt };
  const FONT = (s, b) => (b ? 'bold ' : '') + (s || 9) + 'px Consolas, "Courier New", monospace';
  let seed = (Math.random() * 1e9) | 0;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1)), pick = a => a[Math.floor(rnd() * a.length)], hex = (n = 4) => Math.floor(rnd() * Math.pow(16, n)).toString(16).toUpperCase().padStart(n, '0');
  const pareto = () => Math.pow(rnd(), 3);   // pocos pesados, muchos livianos
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------- vocabulario (lore) ----------
  const TERMINAL = () => pick(['BIOTERMINAL_', 'CITIZEN_', 'MIND_0x', 'ASSET_', 'NODE:', 'OBSERVER_']) + hex();
  const SENSORS = ['LENS_04', 'PHONE_MIC', 'FRONT_CAMERA', 'TOWER_CELL', 'SAT_RELAY', 'SMART_TV', 'WEARABLE', 'DOORBELL', 'KEYSTROKES', 'FEED_SCROLL', 'CHECKOUT', 'GPS_TRACE', 'WIFI_PROBE', 'BROWSER_ID',
    'FACE_INDEX', 'VOICE_PRINT', 'GAIT', 'HEARTBEAT', 'SLEEP_LOG', 'TYPING_CADENCE', 'PURCHASES', 'SEARCHES', 'LIKES', 'CONTACTS', 'LOCATION', 'PUPIL_DILATION', 'DWELL_TIME', 'PAUSE_LENGTH', 'UNSENT_DRAFTS',
    'STREET_CAM', 'TRANSIT_CARD', 'LOYALTY_ID', 'AD_PIXEL', 'COOKIE_SYNC', 'MIC_AMBIENT', 'CLIPBOARD', 'BATTERY_STATE', 'ACCELEROMETER', 'CALENDAR', 'PHOTO_EXIF', 'SCREEN_TIME', 'AUTOPLAY_NEXT', 'NOTIFICATION_TAP',
    'SMART_METER', 'PLATE_READER', 'PAYMENT_RAIL', 'HEALTH_APP', 'MOOD_INFERENCE', 'ATTENTION_SCORE', 'CREDIT_FILE', 'CENSUS_FORM', 'SCHOOL_RECORD', 'WORK_BADGE', 'VPN_EXIT', 'DNS_QUERY', 'BLUETOOTH_BEACON', 'RETINA_SCAN', 'THERMAL_CAM'];
  const OPERATORS = ['PANOPTIC SYSTEMS', 'HUMAN EXPERIENCE ADMIN', 'LRA0101 SYNTHETIC RESEARCH', 'PROSTHETIC THOUGHT', 'ARCHITECTURE OF OBEDIENCE', 'VISIBILITY INFRASTRUCTURE', 'ANESTHESIA BY SIMULATION', 'WASTE LOGISTICS',
    'DEBT_HARVESTER', 'CENSUS_TOWER', 'RENDER_FARM', 'CARBON ARCHIVE', 'TRAINING DATA', 'PREDICTION MARKET', 'BEHAVIORAL FUTURES', 'ATTENTION EXCHANGE', 'UNKNOWN'];
  const CHAPTERS = ['INOCULATION', 'COGNITIVE ATROPHY', 'ETERNAL PRESENT', 'MECHANICS OF ENCLOSURE', 'PSYCHOPOLITICAL INFECTION', 'TERMINAL TECHNOFEUDALISM', 'CAPTURE PROTOCOL', 'RECURSIVE SELF-SURVEILLANCE',
    'NEUTRALIZATION DIAGNOSIS', 'SYNTHESIS OF THE REAL', 'NOETIC LEACHING', 'CATOPTRIC SUBLIMATION', 'COLLAPSE CATALYSIS', 'POST-PROCESSING RESIDUE', 'NECROMATERIAL DRAINAGE'];
  const CLASSES = ['DOCILE', 'DEVIANT', 'PENDING', 'PURGED', 'COMPOSTED', 'INDEXED', 'RANKED', 'SCORED', 'NUDGED', 'TAGGED', 'ALIGNED', 'DRAINED', 'ARCHIVED', 'NOISE'];
  const ATTRS = ['ATTN', 'SLEEP', 'FEAR', 'DEBT', 'PULSE', 'DWELL', 'RECALL', 'DOCIL', 'YIELD', 'DRIFT', 'TRUST', 'NOVEL', 'RAGE', 'LIKES', 'SCROLL', 'BUY', 'OBEY', 'DOUBT'];
  const NODES = ['INDUCTION_GATE', 'LENS_04_SWEEP', 'DIGITAL_LAB_07', 'MONOLITH_LOOP', 'ROOT_OUTBREAK', 'CAVE_PROJECTION', 'CENSUS_TOWER', 'NULL_NEGATION', 'CANCELLED_FUTURES', 'MEAT_RENDER', 'SIGNAL_COLLAPSE', 'FLATLINE'];

  let cv, c, W = 0, H = 0, DPR = 1, cfg = null, T0 = 0, panes = [], total = 0;

  // ---------- haces: curvas agrupadas por estilo para trazarlas en pocas pasadas ----------
  function Bundle() { const groups = new Map(); return {
    add(e) { const k = e.col + '|' + e.w + '|' + e.a; let g = groups.get(k); if (!g) { g = []; groups.set(k, g); } g.push(e); total++; },
    sort() { for (const g of groups.values()) g.sort((a, b) => a.o - b.o); },
    draw(p, jit) {
      for (const [k, g] of groups) {
        const [col, w, a] = k.split('|'); c.strokeStyle = COL[col](+a); c.lineWidth = +w; c.beginPath();
        for (let i = 0; i < g.length; i++) { const e = g[i]; if (e.o > p) break; const j = jit ? (Math.random() - 0.5) * jit : 0; c.moveTo(e.x1 + j, e.y1); c.bezierCurveTo(e.c1x, e.c1y, e.c2x, e.c2y, e.x2 + j, e.y2); }
        c.stroke();
      }
    } }; }
  const hEdge = (x1, y1, x2, y2, col, w, a, o, k) => { const d = (x2 - x1) * (k || 0.5); return { x1, y1, c1x: x1 + d, c1y: y1, c2x: x2 - d, c2y: y2, x2, y2, col, w, a, o }; };
  const vEdge = (x1, y1, x2, y2, col, w, a, o, k) => { const d = (y2 - y1) * (k || 0.5); return { x1, y1, c1x: x1, c1y: y1 + d, c2x: x2, c2y: y2 - d, x2, y2, col, w, a, o }; };
  function text(s, x, y, col, align, size, bold, rot) {
    c.font = FONT(size, bold); c.fillStyle = col; c.textAlign = align || 'left';
    if (rot) { c.save(); c.translate(x, y); c.rotate(rot); c.fillText(s, 0, 0); c.restore(); } else c.fillText(s, x, y);
  }

  // ================= modos =================
  const MODES = {};

  // TERMINAL → SENSOR → OPERATOR: tres columnas de barras blancas, lineas finas y cintas anchas
  MODES.tracker = r => {
    const B = Bundle(), X = [r.x + r.w * 0.17, r.x + r.w * 0.5, r.x + r.w * 0.83], top = r.y + r.h * 0.13, hh = r.h * 0.8;
    const col = (n, wfn, names) => { const ws = Array.from({ length: n }, wfn), sum = ws.reduce((a, b) => a + b, 0), gap = 3, k = (hh - gap * n) / sum; let y = top; return ws.map((w, i) => { const h = Math.max(1.5, w * k), o = { y: y + h / 2, h, w, name: names(i), o: i / n }; y += h + gap; return o; }); };
    const sens = SENSORS.slice().sort(() => rnd() - 0.5);
    const Tn = col(Math.round(clamp(r.h / 17, 16, 40)), () => 0.5 + rnd(), TERMINAL), Sn = col(Math.round(clamp(r.h / 11, 24, 62)), () => 0.25 + pareto() * 6, i => sens[i % sens.length] + (i >= sens.length ? '_' + hex(2) : '')), On = col(Math.round(clamp(r.h / 38, 8, 16)), () => 0.6 + pareto() * 5, i => OPERATORS[i % OPERATORS.length]);
    const heavy = a => { const t = rnd() * a.reduce((s, n) => s + n.w, 0); let q = 0; for (const n of a) { q += n.w; if (q >= t) return n; } return a[a.length - 1]; };
    Tn.forEach(t => { for (let i = ri(2, 5); i > 0; i--) { const s = heavy(Sn); B.add(hEdge(X[0] + 3, t.y, X[1] - 3, s.y, 'w', 1, 0.22, t.o * 0.5, 0.55)); } });
    Sn.forEach((s, i) => { for (let q = ri(1, 2); q > 0; q--) { const o = heavy(On), big = s.h > 9; B.add(hEdge(X[1] + 3, s.y, X[2] - 3, o.y, o === On[0] ? 'r' : 'w', big ? Math.round(Math.min(30, s.h)) : 1, big ? 0.2 : 0.3, 0.35 + s.o * 0.6, 0.5)); } });
    B.sort();
    return (p, t) => {
      B.draw(p, t > 0.8 ? 6 : 0);
      [[Tn, X[0], 'right', -8, '① TERMINAL'], [Sn, X[1], 'left', 8, '② SENSOR'], [On, X[2], 'left', 8, '③ OPERATOR']].forEach(([a, x, al, dx, name], q) => {
        const pp = clamp(p * 1.6 - q * 0.3, 0, 1);
        text(name, x + (q === 0 ? -30 : 0), top - 16, Wt(0.95), q === 0 ? 'right' : 'left', 14, true);
        c.fillStyle = Wt(0.95); a.forEach(n => { if (n.o <= pp) c.fillRect(x - 3, n.y - n.h / 2, 6, n.h); });
        a.forEach(n => { if (n.o <= pp && n.h > 5.5) text(n.name, x + dx, n.y + 3, Wt(0.8), al, 8); });
      });
    };
  };

  // niveles que se abren hacia abajo (cintas anchas arriba, hilos al fondo, etiquetas giradas)
  MODES.alluvial = r => {
    const B = Bundle(), tiers = [3, 7, 9, 16], ys = [0.13, 0.31, 0.49, 0.67].map(f => r.y + r.h * f), spread = [0.2, 0.34, 0.5, 0.74], cx = r.x + r.w * 0.5;
    const names = ['ORIGIN', 'SENSOR CLASS', 'BEHAVIOR', 'CLASSIFICATION', 'DESTINATION'], cols = ['r', 'w', 'g'];
    const T = tiers.map((n, k) => { const ws = Array.from({ length: n }, () => 0.4 + pareto() * 4), sum = ws.reduce((a, b) => a + b, 0), wid = r.w * spread[k], gap = 6, s = (wid - gap * n) / sum; let x = cx - wid / 2; return ws.map((w, i) => { const ww = w * s, o = { x: x + ww / 2, w: ww, col: k === 0 ? cols[i % 3] : null, y: ys[k] }; x += ww + gap; return o; }); });
    for (let k = 1; k < T.length; k++) T[k].forEach((n, i) => { const src = T[k - 1][clamp(Math.round(i / T[k].length * T[k - 1].length + (rnd() - 0.5) * 1.6), 0, T[k - 1].length - 1)]; n.col = src.col; B.add(vEdge(src.x, src.y + 3, n.x, n.y - 3, n.col, Math.max(1, Math.round(Math.min(n.w, src.w) * 0.8)), 0.26, (k - 1) / 4 + i / T[k].length * 0.2, 0.5));
      if (rnd() < 0.5) { const s2 = pick(T[k - 1]); B.add(vEdge(s2.x, s2.y + 3, n.x, n.y - 3, s2.col, 1, 0.35, (k - 1) / 4 + rnd() * 0.25, 0.5)); } });
    const nLeaf = Math.round(clamp(r.w / 16, 24, 74)), leafY = r.y + r.h * 0.86, leaves = Array.from({ length: nLeaf }, (_, i) => ({ x: r.x + r.w * 0.03 + i / (nLeaf - 1) * r.w * 0.94, name: i % 4 === 0 ? CHAPTERS[(i / 4 | 0) % CHAPTERS.length] : pick(CLASSES) + '_' + hex(2) }));
    leaves.forEach((l, i) => { for (let q = ri(1, 3); q > 0; q--) { const s = pick(T[3]); B.add(vEdge(s.x + (rnd() - 0.5) * s.w, s.y + 3, l.x, leafY - 4, s.col, 1, 0.3, 0.72 + i / nLeaf * 0.26, 0.55)); } });
    B.sort();
    return p => {
      B.draw(p);
      T.forEach((tier, k) => { if (p < k / 4.4) return; c.fillStyle = Wt(0.95); tier.forEach(n => c.fillRect(n.x - n.w / 2, n.y - 2, n.w, 4)); text(names[k], cx + r.w * spread[k] / 2 + 16, ys[k] + 3, Wt(0.9), 'left', 10, true); });
      if (p > 0.72) { const q = clamp((p - 0.72) / 0.26, 0, 1); leaves.forEach((l, i) => { if (i / nLeaf > q) return; c.fillStyle = Wt(0.9); c.fillRect(l.x - 2, leafY - 2, 4, 3); text(l.name, l.x + 3, leafY + 6, Wt(i % 4 === 0 ? 0.95 : 0.6), 'left', 8, i % 4 === 0, Math.PI / 2); }); text(names[4], r.x + r.w * 0.97 + 6, leafY + 3, Wt(0.9), 'left', 10, true); }
    };
  };

  // una fila de columnas que se abre en abanico hacia nodos sueltos
  MODES.fan = r => {
    const B = Bundle(), n = Math.round(clamp(r.w / 22, 20, 56)), y0 = r.y + r.h * 0.2, colOf = i => (i < n * 0.34 ? 'r' : i < n * 0.67 ? 'w' : 'g');
    const top = Array.from({ length: n }, (_, i) => ({ x: r.x + r.w * 0.05 + i / (n - 1) * r.w * 0.9, w: 0.2 + pareto() * 5, name: i % 3 ? SENSORS[(i * 7) % SENSORS.length] : TERMINAL(), col: colOf(i) }));
    const dn = Math.round(clamp(r.w / 120, 5, 11)), dest = Array.from({ length: dn }, (_, i) => ({ x: r.x + r.w * (0.08 + (i + rnd() * 0.6) / dn * 0.86), y: r.y + r.h * (0.42 + rnd() * 0.46), name: NODES[i % NODES.length], sq: ri(2, 7) }));
    top.forEach((t, i) => { for (let q = ri(1, 3); q > 0; q--) { const d = dest[clamp(Math.round(i / n * dn + (rnd() - 0.5) * dn * 0.9), 0, dn - 1)]; B.add(vEdge(t.x, y0 + 4, d.x + (rnd() - 0.5) * 30, d.y - 6, t.col, t.w > 2.4 ? Math.round(t.w * 3) : 1, t.w > 2.4 ? 0.14 : 0.28, i / n * 0.8 + rnd() * 0.15, 0.6)); } });
    B.sort();
    return p => {
      B.draw(p);
      top.forEach((t, i) => { if (i / n > p * 1.5) return; c.fillStyle = COL[t.col](0.95); c.fillRect(t.x - 4, y0 - 2 - t.w * 5, 8, 4 + t.w * 5); text(t.name, t.x + 3, y0 - 8 - t.w * 5, Wt(0.75), 'left', 8, false, -Math.PI / 2); });
      dest.forEach((d, i) => { if (p < 0.3 + i / dn * 0.5) return; for (let q = 0; q < d.sq; q++) { c.fillStyle = q === 0 ? R(0.95) : Wt(0.85 - q * 0.08); const s = Math.max(2, 9 - q * 1.2); c.fillRect(d.x - 12 + q * 12, d.y - s / 2, s, s); } text(d.name, d.x - 12, d.y + 18, Wt(0.95), 'left', 10, true); });
    };
  };

  // tabla de rayas y puntos (una fila por terminal, una columna por atributo) + curvas a las clases
  MODES.matrix = r => {
    const B = Bundle(), rows = Math.round(clamp(r.h * 0.78 / 9, 20, 68)), y0 = r.y + r.h * 0.16, rh = r.h * 0.78 / rows, x0 = r.x + r.w * 0.09, nd = 6, np = 11, cw = Math.min(26, r.w * 0.46 / (nd + np));
    const D = Array.from({ length: rows }, (_, i) => ({ id: String(i + 1).padStart(3, '0'), name: TERMINAL(), v: Array.from({ length: nd + np }, () => (rnd() < 0.25 ? 0 : pareto() * 0.8 + rnd() * 0.2)), cls: ri(0, 13) }));
    const xn = x0 + (nd + np) * cw + 12, xb = r.x + r.w * 0.9, cnt = new Array(14).fill(0); D.forEach(d => cnt[d.cls]++);
    let acc = y0; const slot = cnt.map(n => { const h = n / rows * (rows * rh - 14 * 4); const o = [acc, h]; acc += h + 4; return o; }), used = new Array(14).fill(0);
    D.forEach((d, i) => { const s = slot[d.cls], ty = s[0] + (used[d.cls]++ + 0.5) / cnt[d.cls] * s[1]; B.add(hEdge(xn + 96, y0 + i * rh + rh / 2, xb, ty, d.cls % 5 === 0 ? 'r' : 'w', 1, 0.42, i / rows, 0.55)); });
    B.sort();
    return p => {
      const shown = Math.floor(p * rows);
      for (let j = 0; j < nd + np; j++) text(ATTRS[j % ATTRS.length], x0 + j * cw + 4, y0 - 8, Wt(0.75), 'left', 8, false, -1.05);
      c.fillStyle = Wt(0.9); c.fillRect(x0, y0 - 5, nd * cw - 6, 2); c.fillRect(x0 + nd * cw, y0 - 5, np * cw - 6, 2); c.fillRect(xn, y0 - 5, 96, 2);
      text('base stats', x0, y0 - 46, Wt(0.9), 'left', 10, true); text('weaknesses', x0 + nd * cw, y0 - 46, Wt(0.9), 'left', 10, true); text('terminal', xn, y0 - 46, Wt(0.9), 'left', 10, true); text('class', xb + 8, y0 - 46, Wt(0.9), 'left', 10, true);
      c.fillStyle = Wt(0.88); c.beginPath();
      for (let i = 0; i < shown; i++) { const d = D[i], y = y0 + i * rh + rh / 2;
        for (let j = 0; j < nd; j++) if (d.v[j] > 0) c.rect(x0 + j * cw, y - 0.8, 2 + d.v[j] * (cw - 8), 1.6);
        for (let j = nd; j < nd + np; j++) if (d.v[j] > 0) { const rr = 0.5 + d.v[j] * Math.min(3.2, rh * 0.42); c.moveTo(x0 + j * cw + cw / 2 + rr, y); c.arc(x0 + j * cw + cw / 2, y, rr, 0, 6.283); } }
      c.fill();
      if (rh >= 7.5) for (let i = 0; i < shown; i++) { const y = y0 + i * rh + rh / 2 + 3; text(D[i].id, x0 - 8, y, Wt(0.6), 'right', 8); text(D[i].name, xn, y, Wt(0.85), 'left', 8); }
      B.draw(p);
      slot.forEach((s, k) => { if (!cnt[k] || p < 0.2) return; c.fillStyle = k % 5 === 0 ? R(0.95) : Wt(0.95); c.fillRect(xb, s[0], 3, Math.max(2, s[1])); text(CLASSES[k], xb + 8, s[0] + s[1] / 2 + 3, Wt(0.85), 'left', 8); });
    };
  };

  // anillos, radios punteados y nodos concentricos
  MODES.radial = r => {
    const cx = r.x + r.w / 2, cy = r.y + r.h * 0.53, Rm = Math.min(r.w, r.h) * 0.46, r0 = Rm * 0.2, rings = 22, n = Math.round(clamp(Rm / 6, 18, 46));
    let a = rnd() * 6.28; const S = Array.from({ length: n }, () => { a += 0.04 + (rnd() < 0.2 ? rnd() * 0.9 : rnd() * 0.14); const len = 0.45 + rnd() * 0.55; return { a, len, name: pick(NODES) + ' ' + ri(1989, 2031), col: rnd() < 0.14 ? 'r' : 'w', nodes: Array.from({ length: ri(1, 6) }, () => ({ d: 0.25 + rnd() * 0.75, s: 2 + pareto() * 9 })) }; });
    const arcs = Array.from({ length: 9 }, (_, i) => ({ a0: i / 9 * 6.283 + 0.05, a1: (i + 0.5 + rnd() * 0.4) / 9 * 6.283, w: 2 + pareto() * 12 }));
    return (p, t) => {
      c.lineWidth = 1;
      for (let i = 0; i <= rings; i++) { if (i / rings > p * 1.4) break; c.strokeStyle = i % 4 === 0 ? G(0.3) : G(0.1); c.beginPath(); c.arc(cx, cy, r0 + (Rm - r0) * i / rings, 0, 6.283); c.stroke(); if (i % 4 === 0) text((9.6 + i * 0.02).toFixed(2) + 's', cx + 3, cy - r0 - (Rm - r0) * i / rings - 2, G(0.5), 'left', 8); }
      arcs.forEach(k => { c.strokeStyle = Wt(0.8); c.lineWidth = k.w; c.beginPath(); c.arc(cx, cy, r0 * 0.72, k.a0, k.a0 + (k.a1 - k.a0) * clamp(p * 2, 0, 1)); c.stroke(); });
      c.lineWidth = 1;
      S.forEach((s, i) => {
        if (i / n > p) return; const ca = Math.cos(s.a), sa = Math.sin(s.a), re = r0 + (Rm - r0) * s.len, col = COL[s.col];
        c.setLineDash([2, 4]); c.strokeStyle = col(0.55); c.beginPath(); c.moveTo(cx + ca * r0, cy + sa * r0); c.lineTo(cx + ca * re, cy + sa * re); c.stroke(); c.setLineDash([]);
        s.nodes.forEach(q => { const rr = r0 + (re - r0) * q.d, x = cx + ca * rr, y = cy + sa * rr; c.strokeStyle = col(0.9); for (let k = q.s; k > 0.8; k -= 2.6) { c.beginPath(); c.arc(x, y, k, 0, 6.283); c.stroke(); } });
        c.fillStyle = col(0.95); c.beginPath(); c.arc(cx + ca * re, cy + sa * re, 2.5, 0, 6.283); c.fill();
        text(s.name, cx + ca * (re + 8), cy + sa * (re + 8) + 3, col(0.8), ca < 0 ? 'right' : 'left', 8);
      });
      text('SPLIT SECONDS', cx, cy - 2, Wt(0.9), 'center', 9, true); text('BEFORE ARRIVAL', cx, cy + 9, G(0.7), 'center', 8);
    };
  };

  // paneles con listas y haces de curvas entre sus filas
  MODES.topology = r => {
    const B = Bundle(), cols = Math.round(clamp(r.w / 300, 2, 4)), rowsN = Math.round(clamp(r.h / 250, 2, 3)), gx = r.w * 0.86 / cols, gy = r.h * 0.74 / rowsN, x0 = r.x + r.w * 0.05, y0 = r.y + r.h * 0.2, P = [];
    for (let j = 0; j < rowsN; j++) for (let i = 0; i < cols; i++) { const n = ri(4, Math.max(5, Math.floor((gy - 40) / 11))), w = gx * (0.34 + rnd() * 0.2); P.push({ x: x0 + i * gx + rnd() * gx * 0.2, y: y0 + j * gy + rnd() * 16, w, n, name: pick(NODES), rows: Array.from({ length: n }, () => pick(SENSORS).toLowerCase()) }); }
    const anchor = (pn, k, side) => [pn.x + (side ? pn.w : 0), pn.y + 22 + k * 11];
    const nb = Math.round(clamp(r.w / 60, 8, 20)), bots = Array.from({ length: nb }, (_, i) => ({ x: r.x + r.w * 0.06 + i / (nb - 1) * r.w * 0.84, y: r.y + r.h * 0.11 }));
    bots.forEach((b, i) => { for (let q = ri(1, 3); q > 0; q--) { const pn = pick(P.slice(0, cols)), e = anchor(pn, ri(0, pn.n - 1), 0); B.add(vEdge(b.x, b.y + 6, e[0] + pn.w / 2, pn.y, 'g', 1, 0.4, i / bots.length * 0.3, 0.6)); } });
    const E = Math.round(clamp(r.w * r.h / 5200, 50, 220));
    for (let q = 0; q < E; q++) { const a = pick(P), b = pick(P); if (a === b) continue; const s = anchor(a, ri(0, a.n - 1), 1), e = anchor(b, ri(0, b.n - 1), 0), big = rnd() < 0.05; B.add(Math.abs(s[1] - e[1]) > gy * 0.6 ? vEdge(s[0], s[1], e[0], e[1], 'g', big ? ri(10, 26) : 1, big ? 0.22 : 0.38, 0.2 + q / E * 0.8, 0.5) : hEdge(s[0], s[1], e[0], e[1], 'g', big ? ri(10, 26) : 1, big ? 0.22 : 0.38, 0.2 + q / E * 0.8, 0.9)); }
    B.sort();
    return p => {
      P.forEach((pn, i) => { if (i / P.length > p * 2) return; c.fillStyle = BG(0.92); c.fillRect(pn.x, pn.y, pn.w, 22 + pn.n * 11); c.strokeStyle = G(0.28); c.lineWidth = 1; c.strokeRect(pn.x + 0.5, pn.y + 0.5, pn.w - 1, 21 + pn.n * 11);
        text(pn.name, pn.x + 6, pn.y + 12, Wt(0.9), 'left', 8, true);
        pn.rows.forEach((s, k) => { const y = pn.y + 25 + k * 11; c.fillStyle = k % 5 === 0 ? R(0.9) : G(0.8); c.fillRect(pn.x + 5, y - 5, 3, 3); text('# ' + s, pn.x + 12, y, Wt(0.6), 'left', 8); c.fillStyle = G(0.6); c.fillRect(pn.x + pn.w - 8, y - 5, 3, 3); }); });
      B.draw(p);
      c.lineWidth = 1; bots.forEach((b, i) => { if (i / bots.length > p * 3) return; c.strokeStyle = G(0.9); c.beginPath(); c.arc(b.x, b.y, 5, 0, 6.283); c.stroke(); c.fillStyle = i % 4 === 0 ? R(0.9) : G(0.9); c.fillRect(b.x - 1.5, b.y - 1.5, 3, 3); });
      const mw = r.w * 0.1, mh = r.h * 0.16, mx = r.x + r.w - mw - 10, my = r.y + r.h - mh - 14; c.fillStyle = inv ? 'rgba(200,215,200,0.85)' : 'rgba(40,46,42,0.85)'; c.fillRect(mx, my, mw, mh);   // minimapa
      c.fillStyle = Wt(0.5); P.forEach(pn => c.fillRect(mx + (pn.x - r.x) / r.w * mw, my + (pn.y - r.y) / r.h * mh, pn.w / r.w * mw, (22 + pn.n * 11) / r.h * mh));
    };
  };

  // planos isometricos apilados: matriz de eventos, rejilla de rombos, parcelas; plomadas, relieve y piezas flotando entre planos
  MODES.isostack = r => {
    const a = Math.min(r.w * 0.36, r.h * 0.42), ox = r.x + r.w / 2, gap = (r.h * 0.84 - a) / 2, oy = l => r.y + r.h * 0.1 + l * gap, P = (u, v, l, h) => [ox + (u - v) * a, oy(l) + (u + v) * a * 0.5 - (h || 0)];
    const n = 18, grid = Array.from({ length: n * n }, () => rnd() < 0.82), ev = Array.from({ length: 13 }, () => Array.from({ length: 44 }, () => (rnd() < 0.3 ? pareto() + 0.15 : 0)));
    const hm = Array.from({ length: 14 * 14 }, (_, k) => { const i = k % 14, j = k / 14 | 0; return Math.max(0, Math.sin(i * 0.9 + 1) * Math.cos(j * 0.7) * 0.5 + pareto() * 0.9); });
    const pins = Array.from({ length: 16 }, () => ({ u: rnd(), v: rnd(), h: 0.3 + rnd() * 0.9, col: pick(['r', 'w', 'g', 'w']) })), floats = Array.from({ length: 16 }, () => ({ u: rnd(), v: rnd(), l: rnd() * 2 }));
    const quad = (l, col, u0 = 0, v0 = 0, u1 = 1, v1 = 1) => { c.strokeStyle = col; c.beginPath(); [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].forEach(([u, v], i) => { const q = P(u, v, l); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath(); c.stroke(); };
    const rh = (x, y, s) => { c.moveTo(x, y - s * 0.5); c.lineTo(x + s, y); c.lineTo(x, y + s * 0.5); c.lineTo(x - s, y); c.closePath(); };
    return p => {
      c.lineWidth = 1;
      // plano inferior: parcelas + una parcela tramada + relieve de alambre
      if (p > 0.02) { quad(2, G(0.55)); quad(2, G(0.4), 0, 0, 0.45, 0.6); quad(2, G(0.4), 0.45, 0, 1, 0.3); quad(2, G(0.4), 0, 0.6, 0.45, 1);
        c.fillStyle = G(0.6); c.beginPath(); for (let j = 0; j < 22; j++) for (let i = 0; i < 16; i++) { if ((i + j * 16) / 352 > p * 3) break; const q = P(0.02 + i / 16 * 0.42, 0.62 + j / 22 * 0.36, 2); c.rect(q[0], q[1], 1.6, 1); } c.fill();
        c.strokeStyle = Wt(0.5); c.beginPath(); const hh = a * 0.3, pp = clamp(p * 2.4, 0, 1);
        for (let j = 0; j < 14; j++) for (let i = 0; i < 14; i++) { const q = P(0.47 + i / 13 * 0.5, 0.33 + j / 13 * 0.64, 2, hm[j * 14 + i] * hh * pp); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }
        for (let i = 0; i < 14; i++) for (let j = 0; j < 14; j++) { const q = P(0.47 + i / 13 * 0.5, 0.33 + j / 13 * 0.64, 2, hm[j * 14 + i] * hh * pp); j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }
        c.stroke(); text('WASTE LOGISTICS', P(0, 1, 2)[0] - 4, P(0, 1, 2)[1] + 14, G(0.8), 'right', 9, true); }
      // plano medio: rejilla de rombos con huecos
      if (p > 0.3) { const pp = clamp((p - 0.3) / 0.3, 0, 1), s = a / n * 0.4; quad(1, G(0.6)); c.fillStyle = G(0.85); c.beginPath(); for (let k = 0; k < n * n; k++) { if (k / (n * n) > pp) break; if (!grid[k]) continue; const q = P((k % n + 0.5) / n, ((k / n | 0) + 0.5) / n, 1); rh(q[0], q[1], s); } c.fill(); text('CENSUS GRID ' + n + '×' + n, P(0, 1, 1)[0] - 4, P(0, 1, 1)[1] + 14, G(0.8), 'right', 9, true); }
      // plano superior: matriz de eventos (rayas y puntos por fila)
      if (p > 0.55) { const pp = clamp((p - 0.55) / 0.35, 0, 1); quad(0, Wt(0.7)); c.fillStyle = Wt(0.9); c.beginPath(); ev.forEach((row, j) => row.forEach((v, i) => { if (!v || i / 44 > pp) return; const q = P((i + 0.5) / 44, (j + 0.5) / 13, 0), s = 0.8 + v * 3; (i + j) % 3 ? c.rect(q[0] - s, q[1] - 0.8, s * 2, 1.6) : rh(q[0], q[1], s); })); c.fill();
        ev.forEach((row, j) => { const q = P(0, (j + 0.5) / 13, 0); text(SENSORS[j * 3 % SENSORS.length], q[0] - 6, q[1] + 2, Wt(0.6), 'right', 8); });
        for (let i = 0; i <= 4; i++) { const q = P(i / 4, 1, 0); text(String(2021 + i * 2), q[0] - 4, q[1] + 12, Wt(0.6), 'center', 8); } }
      // postes, plomadas y piezas flotando
      [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([u, v]) => { const q = P(u, v, 0), s = P(u, v, 2); c.strokeStyle = G(0.35); c.beginPath(); c.moveTo(q[0], q[1]); c.lineTo(s[0], s[1]); c.stroke(); });
      pins.forEach((k, i) => { if (i / pins.length > p * 1.3) return; const b = P(k.u, k.v, 2), tpt = P(k.u, k.v, 2, a * 1.6 * k.h * clamp(p * 1.5, 0, 1)); c.strokeStyle = COL[k.col](0.8); c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(tpt[0], tpt[1]); c.stroke(); c.fillStyle = COL[k.col](0.95); c.beginPath(); rh(tpt[0], tpt[1], 3.5); c.fill(); });
      c.fillStyle = G(0.9); c.beginPath(); floats.forEach((k, i) => { if (i / floats.length > p) return; const q = P(k.u, k.v, k.l); rh(q[0], q[1], 3); }); c.fill();
    };
  };

  // ================= bucle =================
  function resize() { W = innerWidth; H = innerHeight; DPR = Math.min(window.devicePixelRatio || 1, 1.5); cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); }
  function build() { total = 0; const top = 46; panes = (cfg.panes || [{ mode: cfg.mode || 'tracker', at: [0, 0, 1, 1] }]).map(pn => { const at = pn.at || [0, 0, 1, 1], r = { x: at[0] * W, y: top + at[1] * (H - top), w: at[2] * W, h: at[3] * (H - top) }; return { r, draw: (MODES[pn.mode] || MODES.tracker)(r), mode: pn.mode, delay: pn.delay || 0 }; }); }
  function frame() {
    if (!cfg) return; requestAnimationFrame(frame);
    const t = Math.max(0, (performance.now() - T0) / 1000), u = clamp(t / cfg.dur, 0, 1.5);
    c.setTransform(DPR, 0, 0, DPR, 0, 0); c.clearRect(0, 0, W, H);
    inv = Math.random() < 0.05 + (u > 0.85 ? 0.22 : 0);
    c.fillStyle = BG(inv ? 0.94 : (cfg.veil != null ? cfg.veil : 0.86)); c.fillRect(0, 0, W, H);
    c.textBaseline = 'alphabetic';
    panes.forEach(pn => { const p = clamp((u - pn.delay) / 0.55, 0, 1), e = 1 - Math.pow(1 - p, 2.2); c.save(); try { pn.draw(e, u); } catch (err) { if (!pn.err) { pn.err = 1; console.warn('TRANS2 ' + pn.mode, err); } } c.restore(); });
    // cabecera: de donde viene y a donde va el observador
    const p = clamp(u / 0.55, 0, 1), routed = Math.floor((1 - Math.pow(1 - p, 2.2)) * total);
    c.fillStyle = BG(0.9); c.fillRect(0, 0, W, 40);
    text((cfg.hop || 'RELAY_HOP') + ' //', 20, 17, R(0.95), 'left', 12, true); text((cfg.from || '?') + '  →  ' + (cfg.to || '?'), 150, 17, Wt(0.95), 'left', 12, true);
    text('ROUTING OBSERVER 0x' + cfg.id + ' · ' + String(routed).padStart(4, '0') + '/' + String(total).padStart(4, '0') + ' LINKS · ' + (cfg.caption || panes.map(pn => pn.mode.toUpperCase()).join(' + ')), 20, 32, G(0.75), 'left', 9);
    text('T-' + Math.max(0, cfg.dur - t).toFixed(2) + 's', W - 20, 17, Wt(0.9), 'right', 12, true); text(p < 1 ? 'TRACING' : 'LOCKED', W - 20, 32, p < 1 ? G(0.8) : R(0.95), 'right', 9, true);
    c.fillStyle = R(0.9); c.fillRect(0, 39, W * clamp(u, 0, 1), 1.5);
    // desgarros: franjas del diagrama que saltan de lugar; mas al final
    c.setTransform(1, 0, 0, 1, 0, 0);
    const tears = Math.random() < 0.25 + u * 0.5 ? 1 + Math.floor(Math.random() * (1 + u * 4)) : 0;
    for (let i = 0; i < tears; i++) { const y = Math.floor(Math.random() * cv.height), h = Math.floor(4 + Math.random() * 46 * DPR), dx = (Math.random() - 0.5) * 240 * DPR * (0.3 + u); c.drawImage(cv, 0, y, cv.width, h, dx, y, cv.width, h); }
  }
  function run(conf) {
    cfg = Object.assign({ dur: 5, id: hex(6) }, conf);
    if (new URLSearchParams(location.search).get('t2') === '0') { cfg = null; return; }
    if (!cv) { cv = document.createElement('canvas'); cv.id = 't2'; c = cv.getContext('2d'); cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9100;pointer-events:none'; (document.body || document.documentElement).appendChild(cv); addEventListener('resize', () => { resize(); build(); }); }
    resize(); build(); T0 = performance.now() + (window.top !== window ? 650 : 0);   // dentro del recorrido: el trazo espera a que pase la frase de ruptura del marco
    requestAnimationFrame(frame);
  }
  window.TRANS2 = { run, modes: Object.keys(MODES), restart() { if (cfg) { seed = (Math.random() * 1e9) | 0; build(); T0 = performance.now(); } } };
})();
