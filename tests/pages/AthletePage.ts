import { Page, expect } from '@playwright/test';

/**
 * AthletePage - Page Object Model for athlete management
 *
 * Handles athlete creation, editing, and listing functionality
 * following Playwright testing standards with semantic locators
 */
export class AthletePage {
  constructor(private page: Page) {}

  /**
   * Navigate to athlete creation page
   */
  async goto() {
    await this.page.goto('/athletes/new');
    await expect(this.page).toHaveURL(/\/athletes\/new/);
  }

  /**
   * Verify the athlete creation form is displayed
   */
  async expectCreateFormVisible() {
    await expect(this.page.getByRole('heading', { name: 'Create New Athlete' })).toBeVisible();
    await expect(this.page.getByLabel('First Name')).toBeVisible();
    await expect(this.page.getByLabel('Last Name')).toBeVisible();
    await expect(this.page.getByLabel('Gender')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Create Athlete' })).toBeVisible();
  }

  /**
   * Fill out the athlete creation form
   */
  async fillCreateForm(firstName: string, lastName: string, gender: string) {
    await this.page.getByLabel('First Name').fill(firstName);
    await this.page.getByLabel('Last Name').fill(lastName);
    
    // Select gender from dropdown - use locator method for select element
    await this.page.locator('select[name="genderId"]').selectOption({ label: gender });
  }

  /**
   * Submit the athlete creation form
   */
  async submitForm() {
    await this.page.getByRole('button', { name: 'Create Athlete' }).click();
  }

  /**
   * Complete athlete creation workflow
   */
  async createAthlete(firstName: string, lastName: string, gender: string) {
    await this.fillCreateForm(firstName, lastName, gender);
    await this.submitForm();
  }

  /**
   * Verify successful athlete creation
   */
  async expectCreateSuccess(firstName: string, lastName: string) {
    await expect(
      this.page.getByText(`Athlete "${firstName} ${lastName}" created successfully!`)
    ).toBeVisible();
  }

  /**
   * Verify validation error is displayed
   */
  async expectValidationError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  /**
   * Verify form field validation errors
   */
  async expectFieldRequired(fieldName: string) {
    await expect(
      this.page.getByText(`${fieldName} is required`)
    ).toBeVisible();
  }

  /**
   * Verify loading state
   */
  async expectFormLoading() {
    await expect(this.page.getByRole('button', { name: 'Creating...' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Creating...' })).toBeDisabled();
  }

  /**
   * Clear form fields
   */
  async clearForm() {
    await this.page.getByLabel('First Name').clear();
    await this.page.getByLabel('Last Name').clear();
  }

  /**
   * Check if form is empty/reset
   */
  async expectFormEmpty() {
    await expect(this.page.getByLabel('First Name')).toHaveValue('');
    await expect(this.page.getByLabel('Last Name')).toHaveValue('');
  }

  /**
   * Debug helper to check for any error messages
   */
  async debugFormErrors() {
    // Check for general errors
    const generalError = this.page.locator('.text-red-800');
    if (await generalError.isVisible()) {
      const errorText = await generalError.textContent();
      console.log('General error found:', errorText);
    }

    // Check for field validation errors
    const fieldErrors = this.page.locator('.text-error-500');
    const errorCount = await fieldErrors.count();
    for (let i = 0; i < errorCount; i++) {
      const errorText = await fieldErrors.nth(i).textContent();
      console.log(`Field error ${i + 1}:`, errorText);
    }
  }
} 