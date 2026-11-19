# Verónica Wolk — Accesorios con alma

Landing de **Verónica Wolk** (@soyvero_wolk): collares y accesorios unisex, diseños únicos que no se repiten,
con envíos a todo el país. Muestra la pieza destacada, el catálogo de collares, quién está detrás, preguntas frecuentes y los contactos
(mensaje directo de Instagram, Instagram y TikTok).

## Stack

Sitio **estático**: HTML, CSS y JavaScript plano, sin build ni dependencias. Se abre haciendo doble clic en
`index.html` y se publica en Netlify arrastrando la carpeta (o con `netlify.toml`, que publica la carpeta tal cual).

- **Mobile first:** los estilos de base son para celular; tablet (600 px) y escritorio (900 px) se agregan con `min-width`.
- **Logo:** `img/logo.svg`, redibujado en vectores sobre el logo original (`scripts/logo.py`): se ve nítido a cualquier tamaño.
- **Collar flotando:** es la foto real del collar, recortada sin la persona (`scripts/recorte_collar.py`, con OpenCV).
  Para el zoom se usa `img/collar@2x.webp` (`scripts/collar_2x.py`: limpia artefactos, amplía con Lanczos y realza bordes),
  y el acercamiento tiene un tope para no agrandar más de lo que da la foto.
  Flota a la derecha del inicio, se balancea y se inclina con el mouse. Al bajar viaja a "La pieza, de cerca": la
  sección queda fija y el collar se acerca a cada parte (cuentas, cierre, dije) mientras cambia el texto, con un
  índice al costado como el de Kalis Pizza (`js/main.js`).
- **Animaciones:** sin librerías. Un loop de `requestAnimationFrame` sigue el scroll con suavizado; `IntersectionObserver`
  para las entradas; título letra por letra; subrayados que se dibujan; línea de tiempo que se completa con el scroll.
- **Tipografías (Google Fonts):** Bodoni Moda para los títulos (combina con el logo), Barlow Condensed para etiquetas y
  botones, Barlow para el texto.
- Con "reducir movimiento" activado en el sistema, todo queda quieto y con el mismo contenido.

## Estructura

```
index.html                  página única (todas las secciones)
css/style.css               estilos (colores y tipografías de la marca en :root)
js/config.js                link de mensajes directos de Instagram y de las redes
js/main.js                  menú, animaciones y el collar flotando
js/catalogo.js              ⭐ lista de piezas del catálogo (nombre, descripción, tipo, precio, vendida)
js/catalogo-ui.js           grilla, filtros, "ver más" y vista ampliada del catálogo
img/
  collar.webp / .png        collar recortado
  collar@2x.webp            collar recortado, ampliado y realzado (el que flota y se acerca)
  collar-original.png       foto original (fuente del recorte)
  collar-puesto.webp        la foto original, para el bloque "Para ella y para él"
  logo.svg                  logo en vectores
  logo-original.png         logo original (fuente de logo.svg)
  favicon.ico, ...          íconos (la mariposa del logo)
  catalogo/                 fotos del catálogo: <id>-sm.webp (grilla), <id>.webp (grande), videos .mp4
fuentes/catalogo/           fotos y videos originales del catálogo, renombrados con el id de cada pieza
scripts/recorte_collar.py   regenera img/collar.* desde la foto original
scripts/collar_2x.py        regenera img/collar@2x.webp
scripts/logo.py             regenera img/logo.svg
scripts/catalogo.py         regenera img/catalogo/ desde fuentes/catalogo/
netlify.toml                publicación en Netlify
```

## Tareas habituales

**Consultas:** todos los botones "Consultar" abren el chat de Instagram con Vero (`instagramDM` en `js/config.js`).

**Cambiar un texto:** está directamente en `index.html`.

**Catálogo — sumar una pieza:** copiar la foto a `fuentes/catalogo/<id>.jpeg` (si tiene más fotos: `<id>-2.jpeg`, ...;
video: `<id>.mp4`), correr `python scripts/catalogo.py` y agregar una línea en `js/catalogo.js` con ese `id`.
Para ponerle precio, agregar `precio: '$25.000'`; para marcarla vendida, `vendida: true`; para sacarla, borrar la línea.
Cada pieza tiene un número (N° 01, N° 02, ...) según el orden de la lista, para que la gente lo mencione al consultar.

**Cambiar la pieza que flota:** reemplazar `img/collar-original.png`, ajustar el recorrido de las tiras en
`scripts/recorte_collar.py` y correr `python scripts/recorte_collar.py` y después `python scripts/collar_2x.py`. Si cambia mucho la forma del collar, en
`js/main.js` (`parts`) están los puntos de la foto a los que se acerca en cada paso.

## Pendiente

- La foto original del collar en alta resolución (la actual mide ~1100 px): con ella el zoom gana mucha nitidez.
- Fotos de Vero para "Sobre Vero" (y alguna pieza puesta por un hombre para el bloque unisex).
- Nombres y precios reales del catálogo: los nombres actuales son descriptivos y se cambian en `js/catalogo.js`.
- Métodos de pago y zona/fechas de ferias, si se quieren mostrar en la página.
