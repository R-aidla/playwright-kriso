/**
 * Part II — Page Object Model tests
 * Test suite: Navigate Products via Filters
 *
 * Rules:
 *   - No raw selectors in test files — all locators live in page classes
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 */
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';

test.describe.configure({ mode: 'serial' });

let home: HomePage;
let product: ProductPage;

let lastCount = 0;

test.describe('Navigate Products via Filters (POM)', () => {

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    home = new HomePage(page);
    product = new ProductPage(page);

    await home.openUrl();
    await home.acceptCookies();
  });

  test('Verify logo/title', async () => {
    await home.verifyLogo();
  });

  test('Open music books section and confirm the section is visible', async () => {
    await home.openMusicCatalog();

    await product.verifyCategoryLoaded(/Muusikaraamatud ja noodid/);
  });

  test('Click the "Kitarr" category and validate result count', async () => {
    await product.openCategory('Kitarr');

    lastCount = await product.getResultsCount();

    expect(lastCount).toBeGreaterThan(0);
  });

  test('Filter by language and check if results redused', async () => {
    await product.applyFilter('Inglise');

    const newCount = await product.getResultsCount();

    expect(newCount).toBeLessThan(lastCount);

    lastCount = newCount;
  });

  test('Click on the CD format category and check if results redused', async () => {
    await product.applyFilter('CD');

    const newCount = await product.getResultsCount();

    expect(newCount).toBeLessThan(lastCount);

    lastCount = newCount;
  });

  test('Remove all active filters', async () => {
    await product.removeAllFilters();

    await product.verifyCategoryLoaded(/Muusikaraamatud ja noodid/);
  });

});
