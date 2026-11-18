/* PANOSYS — capa CRT comun + HUD de serie.
   ?hud=1 muestra el HUD, ?crt=0 desactiva la capa CRT inyectada.
   No toca el audio de la pieza: sale directo al browser de TD. */
(function () {
  var q = new URLSearchParams(location.search);

  function hasLayer(sel) { return !!document.querySelector(sel); }
  function pseudoBg(p) {
    var s = getComputedStyle(document.body, p);
    return s.content !== 'none' && s.backgroundImage !== 'none';
  }

  function crt() {
    if (q.get('crt') === '0') return;
    var needScan = !hasLayer('#sl, #scanlines') && !pseudoBg('::before') && !pseudoBg('::after');
    var needVig = !hasLayer('#vg, #vignette');
    if (!needScan && !needVig) return;
    var d = document.createElement('div');
    d.id = 'psys-crt';
    d.innerHTML = (needScan ? '<div class="scan"></div>' : '') + (needVig ? '<div class="vig"></div>' : '');
    document.body.appendChild(d);
  }

  function hud() {
    if (q.get('hud') !== '1') return;  // apagado por defecto: se encima con la UI de algunas piezas
    var name = document.title.replace(/^PANOSYS\s*\/\/\s*/, '');
    var h = document.createElement('div');
    h.id = 'psys-hud';
    h.innerHTML = 'PANOSYS // ' + name + ' &nbsp;<span class="rec">&#9679;</span> <span class="tc">00:00:00</span>';
    document.body.appendChild(h);
    var tc = h.querySelector('.tc'), t0 = Date.now();
    setInterval(function () {
      var s = Math.floor((Date.now() - t0) / 1000);
      tc.textContent = [s / 3600, (s / 60) % 60, s % 60].map(function (v) { return ('0' + Math.floor(v)).slice(-2); }).join(':');
    }, 1000);
  }

  function init() { crt(); hud(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
