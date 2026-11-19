"""Genera las imágenes y videos del catálogo a partir de las fotos originales.

    python scripts/catalogo.py        (desde la carpeta del proyecto)

Entrada:  fuentes/catalogo/<slug>.jpeg (y <slug>-2.jpeg, ... si una pieza tiene varias fotos) y <slug>.mp4
Salida:   img/catalogo/<slug>-sm.webp   miniatura 4:5 para la grilla (640x800)
          img/catalogo/<slug>.webp      foto grande para la vista ampliada (lado mayor 1400 px como máximo)
          img/catalogo/<slug>.mp4       video liviano (H.264, sin audio) + <slug>-poster.webp
Necesita: pip install pillow numpy  (y ffmpeg para los videos)
Antes de recortar, saca los bordes lisos que traen algunas fotos (marcos de color o franjas blancas).
"""
import glob, os, re, subprocess, numpy as np
from PIL import Image, ImageOps

SRC, OUT = 'fuentes/catalogo', 'img/catalogo'
os.makedirs(OUT, exist_ok=True)
# punto de foco vertical para la miniatura (0 = arriba, 1 = abajo); por defecto el centro
FOCO = {}
# recortes manuales (izquierda, arriba, derecha, abajo en fracción de la foto) para marcos que el recorte automático no detecta
CROP = {'aros-y-pluma': (.11, .02, .89, 1)}

def trim(im, tol=14, minfrac=.9):
    a = np.asarray(im.convert('RGB')).astype(int)
    h, w, _ = a.shape
    def uniform(line, ref): return (np.abs(line - ref).max(axis=1) < tol).mean() >= minfrac
    t, b, l, r = 0, h, 0, w
    ref = a[0, w // 2]
    while t < h * .25 and uniform(a[t], ref): t += 1
    ref = a[h - 1, w // 2]
    while b > h * .75 and uniform(a[b - 1], ref): b -= 1
    ref = a[h // 2, 0]
    while l < w * .25 and uniform(a[t:b, l], ref): l += 1
    ref = a[h // 2, w - 1]
    while r > w * .75 and uniform(a[t:b, r - 1], ref): r -= 1
    # sólo recorta si el borde es de verdad un marco (al menos 6 px)
    t = t if t >= 6 else 0; l = l if l >= 6 else 0
    b = b if h - b >= 6 else h; r = r if w - r >= 6 else w
    return im.crop((l, t, r, b))

def thumb(im, slug):
    W, H = 640, 800
    fy = FOCO.get(slug, .5)
    return ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(.5, fy))

for f in sorted(glob.glob(f'{SRC}/*.jpeg')):
    slug = os.path.splitext(os.path.basename(f))[0]
    im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
    if slug in CROP:
        l, t, r, b = CROP[slug]; im = im.crop((int(l * im.width), int(t * im.height), int(r * im.width), int(b * im.height)))
    im = trim(im)
    big = im.copy(); big.thumbnail((1400, 1400), Image.LANCZOS)
    big.save(f'{OUT}/{slug}.webp', 'WEBP', quality=84, method=6)
    if not re.search(r'-\d+$', slug):  # las fotos extra (-2, -3) no necesitan miniatura
        thumb(im, slug).save(f'{OUT}/{slug}-sm.webp', 'WEBP', quality=80, method=6)
    print(slug, im.size)

for f in sorted(glob.glob(f'{SRC}/*.mp4')):
    slug = os.path.splitext(os.path.basename(f))[0]
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24',
                    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', f'{OUT}/{slug}.mp4'], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '1', '-i', f, '-frames:v', '1', f'/tmp/{slug}.png'], check=True)
    im = Image.open(f'/tmp/{slug}.png').convert('RGB')
    im.save(f'{OUT}/{slug}-poster.webp', 'WEBP', quality=82)
    thumb(im, slug).save(f'{OUT}/{slug}-sm.webp', 'WEBP', quality=80, method=6)
    print(slug, 'video')
