/**
 * Part I — Flat tests (no POM)
 * Test suite: Add Books to Shopping Cart
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

let firstBookTitle = '';
let secondBookTitle = '';

test.describe('Add Books to Shopping Cart', () => {

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

  test('Search for books and verify results exist', async () => {

    const searchBox = page.getByRole('textbox', { name: 'Pealkiri, autor, ISBN, märksõ' });

    await searchBox.fill('harry potter');
    await page.getByRole('button', { name: 'Search' }).click();

    const addButtons = page.getByRole('link', { name: 'Lisa ostukorvi' });

    await expect(addButtons.first()).toBeVisible();

    const count = await addButtons.count();
    await expect(count).toBeGreaterThan(1);
  });

  test('Add first book to cart', async () => {

    // Is it too much to ask for some ARIA elements? Maybe some accessible names?
    firstBookTitle = (
      await page.locator('.search-results-wrap .book-title-wrap a.book-title').first().innerText()
    )?.replace(/^\d+\.\s*/, '').trim() || '';

    await page
      .getByRole('link', { name: 'Lisa ostukorvi' })
      .first()
      .click();

    await expect(page.getByText('Toode lisati ostukorvi')).toBeVisible();
    await expect(page.getByText('Tooteid ostukorvis: 1')).toBeVisible();
    await page.getByRole('link', { name: 'Jätka ostlemist ' }).click();

  });

  test('Add second book to cart', async () => {
    secondBookTitle = (
      await page.locator('.search-results-wrap .book-title-wrap a.book-title').nth(2).innerText()
    )?.replace(/^\d+\.\s*/, '').trim() || '';

    await page
      .getByRole('link', { name: 'Lisa ostukorvi' })
      .nth(1) // One of the add buttons shift the rest.
      .click();

    await expect(page.getByText('Toode lisati ostukorvi')).toBeVisible();
    await expect(page.getByText('Tooteid ostukorvis: 2')).toBeVisible();
    await page.getByRole('link', { name: 'Mine ostukorvi ' }).click();
  });

  test('Open cart and verify correct items', async () => {

    await expect(page).toHaveURL(/cart|checkout|basket/i);

    await expect(
      page.getByText(firstBookTitle)
    ).toBeVisible();

    await expect(
      page.getByText(secondBookTitle)
    ).toBeVisible();
  });

  test('Verify cart total exists', async () => {

    await expect(page.getByText('Kokku:').first()).toBeVisible();
    await expect(page.locator('.cart-totals').first().getByText(/\d+[.,]\d{2}\s?€/)).toBeVisible();

  });

  test('Remove first item and verify cart updates', async () => {

    // Do to my lack of understanding and the page also lacking any good
    // ARIA roles, ARIA attributes and accessible name. My hand has been forced.
    await page.locator('tr:nth-child(1) > .remove > .btn-small').click();

    await expect(page.getByText(firstBookTitle)).not.toBeVisible();
    await expect(page.getByText(secondBookTitle)).toBeVisible();

    await expect(page.getByText('Tooteid kokku: 1')).toBeVisible();
  });

});