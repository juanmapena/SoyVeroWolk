# Versión 2x del collar para el zoom: limpia artefactos JPEG, amplía con Lanczos y realza bordes con unsharp mask.
import numpy as np, cv2
from PIL import Image
src=np.array(Image.open('img/collar.png'))  # RGBA 719x941
rgb=cv2.cvtColor(src[...,:3],cv2.COLOR_RGB2BGR); a=src[...,3]
den=cv2.fastNlMeansDenoisingColored(rgb,None,3,3,5,15)
den=cv2.bilateralFilter(den,5,18,4)
S=2
up=cv2.resize(den,None,fx=S,fy=S,interpolation=cv2.INTER_LANCZOS4)
blur=cv2.GaussianBlur(up,(0,0),1.6)
sharp=cv2.addWeighted(up,1.7,blur,-0.7,0)
# un poco más de contraste local en el metal y los cristales (CLAHE suave sobre la luminancia)
lab=cv2.cvtColor(sharp,cv2.COLOR_BGR2LAB); l,aa,bb=cv2.split(lab)
l=cv2.createCLAHE(clipLimit=1.4,tileGridSize=(8,8)).apply(l)
sharp=cv2.cvtColor(cv2.merge([l,aa,bb]),cv2.COLOR_LAB2BGR)
A=cv2.resize(a,None,fx=S,fy=S,interpolation=cv2.INTER_CUBIC)
A=cv2.GaussianBlur(A,(0,0),0.7)
out=np.dstack([cv2.cvtColor(sharp,cv2.COLOR_BGR2RGB),A])
Image.fromarray(out,'RGBA').save('img/collar@2x.webp','WEBP',quality=92,alpha_quality=95,method=6)

