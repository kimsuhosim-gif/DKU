import {createGame,WEAPONS} from './engine.mjs';
import {TOTAL_WAVES,MAX_MASTERY} from './campaign.mjs';
export const SAVE_KEY='re09-defense-campaign-v6';
function countersValid(value,shape){return value&&Object.entries(shape).every(([k,v])=>typeof v==='number'?Number.isFinite(value[k])&&value[k]>=0:countersValid(value[k],v));}
export function encodeCheckpoint(g){
 if(g.phase!=='build'||g.wave<1||g.wave>=TOTAL_WAVES||g.enemies.length||g.spawnQueue.length)return null;
 return JSON.stringify({version:6,state:g});
}
export function decodeCheckpoint(raw){
 try{
  const {version,state:s}=JSON.parse(raw||'null');
  if(version!==6||s.phase!=='build'||!Number.isInteger(s.wave)||s.wave<1||s.wave>=TOTAL_WAVES||!Number.isInteger(s.seed)||!Number.isInteger(s.rng))return null;
  for(const key of ['hp','maxHp','gold','time','kills','nextId','nextTowerId','bossesKilled'])if(!Number.isFinite(s[key])||s[key]<0)return null;
  if(s.hp<=0||s.hp>s.maxHp||s.maxHp!==150||s.gold>1e8||!Array.isArray(s.towers)||s.towers.length!==8||!Array.isArray(s.stats)||s.stats.length!==s.wave)return null;
  const fresh=createGame(s.seed);if(!countersValid(s.telemetry,fresh.telemetry))return null;
  for(const t of s.towers){if(t&&(!Object.hasOwn(WEAPONS,t.type)||![1,2,3].includes(t.level)||!Number.isInteger(t.mastery)||t.mastery<0||t.mastery>MAX_MASTERY||!Number.isFinite(t.invested)||!Number.isFinite(t.cooldown)||!['cycle','casts','skillCasts','id'].every(k=>Number.isFinite(t[k])&&t[k]>=0)||(t.level===3&&!['primary','alternate'].includes(t.branch))))return null;}
  const g={...fresh,...s,positions:fresh.positions,autoRemaining:null,enemies:[],spawnQueue:[],pending:[],effects:[],zones:[],projectiles:[],events:[]};
  g.notice=`${s.wave}웨이브 저장 복원 · ${s.wave+1}웨이브 시작을 눌러요`;return g;
 }catch{return null;}
}
