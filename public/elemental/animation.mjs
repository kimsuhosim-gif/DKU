// Sprite rectangles are shared by gameplay and the browser animation review.
export function spriteFrame(a){
 if(a.action==='attack'&&a.combo>=2){
  const duration=a.combo===3?.62:.42;
  const phase=a.age<=.18?a.age/.18*5:5+(a.age-.18)/(duration-.18)*8;
  const n=Math.max(0,Math.min(13,Math.floor(phase)));
  return {key:a.id+'attack'+a.combo,n,sx:n%7*512,sy:Math.floor(n/7)*512,sw:512,sh:512,anchorX:256};
 }
 if(a.action==='idle'&&a.moving){const n=Math.floor(a.walk*16)%14;return {key:a.id+'walk',n,sx:n%7*512,sy:Math.floor(n/7)*512,sw:512,sh:512,anchorX:256};}
 if(a.action==='dodge'||a.action==='hurt'){const n=a.action==='dodge'?4:5;return {key:a.id+'move',n,sx:n%3*512,sy:Math.floor(n/3)*512,sw:512,sh:512,anchorX:256};}
 const attacking=a.action==='attack'||a.action==='magic';
 const n=attacking?Math.min(13,Math.floor(a.age/(a.action==='magic'?.85:.42)*14)):0;
 return {key:a.id,n,sx:n%7*768,sy:Math.floor(n/7)*512,sw:768,sh:512,anchorX:360};
}
