// @ts-check
const { test, expect } = require('@playwright/test');
// import { getSum } from '../realLandingPage/smaple';

test('goto html page', async ({page}) => {
  await page.goto('https://tripyojan.pages.dev/')
  await expect(page).toHaveTitle(/Tripyojan.com/)
})

// test('Some testing', () => {
//   const ans = getSum(2, 3);

//   expect(ans).toBe(5);
// })