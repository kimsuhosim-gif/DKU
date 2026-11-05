"""Pack AI-drawn whole actors. No procedural drawing or generated in-betweens."""
from pathlib import Path
from PIL import Image
import json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('C:/Users/User/.codex/generated_images/01a1a915-04e1-7e42-9e36-b0b7881b055d')
OUT=ROOT/'output/awakening-design'
SOURCES={
 'hyomin':('397545d6-6157-4a03-beb3-00516b11b25c',84),
 'jaeyeop':('043ba4ca-6d9a-497a-a0b1-2dfc56acc25e',78),
 'seongtae':('13a68f99-2ae2-4624-a884-c3e5b032b700',62),
 'manjong':('a7ec5a60-6ce7-49fe-b6c0-3b92312d7bf0',85),
 'yeonseong':('64b86eef-39d6-4f02-afd4-c7945a642ed9',82),
 'moseongjin':('77f2fcaa-c265-4f32-bd40-dc3bb05d2e79',80),
 'jaeho':('1de2cdf5-5a08-461d-aaab-fcaca9631c86',88),
}
manifest={'generated':'whole-character 16 poses per cast, 8 attack key poses; not 14-frame interpolation','coordinateSpace':'screen','activeShoulder':'screen-right','anchorLimb':'screen-left','weaponHand':'both, except paired gauntlets','renderScale':1.5,'cell':256,'foot':240,'sources':{}}
preview=Image.new('RGB',(7*256,256),'#415763')
for index,(name,(source,head)) in enumerate(SOURCES.items()):
 im=Image.open(SOURCE/f'exec-{source}.png').convert('RGBA')
 im.putdata([(r,g,b,0 if a<48 or (r>g*1.6+30 and b>g*1.5+20) else a) for r,g,b,a in im.getdata()])
 frames=[];bounds=[]
 for row in range(4):
  for col in range(4):
   cell=im.crop((round(col*im.width/4),round(row*im.height/4),round((col+1)*im.width/4),round((row+1)*im.height/4)))
   box=cell.getbbox();assert box,(name,row,col)
   assert min(box[0],box[1],cell.width-box[2],cell.height-box[3])>2,(name,row,col,'source boundary',box)
   bounds.append(box)
   # One scale per source, never fit individual poses. Translation aligns feet only.
   actor=cell.crop(box);scale=48.5/head
   actor=actor.resize((round(actor.width*scale),round(actor.height*scale)),Image.Resampling.LANCZOS)
   assert actor.width<246 and actor.height<235,(name,row,col,actor.size)
   frame=Image.new('RGBA',(256,256));frame.alpha_composite(actor,(round(128+(box[0]-cell.width/2)*scale),240-actor.height));frames.append(frame)
 sheet=Image.new('RGBA',(1024,1024))
 for i,f in enumerate(frames):sheet.alpha_composite(f,((i%4)*256,(i//4)*256))
 target=ROOT/f'public/images/rooftop-{name}-awaken-v1.png';sheet.save(target,optimize=True)
 contact=Image.new('RGB',sheet.size,'#415763');contact.paste(sheet,(0,0),sheet);contact.save(OUT/f'{name}-awaken-contact.jpg')
 gif=[]
 for f in frames[4:12]:
  bg=Image.new('RGB',f.size,'white');bg.paste(f,(0,0),f);gif.append(bg)
 gif[0].save(OUT/f'{name}-awaken-attack.gif',save_all=True,append_images=gif[1:],duration=[120,100,120,55,80,100,100,120],loop=0)
 preview.paste(frames[0],(index*256,0),frames[0])
 manifest['sources'][name]={'source':source,'sourceSize':im.size,'headReference':head,'bounds':bounds,'bytes':target.stat().st_size}
preview.save(OUT/'awaken-roster.jpg')
(OUT/'atlas-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
print('PASS: 112 whole-character poses packed, 7 atlases, fixed per-character scale and feet; inspect contact sheets visually.')
