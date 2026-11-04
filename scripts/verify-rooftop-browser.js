async (page) => {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.reload();
 const samples=[];
 for(const [width,height] of [[1440,1000],[390,844],[320,568],[844,390]]){
  await page.setViewportSize({width,height});
  await page.getByRole('button',{name:'모성진',exact:true}).click();
  await page.screenshot({path:`output/arena-select-${width}.png`});
  await page.getByRole('button',{name:'대전 시작',exact:true}).click();
  await page.locator('.roof[data-phase=playing]').waitFor();
  const read=()=>page.locator('canvas').evaluate(canvas=>{
   const gl=canvas.getContext('webgl2');
   if(!gl)throw Error('WebGL not available');
   const data=new Uint8Array(gl.drawingBufferWidth*gl.drawingBufferHeight*4);
   gl.readPixels(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight,gl.RGBA,gl.UNSIGNED_BYTE,data);
   let hash=0;const colors=new Set();for(let i=0;i<data.length;i+=400){hash=(hash*31+data[i]+data[i+1])>>>0;colors.add(`${data[i]},${data[i+1]},${data[i+2]}`);}
   return {hash,colors:colors.size};
  });
  const before=await read();
  await page.keyboard.down('a');await page.waitForTimeout(160);await page.keyboard.up('a');
  await page.getByRole('button',{name:'점프',exact:true}).click();
  await page.waitForTimeout(130);
  const after=await read();
  if(before.colors<30||before.hash===after.hash)throw Error('Blank or static game');
  await page.screenshot({path:`output/arena-live-${width}.png`});
  await page.getByRole('button',{name:'일시정지',exact:true}).click();
  await page.locator('.roof[data-phase=paused]').waitFor();
  const layout=await page.evaluate(()=>{
   const controls=document.querySelector('.roof-controls').getBoundingClientRect();
   return {overflow:document.documentElement.scrollWidth>innerWidth,bottom:controls.bottom,height:innerHeight};
  });
  if(layout.overflow||layout.bottom>height+1)throw Error('Controls overflow '+JSON.stringify(layout));
  samples.push({width,height,...after});
  await page.getByRole('button',{name:'캐릭터 선택',exact:true}).click();
 }
 if(errors.length)throw Error(errors.join('\n'));
 await page.setViewportSize({width:1440,height:1000});
 console.log(JSON.stringify({samples,errors}));
}
