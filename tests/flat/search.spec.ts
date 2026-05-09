/**
 * Part I — Flat tests (no POM)
 * Test suite: Search for Books by Keywords
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 *
 * Tip: run `npx playwright codegen https://www.kriso.ee` to discover selectors.
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.describe('Search for Books by Keywords', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await page.goto('https://www.kriso.ee/');
    await page.getByRole('button', { name: 'Nõustun' }).click();
  });

  test.afterAll(async () => {
    await page.context().close();
  });

  test('Open homepage and verify logo/title', async () => {
    await expect(page).toHaveTitle(/Kriso/i);
    await expect(page.getByRole('link', { name: 'K', exact: true })).toBeVisible();
  });
  

  test('No products found for invalid keyword', async () => {

    await page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' }).fill('jaslkfjalskjdkls');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText(/vastavat raamatut ei leitud/i)).toBeVisible();
  });

  test('Search results contain keyword', async () => {

    await page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' }).fill('tolkien');
    await page.getByRole('button', { name: 'Search' }).click();

    const resultsText = await page
      .getByText(/Otsingu vasteid leitud/i)
      .locator('..')
      .getByText(/\d+/)
      .first()
      .textContent();

    let count = Number(resultsText?.replace(/\D/g, '')) || 0;
    expect(count).toBeGreaterThan(0);

    await expect(
      page.getByText(/tolkien/i).first()
    ).toBeVisible();
  });

  test('Search by ISBN returns correct book', async () => {

    await page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' }).fill('9780307588371');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(
      page.getByText(/gone girl/i).first()
    ).toBeVisible();
  });

});
