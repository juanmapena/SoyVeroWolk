# Logo de Verónica Wolk redibujado en vectores: letras a mano (medidas sobre el logo original) y la mariposa
# vectorizada desde el original como línea de grosor parejo.
import numpy as np, cv2
from PIL import Image
from skimage import measure, morphology
HAIR=1.25
fills=[]; hairs=[]
def F(d): fills.append(d)
def Hh(d): hairs.append(d)
def ring(cx,cy,rx,ry,irx,iry):  # anillo de óvalo (contraste vertical)
    return (f'M{cx-rx} {cy}a{rx} {ry} 0 1 0 {2*rx} 0a{rx} {ry} 0 1 0 {-2*rx} 0Z'
            f'M{cx-irx} {cy}a{irx} {iry} 0 1 1 {2*irx} 0a{irx} {iry} 0 1 1 {-2*irx} 0Z')
T,B=197,275.5
# V
F('M7.5 197H18.5L46.5 272L42.5 276.5Z'); Hh('M45.5 267L74.5 197.6')
# E
F(f'M78 {T}H87V{B}H78Z')
Hh('M80 197.6H123'); F('M116.5 197H124.6V213.5C122.4 208 120 203 116.5 199.2Z')
Hh('M80 274.9H123'); F('M116.5 275.5H124.6V259C122.4 264.5 120 269.5 116.5 273.3Z')
Hh('M87.5 221.5C94 224.5 99.5 227.5 104 230.5'); F('M101 229.3C106.5 230.5 111.2 234.5 111.6 241C107 238.8 103.5 235 100.6 231.2Z')
# R
F(f'M125.3 {T}H135V{B}H125.3Z')
Hh('M133 197.6H148'); Hh('M133 228.3H150')
F('M148 197a30 15.8 0 0 1 0 31.6v-1.2a19 14.6 0 0 0 0-29.2Z')
F('M149 228.2C160 236 171 253 180 269C183 274.5 187 276.2 195 276.2C188.5 262 177 242 157.5 228.2Z')
# O
F(ring(239,236.25,44,39.4,32,38.15))
# N + I
F(f'M276.5 {T}H285V{B}H276.5Z'); Hh('M284 197.6C298 199.5 311 213 317.5 229C322 241 326 258 330 271')
F(f'M324.3 {T}H332.3V{B}H324.3Z'); F(f'M334.8 {T}H342.4V{B}H334.8Z')
# C (anillo recortado a la derecha)
cring=ring(381,236.25,32,39.4,21,38.15)
F(f'<C>{cring}'); Hh('M389.5 275.4C397 274.6 403 272 407 267.5')
# A
F('M440.4 197H447.2L481.5 275.5H472.2Z')
Hh('M413.5 251.5L443.5 198.2')
Hh('M402.5 266C408 259.5 412.5 252.5 416 249.2C419.2 246.2 419.5 252 417.6 258.5C415.6 266 415.8 277.5 420.5 277.2C426 276.8 429.5 262 433.5 252.5C436.5 246 441 243 451.5 241.2')
# W
F('M505 197H514L543.5 275.5H537Z'); F('M540 197H549L576.5 269.5L571.5 273Z')
Hh('M548.5 252.5C557 231 567 205 580 198.6C589.5 194.2 598.4 200.2 598 209.5C597.4 222.5 585.5 246 575.5 268.5')
# O
F(ring(640,236.25,40,39.4,28,38.15))
# L
F(f'M681 {T}H690.2V{B}H681Z'); Hh('M689 274.9H727'); F('M720.5 275.5H728.4V259C726.2 264.5 723.8 269.5 720.5 273.3Z')
# K
F(f'M729.2 {T}H738.4V{B}H729.2Z')
F('M769 197H791.5C781 199.6 772.5 205 765.5 213.5C766.5 207 767.5 201.5 769 197Z'); Hh('M790.5 197.9C772 204.5 754.5 226 741 252.5')
Hh('M744 238.5C750 231.5 761.5 228.2 770.5 235.5')
F('M766.5 231.6C776.5 239.5 786 261 792 270.2C795 274.4 799.5 276.2 806.5 276.2C798.5 270 792.5 257.5 784.5 243.5C779.5 235.5 774 231.5 768 229.8Z')

# mariposa: línea vectorizada del original
g=np.array(Image.open('img/logo-original.png').convert('L'))
x0,y0=170,360
bx0,by0,bx1,by1=720,0,905,190
c=cv2.fastNlMeansDenoising(g[y0+by0:y0+by1,x0+bx0:x0+bx1],None,h=12,templateWindowSize=5,searchWindowSize=15)
d=np.clip((235-c.astype(np.float32))/205,0,1)
S=6
D=cv2.GaussianBlur(cv2.resize(d,None,fx=S,fy=S,interpolation=cv2.INTER_CUBIC),(0,0),S*0.5)
m=D>0.18
m=cv2.morphologyEx(m.astype(np.uint8),cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9))).astype(bool)
sk=morphology.skeletonize(m)
lab=measure.label(sk,connectivity=2); keep=np.zeros_like(sk)
for r in measure.regionprops(lab):
    if r.area>S*6: keep[lab==r.label]=1
sk=keep.astype(bool)
ys,xs=np.nonzero(sk); P=set(zip(ys.tolist(),xs.tolist()))
nb=lambda p:[(p[0]+a,p[1]+b) for a in(-1,0,1) for b in(-1,0,1) if (a or b) and (p[0]+a,p[1]+b) in P]
deg={p:len(nb(p)) for p in P}; used=set(); lines=[]
def walk(s,n):
    path=[s,n]; used.add(frozenset((s,n))); prev,cur=s,n
    while deg[cur]==2:
        nn=[q for q in nb(cur) if q!=prev and frozenset((cur,q)) not in used]
        if not nn: break
        used.add(frozenset((cur,nn[0]))); prev,cur=cur,nn[0]; path.append(cur)
    return path
for p in sorted(P):
    if deg[p]!=2:
        for q in nb(p):
            if frozenset((p,q)) not in used: lines.append(walk(p,q))
for p in sorted(P):
    for q in nb(p):
        if frozenset((p,q)) not in used: lines.append(walk(p,q))
def cr(p):
    n=len(p); out=[f'M{p[0][0]:.2f} {p[0][1]:.2f}']
    for i in range(n-1):
        p0=p[max(i-1,0)];p1,p2=p[i],p[i+1];p3=p[min(i+2,n-1)]
        c1=p1+(p2-p0)/6;c2=p2-(p3-p1)/6
        out.append(f'C{c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {p2[0]:.2f} {p2[1]:.2f}')
    return ''.join(out)
bf=[]
for l in lines:
    if len(l)<S*3: continue
    a=np.array([(x,y) for y,x in l],float)
    if len(a)>12:
        k=np.ones(17)/17; a=np.column_stack([np.convolve(np.pad(a[:,i],8,mode='edge'),k,'valid') for i in (0,1)])
    a=measure.approximate_polygon(a,tolerance=0.8)/S+[bx0,by0]
    bf.append(cr(a))

W,H=905,285
cp='<clipPath id="vw-c"><path d="M340 190H420V214H392V285H340Z"/></clipPath>'
body=[]
for f in fills:
    if f.startswith('<C>'): body.append(f'<path clip-path="url(#vw-c)" fill-rule="evenodd" d="{f[3:]}"/>')
    else: body.append(f'<path fill-rule="evenodd" d="{f}"/>')
svg=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" fill="currentColor"><defs>{cp}</defs>'
     + ''.join(body) +
     f'<path fill="none" stroke="currentColor" stroke-width="{HAIR}" stroke-linecap="round" stroke-linejoin="round" d="{"".join(hairs)}"/>'
     f'<path fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" d="{"".join(bf)}"/></svg>')
open('img/logo.svg','w').write(svg.replace('currentColor','#16323a'))
print(len(bf),'trazos mariposa',len(svg),'bytes')
