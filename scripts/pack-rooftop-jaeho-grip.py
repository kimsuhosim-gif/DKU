"""Pack corrected whole-character rifle club poses; no synthetic pose changes."""
from pathlib import Path
from PIL import Image
import json
ROOT=Path(__file__).resolve().parents[1]
SRC=Path('C:/Users/User/.codex/generated_images/01a1a915-04e1-7e42-9e36-b0b7881b055d')
OUT=ROOT/'output/jaeho-grip'
report={'coordinateSpace':'screen','weaponHand':'both hands adjacent at muzzle end; same order','activeWeapon':'reversed M16 club','sources':{}}
def split(name,id):
 im=Image.open(SRC/f'exec-{id}.png').convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<32 else a))
 result=[]
 for y in range(2):
  for x in range(4):
   cell=im.crop((round(x*im.width/4),round(y*im.height/2),round((x+1)*im.width/4),round((y+1)*im.height/2)));box=cell.getbbox()
   assert box and box[0]>0 and box[1]>0 and box[2]<cell.width and box[3]<cell.height,(name,x,y,box)
   result.append(cell.crop(box))
 report['sources'][name]=str(SRC/f'exec-{id}.png');return result
def normalize(frames,reference_height,target):
 scale=min(target/reference_height,234/max(i.width for i in frames),234/max(i.height for i in frames));result=[]
 for frame in frames:
  f=frame.resize((round(frame.width*scale),round(frame.height*scale)),Image.Resampling.LANCZOS);cell=Image.new('RGBA',(256,256));cell.alpha_composite(f,((256-f.width)//2,240-f.height));result.append(cell)
 return result
def pack(frames,cols,suffix):
 im=Image.new('RGBA',(cols*256,((len(frames)+cols-1)//cols)*256))
 for i,f in enumerate(frames):im.alpha_composite(f,((i%cols)*256,(i//cols)*256))
 im.save(ROOT/'public/images'/f'rooftop-jaeho-{suffix}.png')
melee=split('melee','5521cb3c-6e0f-4951-b8d7-9b7ee029c6d5');states=split('walk-states','9f300359-154b-46e4-8231-31ef67f30a28')
base=normalize([melee[0]],melee[0].height,220)[0]
walk=normalize(states[:4],states[0].height,220);poses=normalize(states[4:],states[0].height,220)
light=normalize(melee,melee[0].height,220);heavy=normalize(melee,melee[0].height,170)
pack([base,base,poses[0],poses[1],base,poses[0],poses[2],poses[3]],4,'v2');pack(walk*2+light,4,'motion-v3');pack(heavy,8,'heavy-v5')
preview=Image.new('RGB',(1024,1024),'#48616a')
for i,f in enumerate(heavy+walk+poses):preview.paste(f,((i%4)*256,(i//4)*256),f)
preview.save(OUT/'contact-sheet.jpg')
heavy[0].save(OUT/'preview.gif',save_all=True,append_images=heavy[1:],duration=[220,130,70,100,90,90,100,200],loop=0,disposal=2)
(OUT/'manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print('PASS: 8 melee and 8 locomotion/state source cells intact. Three corrected atlases packed; shooting sheet unchanged.')
