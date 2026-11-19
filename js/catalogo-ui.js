// Catálogo: grilla con filtros, "ver más" y vista ampliada (con flechas, teclado y deslizar en celular).
(() => {
  const $ = (s) => document.querySelector(s);
  const items = (window.CATALOGO || []).map((p, i) => ({ ...p, n: String(i + 1).padStart(2, '0') }));
  const cfg = window.SITE || {};
  const grid = $('#grid'), more = $('#more'), chips = [...document.querySelectorAll('#filters .chip')];
  const TIPOS = { cadenas: 'Cadenas', cuentas: 'Cuentas y piedras', cordon: 'Cordón' };
  const img = (p, k = 1, size = '') => `img/catalogo/${p.id}${k > 1 ? `-${k}` : ''}${size}.webp`;
  const step = () => (innerWidth >= 900 ? 12 : 8);

  let filtro = 'todos', visibles = step(), lista = items;

  // cantidad por filtro
  chips.forEach((c) => {
    const f = c.dataset.f;
    c.querySelector('span').textContent = f === 'todos' ? items.length : items.filter((p) => p.tipo === f).length;
  });

  function card(p, i) {
    const li = document.createElement('li');
    li.className = 'card' + (p.vendida ? ' sold' : '');
    li.style.setProperty('--i', i % step());
    li.innerHTML = `
      <button type="button" class="card-btn" aria-label="Ver ${p.nombre}">
        <span class="card-img"><img src="${img(p, 1, '-sm')}" alt="${p.nombre}: ${p.desc}" loading="lazy" width="640" height="800" />
          ${p.video ? '<span class="card-play" aria-hidden="true">▶</span>' : ''}${p.vendida ? '<span class="card-sold">Vendida</span>' : ''}</span>
        <span class="card-name">${p.nombre}</span>
        ${p.precio ? `<span class="card-meta">${p.precio}</span>` : ''}
      </button>`;
    li.querySelector('button').addEventListener('click', () => open(lista.indexOf(p)));
    return li;
  }

  function render(reset) {
    lista = filtro === 'todos' ? items : items.filter((p) => p.tipo === filtro);
    if (reset) grid.innerHTML = '';
    const from = grid.children.length;
    lista.slice(from, visibles).forEach((p, i) => grid.appendChild(card(p, from + i)));
    more.hidden = visibles >= lista.length;
    more.textContent = `Ver más piezas (${lista.length - Math.min(visibles, lista.length)})`;
  }

  chips.forEach((c) => c.addEventListener('click', () => {
    if (c.dataset.f === filtro) return;
    chips.forEach((x) => x.classList.toggle('on', x === c));
    filtro = c.dataset.f; visibles = step();
    render(true);
  }));
  more.addEventListener('click', () => { visibles += step(); render(false); });
  render(true);

  // ---------- vista ampliada ----------
  const lb = $('#lb'), stage = $('#lbStage'), dots = $('#lbDots');
  let cur = 0, foto = 1;
  const medios = (p) => {
    const m = [];
    if (!p.soloVideo) for (let k = 1; k <= (p.fotos || 1); k++) m.push({ t: 'img', src: img(p, k) });
    if (p.video) m.push({ t: 'video', src: `img/catalogo/${p.id}.mp4`, poster: `img/catalogo/${p.id}-poster.webp` });
    return m;
  };

  function show() {
    const p = lista[cur], m = medios(p), it = m[foto - 1];
    stage.innerHTML = it.t === 'img'
      ? `<img src="${it.src}" alt="${p.nombre}: ${p.desc}" />`
      : `<video src="${it.src}" poster="${it.poster}" autoplay muted loop playsinline></video>`;
    stage.firstChild.classList.add('in');
    dots.innerHTML = m.length > 1 ? m.map((x, k) => `<button type="button" class="${k + 1 === foto ? 'on' : ''}" aria-label="${x.t === 'video' ? 'Video' : `Foto ${k + 1}`}">${x.t === 'video' ? '▶' : ''}</button>`).join('') : '';
    [...dots.children].forEach((b, k) => b.addEventListener('click', () => { foto = k + 1; show(); }));
    $('#lbName').textContent = p.nombre;
    $('#lbDesc').textContent = p.desc;
    $('#lbPrice').textContent = p.vendida ? 'Vendida' : (p.precio || 'Consultá precio');
    $('#lbAsk').href = cfg.instagramDM;
    // precargar la vecina
    const nx = lista[(cur + 1) % lista.length]; if (nx && !nx.soloVideo) new Image().src = img(nx);
  }
  function open(i) {
    cur = i; foto = 1; show();
    document.documentElement.classList.add('lb-open');
    lb.showModal();
  }
  function go(d) {
    cur = (cur + d + lista.length) % lista.length; foto = 1;
    show();
  }
  $('#lbPrev').addEventListener('click', () => go(-1));
  $('#lbNext').addEventListener('click', () => go(1));
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('close', () => { document.documentElement.classList.remove('lb-open'); stage.innerHTML = ''; });
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); }); // tocar afuera cierra
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });

  // deslizar con el dedo: izquierda/derecha cambia de pieza
  let x0 = null, y0 = 0;
  const media = $('#lbMedia');
  media.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  media.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(dx < 0 ? 1 : -1);
    x0 = null;
  });
})();
