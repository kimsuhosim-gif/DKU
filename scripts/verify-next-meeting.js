async (page) => {
 for (const width of [1280,390]) {
  await page.setViewportSize({width,height:844});
  await page.goto('http://localhost:5173/#/home');
  const notice=page.getByRole('region',{name:'다음 모임 안내'});
  await notice.scrollIntoViewIfNeeded();
  const text=await notice.innerText();
  for(const value of ['망년회','돼봉삼겹살 신논현점','2026.12.08 (화) · 18:30']) if(!text.includes(value))throw Error('Missing '+value);
  await page.screenshot({path:`output/next-meeting-${width}.png`});
  await notice.getByRole('link',{name:'일정 확인'}).click();
  await page.getByRole('heading',{name:'망년회',exact:true}).waitFor();
  if(!await page.locator('.schedule-note').innerText().then(t=>t.includes('돼봉삼겹살 신논현점')))throw Error('Missing meeting venue');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Horizontal overflow');
 }
}
