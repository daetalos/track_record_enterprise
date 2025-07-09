import { Page, expect } from '@playwright/test';
import type { TestUser } from '../fixtures/club-test-data';

/**
 * Reusable Test Helper Functions for Club Management BDD Scenarios
 * 
 * Provides common functionality for authentication, navigation, 
 * and club management operations in tests
 */

export class ClubTestHelpers {
  
  /**
   * Sign up a new user account
   * Uses the existing registration flow patterns from auth-registration.spec.ts
   */
  static async signUpUser(page: Page, userData: TestUser): Promise<void> {
    await page.goto('/signup');
    await this.waitForPageReady(page);

    // Fill out the registration form
    await page.getByPlaceholder('Enter your first name').fill(userData.firstName);
    await page.getByPlaceholder('Enter your last name').fill(userData.lastName);
    await page.getByPlaceholder('Enter your email').fill(userData.email);
    await page.getByPlaceholder('Enter your password').fill(userData.password);

    // Check terms checkbox
    await page.locator('input[type="checkbox"]').check({ force: true });

    // Submit form
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    // Wait for redirect to signin page
    await page.waitForURL('**/signin**', { timeout: 10000 });
    await expect(page).toHaveURL(/signin/);
  }

  /**
   * Sign in an existing user
   * Uses the authentication system to log in
   */
  static async signInUser(page: Page, email: string, password: string): Promise<void> {
    await page.goto('/signin');
    await this.waitForPageReady(page);

    // Fill out the signin form
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);

    // Submit form
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // Wait for successful authentication and redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    await this.waitForAuthentication(page);
  }

  /**
   * Wait for user to be fully authenticated and session established
   */
  static async waitForAuthentication(page: Page): Promise<void> {
    // Wait for club context to be loaded (may appear in header/navigation)
    await this.waitForPageReady(page);
    
    // Additional wait for club context to be established
    await page.waitForTimeout(2000);
  }

  /**
   * Verify club selector is visible and contains expected clubs
   */
  static async verifyClubSelectorVisible(page: Page): Promise<void> {
    // Club selector should be visible in the header area
    // For single club: shows as a div with club name
    // For multi club: shows as a button that can be clicked
    const clubComponent = page.locator('header').locator('.w-2.h-2.bg-green-500.rounded-full').locator('..');
    
    await expect(clubComponent).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify a specific club is selected in the club selector
   */
  static async verifyClubSelected(page: Page, clubName: string): Promise<void> {
    // Look for the club name in the header (either in div for single club or button for multi club)
    const clubText = page.locator('header').locator(`text="${clubName}"`);
    await expect(clubText).toBeVisible({ timeout: 10000 });
  }

  /**
   * Select a club from the club selector dropdown
   */
  static async selectClub(page: Page, clubName: string): Promise<void> {
    // Find the club selector button in the header (only exists for multi-club users)
    const selectorButton = page.locator('header').locator('button').filter({ 
      has: page.locator('.w-2.h-2.bg-green-500.rounded-full')
    });
    
    // Click to open the dropdown
    await selectorButton.click();
    
    // Wait for dropdown to appear and click on the desired club
    const clubOption = page.locator(`button:has-text("${clubName}")`).last();
    await expect(clubOption).toBeVisible({ timeout: 5000 });
    await clubOption.click();
    
    // Wait for the selection to be processed
    await page.waitForTimeout(2000);
  }

  /**
   * Verify that club data is properly filtered (data isolation testing)
   */
  static async verifyClubDataIsolation(page: Page, expectedClubName: string): Promise<void> {
    // Implementation will be added in Step 4 (Develop Refine)
    console.log('ClubTestHelpers.verifyClubDataIsolation() - Implementation pending');
  }

  /**
   * Navigate to different pages and verify club context persistence
   */
  static async verifyClubPersistenceAcrossPages(page: Page, expectedClubName: string): Promise<void> {
    // Implementation will be added in Step 4 (Develop Refine)
    console.log('ClubTestHelpers.verifyClubPersistenceAcrossPages() - Implementation pending');
  }

  /**
   * Attempt unauthorized club access and verify proper error handling
   */
  static async verifyUnauthorizedClubAccess(page: Page, unauthorizedClubName: string): Promise<void> {
    // Implementation will be added in Step 4 (Develop Refine)
    console.log('ClubTestHelpers.verifyUnauthorizedClubAccess() - Implementation pending');
  }

  /**
   * Wait for page to finish loading and all dynamic content to be ready
   */
  static async waitForPageReady(page: Page): Promise<void> {
    // Wait for network to be idle and page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Additional buffer for React hydration
  }

  /**
   * Get the currently selected club name from the UI
   */
  static async getCurrentlySelectedClub(page: Page): Promise<string | null> {
    try {
      // Look for club name in the header area (could be in div or button)
      const clubComponent = page.locator('header').locator('.w-2.h-2.bg-green-500.rounded-full').locator('..');
      
      const clubText = await clubComponent.textContent();
      // Extract just the club name part (remove any role text or extra content)
      const clubName = clubText?.split('\n')[0]?.trim() || null;
      return clubName;
    } catch {
      return null;
    }
  }

  /**
   * Verify error message is displayed to user
   */
  static async verifyErrorMessage(page: Page, expectedErrorText: string): Promise<void> {
    // Look for error message in common error display areas
    const errorMessage = page.locator(`text="${expectedErrorText}"`).or(
      page.locator('[role="alert"]').filter({ hasText: expectedErrorText })
    ).or(
      page.locator('.error, .alert-error, [class*="error"], [class*="alert"]').filter({ hasText: expectedErrorText })
    );
    
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Clear browser storage and cookies for clean test state
   */
  static async clearBrowserState(page: Page): Promise<void> {
    await page.context().clearCookies();
    // Safely clear localStorage and sessionStorage by navigating to data URI first
    try {
      await page.goto('data:text/html,<html></html>');
      await page.evaluate(() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          // Ignore security errors when clearing storage
        }
      });
    } catch (e) {
      // Ignore security errors during browser state clearing
    }
  }
} 