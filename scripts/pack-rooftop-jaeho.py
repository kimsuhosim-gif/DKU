"""Pack generated whole-character poses. No limb synthesis or pose warping."""
from PIL import Image, ImageDraw
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('C:/Users/User/.codex/generated_images/01a1a915-04e1-7e42-9e36-b0b7881b055d')
FILES={'melee':('5fef88a9-7aa9-47d9-b94e-c46e2914d377',4,2),'walk':('c0d82f91-73ca-462a-b0f1-f8e9cf28115c',2,2),'states':('c1f1bb3b-1d59-47ee-a106-c7fa5f633afb',2,2),'shoot':('a40c6820-740d-412b-8172-982d5ff6c8d6',2,2)}
report={}
def split(key):
 id,cols,rows=FILES[key];im=Image.open(SOURCE/f'exec-{id}.png').convert('RGBA')
 if key=='walk':
  pixels=list(im.getdata());im.putdata([(r,g,b,0 if r>g*1.35 and b>g*1.35 and r>100 and b>100 else a) for r,g,b,a in pixels])
 frames=[];boxes=[]
 for y in range(rows):
  for x in range(cols):
   cell=im.crop((round(x*im.width/cols),round(y*im.height/rows),round((x+1)*im.width/cols),round((y+1)*im.height/rows)))
   box=cell.getchannel('A').point(lambda a:255 if a>32 else 0).getbbox();assert box,key
   boxes.append(box);frames.append(cell.crop(box))
 report[key]={'source':str(SOURCE/f'exec-{id}.png'),'boxes':boxes}
 return frames
def normalize(frames,height):
 scale=min(height/max(im.height for im in frames),238/max(im.width for im in frames));out=[]
 for im in frames:
  im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
  cell=Image.new('RGBA',(256,256));cell.alpha_composite(im,((256-im.width)//2,240-im.height));out.append(cell)
 return out
def sheet(frames,cols,name):
 out=Image.new('RGBA',(cols*256,((len(frames)+cols-1)//cols)*256))
 for i,im in enumerate(frames):out.alpha_composite(im,((i%cols)*256,(i//cols)*256))
 path=ROOT/'public/images'/f'rooftop-jaeho-{name}.png';out.save(path)
 return out
melee=split('melee');walk=normalize(split('walk'),220);states=normalize(split('states'),220)
base=Image.open(ROOT/'output/jaeho/baseline.png').convert('RGBA');base=normalize([base.crop(base.getbbox())],220)[0]
sheet([base,base,states[0],states[1],base,states[0],states[2],states[3]],4,'v2')
sheet(walk*2+normalize(melee,220),4,'motion-v3')
heavy=sheet(normalize(melee,170),8,'heavy-v5')
shoot=sheet(normalize(split('shoot'),170),4,'shoot-v1')
preview=Image.new('RGB',(1024,1024),'#48616a')
for row,frames in enumerate([normalize(melee,170)[:4],normalize(melee,170)[4:],normalize(split('shoot'),170),walk]):
 for col,frame in enumerate(frames):preview.paste(frame,(col*256,row*256),frame)
preview.save(ROOT/'output/jaeho/contact-sheet.jpg')
(ROOT/'output/jaeho/asset-manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
