"""Non-creative cleanup/packing of image_gen key poses. No synthesized poses."""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np
import json

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/rooftop-motion-v4'
OUT=ROOT/'output/combat-v4/review'
OUT.mkdir(parents=True,exist_ok=True)
names=['hyomin','jaeyeop','seongtae','manjong','yeonseong','moseongjin']
orders=[[1,2,3,0],[0,1,2,3],[0,1,2,3],[0,2,1,3],[0,1,2,3],[0,1,2,3]]

def clean(im,white=False):
 a=np.array(im.convert('RGBA')); rgb=a[:,:,:3].astype(int)
 a[:,:,3][a[:,:,3]<20]=0
 if white:
  # Flood only connected light background; enclosed white hats/shoes are preserved.
  candidate=((rgb.min(2)>186)&((rgb.max(2)-rgb.min(2))<40))|((rgb[:,:,0]>200)&(rgb[:,:,2]>190)&(rgb[:,:,1]<170))|(a[:,:,3]<20)
  mask=Image.fromarray((candidate*255).astype('uint8')).copy()
  w,h=im.size
  for x,y in [(x,y) for x in [0,24,40,w-41,w-25,w-1] for y in [0,24,40,h-41,h-25,h-1]]:
   if mask.getpixel((x,y))==255:ImageDraw.floodfill(mask,(x,y),128)
  a[:,:,3][np.array(mask)==128]=0
 # Drop only detached tiny fragments, not connected character pixels.
 alpha=Image.fromarray((a[:,:,3]>32).astype('uint8')*255)
 # Transparent gutters and outside border are guaranteed by source-cell margins.
 a[a[:,:,3]==0,:3]=0
 return Image.fromarray(a)

summary=[]
for name,order in zip(names,orders):
 source=Image.open(SRC/f'{name}-keys.png').convert('RGBA'); w,h=source.size
 cells=[]
 for i in range(4):
  cell=source.crop((i%2*w//2,i//2*h//2,(i%2+1)*w//2,(i//2+1)*h//2))
  # Remove the source sheet's empty border, never touching the sprite itself.
  arr=np.array(cell);arr[:18,:,3]=0;arr[-18:,:,3]=0;arr[:,:18,3]=0;arr[:,-18:,3]=0
  cell=clean(Image.fromarray(arr),name in ['yeonseong','moseongjin'])
  cells.append(cell)
 factor=.72
 bottoms=[c.getbbox()[3] for c in cells]
 dy=480-round(max(bottoms)*factor)
 frames=[]
 for cell in cells:
  frame=Image.new('RGBA',(512,512));scaled=cell.resize((round(cell.width*factor),round(cell.height*factor)),Image.Resampling.LANCZOS)
  frame.alpha_composite(scaled,((512-scaled.width)//2,dy));frames.append(frame)
 sheet=Image.new('RGBA',(2048,512));preview=[]
 for n,i in enumerate(order):
  sheet.alpha_composite(frames[i],(n*512,0));frames[i].save(OUT/f'{name}-key-{n}.png')
  bg=Image.new('RGBA',(512,512),'white');bg.alpha_composite(frames[i]);preview.append(bg.convert('RGB'))
 sheet.save(ROOT/f'public/images/rooftop-{name}-heavy-v4.png',optimize=True)
 preview[0].save(OUT/f'{name}-keyposes.gif',save_all=True,append_images=preview[1:],duration=[280,120,130,160],loop=0)
 board=Image.new('RGB',(1024,1024),'#e8edf0')
 for i,fr in enumerate(frames):board.paste(fr,(i%2*512,i//2*512),fr)
 board.save(OUT/f'{name}-contact.png')
 summary.append({'id':name,'sourceOrder':order,'scale':factor,'translationY':dy,'bounds':[f.getbbox() for f in frames],'frameCount':4,'kind':'generated-key-poses-not-14-frame-interpolation','coordinateSpace':'screen-space','activeShoulder':'screen-left','previewBackground':'#FFFFFF'})
 # Existing near-transparent noise is invisible at gameplay size but unnecessary.
 if name!='seongtae':continue
 oldpath=ROOT/f'public/images/rooftop-{name}-motion-v3.png'
 old=Image.open(oldpath).convert('RGBA');a=np.array(old);a[:,:,3][a[:,:,3]<20]=0;a[a[:,:,3]==0,:3]=0;Image.fromarray(a).save(ROOT/f'public/images/rooftop-{name}-motion-v4.png',optimize=True)
(OUT/'manifest.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(summary,ensure_ascii=False))
