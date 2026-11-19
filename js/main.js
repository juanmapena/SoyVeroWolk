// Verónica Wolk — animaciones de la landing, sin librerías.
// - El collar real (img/collar@2x.webp, recortado de la foto original) flota a la derecha del inicio, se inclina con el
//   mouse y, al bajar, viaja a la sección "La pieza, de cerca", donde la sección queda fija y el collar se acerca a cada
//   parte (cuentas, cierre, dije) mientras cambia el texto (como las porciones de Kalis).
// - Un loop de requestAnimationFrame sigue el scroll con suavizado; IntersectionObserver para las entradas.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const cfg = window.SITE || {};

  // ---- links: consultas por mensaje directo de Instagram, y redes (js/config.js) ----
  $$('[data-dm]').forEach((a) => { a.href = cfg.instagramDM; });
  $('#igLink').href = cfg.instagram; $('#ttLink').href = cfg.tiktok;
  $('#year').textContent = new Date().getFullYear();

  // ---- título del inicio, letra por letra ----
  const title = $('#title');
  title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
  let n = 0;
  const split = (node) => [...node.childNodes].map((c) => {
    if (c.nodeType === 3) return c.textContent.split(/(\s+)/).map((w) => /^\s+$/.test(w) || !w ? w : `<span class="w" aria-hidden="true">${[...w].map((ch) => `<span class="char" style="--i:${n++}">${ch}</span>`).join('')}</span>`).join('');
    return `<${c.tagName.toLowerCase()}>${split(c)}</${c.tagName.toLowerCase()}>`;
  }).join('');
  title.innerHTML = split(title);

  // ---- menú en celular ----
  const nav = $('#nav'), burger = $('#burger');
  const setMenu = (open) => { root.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', String(open)); };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  $('#menu').addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  // ---- aparición al entrar en pantalla ----
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .swash:not(.hero .swash)').forEach((el) => io.observe(el));

  // ---- "La pieza, de cerca": paso activo según el scroll ----
  const feature = $('#pieza'), steps = $$('.step'), idx = $$('#stepIndex li'), bar = $('#featureBar');
  let current = 0;
  const featureRange = () => { const top = feature.getBoundingClientRect().top + scrollY; return [top, top + feature.offsetHeight - innerHeight]; };
  const setStep = (k) => {
    if (k === current) return;
    steps.forEach((s, i) => { s.classList.toggle('on', i === k); s.classList.toggle('out', i < k); });
    idx.forEach((l, i) => l.classList.toggle('on', i === k));
    current = k;
  };
  idx.forEach((li, i) => li.addEventListener('click', () => {
    const [a, b] = featureRange();
    scrollTo({ top: a + (b - a) * (i / steps.length + 0.12), behavior: 'smooth' });
  }));

  // ---- efectos de página: barra, línea de "Sobre Vero", paso activo ----
  const timeline = $('#timeline'), tSteps = [...timeline.children];
  let lastY = scrollY;
  function pageFx() {
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle('solid', y > 40);
    nav.classList.toggle('hide', y > lastY + 4 && y > vh * 0.8 && !root.classList.contains('menu-open'));
    if (y < lastY - 4) nav.classList.remove('hide');
    lastY = y;
    const tr = timeline.getBoundingClientRect(), p = clamp((vh * 0.8 - tr.top) / (tr.height + vh * 0.1));
    timeline.style.setProperty('--p', p.toFixed(4));
    tSteps.forEach((s, i) => s.classList.toggle('on', p >= (i + 0.15) / tSteps.length));
    const [a, b] = featureRange(), fp = clamp((y - a) / (b - a));
    bar.style.setProperty('--fp', fp.toFixed(4));
    if (!root.classList.contains('static')) setStep(Math.min(steps.length - 1, Math.floor(fp * steps.length * 0.999)));
  }

  // ---- reducir movimiento: página quieta ----
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('static', 'ready');
    steps.forEach((s) => s.classList.add('on'));
    addEventListener('scroll', pageFx, { passive: true }); pageFx();
    return;
  }

  // ---- el collar flotando ----
  const img = $('#floater'), shadow = $('#floaterShadow'), slot = $('#heroSlot');
  const ratio = () => (img.naturalWidth || 1438) / (img.naturalHeight || 1882);
  // el detalle real de la foto: el recorte original mide 941 px de alto (img/collar@2x.webp es esa foto ampliada y
  // realzada). El acercamiento nunca agranda más de 1.3 veces ese detalle, para que no se vea borroso.
  const DETAIL_H = 941, MAX_UPSCALE = 1.3;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { mouse.tx = e.clientX / innerWidth - 0.5; mouse.ty = e.clientY / innerHeight - 0.5; } });

  // Pose: s = scroll (px); x, y = punto de la pantalla (fracción); h = alto (fracción del alto de pantalla);
  // fx, fy = qué punto del collar va en (x, y) (fracción de la imagen); z = acercamiento; rot = giro; sh = sombra.
  let K = [], leave = 0;
  function layout() {
    const vh = innerHeight, mobile = innerWidth < 900;
    const [a, b] = featureRange(), L = b - a;
    const H = Math.min(0.8, (innerWidth * 0.38) / (vh * ratio()));
    const HF = mobile ? 0.46 : H * 0.92; // alto base en la sección de la pieza
    const zMax = Math.max(1, (DETAIL_H * MAX_UPSCALE) / (HF * vh));
    const at = (k, t) => a + L * (k / 4 + t);
    const fx = mobile ? 0.5 : 0.62, fy = mobile ? 0.29 : 0.52;
    const parts = [
      { fx: 0.5, fy: 0.5, z: 1, rot: 2 },     // la pieza completa
      { fx: 0.14, fy: 0.42, z: 1.7, rot: -4 }, // cuentas (tira izquierda)
      { fx: 0.58, fy: 0.83, z: 1.9, rot: 3 },  // mosquetón
      { fx: 0.57, fy: 0.94, z: 2.1, rot: 0 },  // dije corazón
    ].map((p) => ({ ...p, z: Math.min(p.z, zMax) }));
    if (mobile) {
      // celular: el collar ocupa el hueco entre el párrafo y los botones (#heroSlot) y sube con la página
      // (tramo lineal) hasta que ese hueco llega al 42% de la pantalla; de ahí viaja a la sección de la pieza.
      const r = slot.getBoundingClientRect(), cy = r.top + scrollY + r.height / 2, hs = (r.height * 0.96) / vh;
      const s1 = Math.max(0, cy - vh * 0.42);
      K = [
        { s: 0, x: 0.5, y: cy / vh, h: hs, fx: 0.5, fy: 0.5, z: 1, rot: 0, sh: 0, lin: true },
        { s: s1, x: 0.5, y: (cy - s1) / vh, h: hs, fx: 0.5, fy: 0.5, z: 1, rot: 0, sh: 0 },
      ];
    } else {
      K = [
        { s: 0, x: 0.73, y: 0.53, h: H, fx: 0.5, fy: 0.5, z: 1, rot: -4, sh: 1 },
        { s: a * 0.45, x: 0.7, y: 0.5, h: H, fx: 0.5, fy: 0.5, z: 1.02, rot: 3, sh: 0.6 },
      ];
    }
    parts.forEach((p, k) => {
      const pose = { x: fx, y: fy, h: HF, fx: p.fx, fy: p.fy, z: p.z, rot: p.rot, sh: 0 };
      K.push({ ...pose, s: at(k, k === 0 ? 0 : 0.05) }, { ...pose, s: at(k, 0.2) });
    });
    leave = b;
  }

  function pose(s) {
    let i = 0;
    while (i < K.length - 2 && s > K[i + 1].s) i++;
    const A = K[i], B = K[i + 1], u = clamp((s - A.s) / (B.s - A.s || 1)), t = A.lin ? u : smooth(u);
    const o = {};
    for (const k of ['x', 'y', 'h', 'fx', 'fy', 'z', 'rot', 'sh']) o[k] = lerp(A[k], B[k], t);
    o.hop = i === 1 && innerWidth >= 900 ? Math.sin(Math.PI * t) : 0; // al pasar del inicio a la sección, "salta" un poco
    return o;
  }

  function render(s, time) {
    const vw = innerWidth, vh = innerHeight, p = pose(s);
    const away = Math.max(0, s - leave); // al terminar la sección, se va con la página
    mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
    const bob = (Math.sin(time * 1.1) * 0.5 + 0.5) * 10 * (1 / p.z);
    const swing = Math.sin(time * 0.7) * 1.2; // se balancea apenas, como colgando
    const H = p.h * vh * p.z, W = H * ratio();
    const X = p.x * vw, Y = p.y * vh - away - bob - p.hop * vh * 0.05;
    img.style.width = `${W}px`;
    img.style.transform = `translate(${X}px, ${Y}px) perspective(1100px) rotateY(${mouse.x * 12}deg) rotateX(${mouse.y * -8}deg) rotate(${p.rot + swing}deg) translate(${-p.fx * W}px, ${-p.fy * H}px)`;
    // sombra debajo (solo cuando se ve entero)
    const sw = W * 0.7, lift = bob + p.hop * vh * 0.05;
    shadow.style.width = `${sw}px`;
    shadow.style.transform = `translate(${X - sw / 2}px, ${Y + (1 - p.fy) * H + 18 + lift}px) scale(${1 - lift / (vh * 0.3)})`;
    shadow.style.opacity = String(p.sh * Math.max(0, 0.85 - lift / 60));
    return away < vh * 1.3;
  }

  layout();
  addEventListener('resize', layout); addEventListener('load', layout);
  document.fonts?.ready.then(layout);
  const go = () => root.classList.add('ready');
  img.decode().catch(() => {}).then(() => { layout(); setTimeout(go, 500); });
  setTimeout(go, 4000); // por si la imagen tarda: no dejar la página tapada

  const follow = new URLSearchParams(location.search).has('instant') ? 1 : 0.12;
  let s = scrollY;
  const tick = (ms) => {
    requestAnimationFrame(tick);
    pageFx();
    s += (scrollY - s) * follow;
    if (Math.abs(scrollY - s) < 0.5) s = scrollY;
    const visible = render(s, ms / 1000);
    img.style.visibility = shadow.style.visibility = visible ? 'visible' : 'hidden';
  };
  requestAnimationFrame(tick);
})();
