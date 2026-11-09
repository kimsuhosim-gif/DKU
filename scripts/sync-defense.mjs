import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.resolve(root,'../클럽하우스-디펜스/deploy-public');
const destination=path.join(root,'public/defense');
const files=["index.html","asset-manifest.json","board.mjs","characters.mjs","combat-audio.mjs","enemy-roles.mjs","engine-evolution.mjs","engine.mjs","campaign.mjs","campaign-save.mjs","members-fx.mjs","evolution-fx.mjs","evolution.css","evolution.mjs","expansion.mjs","expansion-fx.mjs","expansion.css","game.mjs","impact-v4.css","impact-v4.mjs","style.css","assets/clubhouse-mobile-v2.png","assets/effects-v2.png","assets/enemies.png","assets/items.png","assets/characters-v1/B02.png","assets/characters-v1/E08.png","assets/characters-v1/S01.png","assets/motion-v3/B02/attack.png","assets/motion-v3/E08/attack.png","assets/motion-v3/S01/attack.png","member-motion.mjs","member-spells.mjs","assets/members-v7/jaeho/portrait.png","assets/members-v7/yeonseong/portrait.png","assets/members-v7/jaeho/bolt.png","assets/members-v7/yeonseong/bolt.png","assets/members-v7/jaeho/fan.png","assets/members-v7/jaeho/storm.png","assets/members-v7/yeonseong/ward.png","assets/members-v7/yeonseong/bless.png","assets/members-v7/spells.png"];
for(const file of files){const target=path.join(destination,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(source,file),target);}
const entry=path.join(destination,'index.html');let html=fs.readFileSync(entry,'utf8');
html=html.replace('</head>','<link rel="stylesheet" href="homepage.css"></head>');
html=html.replace('<div class="canvas-wrap">','<div class="canvas-wrap"><a class="homepage-return" href="/#/more" aria-label="클럽 데스크로 돌아가기">← 클럽 데스크</a>');
fs.writeFileSync(entry,html);
for(const file of ['index.html','characters.mjs']){const target=path.join(destination,file);fs.writeFileSync(target,fs.readFileSync(target,'utf8').trimEnd()+'\n');}
console.log(`Synced ${files.length} runtime files; added homepage return link.`);
