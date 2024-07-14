// @ts-check
const { test, expect } = require('@playwright/test');

test('goto html page', async ({page}) => {
  await page.goto('http://127.0.0.1:5500/realLandingPage/index.html')
  await expect(page).toHaveTitle(/Tripyojan.com/)
})