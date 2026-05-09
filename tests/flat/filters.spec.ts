/**
 * Part I — Flat tests (no POM)
 * Test suite: Navigate Products via Filters
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

let lastResultsCount = 0;

test.describe('Navigate Products via Filters', () => {

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

  test('Open music books section and confirm the section is visible', async () => {
    await page.getByRole('link', { name: 'Muusikaraamatud ja noodid' }).click();
    
    await expect(page).toHaveTitle(/Muusikaraamatud ja noodid/);
  });

  test('Click the "Kitarr" category and verify contents', async () => {
    await page.getByRole('link', { name: 'Kitarr' }).click();

    await expect(
      page.getByText(/Otsingu vasteid leitud/i)
    ).toBeVisible();

    const resultsText = await page
      .getByText(/Otsingu vasteid leitud/i)
      .locator('..')
      .getByText(/\d+/)
      .first()
      .textContent();

    let currentResultsCount = Number(resultsText?.replace(/\D/g, '')) || 0;
    expect(currentResultsCount).toBeGreaterThan(0);
    lastResultsCount = currentResultsCount;
  });

  test('Filter by language and validate', async () => {
    await page.getByRole('link', { name: 'Inglise (7381)' }).click();

    await expect(
      page.getByText(/Otsingu vasteid leitud/i)
    ).toBeVisible();

    const resultsText = await page
      .getByText(/Otsingu vasteid leitud/i)
      .locator('..')
      .getByText(/\d+/)
      .first()
      .textContent();

    let currentResultsCount = Number(resultsText?.replace(/\D/g, '')) || 0;
    expect(currentResultsCount).toBeLessThan(lastResultsCount);
    lastResultsCount = currentResultsCount;
  });

  test('Click on the CD format category and validate', async () => {
    await page.getByRole('link', { name: 'CD (1141)' }).click();

    await expect(
      page.getByText(/Otsingu vasteid leitud/i)
    ).toBeVisible();

    const resultsText = await page
      .getByText(/Otsingu vasteid leitud/i)
      .locator('..')
      .getByText(/\d+/)
      .first()
      .textContent();

    let currentResultsCount = Number(resultsText?.replace(/\D/g, '')) || 0;
    expect(currentResultsCount).toBeLessThan(lastResultsCount);
    lastResultsCount = currentResultsCount;
  });

  test('Remove all active filters and validate', async () => {
    await page.getByRole('link', { name: 'Eemalda kõik' }).click();

    // Do to how kriso works nowadays, it just brings you back to the main page of the section selected.
    await expect(page).toHaveTitle(/Muusikaraamatud ja noodid/);
  });

});
