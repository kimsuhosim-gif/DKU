"""Pack AI-drawn in-betweens and existing anchors. No pose synthesis or per-frame resizing.
Usage: python scripts/pack-rooftop-motion.py output/combat-v6/accepted-sources.json
"""
import json,sys,statistics
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
sources=json.loads(Path(sys.argv[1]).read_text())
out=ROOT/'output/combat-v6';out.mkdir(parents=True,exist_ok=True)
contact=Image.new('RGB',(1536,6*220),'#33434a');report=[]
for row,(name,path) in enumerate(sources.items()):
 old=Image.open(ROOT/f'public/images/rooftop-{name}-heavy-v4.png').convert('RGBA')
 src=Image.open(path).convert('RGBA');cols=2 if src.width/src.height<2 else 4;cw=src.width//cols;ch=src.height//(4//cols)
 anchors=[old.crop((i*512,0,(i+1)*512,512)) for i in range(4)]
 new=[src.crop(((i%cols)*cw,(i//cols)*ch,(i%cols+1)*cw,(i//cols+1)*ch)) for i in range(4)]
 # Alpha cleanup only: discard invisible encoder residue, never redraw or deform the subject.
 for cell in new:cell.putalpha(cell.getchannel('A').point(lambda a:0 if a<32 else a))
 boxes=[cell.getbbox() for cell in new]
 assert all(b and b[0]>3 and b[2]<cw-3 and b[1]>3 and b[3]<ch-3 for b in boxes),'Cropped source cell'
 oldheights=[a.getbbox()[3]-a.getbbox()[1] for a in anchors]
 newheights=[b[3]-b[1] for b in boxes]
 factor=statistics.median(oldheights)/statistics.median(newheights)
 # ONE scale and translation for all generated cells; never fit individual frames.
 base=statistics.median(b[3] for b in boxes)
 cleaned=[]
 for cell in new:
  scaled=cell.resize((round(cw*factor),round(ch*factor)),Image.Resampling.LANCZOS)
  frame=Image.new('RGBA',(512,512));frame.alpha_composite(scaled,(round(256-cw*factor/2),round(480-base*factor)))
  cleaned.append(frame)
 if name=='hyomin':cleaned[0],cleaned[1]=cleaned[1],cleaned[0]
 sequence=[anchors[0],cleaned[0],cleaned[1],anchors[1],cleaned[2],anchors[2],cleaned[3],anchors[3]]
 if name=='seongtae':sequence[4],sequence[5]=sequence[5],sequence[4]
 sheet=Image.new('RGBA',(2048,256));preview=[]
 for i,frame in enumerate(sequence):
  frame=frame.resize((256,256),Image.Resampling.LANCZOS);sheet.alpha_composite(frame,(i*256,0))
  bg=Image.new('RGB',(256,256),'white');bg.paste(frame,mask=frame.getchannel('A'));preview.append(bg)
  thumb=frame.resize((192,192));contact.paste(thumb,(i*192,row*220+24),thumb)
 for i in range(8):
  box=sheet.crop((i*256,0,(i+1)*256,256)).getchannel('A').point(lambda a:255 if a>32 else 0).getbbox()
  assert box and box[0]>3 and box[1]>3 and box[2]<253 and box[3]<250,(name,i,box)
 sheet.save(ROOT/f'public/images/rooftop-{name}-heavy-v5.png',optimize=True)
 ImageDraw.Draw(contact).text((4,row*220+4),name+' | anchor + 4 generated in-betweens',fill='white')
 preview[0].save(out/f'{name}-preview.gif',save_all=True,append_images=preview[1:],duration=[180,90,70,90,70,70,90,140],loop=0)
 report.append({'id':name,'source':Path(path).name,'frames':8,'cell':256,'sharedScale':round(factor,5),'sourceFeet': [b[3] for b in boxes],'bytes':(ROOT/f'public/images/rooftop-{name}-heavy-v5.png').stat().st_size})
contact.save(out/'motion-contact.jpg')
(out/'motion-manifest.json').write_text(json.dumps({'content':'4 existing anchors + 4 model-drawn in-betweens per character; 8-frame sequence, not a full 14-frame set','coordinateSpace':'screen','weaponOwnership':'same reference grip; both hands anchored for iron/bat/hammer/spear; pan original hand, opposite empty; boxer two gloves','normalization':'one shared scale and translation per character; no pose warping','sheets':report},indent=2))
print(json.dumps(report,indent=2))
