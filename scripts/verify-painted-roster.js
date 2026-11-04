async (page) => {
 await page.reload();
 await page.setViewportSize({width:1280,height:900});
 for(const name of ['김효민','정재엽','김성태','유만종','신연성','모성진']){
  await page.getByRole('button',{name,exact:true}).click();
  await page.getByRole('button',{name:'대전 시작',exact:true}).click();
  await page.locator('.roof[data-phase=playing]').waitFor();
  await page.keyboard.down('d');await page.waitForTimeout(900);await page.keyboard.up('d');
  await page.keyboard.down('j');await page.waitForTimeout(1200);await page.keyboard.up('j');
  await page.keyboard.press('k');await page.waitForTimeout(800);
  const health=await page.locator('.roof-hp').evaluateAll(bars=>bars.map(b=>b.value));
  if(health.length!==4||!health.some(hp=>hp<180))throw Error('Combat did not reduce health');
  await page.keyboard.press('l');await page.waitForTimeout(100);
  await page.screenshot({path:`output/painted-${name}.png`});
  await page.getByRole('button',{name:'일시정지',exact:true}).click();
  await page.locator('.roof[data-phase=paused]').waitFor();
  await page.getByRole('button',{name:'캐릭터 선택',exact:true}).click();
 }
}
