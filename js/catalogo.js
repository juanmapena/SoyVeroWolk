// Catálogo de collares. Para sumar, sacar o cambiar una pieza, editá esta lista.
//
//  id      nombre de las imágenes en img/catalogo/ (se generan con scripts/catalogo.py desde fuentes/catalogo/)
//  nombre  cómo se llama la pieza
//  desc    una línea que la describe
//  tipo    'cadenas' | 'cuentas' | 'cordon'  (los filtros de arriba de la grilla)
//  fotos   cuántas fotos tiene (id.webp, id-2.webp, ...)            — opcional, 1 por defecto
//  video   true si tiene video (id.mp4)                              — opcional
//  soloVideo true si no tiene foto, solo el video (usa id-poster.webp de portada) — opcional
//  precio  por ejemplo '$25.000'; si no está, dice "Consultá precio" — opcional
//  vendida true para mostrarla como vendida                          — opcional
window.CATALOGO = [
  { id: 'corazon-dorado', nombre: 'Corazón dorado', desc: 'Cadena de eslabones con cierre de barra y un gran corazón dorado.', tipo: 'cadenas' },
  { id: 'cristales-y-corazon', nombre: 'Cristales y corazón', desc: 'Cuentas de vidrio celestes, lilas y rosas, mosquetón y dije de corazón.', tipo: 'cuentas' },
  { id: 'mosqueton-y-aros', nombre: 'Mosquetón y aros', desc: 'Cadena plateada con mosquetón grande y aros encadenados.', tipo: 'cadenas', fotos: 2 },
  { id: 'turquesa-y-medalla', nombre: 'Turquesa y medalla', desc: 'Cuentas verde agua, cierre de barra, medalla y corazón.', tipo: 'cuentas' },
  { id: 'luna-y-mandala', nombre: 'Luna y mandala', desc: 'Gargantilla negra y cadena fina con luna y mandala.', tipo: 'cuentas' },
  { id: 'corazon-y-gota-azul', nombre: 'Corazón y gota azul', desc: 'Cadena plateada con mosquetón, corazón y gota azul.', tipo: 'cadenas' },
  { id: 'cristales-flotantes', nombre: 'Cristales flotantes', desc: 'Hilos invisibles en capas con cuentas violetas y turquesas.', tipo: 'cuentas' },
  { id: 'malla-de-aros', nombre: 'Malla de aros', desc: 'Pechera de aros plateados entrelazados con una gota.', tipo: 'cadenas' },
  { id: 'estrella-de-mar', nombre: 'Estrella de mar', desc: 'Cadena dorada con alfiler, perlas y estrella de mar turquesa.', tipo: 'cadenas' },
  { id: 'corazon-calado', nombre: 'Corazón abierto', desc: 'Doble cadena de eslabones con un corazón abierto.', tipo: 'cadenas' },
  { id: 'arbol-de-la-vida', nombre: 'Árbol de la vida', desc: 'Cuentas de colores y cadena, con mosquetón y medalla árbol de la vida.', tipo: 'cuentas' },
  { id: 'corazon-filigrana', nombre: 'Corazón filigrana', desc: 'Cordón negro con cuentas y un gran corazón calado.', tipo: 'cordon' },
  { id: 'corazon-mosqueton-dorado', nombre: 'Corazón mosquetón', desc: 'Cadena plateada con eslabones dorados grandes, mosquetón corazón y medalla.', tipo: 'cadenas', video: true },
  { id: 'eslabones-y-perlas', nombre: 'Eslabones y perlas', desc: 'Cadena de eslabones alargados con perlas.', tipo: 'cadenas' },
  { id: 'piedras-turquesa', nombre: 'Piedras turquesa', desc: 'Piedras turquesa y blancas en doble vuelta.', tipo: 'cuentas' },
  { id: 'libelula', nombre: 'Libélula', desc: 'Doble cadena con libélula, corazón y gota azul.', tipo: 'cadenas' },
  { id: 'luna-creciente', nombre: 'Luna creciente', desc: 'Cordón negro con cuentas y luna creciente.', tipo: 'cordon' },
  { id: 'esferas-y-aros', nombre: 'Esferas y aros', desc: 'Cadena gruesa con aros y esferas plateadas.', tipo: 'cadenas' },
  { id: 'verdes-y-pajaro', nombre: 'Verdes y pájaro', desc: 'Piedras verdes y doble cadena con dije de pájaro.', tipo: 'cuentas' },
  { id: 'estrella-negra', nombre: 'Estrella negra', desc: 'Cadena trenzada con estrella negra.', tipo: 'cadenas' },
  { id: 'cuentas-de-colores', nombre: 'Cuentas de colores', desc: 'Cordón con cuentas naranjas, bordó, verdes y crema.', tipo: 'cuentas' },
  { id: 'mano-de-fatima', nombre: 'Mano de Fátima', desc: 'Cadena larga con dije mano de Fátima.', tipo: 'cadenas' },
  { id: 'aros-entrelazados', nombre: 'Aros entrelazados', desc: 'Cadena de aros con un centro de aros entrelazados.', tipo: 'cadenas' },
  { id: 'cuentas-negras-flotantes', nombre: 'Cuentas negras flotantes', desc: 'Gargantilla negra y cuentas negras sobre hilo invisible.', tipo: 'cuentas' },
  { id: 'aro-y-cuentas-azules', nombre: 'Aro y cuentas azules', desc: 'Cadena plateada con cuentas azules y un aro.', tipo: 'cuentas' },
  { id: 'corazon-y-triangulo', nombre: 'Corazón y triángulo', desc: 'Cadena plateada con aro, corazón y triángulo.', tipo: 'cadenas' },
  { id: 'medallon-pintado', nombre: 'Medallón pintado', desc: 'Cordón largo con medallón de colores.', tipo: 'cordon' },
  { id: 'cordon-de-gamuza', nombre: 'Cordón de gamuza', desc: 'Gamuza marrón con cuentas de colores, para atar.', tipo: 'cordon' },
  { id: 'aros-y-pluma', nombre: 'Aros y pluma', desc: 'Cadena de aros y barras, con cordón negro y dije de pluma.', tipo: 'cordon' },
  { id: 'corazon-y-piedras-negras', nombre: 'Corazón y piedras negras', desc: 'Cuentas negras y corazón plateado, en capas.', tipo: 'cuentas' },
  { id: 'aros-dorados', nombre: 'Aros dorados', desc: 'Cadena larga de aros y eslabones en tono dorado.', tipo: 'cadenas' },
  { id: 'triple-eslabon', nombre: 'Triple eslabón', desc: 'Cadena plateada de eslabones triples.', tipo: 'cadenas', video: true, soloVideo: true },
];
