import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const source=process.argv[2]||'C:/Users/User/.codex/tools/pixelfx';
const {loadEffect,renderFrames,spriteSheet}=await import(pathToFileURL(path.join(source,'tools/lib/fxlib.mjs')));
const out=new URL('../public/images/rooftop-fx/specials/',import.meta.url);fs.mkdirSync(out,{recursive:true});
const teal=['#092b2b','#10514f','#198b81','#33bfa7','#6df5ce','#bdffe9','#ffffff'];
const gold=['#39220e','#71400e','#ad701b','#e6a92d','#ffdc67','#fff4ba','#ffffff'];
const red=['#380b25','#6f183e','#ac265a','#e44878','#ff83aa','#ffd2df','#fff2f7','#ffffff'];
const effects=[['cannon','arcane/arcane-beam',teal,[41,60],2.6,0,23],['homerun','melee/spin-slash',gold,[104,59],3,3,16],['thunder','lightning/lightning-strike',null,[120,228],1.7,16,60],['rush','melee/uppercut',null,[48,85],2.1,1,17],['lance','ice/ice-lance',red,[146,32],2.6,0,15],['counter','holy/sunburst',null,[64,64],2.3,0,25],['charge','arcane/spell-charge',teal,[59,58],1.4,0,31]];
const manifest={};
for(const [key,id,palette,pivot,scale,first,last] of effects){const fx=await loadEffect(id);const r=renderFrames(fx,{fps:20,seed:9,bg:'none',actor:false,options:palette?{palette}:{}});r.frames=r.frames.slice(0,last+1);const sheet=spriteSheet(fx,r,key);fs.writeFileSync(new URL(key+'.png',out),sheet.png);const meta=sheet.json.meta.pixelfx;manifest[key]={id,width:meta.frameSize[0],height:meta.frameSize[1],columns:meta.columns,frames:meta.frames,pivot,scale,first,last};console.log(key,sheet.png.length,meta.frames);}
fs.writeFileSync(new URL('manifest.json',out),JSON.stringify(manifest,null,2)+'\n');
