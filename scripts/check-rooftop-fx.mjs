import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../public/images/rooftop-fx/specials/',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',root)));
let bytes=0,decoded=0;
for(const [name,a] of Object.entries(manifest)){const png=fs.readFileSync(new URL(name+'.png',root)),w=png.readUInt32BE(16),h=png.readUInt32BE(20);bytes+=png.length;decoded+=w*h*4;assert.equal(w,a.columns*a.width);assert.equal(h,Math.ceil(a.frames/a.columns)*a.height);assert(a.first>=0&&a.last<a.frames&&a.last>a.first);assert(a.pivot.every(Number.isFinite));assert(w<=4096&&h<=4096);}
assert.equal(Object.keys(manifest).length,7);assert(bytes<2_000_000);assert(decoded<32*1024*1024);
console.log('P0 PASS: seven PixelFX sheets, frame bounds, pivots, mobile texture limits, compressed and decoded budgets.',{bytes,decoded});
