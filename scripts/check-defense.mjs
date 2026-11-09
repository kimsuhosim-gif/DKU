import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {createGame,WEAPONS,command,step} from '../public/defense/engine.mjs';
import {DEFENDERS,MOTION_FILES} from '../public/defense/characters.mjs';
import {EVOLUTIONS} from '../public/defense/evolution.mjs';
import {branchOptions} from '../public/defense/expansion.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),game=path.join(root,'public/defense');
const html=fs.readFileSync(path.join(game,'index.html'),'utf8');
for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){const file=match[1];if(file.startsWith('/')||file.includes('://'))continue;assert(fs.existsSync(path.join(game,file)),file);}
for(const file of [...Object.values(DEFENDERS).map(d=>d.file),...Object.values(MOTION_FILES)])assert(fs.existsSync(path.join(game,'assets',file)),file);
assert.equal(Object.keys(WEAPONS).length,5);assert.equal(Object.keys(DEFENDERS).length,5);
assert.equal(Object.entries(EVOLUTIONS).flatMap(([type,ev])=>branchOptions(type,ev[2])).length,10);
assert(html.includes('href="/#/more"'));assert(!fs.existsSync(path.join(root,'public/elemental')));
const menu=fs.readFileSync(path.join(root,'components/MoreSection.tsx'),'utf8');assert(menu.includes('/defense/index.html'));assert(!menu.includes('원소액션'));
const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));assert(config.redirects.some(r=>r.source==='/elemental/:path*'&&r.destination==='/defense/index.html'));
const g=createGame();assert(command(g,{type:'build',slot:0,weapon:'frost'}));assert(command(g,{type:'start'}));for(let i=0;i<60;i++)step(g);assert.equal(g.wave,1);assert(g.enemies.length>0);
console.log('PASS: embedded assets, 5 roles / 10 branches, entry and return links, old game removal and redirect, playable engine. Existing v5 combat suite unchanged.');
