"""Pack model-drawn whole-character poses; only alpha cleanup and uniform layout."""
from PIL import Image
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
SRC=Path('C:/Users/User/.codex/generated_images/01a1a915-04e1-7e42-9e36-b0b7881b055d')
OUT=ROOT/'output/weapon-redesign';OUT.mkdir(exist_ok=True,parents=True)
SOURCES={'seongtae':('43140e3d-d6ba-4ed5-847a-cf6e96e02aa0','4d3e6c8d-fcd8-4972-98f9-5a3645e305e4',100,96),'moseongjin':('b409fdbb-7266-4fd7-b359-21b60d8ffeb8','dcc229eb-4fe3-418c-983a-fed267517bb2',110,112)}
manifest={'coordinateSpace':'screen','weaponHand':'both; screen-right shoulder owns lead hand, screen-left shoulder rear hand','renderScale':1.5,'targetHeadPixels':48.5,'frames':{ 'melee':8,'walk':4,'states':4},'sources':{}}
def split(id,head):
 im=Image.open(SRC/f'exec-{id}.png').convert('RGBA')
 # Remove only residual magenta matte and low-alpha fringe, not subject hues.
 pixels=[]
 for r,g,b,a in im.getdata():
  if a<40 or (r>g*1.6+30 and b>g*1.5+20):a=0
  pixels.append((r,g,b,a))
 im.putdata(pixels);frames=[]
 for row in range(2):
  for col in range(4):
   cell=im.crop((round(col*im.width/4),round(row*im.height/2),round((col+1)*im.width/4),round((row+1)*im.height/2)))
   box=cell.getbbox();assert box and min(box[0],box[1],cell.width-box[2],cell.height-box[3])>1,(id,row,col,box)
   f=cell.crop(box);s=48.5/head;f=f.resize((round(f.width*s),round(f.height*s)),Image.Resampling.LANCZOS)
   assert f.width<246 and f.height<235,(id,row,col,f.size)
   canvas=Image.new('RGBA',(256,256));canvas.alpha_composite(f,((256-f.width)//2,240-f.height));frames.append(canvas)
 return frames
def pack(name,frames,cols,suffix):
 im=Image.new('RGBA',(cols*256,((len(frames)+cols-1)//cols)*256))
 for i,f in enumerate(frames):im.alpha_composite(f,((i%cols)*256,(i//cols)*256))
 im.save(ROOT/f'public/images/rooftop-{name}-{suffix}.png')
for name,(attack,states,ha,hs) in SOURCES.items():
 melee=split(attack,ha);poses=split(states,hs);base=melee[0]
 pack(name,[base,base,poses[4],poses[5],base,poses[4],poses[6],poses[7]],4,'v6')
 pack(name,poses[:4]*2+melee,4,'motion-v6');pack(name,melee,8,'heavy-v6')
 contact=Image.new('RGB',(1024,1024),'#49616a')
 for i,f in enumerate(melee+poses):contact.paste(f,((i%4)*256,(i//4)*256),f)
 contact.save(OUT/f'{name}-contact.jpg')
 preview=[Image.new('RGB',(256,256),'white') for _ in melee]
 for dest,f in zip(preview,melee):dest.paste(f,(0,0),f)
 preview[0].save(OUT/f'{name}-attack.gif',save_all=True,append_images=preview[1:],duration=[170,100,90,85,75,90,100,180],loop=0)
 manifest['sources'][name]={'melee':str(SRC/f'exec-{attack}.png'),'states':str(SRC/f'exec-{states}.png'),'headPixels':[ha,hs]}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
print('PASS: 32 generated poses, safe cell boundaries, fixed 256 canvas/240 feet, shared head calibration per batch; 6 atlases.')
