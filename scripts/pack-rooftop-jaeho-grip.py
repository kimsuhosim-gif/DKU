"""Pack corrected whole-character rifle club poses; no synthetic pose changes."""
from pathlib import Path
from PIL import Image
import json
ROOT=Path(__file__).resolve().parents[1]
SRC=Path('C:/Users/User/.codex/generated_images/01a1a915-04e1-7e42-9e36-b0b7881b055d')
OUT=ROOT/'output/jaeho-grip'
report={'coordinateSpace':'screen','weaponHand':'both hands adjacent at muzzle end; same order','activeWeapon':'reversed M16 club','sources':{}}
def split(name,id,cols=4):
 im=Image.open(SRC/f'exec-{id}.png').convert('RGBA');im.putalpha(im.getchannel('A').point(lambda a:0 if a<32 else a))
 result=[]
 for y in range(2):
  for x in range(cols):
   cell=im.crop((round(x*im.width/cols),round(y*im.height/2),round((x+1)*im.width/cols),round((y+1)*im.height/2)));box=cell.getbbox()
   assert box and box[0]>0 and box[1]>0 and box[2]<cell.width and box[3]<cell.height,(name,x,y,box)
   result.append(cell.crop(box))
 report['sources'][name]=str(SRC/f'exec-{id}.png');return result
# Calibrate ONE uniform scale per source batch using cap-to-chin landmarks,
# never the weapon/pose bounding box. All gameplay sheets use the same 1.5 canvas scale.
HEAD_PIXELS={'melee':85,'walk-states':90,'shoot':145}
REFERENCE_HEAD=150/293*85
report['scaleContract']={'renderScale':1.5,'targetHeadPixels':REFERENCE_HEAD,'sourceHeadPixels':HEAD_PIXELS,'anchor':240/256}
def normalize(frames,batch):
 scale=REFERENCE_HEAD/HEAD_PIXELS[batch];result=[]
 for frame in frames:
  f=frame.resize((round(frame.width*scale),round(frame.height*scale)),Image.Resampling.LANCZOS)
  assert f.width<246 and f.height<236,('Enlarge canvas, never shrink body to fit',batch,f.size)
  cell=Image.new('RGBA',(256,256));cell.alpha_composite(f,((256-f.width)//2,240-f.height));result.append(cell)
 return result
def pack(frames,cols,suffix):
 im=Image.new('RGBA',(cols*256,((len(frames)+cols-1)//cols)*256))
 for i,f in enumerate(frames):im.alpha_composite(f,((i%cols)*256,(i//cols)*256))
 im.save(ROOT/'public/images'/f'rooftop-jaeho-{suffix}.png')
melee=split('melee','5521cb3c-6e0f-4951-b8d7-9b7ee029c6d5');states=split('walk-states','9f300359-154b-46e4-8231-31ef67f30a28')
heavy=normalize(melee,'melee');light=heavy;base=heavy[0]
all_states=normalize(states,'walk-states');walk=all_states[:4];poses=all_states[4:]
shoot=normalize(split('shoot','a40c6820-740d-412b-8172-982d5ff6c8d6',2),'shoot')
pack([base,base,poses[0],poses[1],base,poses[0],poses[2],poses[3]],4,'v2');pack(walk*2+light,4,'motion-v3');pack(heavy,8,'heavy-v5');pack(shoot,4,'shoot-v1')
preview=Image.new('RGB',(1024,1024),'#48616a')
for i,f in enumerate(heavy+walk+poses):preview.paste(f,((i%4)*256,(i//4)*256),f)
preview.save(OUT/'contact-sheet.jpg')
heavy[0].save(OUT/'preview.gif',save_all=True,append_images=heavy[1:],duration=[220,130,70,100,90,90,100,200],loop=0,disposal=2)
(OUT/'manifest.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print('PASS: 8 melee and 8 locomotion/state source cells intact. Four atlases share one body scale; no per-pose fitting.')
