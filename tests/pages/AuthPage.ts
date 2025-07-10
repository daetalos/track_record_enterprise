import { Page, expect } from '@playwright/test';

/**
 * AuthPage - Page Object Model for authentication workflows
 * 
 * Eliminates code duplication across test files and provides
 * clean authentication methods following Playwright standards.
 * 
 * Key improvements from existing patterns:
 * - No arbitrary timeouts (uses proper Playwright waiting)
 * - Semantic locators only
 * - Proper error handling
 * - Reusable across all test files
 */
export class AuthPage {
  constructor(private page: Page) {}

  /**
   * Navigate to sign-in page and verify it loads properly
   */
  async goto() {
    await this.page.goto('/signin');
    await expect(this.page).toHaveURL(/signin/);
    
    // Verify sign-in form is present
    await expect(this.page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  }

  /**
   * Sign in with email and password
   * Replaces duplicated signIn functions across test files
   * 
   * @param email - User email address
   * @param password - User password
   */
  async signIn(email: string, password: string) {
    await this.page.getByPlaceholder('Enter your email').fill(email);
    await this.page.getByPlaceholder('Enter your password').fill(password);
    await this.page.getByRole('button', { name: 'Sign In', exact: true }).click();
    
    // ✅ Proper waiting - no arbitrary timeouts
    // Wait for successful authentication and redirect to dashboard
    await expect(this.page).toHaveURL(/dashboard/);
  }

  /**
   * Sign in with default admin credentials
   * Convenience method for most test scenarios
   */
  async signInAsAdmin() {
    await this.signIn('admin@trackrecord.dev', 'password123');
  }

  /**
   * Navigate to sign-up page and verify it loads properly
   */
  async gotoSignUp() {
    await this.page.goto('/signup');
    await expect(this.page).toHaveURL(/signup/);
    
    // Verify sign-up form is present
    await expect(this.page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
  }

  /**
   * Complete sign-up process with user details
   * 
   * @param userData - User registration information
   */
  async signUp(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    await this.page.getByPlaceholder('Enter your first name').fill(userData.firstName);
    await this.page.getByPlaceholder('Enter your last name').fill(userData.lastName);
    await this.page.getByPlaceholder('Enter your email').fill(userData.email);
    await this.page.getByPlaceholder('Enter your password').fill(userData.password);

    // Check terms checkbox - using working selector
    await this.page.locator('input[type="checkbox"]').check({ force: true });

    // Submit form
    await this.page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    // Wait for redirect to signin page after successful registration
    await expect(this.page).toHaveURL(/signin/);
  }

  /**
   * Verify validation error message is displayed
   * 
   * @param message - Expected error message text
   */
  async expectValidationError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  /**
   * Verify user is authenticated and on dashboard
   */
  async expectAuthenticated() {
    await expect(this.page).toHaveURL(/dashboard/);
  }

  /**
   * Sign out current user
   */
  async signOut() {
    // Look for user dropdown or sign out button in header
    await this.page.getByRole('button', { name: /sign out|logout/i }).click();
    
    // Verify redirect to sign-in page
    await expect(this.page).toHaveURL(/signin/);
  }

  /**
   * Verify sign-in form is visible and ready for input
   */
  async expectSignInFormVisible() {
    // Check if signin form is present using semantic locators
    await expect(this.page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(this.page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(this.page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
  }
} 