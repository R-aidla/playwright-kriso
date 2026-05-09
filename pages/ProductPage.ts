import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async openCategory(name: string) {
    await this.page.getByRole('link', {
      name
    }).click();
  }

  async verifyCategoryLoaded(title: RegExp) {
    await expect(this.page).toHaveTitle(title);
  }

  async getResultsCount(): Promise<number> {
    const text = await this.page
      .getByText(/Otsingu vasteid leitud/i)
      .locator('..')
      .getByText(/\d+/)
      .first()
      .textContent();

    return Number(text?.replace(/\D/g, '')) || 0;
  }

  async applyFilter(name: string) {
    await this.page.getByRole('link', {
      name
    }).click();
  }

  async removeAllFilters() {
    await this.page.getByRole('link', {
      name: /Eemalda kõik/i
    }).click();
  }
}
