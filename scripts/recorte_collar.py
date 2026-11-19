"""Recorta el collar de la foto original (sin la persona) para usarlo flotando en la página.

    python scripts/recorte_collar.py     (desde la carpeta del proyecto)

Necesita: pip install opencv-python numpy pillow
Cómo funciona: separa la piel por color (tono anaranjado y saturado) y se queda con todo lo que NO es piel dentro de una
franja que sigue las dos tiras del collar, más el broche y el dije. Las puntas de arriba se desvanecen (ahí el collar
sigue por detrás del cuello). Al metal se le saca parte del reflejo anaranjado de la piel. Nada es generado: son los
píxeles de la foto real. Si cambia la foto, hay que ajustar las líneas Lc/Rc (recorrido de cada tira) y el polígono C.
"""
import cv2,numpy as np
from PIL import Image
im=cv2.imread('img/collar-original.png'); h,w=im.shape[:2]
hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV).astype(int)
H,S,V=hsv[...,0],hsv[...,1],hsv[...,2]
skin=(H<=19)&(S>=88)&(V<235)
roi=np.zeros((h,w),np.uint8)
L=np.array([[188,95],[240,95],[480,745],[470,775],[430,770],[180,200]])
R=np.array([[812,40],[862,40],[868,120],[725,775],[690,770],[700,600]])
C=np.array([[430,735],[740,735],[740,800],[640,880],[640,1000],[540,1000],[540,880],[430,800]])
Lc=np.array([[205,85],[212,200],[240,300],[272,385],[312,480],[352,560],[400,650],[440,720],[465,765]])
Rc=np.array([[838,45],[858,140],[860,210],[846,300],[830,400],[802,500],[772,580],[742,650],[703,745]])
cv2.polylines(roi,[Lc,Rc],False,255,52)
cv2.fillPoly(roi,[C],255)
fg=((~skin)&(roi>0)).astype(np.uint8)*255
fg=cv2.morphologyEx(fg,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(3,3)))
fg=cv2.morphologyEx(fg,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
n,lab,st,_=cv2.connectedComponentsWithStats(fg)
keep=np.zeros_like(fg)
for i in range(1,n):
    if st[i,cv2.CC_STAT_AREA]>500: keep[lab==i]=255
fg=keep
# rellenar agujeros (cuentas transparentes que dejan ver la piel)
inv=cv2.bitwise_not(fg); n,lab,st,_=cv2.connectedComponentsWithStats(inv)
for i in range(1,n):
    if st[i,cv2.CC_STAT_AREA]<250: fg[lab==i]=255
fg=cv2.erode(fg,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(3,3)))
alpha=cv2.GaussianBlur(fg,(0,0),0.8).astype(float)
ys=np.arange(h)[:,None]
xs_=np.arange(w)[None,:]
start=np.where(xs_<500,112,62)
alpha=(alpha*np.clip((ys-start)/150,0,1)).astype(np.uint8)
# reflejo de la piel sobre el metal: quitar parte del tono anaranjado en zonas plateadas (poca saturación)
hs=cv2.cvtColor(im,cv2.COLOR_BGR2HSV)
metal=(hs[...,0]<=22)&(fg>0)
hs2=hs.copy(); hs2[...,1]=np.where(metal,(hs[...,1]*0.35).astype(np.uint8),hs[...,1])
im2=cv2.cvtColor(hs2,cv2.COLOR_HSV2BGR)
rgb=cv2.cvtColor(im2,cv2.COLOR_BGR2RGB)
yy,xx=np.where(alpha>8); m=14
x0,x1,y0,y1=max(0,xx.min()-m),min(w,xx.max()+m),max(0,yy.min()-m),min(h,yy.max()+m)
rgba=np.dstack([rgb,alpha])[y0:y1,x0:x1]
out=Image.fromarray(rgba,'RGBA'); out.save('img/collar.png')
out.save('img/collar.webp','WEBP',quality=90,alpha_quality=95,method=6)
print(out.size)
