async (page) => {
  await page.getByRole('textbox', { name: '모임 입장 비밀번호' }).fill('0909');
  await page.locator('form').evaluate(form => form.requestSubmit());
  await page.locator('.re09-header-logo').waitFor();
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator('.re09-header-logo').evaluate(img => img.decode());
    if (await page.locator('img[src*="bear"]').count()) throw Error('Old bear logo remains');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Horizontal overflow');
    await page.screenshot({ path: `output/premium-logo-${width}.png` });
  }
}
