import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const source=ts.transpileModule(fs.readFileSync(new URL('../utils/demolition2d.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
globalThis.matchMedia=()=>({matches:true});globalThis.Image=class{complete=false;};globalThis.ResizeObserver=class{observe(){}disconnect(){}};globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};globalThis.devicePixelRatio=1;globalThis.document={hidden:false};
const {Demolition2D,ITEMS}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const make=()=>new Demolition2D({getContext:()=>({}),getBoundingClientRect:()=>({width:1200,height:470})},()=>{});
const finish=g=>{for(let n=0;n<1600&&g.s.busy;n++)g.update(1/120);assert.equal(g.s.busy,false,'shot must settle');};
for(const item of ITEMS){const g=make();g.active=true;g.equip(item.id);const stock=g.s.inventory[item.id];g.fire();finish(g);assert(g.s.score>0,item.id+' must hit');if(item.id!=='standard')assert.equal(g.s.inventory[item.id],stock-1);g.dispose();}
const g=make();g.active=true;g.fire();g.fire();assert.equal(g.s.shots,1,'duplicate input cannot launch twice');finish(g);g.paused=true;g.fire();assert.equal(g.s.shots,1,'pause blocks fire');g.paused=false;
for(let stage=0;stage<3;stage++){let attempts=0;while(!g.s.cleared&&attempts++<45){const i=g.blocks.findIndex(b=>b.hp);g.select(i);g.fire();finish(g);}assert(g.s.cleared,'all targets must be reachable in stage '+stage);if(stage<2)g.next();}
const score=g.s.score;g.reset();assert.equal(g.s.score,0);assert.equal(g.s.stage,0);assert(g.blocks.every(b=>b.hp===b.max));g.s.coins=0;const stock=g.s.inventory.bomb;g.buy('bomb');assert.equal(g.s.inventory.bomb,stock);g.s.coins=100;g.buy('bomb');assert.equal(g.s.coins,40);assert.equal(g.s.inventory.bomb,stock+1);g.dispose();console.log('PASS: six items, ammunition, pause, duplicate fire, all three stages, restart, shop. Final score:',score);
