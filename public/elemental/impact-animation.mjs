// Use authored variable frame durations, scaled to the combat event lifetime.
export function impactFrame(frames,progress){
 const total=frames.reduce((n,f)=>n+f.duration,0);
 let elapsed=Math.max(0,Math.min(1,progress))*total;
 for(const f of frames){if(elapsed<f.duration)return f;elapsed-=f.duration;}
 return frames.at(-1);
}
