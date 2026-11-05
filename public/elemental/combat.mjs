export const DT=1/60;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const DIFFICULTIES=Object.freeze({
 training:Object.freeze({label:'연습',tell:.4,tellSpread:.25,counter:.65,counterSpread:0,wait:.5,waitSpread:.65,speed:175,damage:1}),
 standard:Object.freeze({label:'실전',tell:.32,tellSpread:.2,counter:.46,counterSpread:.18,wait:.28,waitSpread:.4,speed:190,damage:1.4}),
 // Keep counter telegraphs long enough to recover from a single strike and react.
 challenge:Object.freeze({label:'도전',tell:.24,tellSpread:.18,counter:.46,counterSpread:.12,wait:.12,waitSpread:.28,speed:205,damage:1.8})
});
export function createGame(kind='fire',seed=7,difficulty='training'){
 if(!Object.hasOwn(DIFFICULTIES,difficulty))throw new RangeError('Unknown difficulty: '+difficulty);
 const actor=(id,x,dir)=>({id,x,y:440,dir,hp:100,energy:100,action:'idle',age:0,cool:0,dodgeCool:0,hit:false,moving:false,combo:0,queued:false,pressure:0,armor:false,walk:0});
 return {difficulty,player:actor(kind,300,1),enemy:actor(kind==='fire'?'water':'fire',680,-1),time:0,result:null,seed:seed>>>0,aiWait:.8,events:[],freeze:0,stats:{hits:0,dodges:0,finishers:0,counters:0}};
}
function random(g){g.seed=(1664525*g.seed+1013904223)>>>0;return g.seed/4294967296;}
function start(a,action){a.action=action;a.age=0;a.hit=false;a.queued=false;if(action!=='attack')a.combo=0;}
function act(a,i,dt,speed=175){
 a.cool=Math.max(0,a.cool-dt);a.dodgeCool=Math.max(0,a.dodgeCool-dt);a.energy=Math.min(100,a.energy+dt*11);a.moving=false;
 if(a.action==='attack'&&i.attack&&a.age>.12&&a.combo<3)a.queued=true;
 if(a.action==='idle'){
  if(i.x)a.dir=Math.sign(i.x);
  if(i.dodge&&a.dodgeCool===0){start(a,'dodge');a.dodgeCool=1.1;a.dodgeX=i.x||(!i.y?a.dir:0);a.dodgeY=i.y||0;const n=Math.max(1,Math.hypot(a.dodgeX,a.dodgeY));a.dodgeX/=n;a.dodgeY/=n;}
  else if(i.magic&&a.energy>=35&&a.cool===0){start(a,'magic');a.energy-=35;}
  else if(i.attack&&a.cool===0){start(a,'attack');a.combo=1;}
  else {const x=i.x||0,y=i.y||0,n=Math.max(1,Math.hypot(x,y));a.x+=x/n*speed*dt;a.y+=y/n*105*dt;a.moving=!!(x||y);if(a.moving)a.walk+=dt;else a.walk=0;}
 }
 if(a.action==='dodge'){a.x+=a.dodgeX*390*dt;a.y+=a.dodgeY*240*dt;}
 a.x=clamp(a.x,100,860);a.y=clamp(a.y,350,510);a.age+=dt;
 const duration={attack:a.combo===3?.62:.42,magic:.85,dodge:.28,hurt:.22};
 if(duration[a.action]&&a.age>=duration[a.action]){
  if(a.action==='attack'&&a.queued&&a.combo<3){const next=a.combo+1;start(a,'attack');a.combo=next;}
  else {const recovery=a.action==='attack'&&a.combo===3?.32:.1;a.action='idle';a.age=0;a.cool=recovery;a.combo=0;a.armor=false;}
 }
}
function strike(g,a,b){
 if(!['attack','magic'].includes(a.action)||a.hit||a.age<(a.action==='magic'?.28:.18))return;
 a.hit=true;const magic=a.action==='magic',finisher=a.combo===3,range=magic?275:(a.id==='fire'?142:175);
 g.events.push({x:a.x+a.dir*range*.65,y:a.y-85,id:a.id,dir:a.dir,life:.6,maxLife:.6,type:'cast',magic});
 if(Math.abs(b.y-a.y)>42||Math.abs(b.x-a.x)>range||(b.x-a.x)*a.dir<0)return;
 if(b.action==='dodge'){if(b===g.player)g.stats.dodges++;return;}
 const baseDamage=magic?23:finisher?20:a.combo===2?12:10;
 const damage=a===g.enemy?Math.round(baseDamage*DIFFICULTIES[g.difficulty].damage):baseDamage;
 b.hp=Math.max(0,b.hp-(b.armor?Math.ceil(damage*.45):damage));
 g.events.push({x:b.x,y:b.y-105,id:a.id,life:.28,maxLife:.28,type:'impact',finisher});g.freeze=finisher?.065:.035;
 b.x=clamp(b.x+a.dir*(b.armor?4:finisher?48:12),100,860);
 if(!b.armor){start(b,'hurt');if(b===g.enemy){b.pressure++;if(b.pressure>=2){b.pressure=0;b.armor=true;start(b,'tell');const cfg=DIFFICULTIES[g.difficulty];b.tellDuration=cfg.counter+(cfg.counterSpread?random(g)*cfg.counterSpread:0);g.stats.counters++;}}}
 if(a===g.player){g.stats.hits++;if(finisher)g.stats.finishers++;}
}
export function step(g,input={},dt=DT){
 if(g.result)return g;
 g.time+=dt;g.events=g.events.filter(e=>(e.life-=dt)>0);
 if(g.freeze>0){g.freeze=Math.max(0,g.freeze-dt);return g;}
 const p=g.player,e=g.enemy,cfg=DIFFICULTIES[g.difficulty];g.aiWait-=dt;const ai={};
 if(e.action==='idle'){
  const dx=p.x-e.x,dy=p.y-e.y;e.dir=Math.sign(dx)||e.dir;
  if(Math.abs(dy)>18)ai.y=Math.sign(dy);
  if(Math.abs(dx)>118)ai.x=Math.sign(dx);
  else if(g.aiWait<=0&&Math.abs(dy)<35){start(e,'tell');e.tellDuration=cfg.tell+random(g)*cfg.tellSpread;g.aiWait=cfg.wait+random(g)*cfg.waitSpread;}
 }
 // Telegraph locks direction and lane so movement can evade the strike.
 if(e.action==='tell'&&e.age>=e.tellDuration){start(e,'attack');e.combo=1;}
 act(p,input,dt);act(e,ai,dt,cfg.speed);strike(g,p,e);strike(g,e,p);
 if(p.hp<=0||e.hp<=0)g.result=p.hp>0?'win':'lose';
 return g;
}
