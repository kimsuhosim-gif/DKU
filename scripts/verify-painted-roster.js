async (page) => {
 await page.reload();
 await page.setViewportSize({width:1280,height:900});
 for(const name of ['김효민','정재엽','김성태','유만종','신연성','모성진']){
  await page.getByRole('button',{name,exact:true}).click();
  await page.getByRole('button',{name:'대전 시작',exact:true}).click();
  await page.locator('.roof[data-phase=playing]').waitFor();
  await page.keyboard.down('d');await page.waitForTimeout(900);await page.keyboard.up('d');
  await page.keyboard.down('j');await page.waitForTimeout(1200);await page.keyboard.up('j');
  await page.screenshot({path:`output/painted-${name}.png`});
  await page.getByRole('button',{name:'일시정지',exact:true}).click();
  await page.locator('.roof[data-phase=paused]').waitFor();
  await page.getByRole('button',{name:'캐릭터 선택',exact:true}).click();
 }
}
