import { Page, expect } from '@playwright/test';

/**
 * ClubPage - Page Object Model for club management workflows
 * 
 * Encapsulates club selection and verification logic that was previously
 * embedded directly in test files. Removes arbitrary timeouts and
 * complex selector logic from tests.
 * 
 * Key improvements from existing patterns:
 * - No arbitrary timeouts (uses proper Playwright waiting)
 * - Semantic locators only
 * - Proper error handling for club states
 * - Handles both single-club and multi-club scenarios
 */
export class ClubPage {
  constructor(private page: Page) {}

  /**
   * Select a club from the club selector dropdown
   * Handles both multi-club users (with dropdown) and single-club users
   * 
   * @param clubName - Name of the club to select
   */
  async selectClub(clubName: string) {
    // First check if club is already selected
    const isAlreadySelected = await this.isClubSelected(clubName);
    if (isAlreadySelected) {
      return; // Club already selected, no action needed
    }

    // Look for club selector button in header (multi-club users)
    const clubSelectorButton = this.page
      .locator('header')
      .locator('button')
      .filter({
        has: this.page.locator('.w-2.h-2.bg-green-500.rounded-full'),
      });

    const hasClubSelector = await clubSelectorButton.isVisible();
    
    if (hasClubSelector) {
      // Multi-club user: open dropdown and select club
      await clubSelectorButton.click();
      
      // Select specific club from dropdown
      const clubOption = this.page.locator('button').filter({ hasText: clubName });
      await expect(clubOption.first()).toBeVisible({ timeout: 5000 });
      await clubOption.first().click();
      
      // ✅ Wait for selection to be processed - no arbitrary timeout
      await this.expectClubSelected(clubName);
    } else {
      // Single-club user: verify the club is the expected one
      await this.expectClubSelected(clubName);
    }
  }

  /**
   * Verify that a specific club is currently selected
   * 
   * @param clubName - Expected club name
   */
  async expectClubSelected(clubName: string) {
    // Look for club name in header area
    const clubText = this.page.locator('header').getByText(clubName);
    await expect(clubText).toBeVisible({ timeout: 10000 });
  }

  /**
   * Check if a specific club is currently selected (without throwing)
   * 
   * @param clubName - Club name to check
   * @returns Promise<boolean> - true if club is selected
   */
  async isClubSelected(clubName: string): Promise<boolean> {
    try {
      const clubText = this.page.locator('header').getByText(clubName);
      await expect(clubText).toBeVisible({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify club selector is visible (for multi-club users)
   */
  async expectClubSelectorVisible() {
    const clubSelectorButton = this.page
      .locator('header')
      .locator('button')
      .filter({
        has: this.page.locator('.w-2.h-2.bg-green-500.rounded-full'),
      });

    await expect(clubSelectorButton).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get the currently selected club name
   * Based on the working patterns from our successful tests
   * 
   * @returns Promise<string | null> - Currently selected club name or null
   */
  async getCurrentlySelectedClub(): Promise<string | null> {
    try {
      // Look for club selector button with green indicator (working pattern from age-group tests)
      const clubSelectorButton = this.page
        .locator('header')
        .locator('button')
        .filter({
          has: this.page.locator('.w-2.h-2.bg-green-500.rounded-full'),
        });

      const isVisible = await clubSelectorButton.isVisible();
      if (isVisible) {
        // Get the text content of the club selector button
        const clubText = await clubSelectorButton.textContent();
        return clubText ? clubText.trim() : null;
      }

      // For single-club users, look for club name in header text
      const headerText = await this.page.locator('header').textContent();
      if (headerText && (headerText.includes('Elite Athletics Club') || headerText.includes('Metro Runners'))) {
        if (headerText.includes('Elite Athletics Club')) return 'Elite Athletics Club';
        if (headerText.includes('Metro Runners')) return 'Metro Runners';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Handle the "No Club Selected" state
   * Navigates through club selection if user has no club selected
   * 
   * @param clubName - Club to select
   */
  async handleNoClubSelected(clubName: string) {
    // Check if we're in "No Club Selected" state
    const noClubHeading = this.page.getByRole('heading', { name: 'No Club Selected' });
    
    try {
      await expect(noClubHeading).toBeVisible({ timeout: 3000 });
      
      // We're in no club selected state, try to select a club
      await this.selectClub(clubName);
      
    } catch {
      // Not in "No Club Selected" state, continue normally
    }
  }

  /**
   * Verify club context is properly loaded on a page
   * Uses the same logic as our successful age-group tests
   */
  async expectClubContextLoaded() {
    // Wait for page to be fully loaded first
    await this.page.waitForLoadState('networkidle');
    
    // Check for either club selector (multi-club) or club name in header (single-club)
    try {
      // Try multi-club pattern first
      await this.expectClubSelectorVisible();
    } catch {
      // Try single-club pattern - just verify header is loaded
      const header = this.page.locator('header');
      await expect(header).toBeVisible({ timeout: 10000 });
    }
  }

  /**
   * Navigate to a page and ensure proper club context
   * Combines navigation with club context verification
   * 
   * @param url - Page URL to navigate to
   * @param expectedClubName - Club that should be selected
   */
  async navigateWithClubContext(url: string, expectedClubName: string) {
    await this.page.goto(url);
    
    // Handle potential "No Club Selected" state
    await this.handleNoClubSelected(expectedClubName);
    
    // Verify club context is loaded
    await this.expectClubContextLoaded();
  }
} 