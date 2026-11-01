import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source=readFileSync(new URL('../utils/drivePhysics.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {segmentBox,autoAim,velocity,positionAt}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const min={x:-1,y:0,z:-1},max={x:1,y:5,z:1};
assert.equal(segmentBox({x:-20,y:3,z:0},{x:20,y:3,z:0},min,max),.475,'fast ball must hit thin wall');
assert.equal(segmentBox({x:-20,y:6,z:0},{x:20,y:6,z:0},min,max),null,'above roof must miss');
assert.equal(segmentBox({x:0,y:3,z:0},{x:0,y:3,z:2},min,max),0,'starting inside returns immediate contact');
assert.equal(segmentBox({x:2,y:3,z:-5},{x:2,y:3,z:5},min,max),null,'parallel segment outside misses');
assert.notEqual(segmentBox({x:1,y:3,z:-5},{x:1,y:3,z:5},min,max),null,'grazing facade is a hit');
let cases=0;
for(const wind of [0,.65,-.9])for(const [x,z,y] of [[-8,.25,3.12],[8,.25,3.575],[0,-5.75,4.55],[-9,-13.5,4.55],[0,-20.25,6.5],[9,-13.5,5.2]]){
 const aim=autoAim(x,z,y,wind),v=velocity(aim.yaw,aim.angle,aim.power),t=(z-18)/v.z,p=positionAt(v,t,wind);
 assert.ok(aim.power>=5&&aim.power<=100);assert.ok(Math.abs(p.x-x)<.05,`wind aim off: ${JSON.stringify({wind,x,p})}`);assert.ok(Math.abs(p.y-y)<.05,'vertical aim should reach weak point');cases++;
}
console.log(`PASS: 5 swept-collision cases and ${cases} ballistic / crosswind targets`);
