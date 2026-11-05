export type PixelSound='shot'|'throw'|'hit'|'hurt'|'dash'|'step'|'glass'|'upgrade'|'transform'|'boss'|'win';

/** Small, local synthesized cues. Audio is unlocked only by a user gesture. */
export class PixelAudio {
 private context:AudioContext|null=null;
 private master:GainNode|null=null;
 private enabled=true;
 private last=new Map<PixelSound,number>();
 async unlock(){
  try{
   if(!this.context){this.context=new AudioContext();this.master=this.context.createGain();this.master.gain.value=this.enabled?.2:0;this.master.connect(this.context.destination);}
   if(this.context.state==='suspended')await this.context.resume();
  }catch{/* Sound must never prevent gameplay. */}
 }
 setEnabled(value:boolean){this.enabled=value;if(this.master&&this.context)this.master.gain.setTargetAtTime(value?.2:0,this.context.currentTime,.015);}
 play=(kind:PixelSound)=>{
  const c=this.context;if(!this.enabled||!c||c.state!=='running'||!this.master)return;
  const now=c.currentTime,minGap=kind==='hit'?.065:kind==='step'?.18:.07;
  if(now-(this.last.get(kind)??-1)<minGap)return;this.last.set(kind,now);
  const note=(from:number,to:number,duration:number,volume:number,type:OscillatorType='sine',delay=0)=>{
   const osc=c.createOscillator(),gain=c.createGain(),at=now+delay;
   osc.type=type;osc.frequency.setValueAtTime(from,at);osc.frequency.exponentialRampToValueAtTime(Math.max(20,to),at+duration);
   gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(volume,at+.006);gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
   osc.connect(gain);gain.connect(this.master!);osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start(at);osc.stop(at+duration+.01);
  };
  if(kind==='shot'){note(1600,80,.075,.14,'square');note(110,40,.12,.2,'triangle');}
  else if(kind==='throw')note(420,130,.09,.12,'triangle');
  else if(kind==='hit'){note(165,55,.065,.24,'triangle');note(1150,440,.035,.07,'square');}
  else if(kind==='hurt')note(155,55,.22,.3,'sawtooth');
  else if(kind==='dash')note(160,700,.13,.12,'triangle');
  else if(kind==='step')note(85,45,.035,.055,'triangle');
  else if(kind==='glass'){for(let i=0;i<4;i++)note(1700+i*540,800+i*200,.12,.07,'triangle',i*.018);}
  else if(kind==='boss'){note(120,70,.3,.25,'sawtooth');note(120,70,.3,.25,'sawtooth',.35);}
  else {const notes=kind==='win'?[392,494,587,784]:kind==='transform'?[330,440,554,660]:[440,554,660];notes.forEach((f,i)=>note(f,f,.18,.16,'sine',i*.1));}
 };
 dispose(){void this.context?.close().catch(()=>{});this.context=null;this.master=null;this.last.clear();}
}
