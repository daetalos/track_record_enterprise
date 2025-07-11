import { Page, expect } from '@playwright/test';

export class SeasonPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/seasons');
    await expect(this.page).toHaveURL(/seasons/);
  }

  async createSeason(name: string, description?: string) {
    // Use semantic locators - NO CSS selectors
    await this.page.getByRole('button', { name: 'Add Season' }).click();
    await this.page.getByLabel('Season Name').fill(name);

    if (description) {
      await this.page.getByLabel('Description').fill(description);
    }

    await this.page.getByRole('button', { name: 'Create Season' }).click();

    // Proper waiting - NO arbitrary timeouts
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async editSeason(
    currentName: string,
    newName: string,
    newDescription?: string
  ) {
    await this.page
      .getByRole('row', { name: new RegExp(currentName, 'i') })
      .getByRole('button', { name: 'Edit' })
      .click();

    await this.page.getByLabel('Season Name').clear();
    await this.page.getByLabel('Season Name').fill(newName);

    if (newDescription !== undefined) {
      await this.page.getByLabel('Description').clear();
      if (newDescription) {
        await this.page.getByLabel('Description').fill(newDescription);
      }
    }

    await this.page.getByRole('button', { name: 'Update Season' }).click();

    // Wait for update to complete
    await expect(this.page.getByText(newName)).toBeVisible();
  }

  async deleteSeason(seasonName: string) {
    await this.page
      .getByRole('row', { name: new RegExp(seasonName, 'i') })
      .getByRole('button', { name: 'Delete' })
      .click();

    // Confirm deletion in any confirmation dialog
    const confirmButton = this.page.getByRole('button', {
      name: /confirm|yes|delete/i,
    });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    // Wait for removal from list
    await expect(this.page.getByText(seasonName)).not.toBeVisible();
  }

  async searchSeasons(searchTerm: string) {
    await this.page.getByRole('textbox', { name: /search/i }).fill(searchTerm);

    // Wait for search to filter results
    await expect(this.page.getByText('Loading...')).not.toBeVisible();
  }

  async sortByColumn(columnName: 'Name' | 'Created') {
    await this.page
      .getByRole('columnheader', { name: columnName })
      .getByRole('button')
      .click();

    // Wait for table to re-sort
    await expect(this.page.getByText('Loading...')).not.toBeVisible();
  }

  async expectSeasonInList(seasonName: string) {
    await expect(this.page.getByText(seasonName)).toBeVisible();
  }

  async expectSeasonNotInList(seasonName: string) {
    await expect(this.page.getByText(seasonName)).not.toBeVisible();
  }

  async expectValidationError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectSeasonCount(count: number) {
    const seasonRows = this.page.getByRole('row').filter({
      has: this.page.getByRole('button', { name: 'Edit' }),
    });
    await expect(seasonRows).toHaveCount(count);
  }

  async expectTableSortedBy(
    columnName: 'Name' | 'Created',
    direction: 'asc' | 'desc'
  ) {
    // Verify table is sorted correctly by checking the sort indicator
    const columnHeader = this.page.getByRole('columnheader', {
      name: columnName,
    });
    if (direction === 'asc') {
      await expect(columnHeader).toContainText('↑');
    } else {
      await expect(columnHeader).toContainText('↓');
    }
  }
}
