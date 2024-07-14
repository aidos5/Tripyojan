// @ts-check
const { test, expect } = require('@playwright/test');
// import { getSum } from '../realLandingPage/smaple';

test('goto html page', async ({page}) => {
  await page.goto('https://tripyojan.pages.dev/')
  await expect(page).toHaveTitle(/Tripyojan.com/)
})

test('home button click', async ({page}) => {
  await page.goto('https://tripyojan.pages.dev/')
  await page.click("text=Home")
  const homeSection = await page.locator('#section-home')
  await expect(homeSection).toHaveText(/Travel no where, travel wide, and let tripyojan be your/)

})
test('features button click', async ({page}) => {
  await page.goto('https://tripyojan.pages.dev/')
  await page.click("text=Home")
  const homeSection = await page.locator('#section-home')
  await expect(homeSection).toHaveText(/Travel no where, travel wide, and let tripyojan be your/)

})

// test('Some testing', () => {
//   const ans = getSum(2, 3);

//   expect(ans).toBe(5);
// })