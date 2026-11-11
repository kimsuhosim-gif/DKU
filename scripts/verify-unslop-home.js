async (page) => {
  await page.goto('http://localhost:5173/#/home');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({width, height:844});
    await page.locator('.hero-photograph img').evaluate(img => img.decode());
    const issue = await page.evaluate(() => {
      if (document.documentElement.scrollWidth > innerWidth) return 'Horizontal overflow';
      const hero = document.querySelector('.editorial-hero').getBoundingClientRect();
      const next = document.querySelector('.next-round-strip').getBoundingClientRect();
      if (hero.bottom > innerHeight - 80) return 'Hero hides next section';
      if (next.top < hero.bottom - 1) return 'Sections overlap';
      for (const img of document.querySelectorAll('.home-content img')) {
        if (img.complete && !img.naturalWidth) return 'Broken image';
      }
      return '';
    });
    if (issue) throw Error(`${width}: ${issue}`);
    await page.screenshot({path:`output/unslop-home-${width}.png`,fullPage:true});
  }
  await page.getByRole('region',{name:'다음 모임 안내'}).getByRole('link').click();
  await page.getByRole('heading',{name:'망년회',exact:true}).waitFor();
  await page.getByRole('link',{name:'DKU RE09 홈'}).click();
  await page.getByRole('heading',{name:'RE09',exact:true}).waitFor();
}
