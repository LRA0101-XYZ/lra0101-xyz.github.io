/* DARK 2.0 — capas de instrumentos (numeralia de puntos y vectores).
   Una sola libreria dibuja, encima de cada juego, instrumentos alimentados con SUS datos reales:
   la pieza entrega una "sonda" (probe) con sus puntos en pantalla y esta libreria calcula velocidades, centroide,
   dispersion, casco, vecinos... y los dibuja en capas. El lenguaje grafico es el mismo en toda la serie
   (verde tenue = andamiaje, blanco = valores, rojo = alerta; Consolas 9 px), y cada escena elige sus capas.

   Capas (looks/): tags (etiqueta + vector por punto) · web (vecinos, casco, centroide, cotas) · alluvial (haces de curvas a una
   columna, como los diagramas de flujo de looks/transitions) · iso (planos isometricos apilados: puntos, rejilla, relieve; looks/glitch)
   · radial (anillos y radios, "split seconds") · matrix (tabla de rayas y puntos) · rulers (reglas, marcas y cursor) · field (campo de
   vectores) · scope (series en el tiempo) · readout (bitacora de vectores) · histo · frame (marco de serie) · fn (dibujo propio de la pieza)

   Uso, dentro de la pieza:
     DARK2.viz({ code: 'LENS_04', area: () => ({ x, y, w, h }), probe: () => ({ pts: [{ id, x, y, k, v, w: [X, Y, Z] }], grid, links }),
                 layers: [{ type: 'tags', max: 8 }, { type: 'iso', at: [0.02, 0.55, 0.2, 0.42] }, ...] });
   El glitch general (dark.js) llama a DARK2.glitch(ms, guion): las capas tiemblan y los numeros se vuelven glifos. */
(function () {
  if (window.DARK2) return;
  const G = a => 'rgba(0,255,85,' + a + ')', R = a => 'rgba(255,42,42,' + a + ')', Wt = a => 'rgba(232,255,232,' + a + ')';
  const COL = { g: G, r: R, w: Wt, red: R, green: G, white: Wt };
  const colOf = k => COL[k] || G;
  const FONT = '9px Consolas, "Courier New", monospace', FONT_B = 'bold 9px Consolas, "Courier New", monospace';
  const GLYPHS = '▓▒░█▄▀■□▪╳╬┼╫╪┤├┴┬≡≈∆∑Ω¤§¶ΞΨ#@%&';
  const rnd = n => Math.random() * n, pick = a => a[rnd(a.length) | 0];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = (n, w) => String(Math.abs(Math.round(n))).padStart(w || 4, '0'), sgn = n => (n < 0 ? '-' : '+');
  const f1 = n => (Math.round(n * 10) / 10).toFixed(1);
  const hex = (n = 4) => (rnd(Math.pow(16, n)) | 0).toString(16).toUpperCase().padStart(n, '0');

  let cv, c, W = 0, H = 0, DPR = 1, cfg = null, started = false, tick = 0, t0 = performance.now(), now = 0;
  let A = { x: 0, y: 0, w: 0, h: 0 };              // area util de la pieza
  let D = null;                                    // cuadro de datos ya procesado
  const mem = new Map();                           // por id: posicion previa, velocidad suavizada, estela
  const SER = {}, SER_N = 96;                      // series en el tiempo
  let mouse = { x: -1, y: -1 };
  let glitchUntil = 0, gl = false;
  let sticky = [], stickyAt = -99;

  // ---------- utilidades de dibujo ----------
  const jx = () => (gl ? (Math.random() - 0.5) * 22 : 0);
  const scr = s => { if (!gl) return s; let o = ''; for (const ch of String(s)) o += ch === ' ' || Math.random() < 0.45 ? ch : pick(GLYPHS); return o; };
  function line(x1, y1, x2, y2, col, w) { c.strokeStyle = col; c.lineWidth = w || 1; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
  function dash(x1, y1, x2, y2, col, pat) { c.setLineDash(pat || [2, 4]); line(x1, y1, x2, y2, col); c.setLineDash([]); }
  function text(s, x, y, col, align, bold) { c.font = bold ? FONT_B : FONT; c.fillStyle = col; c.textAlign = align || 'left'; c.fillText(scr(s), x + jx() * 0.3, y); }
  function arrow(x1, y1, x2, y2, col) {
    line(x1, y1, x2, y2, col); const a = Math.atan2(y2 - y1, x2 - x1), s = 5;
    c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - Math.cos(a - 0.45) * s, y2 - Math.sin(a - 0.45) * s); c.lineTo(x2 - Math.cos(a + 0.45) * s, y2 - Math.sin(a + 0.45) * s); c.closePath(); c.fillStyle = col; c.fill();
  }
  function bracket(x, y, s, col) {   // cuatro esquinas alrededor del punto
    c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); const q = s * 0.45;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => { c.moveTo(x + a * s, y + b * (s - q)); c.lineTo(x + a * s, y + b * s); c.lineTo(x + a * (s - q), y + b * s); });
    c.stroke();
  }
  function cross(x, y, s, col) { line(x - s, y, x + s, y, col); line(x, y - s, x, y + s, col); }
  function diamond(x, y, rx, ry) { c.beginPath(); c.moveTo(x, y - ry); c.lineTo(x + rx, y); c.lineTo(x, y + ry); c.lineTo(x - rx, y); c.closePath(); }
  function title(code, name, x, y, extra) {   // rotulo comun de cada instrumento
    text(code, x, y, R(0.9), 'left', true); text('// ' + name, x + 30, y, G(0.7));
    if (extra) text(extra, x + 34 + (name.length + 4) * 5, y, Wt(0.75));
  }
  const rectOf = at => ({ x: A.x + at[0] * A.w, y: A.y + at[1] * A.h, w: at[2] * A.w, h: at[3] * A.h });

  // ---------- datos: sonda -> velocidades, estelas y agregados ----------
  function hullOf(P) {
    if (P.length < 3) return P.slice();
    const p = P.slice().sort((a, b) => a.x - b.x || a.y - b.y), cr = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x), lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    lo.pop(); up.pop(); return lo.concat(up);
  }
  function process(raw) {
    const pts = (raw.pts || []).filter(p => p && isFinite(p.x) && isFinite(p.y));
    const seen = new Set();
    let sx = 0, sy = 0, sp = 0, mx = 0;
    pts.forEach((p, i) => {
      if (p.id == null) p.id = 'P' + String(i).padStart(2, '0');
      seen.add(p.id);
      let m = mem.get(p.id);
      if (!m) { m = { x: p.x, y: p.y, vx: 0, vy: 0, h: [], born: tick }; mem.set(p.id, m); }
      const ivx = p.vx != null ? p.vx : (p.x - m.x) * 30, ivy = p.vy != null ? p.vy : (p.y - m.y) * 30;   // px por segundo
      const far = Math.abs(p.x - m.x) + Math.abs(p.y - m.y) > 260;                                      // salto (teletransporte): no es velocidad
      m.vx += ((far ? 0 : ivx) - m.vx) * 0.3; m.vy += ((far ? 0 : ivy) - m.vy) * 0.3;
      m.x = p.x; m.y = p.y;
      if (tick % 2 === 0) { m.h.push({ x: p.x, y: p.y }); if (m.h.length > 16) m.h.shift(); }
      if (far) m.h.length = 0;
      p._vx = m.vx; p._vy = m.vy; p._s = Math.hypot(m.vx, m.vy); p._h = m.h; p._age = tick - m.born;
      p._a = Math.atan2(m.vy, m.vx);
      sx += p.x; sy += p.y; sp += p._s; if (p._s > mx) mx = p._s;
    });
    if (tick % 90 === 0) for (const k of mem.keys()) if (!seen.has(k)) mem.delete(k);
    const n = pts.length, cx = n ? sx / n : A.x + A.w / 2, cy = n ? sy / n : A.y + A.h / 2;
    let sd = 0, maxd = 1, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(p => { const d = Math.hypot(p.x - cx, p.y - cy); sd += d * d; if (d > maxd) maxd = d; p._d = d; p._vn = mx > 0 ? p._s / mx : 0; if (p.v == null) p.v = p._vn;
      if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x; if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y; });
    sd = n ? Math.sqrt(sd / n) : 0;
    const hull = n <= 220 ? hullOf(pts) : [];
    let area = 0; for (let i = 0; i < hull.length; i++) { const a = hull[i], b = hull[(i + 1) % hull.length]; area += a.x * b.y - b.x * a.y; }
    D = { pts, n, cx, cy, sd, maxd, spd: n ? sp / n : 0, maxs: mx, hull, area: Math.abs(area) / 2, box: n ? { x0, y0, x1, y1 } : null,
          grid: raw.grid || null, links: raw.links || null, x: raw.extra || raw.x || {}, sel: raw.sel };
    if (tick % 3 === 0) {
      const push = (k, v) => { (SER[k] || (SER[k] = [])).push(v); if (SER[k].length > SER_N) SER[k].shift(); };
      push('n', n); push('spd', D.spd); push('sig', sd); push('area', D.area / 1000);
      if (raw.series) for (const k in raw.series) push(k, raw.series[k]);
    }
  }
  // subconjunto estable de puntos para rotular (se recalcula cada 2/3 de segundo, asi las etiquetas no bailan)
  function chosen(max) {
    if (tick - stickyAt > 20) {
      stickyAt = tick;
      sticky = D.pts.slice().sort((a, b) => (b.sel ? 9 : 0) + (b.k === 'r' ? 2 : 0) + b._vn - ((a.sel ? 9 : 0) + (a.k === 'r' ? 2 : 0) + a._vn)).map(p => p.id);
    }
    const byId = new Map(D.pts.map(p => [p.id, p])), out = [];
    for (const id of sticky) { const p = byId.get(id); if (p) out.push(p); if (out.length >= max) break; }
    if (out.length < max) for (const p of D.pts) { if (out.length >= max) break; if (!out.includes(p)) out.push(p); }
    return out;
  }
  // ocupacion n x n de los puntos dentro del area (o la rejilla que entregue la pieza)
  function occupancy(n) {
    if (D.grid) { const g = D.grid, o = []; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) o.push(clamp(g.get(i / n, j / n), 0, 1)); return o; }
    const o = new Array(n * n).fill(0); let m = 1;
    D.pts.forEach(p => { const i = Math.floor((p.x - A.x) / A.w * n), j = Math.floor((p.y - A.y) / A.h * n); if (i >= 0 && j >= 0 && i < n && j < n) { const k = j * n + i; o[k]++; if (o[k] > m) m = o[k]; } });
    return o.map(v => v / m);
  }

  // ================= capas =================
  const L = {};

  // etiqueta + vector de velocidad + estela por punto
  L.tags = o => {
    const sc = o.vec || 0.3, used = [];
    chosen(o.max || 12).forEach((p, i) => {
      const x = p.x + jx(), y = p.y + jx(), col = colOf(p.k);
      const h = p._h; if (h && h.length > 2) { c.fillStyle = col(0.45); for (let j = 0; j < h.length; j++) c.fillRect(h[j].x, h[j].y, 1.4, 1.4); }
      bracket(x, y, o.size || 8, col(0.85));
      const vx = clamp(p._vx * sc, -90, 90), vy = clamp(p._vy * sc, -90, 90);
      if (Math.hypot(vx, vy) > 4) arrow(x, y, x + vx, y + vy, Wt(0.8));
      const side = p.x > A.x + A.w * 0.55 ? -1 : 1, up = i % 2 ? -1 : 1, ex = x + side * 16, ey = y + up * (14 + (i % 3) * 7), tx = ex + side * 20;
      if (used.some(u => Math.abs(u[0] - tx) < 96 && Math.abs(u[1] - ey) < 30)) return; used.push([tx, ey]);
      line(x + side * 6, y + up * 6, ex, ey, col(0.5)); line(ex, ey, tx, ey, col(0.5));
      const al = side > 0 ? 'left' : 'right', lx = tx + side * 3;
      text(p.id, lx, ey - 4, Wt(0.95), al, true);
      text(p.w ? 'X' + sgn(p.w[0]) + pad(p.w[0]) + ' Y' + sgn(p.w[1]) + pad(p.w[1]) + (p.w.length > 2 ? ' Z' + sgn(p.w[2]) + pad(p.w[2]) : '') : 'x' + pad(p.x) + ' y' + pad(p.y), lx, ey + 6, col(0.8), al);
      text('|v|' + f1(p._s) + ' θ' + pad((p._a * 180 / Math.PI + 360) % 360, 3) + '°' + (p.t ? ' ' + p.t : ''), lx, ey + 16, G(0.55), al);
    });
  };

  // vecinos mas cercanos con distancias, casco convexo, centroide con anillo de dispersion y cotas de la caja
  L.web = o => {
    const P = D.pts.slice(0, o.max || 70), n = P.length; if (n < 2) return;
    const k = o.k || 2, segs = new Map();
    for (let i = 0; i < n; i++) {
      const ds = []; for (let j = 0; j < n; j++) if (j !== i) ds.push([Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y), j]);
      ds.sort((a, b) => a[0] - b[0]);
      for (let q = 0; q < Math.min(k, ds.length); q++) { const j = ds[q][1], key = i < j ? i + ':' + j : j + ':' + i; if (!segs.has(key)) segs.set(key, [P[i], P[j], ds[q][0]]); }
    }
    c.strokeStyle = G(o.alpha || 0.2); c.lineWidth = 1; c.beginPath();
    for (const [a, b] of segs.values()) { c.moveTo(a.x + jx(), a.y + jx()); c.lineTo(b.x, b.y); }
    c.stroke();
    [...segs.values()].sort((a, b) => b[2] - a[2]).slice(0, o.labels || 6).forEach(([a, b, d]) => text(pad(d, 3), (a.x + b.x) / 2 + 3, (a.y + b.y) / 2 - 2, G(0.65)));
    if (o.hull !== false && D.hull.length > 2) {
      c.setLineDash([5, 4]); c.strokeStyle = R(0.45); c.beginPath(); D.hull.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.closePath(); c.stroke(); c.setLineDash([]);
      c.fillStyle = R(0.8); D.hull.forEach(p => c.fillRect(p.x - 1.5, p.y - 1.5, 3, 3));
      const top = D.hull.reduce((a, b) => (b.y < a.y ? b : a));
      text('HULL ' + D.hull.length + 'v  A=' + Math.round(D.area) + 'px²', top.x + 8, top.y - 8, R(0.8));
    }
    cross(D.cx, D.cy, 9, Wt(0.9));
    c.setLineDash([2, 5]); c.strokeStyle = Wt(0.35); c.beginPath(); c.arc(D.cx, D.cy, Math.max(4, D.sd), 0, 6.283); c.stroke(); c.setLineDash([]);
    text('Σ n=' + D.n + '  c(' + pad(D.cx) + ',' + pad(D.cy) + ')  σ=' + f1(D.sd), D.cx + 12, D.cy - 6, Wt(0.85));
    if (o.dims !== false && D.box) {   // cotas, como en un plano tecnico
      const b = D.box, yb = Math.min(A.y + A.h - 14, b.y1 + 16), xb = Math.min(A.x + A.w - 14, b.x1 + 16);
      line(b.x0, yb, b.x1, yb, G(0.4)); line(b.x0, yb - 4, b.x0, yb + 4, G(0.6)); line(b.x1, yb - 4, b.x1, yb + 4, G(0.6));
      text(pad(b.x1 - b.x0) + ' px', (b.x0 + b.x1) / 2, yb + 10, G(0.7), 'center');
      line(xb, b.y0, xb, b.y1, G(0.4)); line(xb - 4, b.y0, xb + 4, b.y0, G(0.6)); line(xb - 4, b.y1, xb + 4, b.y1, G(0.6));
      text(pad(b.y1 - b.y0), xb + 6, (b.y0 + b.y1) / 2, G(0.7));
    }
  };

  // haces de curvas desde cada punto hasta una columna ordenada (diagrama de flujo): side right | left | bottom | top
  L.alluvial = o => {
    const side = o.side || 'right', vert = side === 'bottom' || side === 'top';
    let P = chosen(o.max || 26).slice();
    const key = { y: p => p.y, x: p => p.x, v: p => -p._s, k: p => (p.k === 'r' ? 0 : p.k === 'w' ? 1 : 2) * 1e5 + p.y, d: p => p._d, id: p => p.id }[o.sort || (vert ? 'x' : 'y')];
    P.sort((a, b) => (key(a) > key(b) ? 1 : key(a) < key(b) ? -1 : 0));
    const n = P.length; if (!n) return;
    const a0 = (vert ? A.x : A.y) + (vert ? A.w : A.h) * (o.from != null ? o.from : 0.14), a1 = (vert ? A.x : A.y) + (vert ? A.w : A.h) * (o.to != null ? o.to : 0.86);
    const step = Math.min(o.step || 15, (a1 - a0) / Math.max(1, n - 1)), start = a0 + ((a1 - a0) - step * (n - 1)) / 2;
    const edge = side === 'right' ? A.x + A.w - (o.w || 118) : side === 'left' ? A.x + (o.w || 118) : side === 'bottom' ? A.y + A.h - (o.w || 66) : A.y + (o.w || 66);
    const dir = side === 'right' || side === 'bottom' ? 1 : -1;
    P.forEach((p, i) => {
      const s = start + i * step, sx = vert ? s : edge, sy = vert ? edge : s, col = colOf(p.k);
      c.strokeStyle = col(0.12 + 0.3 * (p.sel ? 1 : p._vn)); c.lineWidth = 0.6 + 2.4 * clamp(p.v, 0, 1);
      c.beginPath(); c.moveTo(p.x + jx(), p.y + jx());
      if (vert) { const d = (sy - p.y) * 0.6; c.bezierCurveTo(p.x, p.y + d, sx, sy - d, sx, sy); } else { const d = (sx - p.x) * 0.6; c.bezierCurveTo(p.x + d, p.y, sx - d, sy, sx, sy); }
      c.stroke();
      c.fillStyle = Wt(0.9);
      if (vert) c.fillRect(sx - step * 0.3, sy - 1, Math.max(2, step * 0.6), 2.5); else c.fillRect(sx - 1, sy - step * 0.3, 2.5, Math.max(2, step * 0.6));
      const lab = p.id + ' ' + (o.val ? o.val(p) : f1(p._s));
      if (vert) { c.save(); c.translate(sx + 3, sy + dir * 6); c.rotate(dir > 0 ? Math.PI / 2 : -Math.PI / 2); text(lab, 0, 0, col(0.8)); c.restore(); }
      else text(lab, sx + dir * 6, sy + 3, col(0.8), dir > 0 ? 'left' : 'right');
    });
    if (o.name !== false) {
      if (vert) title(o.code || 'F.01', o.name || 'FLOW', A.x + 8, edge + (dir > 0 ? -8 : 14)); else title(o.code || 'F.01', o.name || 'FLOW', dir > 0 ? edge - 30 : edge - 60, start - 12);
    }
  };

  // planos isometricos apilados: L0 puntos con sus plomadas, L1 rejilla de ocupacion, L2 relieve de densidad
  L.iso = (o, r) => {
    const n = o.n || 12, a = r.w / 2, ox = r.x + r.w / 2, gap = Math.max(20, (r.h - a - 26) / 2);
    const oy = l => r.y + 22 + l * gap, P = (u, v, l, h) => [ox + (u - v) * a + jx() * 0.4, oy(l) + (u + v) * a * 0.5 - (h || 0)];
    const occ = occupancy(n), sm = new Array(n * n).fill(0);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let s = 0, q = 0; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const ii = i + di, jj = j + dj; if (ii >= 0 && jj >= 0 && ii < n && jj < n) { s += occ[jj * n + ii]; q++; } } sm[j * n + i] = s / q; }
    const quad = (l, col) => { c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([u, v], i) => { const p = P(u, v, l); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.stroke(); };
    // L2: relieve (malla de alambre)
    const hm = a * 0.5;
    c.strokeStyle = G(0.4); c.lineWidth = 1; c.beginPath();
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const p = P((i + 0.5) / n, (j + 0.5) / n, 2, sm[j * n + i] * hm); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const p = P((i + 0.5) / n, (j + 0.5) / n, 2, sm[j * n + i] * hm); j ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }
    c.stroke(); quad(2, G(0.25));
    // L1: rejilla de ocupacion (rombos)
    const rx = a / n * 0.42, ry = rx * 0.5; let on = 0;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const v = occ[j * n + i], p = P((i + 0.5) / n, (j + 0.5) / n, 1); if (v > 0.02) { on++; c.fillStyle = v > 0.66 ? Wt(0.9) : G(0.35 + v * 0.6); diamond(p[0], p[1], rx, ry); c.fill(); } else { c.fillStyle = G(0.22); c.fillRect(p[0], p[1], 1, 1); } }
    quad(1, G(0.45));
    // L0: puntos y plomadas hasta la rejilla
    quad(0, Wt(0.5));
    D.pts.slice(0, o.max || 50).forEach(p => {
      const u = clamp((p.x - A.x) / A.w, 0, 1), v = clamp((p.y - A.y) / A.h, 0, 1), t = P(u, v, 0, 4 + p.v * a * 0.35), m = P(u, v, 0), b = P(u, v, 1), col = colOf(p.k);
      line(t[0], t[1], b[0], b[1], col(0.5));
      c.fillStyle = col(0.95); diamond(t[0], t[1], 2.6, 2.6); c.fill();
      c.fillStyle = Wt(0.5); c.fillRect(m[0] - 1, m[1] - 0.5, 2, 1);
    });
    // postes y rotulos
    [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([u, v]) => { const p = P(u, v, 0), q = P(u, v, 2); dash(p[0], p[1], q[0], q[1], G(0.3), [1, 4]); });
    for (let i = 0; i <= 4; i++) { const p = P(i / 4, 0, 0); text(String(Math.round(A.w * i / 4)), p[0] + 3, p[1] - 3, G(0.45)); }
    const lx = r.x;
    text('L0 · PTS ' + D.n, lx, oy(0) + a * 0.5 + 2, Wt(0.8)); text('L1 · GRID ' + n + '×' + n + ' ' + Math.round(on / (n * n) * 100) + '%', lx, oy(1) + a * 0.5 + 2, G(0.75)); text('L2 · FIELD σ' + f1(D.sd), lx, oy(2) + a * 0.5 + 2, G(0.6));
    title(o.code || 'I.01', o.name || 'STACK', r.x, r.y + 9);
  };

  // anillos y radios: cada punto en su angulo y su distancia al centroide; arco interior = histograma de rumbos
  L.radial = (o, r) => {
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2 + 5, Rm = Math.min(r.w, r.h) / 2 - 16, r0 = Rm * 0.24, rings = o.rings || 7;
    c.lineWidth = 1;
    for (let i = 0; i <= rings; i++) { c.strokeStyle = G(i === rings ? 0.4 : 0.14); c.beginPath(); c.arc(cx, cy, r0 + (Rm - r0) * i / rings, 0, 6.283); c.stroke(); }
    for (let i = 1; i <= rings; i += 2) text(String(Math.round(D.maxd * i / rings)), cx + 2, cy - r0 - (Rm - r0) * i / rings + 3, G(0.4));
    const P = D.pts.slice(0, o.max || 44), bins = new Array(16).fill(0);
    P.forEach((p, i) => {
      const ang = Math.atan2(p.y - D.cy, p.x - D.cx), rr = r0 + (p._d / D.maxd) * (Rm - r0), col = colOf(p.k), ca = Math.cos(ang), sa = Math.sin(ang);
      dash(cx + ca * r0, cy + sa * r0, cx + ca * rr, cy + sa * rr, col(0.35), [1, 3]);
      const x = cx + ca * rr + jx() * 0.3, y = cy + sa * rr + jx() * 0.3, rad = 1.6 + 3.4 * clamp(p.v, 0, 1);
      c.strokeStyle = col(0.9); c.beginPath(); c.arc(x, y, rad, 0, 6.283); c.stroke();
      if (p.k === 'r' || p.sel) { c.beginPath(); c.arc(x, y, rad + 2.5, 0, 6.283); c.stroke(); }
      if (i < (o.labels || 10)) text(p.id, cx + ca * (Rm + 5), cy + sa * (Rm + 5) + 3, col(0.75), ca < 0 ? 'right' : 'left');
      if (p._s > 2) bins[(Math.floor(((p._a + Math.PI) / 6.2832) * 16) + 16) % 16]++;
    });
    const mb = Math.max(1, ...bins);
    bins.forEach((b, i) => { if (!b) return; const a0 = -Math.PI + i * 6.2832 / 16; c.strokeStyle = Wt(0.75); c.lineWidth = 1 + (b / mb) * (r0 * 0.5); c.beginPath(); c.arc(cx, cy, r0 * 0.55, a0 + 0.04, a0 + 6.2832 / 16 - 0.04); c.stroke(); });
    c.lineWidth = 1;
    text(String(D.n), cx, cy + 3, Wt(0.9), 'center', true);
    title(o.code || 'R.01', o.name || 'RADIAL', r.x, r.y + 9, 'Δ→Σ');
  };

  // tabla de rayas y puntos: una fila por punto, una columna por atributo; a la derecha, curvas a las clases
  L.matrix = (o, r) => {
    const P = chosen(o.rows || 18), n = P.length; if (!n) return;
    const cols = o.cols || ['x', 'y', '|v|', 'θ', 'Δ'], rh = Math.min(11, (r.h - 40) / n), x0 = r.x + 40, cw = Math.max(16, (r.w - 40 - 26) / cols.length), y0 = r.y + 40;
    const val = { x: p => (p.x - A.x) / A.w, y: p => (p.y - A.y) / A.h, '|v|': p => p._vn, 'θ': p => (p._a + Math.PI) / 6.2832, 'Δ': p => p._d / D.maxd, v: p => p.v, age: p => clamp(p._age / 600, 0, 1) };
    cols.forEach((k, j) => { c.save(); c.translate(x0 + j * cw + 3, y0 - 8); c.rotate(-1.05); text(k, 0, 0, G(0.75)); c.restore(); line(x0 + j * cw, y0 - 5, x0 + j * cw + cw - 4, y0 - 5, Wt(0.5), 2); });
    const kinds = ['r', 'w', 'g'], cnt = { r: 0, w: 0, g: 0 }; P.forEach(p => cnt[kinds.includes(p.k) ? p.k : 'g']++);
    const xr = r.x + r.w - 4; let acc = y0; const slot = {};
    kinds.forEach(k => { const hh = cnt[k] / n * (n * rh - 6); slot[k] = [acc, hh]; if (hh > 0) { c.fillStyle = colOf(k)(0.9); c.fillRect(xr, acc, 3, hh); } acc += hh + 3; });
    const used = { r: 0, w: 0, g: 0 };
    P.forEach((p, i) => {
      const y = y0 + i * rh + rh / 2, col = colOf(p.k);
      text(p.id.slice(0, 7), r.x, y + 3, col(0.85));
      cols.forEach((k, j) => {
        const v = clamp((val[k] || val.v)(p), 0, 1), x = x0 + j * cw;
        if (j % 2 === 0) { c.fillStyle = Wt(0.85); c.fillRect(x, y - 0.8, 2 + v * (cw - 8), 1.6); }
        else { c.fillStyle = Wt(0.9); c.beginPath(); c.arc(x + cw / 2 - 2, y, 0.6 + v * 2.8, 0, 6.283); c.fill(); }
      });
      const k = kinds.includes(p.k) ? p.k : 'g', s = slot[k], ty = s[0] + (used[k]++ + 0.5) / Math.max(1, cnt[k]) * s[1], xs = x0 + cols.length * cw - 2;
      c.strokeStyle = col(0.3); c.lineWidth = 1; c.beginPath(); c.moveTo(xs, y); c.bezierCurveTo(xs + 12, y, xr - 12, ty, xr, ty); c.stroke();
    });
    title(o.code || 'M.01', o.name || 'MATRIX', r.x, r.y + 9, n + '×' + cols.length);
  };

  // reglas con marcas de cada punto, triangulos del centroide y cursor con distancia al punto mas cercano
  L.rulers = o => {
    const x0 = A.x + 4, y0 = A.y + (o.top != null ? o.top : 4), x1 = A.x + A.w - 4, y1 = A.y + A.h - 4;
    c.strokeStyle = G(0.35); c.lineWidth = 1; c.beginPath();
    for (let x = Math.ceil(x0 / 20) * 20; x < x1; x += 20) { c.moveTo(x + 0.5, y0); c.lineTo(x + 0.5, y0 + (x % 100 ? 3 : 8)); }
    for (let y = Math.ceil(y0 / 20) * 20; y < y1; y += 20) { c.moveTo(x0, y + 0.5); c.lineTo(x0 + (y % 100 ? 3 : 8), y + 0.5); }
    c.stroke();
    for (let x = Math.ceil(x0 / 100) * 100; x < x1; x += 100) text(String(x), x + 3, y0 + 16, G(0.45));
    for (let y = Math.ceil(y0 / 100) * 100; y < y1; y += 100) text(String(y), x0 + 11, y + 3, G(0.45));
    D.pts.slice(0, 120).forEach(p => { c.fillStyle = colOf(p.k)(0.8); c.fillRect(p.x, y0, 1, 6); c.fillRect(x0, p.y, 6, 1); });
    c.fillStyle = Wt(0.9); c.beginPath(); c.moveTo(D.cx, y0 + 9); c.lineTo(D.cx - 4, y0 + 15); c.lineTo(D.cx + 4, y0 + 15); c.fill();
    c.beginPath(); c.moveTo(x0 + 9, D.cy); c.lineTo(x0 + 15, D.cy - 4); c.lineTo(x0 + 15, D.cy + 4); c.fill();
    if (o.cursor !== false && mouse.x > A.x && mouse.x < A.x + A.w && mouse.y > A.y && mouse.y < A.y + A.h) {
      dash(mouse.x, A.y, mouse.x, A.y + A.h, Wt(0.22), [1, 5]); dash(A.x, mouse.y, A.x + A.w, mouse.y, Wt(0.22), [1, 5]);
      text('x' + pad(mouse.x) + ' y' + pad(mouse.y), mouse.x + 10, mouse.y - 8, Wt(0.8));
      let best = null, bd = 1e9; D.pts.forEach(p => { const d = Math.hypot(p.x - mouse.x, p.y - mouse.y); if (d < bd) { bd = d; best = p; } });
      if (best && bd < 420) { dash(mouse.x, mouse.y, best.x, best.y, R(0.6), [3, 3]); text('→ ' + best.id + ' ' + Math.round(bd) + 'px', mouse.x + 10, mouse.y + 14, R(0.85)); }
    }
  };

  // campo de vectores: el flujo de los puntos interpolado en una rejilla
  L.field = o => {
    const step = o.step || 76, P = D.pts.slice(0, 40); if (!P.length || D.maxs < 1) return;
    const sc = (step * 0.42) / Math.max(20, D.maxs);
    c.strokeStyle = G(o.alpha || 0.3); c.lineWidth = 1; c.beginPath(); let q = 0;
    for (let y = A.y + step / 2; y < A.y + A.h; y += step) for (let x = A.x + step / 2; x < A.x + A.w; x += step) {
      let wx = 0, wy = 0, ws = 0; for (const p of P) { const d = (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y), w = 1 / (d + 1600); wx += p._vx * w; wy += p._vy * w; ws += w; }
      const vx = wx / ws * sc, vy = wy / ws * sc; c.moveTo(x, y); c.lineTo(x + vx, y + vy); c.rect(x - 0.5, y - 0.5, 1, 1);
      if (o.nums !== false && (q++ % 5) === 0) text(f1(Math.hypot(wx / ws, wy / ws)), x + 4, y + 10, G(0.35));
    }
    c.stroke();
  };

  // series en el tiempo con su lectura
  const SLAB = { n: 'N PTS', spd: 'MEAN |v|', sig: 'SPREAD σ', area: 'HULL kpx²' };
  L.scope = (o, r) => {
    const S = o.series || ['n', 'spd', 'sig', 'area'], h = (r.h - 12) / S.length;
    title(o.code || 'S.01', o.name || 'SCOPE', r.x, r.y + 9);
    S.forEach((k, i) => {
      const buf = SER[k] || [], y0 = r.y + 14 + i * h, lo = Math.min(...buf, 0), hi = Math.max(...buf, 1e-6), cur = buf.length ? buf[buf.length - 1] : 0;
      text((o.labels && o.labels[k]) || SLAB[k] || k.toUpperCase(), r.x, y0 + 8, G(0.65)); text(cur >= 100 ? String(Math.round(cur)) : f1(cur), r.x + r.w, y0 + 8, Wt(0.95), 'right', true);
      dash(r.x, y0 + h - 3, r.x + r.w, y0 + h - 3, G(0.25), [1, 3]);
      c.strokeStyle = i % 2 ? Wt(0.8) : G(0.9); c.lineWidth = 1; c.beginPath();
      buf.forEach((v, j) => { const x = r.x + j / (SER_N - 1) * r.w, y = y0 + h - 3 - (v - lo) / (hi - lo || 1) * (h - 15) + jx() * 0.2; j ? c.lineTo(x, y) : c.moveTo(x, y); });
      c.stroke();
    });
  };

  // bitacora de vectores: lineas que rotan
  L.readout = (o, r) => {
    const n = o.lines || 8, P = D.pts; title(o.code || 'V.01', o.name || 'VECTORS', r.x, r.y + 9);
    if (!P.length) return; const s = Math.floor(now / 220);
    for (let i = 0; i < n; i++) {
      const p = P[(s + i) % P.length];
      text(p.id.padEnd(7).slice(0, 7) + ' p(' + pad(p.x) + ',' + pad(p.y) + ') v(' + sgn(p._vx) + pad(p._vx, 3) + ',' + sgn(p._vy) + pad(p._vy, 3) + ') θ' + pad((p._a * 180 / Math.PI + 360) % 360, 3), r.x, r.y + 22 + i * 10, i === 0 ? Wt(0.95) : colOf(p.k)(0.62 - i * 0.05));
    }
  };

  // histograma (velocidades o el valor v de la pieza)
  L.histo = (o, r) => {
    const nb = o.bins || 14, b = new Array(nb).fill(0), of = o.of === 'v' ? p => p.v : o.of === 'd' ? p => p._d / D.maxd : p => p._vn;
    D.pts.forEach(p => b[clamp(Math.floor(of(p) * nb), 0, nb - 1)]++);
    const m = Math.max(1, ...b), bw = r.w / nb, base = r.y + r.h - 10;
    title(o.code || 'H.01', o.name || 'DISTRIB', r.x, r.y + 9);
    b.forEach((v, i) => { const hh = v / m * (r.h - 28); c.fillStyle = i > nb * 0.75 ? R(0.8) : G(0.6); c.fillRect(r.x + i * bw + 1, base - hh, bw - 2, hh); if (v) text(String(v), r.x + i * bw + bw / 2, base - hh - 2, Wt(0.7), 'center'); });
    line(r.x, base + 0.5, r.x + r.w, base + 0.5, Wt(0.5));
    text('0', r.x, base + 9, G(0.5)); text(o.of === 'v' ? '1.0' : f1(D.maxs), r.x + r.w, base + 9, G(0.5), 'right');
  };

  // censo de glifos: frecuencia de cada letra del texto que la pieza lleva escrito (o.text() lo entrega)
  let glyphCache = { at: -99, f: null, n: 0, w: 0 };
  L.glyphs = (o, r) => {
    if (tick - glyphCache.at > 12) {
      const s = String(o.text() || '').toUpperCase().slice(-4000), f = new Array(26).fill(0); let n = 0;
      for (let i = 0; i < s.length; i++) { const k = s.charCodeAt(i) - 65; if (k >= 0 && k < 26) { f[k]++; n++; } }
      glyphCache = { at: tick, f, n, w: (s.match(/\S+/g) || []).length };
    }
    const f = glyphCache.f, m = Math.max(1, ...f), bw = (r.w - 2) / 26, base = r.y + r.h - 24, top = f.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 4).map(a => a[1]);
    title(o.code || 'G.01', o.name || 'GLYPH CENSUS', r.x, r.y + 9, glyphCache.n + ' CH');
    f.forEach((v, i) => {
      const h = v / m * (r.h - 48), x = r.x + i * bw, hot = top.includes(i);
      c.fillStyle = hot ? Wt(0.9) : G(0.55); c.fillRect(x + 1, base - h + jx() * 0.2, Math.max(1, bw - 2), h);
      text(String.fromCharCode(65 + i), x + bw / 2, base + 9, hot ? Wt(0.95) : G(0.6), 'center', hot);
      if (hot && v) text(String(v), x + bw / 2, base - h - 3, Wt(0.8), 'center');
    });
    line(r.x, base + 0.5, r.x + r.w, base + 0.5, Wt(0.5));
    text('WORDS ' + glyphCache.w + (o.extra ? '   ' + o.extra() : ''), r.x, base + 20, G(0.7));
  };

  // marco de serie: registro en las esquinas, codigo de la escena y leyenda de capas (el mismo en todas las piezas)
  L.frame = o => {
    const m = 10, s = 16, col = G(0.55);
    [[A.x + m, A.y + m, 1, 1], [A.x + A.w - m, A.y + m, -1, 1], [A.x + A.w - m, A.y + A.h - m, -1, -1], [A.x + m, A.y + A.h - m, 1, -1]].forEach(([x, y, a, b]) => { line(x, y, x + a * s, y, col); line(x, y, x, y + b * s, col); cross(x + a * (s + 8), y + b * (s + 8), 2.5, G(0.35)); });
    const sec = Math.floor((now - t0) / 1000), tc = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
    const y = A.y + A.h - m - 6;
    text('PANOSYS // ' + (cfg.code || 'NODE'), A.x + m + 26, y, Wt(0.8), 'left', true);
    text('N=' + String(D.n).padStart(3, '0') + '  Σ(' + pad(D.cx) + ',' + pad(D.cy) + ')  σ=' + f1(D.sd) + '  |v|=' + f1(D.spd) + '  L=' + cfg.layers.length + '  T+' + tc, A.x + m + 26, y + 11, G(0.6));
  };

  // dibujo propio de la pieza, con las mismas herramientas
  const API = { G, R, Wt, colOf, line, dash, text, arrow, bracket, cross, diamond, title, pad, sgn, f1, hex, clamp, jx, rectOf, chosen, occupancy, get glitch() { return gl; }, get mouse() { return mouse; }, get tick() { return tick; }, get now() { return now; }, SER };
  L.fn = (o, r) => o.draw(c, D, A, API, r);

  // ================= bucle =================
  function resize() {
    W = innerWidth; H = innerHeight; DPR = Math.min(window.devicePixelRatio || 1, W * H > 2600000 ? 1 : 1.5);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); c.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function frame() {
    requestAnimationFrame(frame);
    if (!cfg || (++frame.skip & 1)) return;   // ~30 cuadros por segundo
    now = performance.now(); tick++;
    gl = now < glitchUntil;
    let raw; try { raw = cfg.probe() || {}; } catch (e) { raw = {}; }
    const ar = cfg.area ? cfg.area() : null; A = ar || { x: 0, y: 0, w: W, h: H };
    process(raw);
    c.clearRect(0, 0, W, H);
    if (raw.hide) return;
    c.textBaseline = 'alphabetic'; c.lineCap = 'butt';
    cfg.layers.forEach((l, i) => {
      if (l.when && !l.when(D)) return;
      const born = l._born || (l._born = now + 500 + i * 450); if (now < born) return;
      if (now > (l._next || (l._next = now + 4000 + rnd(9000)))) { l._off = now + 50 + rnd(140); l._next = now + 3000 + rnd(11000); }   // parpadeo erratico de cada capa
      if (now < l._off || (gl && Math.random() < 0.3)) return;
      c.globalAlpha = clamp((now - born) / 500, 0, 1) * (l.alpha != null ? l.alpha : 1);
      c.save();
      const rr = l.at ? rectOf(l.at) : null;
      if (l.bg && rr) {   // respaldo oscuro para los instrumentos que van encima de imagen densa
        c.fillStyle = 'rgba(0,0,0,' + (l.bg === true ? 0.8 : l.bg) + ')'; c.fillRect(rr.x - 7, rr.y - 5, rr.w + 14, rr.h + 12);
        c.strokeStyle = G(0.28); c.lineWidth = 1; c.strokeRect(rr.x - 6.5, rr.y - 4.5, rr.w + 13, rr.h + 11);
      }
      try { L[l.type](l, rr); } catch (e) { if (!l._err) { l._err = 1; console.warn('DARK2 capa ' + l.type, e); } }
      c.restore();
    });
    c.globalAlpha = 1;
    if (gl) for (let i = 0; i < 6; i++) { c.fillStyle = pick([G(0.5), R(0.6), Wt(0.7)]); c.fillRect(rnd(W), rnd(H), 20 + rnd(260), 1 + rnd(3)); }
  }
  frame.skip = 0;
  function viz(conf) {
    cfg = conf; cfg.layers = cfg.layers || [];
    if (new URLSearchParams(location.search).get('viz') === '0') { cfg = null; return; }
    if (!cv) {
      cv = document.createElement('canvas'); cv.id = 'd2-viz'; c = cv.getContext('2d');
      cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:' + (conf.z || 60);
      (document.body || document.documentElement).appendChild(cv);
      addEventListener('resize', resize); resize();
      addEventListener('mousemove', e => { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
    }
    if (conf.z) cv.style.zIndex = conf.z;
    if (!started) { started = true; t0 = performance.now(); requestAnimationFrame(frame); }
  }
  window.DARK2 = { viz, glitch(ms) { glitchUntil = performance.now() + (ms || 600); }, get data() { return D; }, get cfg() { return cfg; }, layers: L, api: API };
})();
