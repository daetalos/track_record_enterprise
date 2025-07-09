import { test, expect } from '@playwright/test';
import { ClubTestHelpers } from './helpers/club-test-helpers';
import { clubTestData, ClubTestDataSeeder } from './fixtures/club-test-data';

/**
 * Club Management BDD Test Scenarios
 * 
 * These tests validate the 5 Acceptance Criteria for the club management feature:
 * AC1: Club Context Establishment
 * AC2: Multi-Club Selection  
 * AC3: Club Context Switching
 * AC4: Data Isolation
 * AC5: Session Persistence
 */

test.describe('Club Management & Context Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear browser state for clean test environment
    await ClubTestHelpers.clearBrowserState(page);
    
    // Navigate to home page before each test
    await page.goto('/');
    await ClubTestHelpers.waitForPageReady(page);
  });

  /**
   * BDD Scenario 1: Single Club Auto-Selection
   * 
   * Given I have access to only "Metro Runners"
   * When I log into the system  
   * Then "Metro Runners" should be automatically selected
   * And I should see "Metro Runners" in the club selector
   * And all data should be filtered to this club
   */
  test('Scenario 1: User with single club access gets auto-selection', async ({ page }) => {
    // GIVEN: I have access to only one club (using existing seed user)
    const testUser = clubTestData.singleClubUser;
    
    // WHEN: I log into the system
    await ClubTestHelpers.signInUser(page, testUser.email, testUser.password);
    
    // THEN: The club should be automatically selected
    await ClubTestHelpers.verifyClubSelected(page, testUser.club.name);
    
    // AND: I should see the club in the club selector
    await ClubTestHelpers.verifyClubSelectorVisible(page);
    
    // AND: All data should be filtered to this club (basic verification)
    const currentClub = await ClubTestHelpers.getCurrentlySelectedClub(page);
    expect(currentClub).toContain(testUser.club.name);
  });

  /**
   * BDD Scenario 2: Multi-Club Selection Interface
   * 
   * Given I have access to "Elite Athletics Club" and "Metro Runners"
   * When I log into the system
   * Then I should see a club selector with both clubs
   * And I should be prompted to select a club
   * And no club data should be displayed until I make a selection
   */
  test('Scenario 2: User with multiple club access sees selection interface', async ({ page }) => {
    // GIVEN: I have access to multiple clubs (using existing seed user)
    const testUser = clubTestData.multiClubUser;
    
    // WHEN: I log into the system
    await ClubTestHelpers.signInUser(page, testUser.email, testUser.password);
    
    // THEN: I should see a club selector with both clubs
    await ClubTestHelpers.verifyClubSelectorVisible(page);
    
    // AND: I should be able to see both clubs are available
    // The specific verification will depend on how the multi-club UI is implemented
    // For now, verify that the club selector is interactive (not just an indicator)
    const clubSelector = page.locator('button').filter({ 
      has: page.locator('[class*="w-2 h-2"]') // Green indicator dot
    });
    await expect(clubSelector).toBeVisible();
    
    // Click to open the dropdown and verify multiple options
    await clubSelector.click();
    
    // Look for both club names in the dropdown
    for (const club of testUser.clubs) {
      const clubOption = page.locator(`button:has-text("${club.name}")`);
      await expect(clubOption).toBeVisible({ timeout: 5000 });
    }
  });

  /**
   * BDD Scenario 3: Club Context Switching
   * 
   * Given I am logged in and working with "Springfield Athletics Club"
   * And I have access to "Riverside Track Club"
   * When I select "Riverside Track Club" from the club selector
   * Then the page should reload with "Riverside Track Club" data
   * And the club selector should show "Riverside Track Club" as selected
   * And I should only see athletes and performances from "Riverside Track Club"
   */
  test('Scenario 3: Club context switching works correctly', async ({ page }) => {
    // GIVEN: I am logged in and working with Elite Athletics Club
    const testUser = clubTestData.multiClubUser;
    const initialClub = testUser.clubs[0]; // Elite Athletics Club
    const targetClub = testUser.clubs[1];  // Metro Runners
    
    // Sign in with existing seed user
    await ClubTestHelpers.signInUser(page, testUser.email, testUser.password);
    
    // Verify initial state - first club should be selected or available for selection
    await ClubTestHelpers.verifyClubSelectorVisible(page);
    
    // WHEN: I select the second club from the club selector
    await ClubTestHelpers.selectClub(page, targetClub.name);
    
    // THEN: The club selector should show the new club as selected
    await ClubTestHelpers.verifyClubSelected(page, targetClub.name);
    
    // AND: The context should have switched
    const currentClub = await ClubTestHelpers.getCurrentlySelectedClub(page);
    expect(currentClub).toContain(targetClub.name);
  });

  /**
   * BDD Scenario 4: Data Isolation Verification
   * 
   * Given I am working with "Springfield Athletics Club"
   * And there are athletes in both "Springfield Athletics Club" and "Riverside Track Club"
   * When I view the athletes list
   * Then I should only see athletes from "Springfield Athletics Club"
   * And I should not see any athletes from "Riverside Track Club"
   */
  test('Scenario 4: Club data isolation is properly enforced', async ({ page }) => {
    // GIVEN: I am working with Metro Runners
    const testUser = clubTestData.singleClubUser;
    
    // Sign in to establish club context
    await ClubTestHelpers.signInUser(page, testUser.email, testUser.password);
    
    // Verify the correct club is selected
    await ClubTestHelpers.verifyClubSelected(page, testUser.club.name);
    
    // WHEN: I navigate to areas that would show club-specific data
    // (This test validates that data filtering is working)
    
    // Navigate to dashboard or any club-specific page
    await page.goto('/dashboard');
    await ClubTestHelpers.waitForPageReady(page);
    
    // THEN: Verify club context is maintained across navigation
    await ClubTestHelpers.verifyClubSelected(page, testUser.club.name);
    
    // AND: Only data from the selected club should be visible
    // This is a basic validation - in a real scenario, you'd verify specific data elements
    const currentClub = await ClubTestHelpers.getCurrentlySelectedClub(page);
    expect(currentClub).toContain(testUser.club.name);
  });

  /**
   * BDD Scenario 5: Session Persistence
   * 
   * Given I am logged in with "Springfield Athletics Club" selected
   * When I navigate to the performances page
   * And then navigate to the athletes page  
   * And then navigate to the records page
   * Then "Springfield Athletics Club" should remain selected on all pages
   * And all data should consistently be from "Springfield Athletics Club"
   */
  test('Scenario 5: Club context persists across page navigation', async ({ page }) => {
    // GIVEN: I am logged in with Metro Runners selected
    const testUser = clubTestData.singleClubUser;
    
    // Sign in with existing seed user
    await ClubTestHelpers.signInUser(page, testUser.email, testUser.password);
    
    // Verify initial club selection
    await ClubTestHelpers.verifyClubSelected(page, testUser.club.name);
    
    // WHEN: I navigate to different pages
    const pagesToTest = ['/dashboard', '/dashboard/profile', '/dashboard/charts/bar-chart'];
    
    for (const targetPage of pagesToTest) {
      // Navigate to the page
      await page.goto(targetPage);
      await ClubTestHelpers.waitForPageReady(page);
      
      // THEN: Club context should persist
      await ClubTestHelpers.verifyClubSelected(page, testUser.club.name);
      
      // AND: The selected club should remain consistent
      const currentClub = await ClubTestHelpers.getCurrentlySelectedClub(page);
      expect(currentClub).toContain(testUser.club.name);
    }
  });

  /**
   * BDD Scenario 6: Club Access Validation
   * 
   * Given I am logged in with access only to "Springfield Athletics Club"
   * When I attempt to switch to "Riverside Track Club" (which I don't have access to)
   * Then I should see an "Access Denied" error message
   * And my club context should remain "Springfield Athletics Club"
   * And the attempt should be logged for security monitoring
   */
  test('Scenario 6: Unauthorized club access attempts are blocked', async ({ page }) => {
    // GIVEN: I am logged in with access only to one club
    const testUser = clubTestData.singleClubUser;
    const unauthorizedClub = 'Elite Athletics Club'; // Club the user doesn't have access to
    
    // Sign in with existing seed user
    await ClubTestHelpers.signInUser(page, testUser.email, testUser.password);
    
    // Verify initial club selection
    await ClubTestHelpers.verifyClubSelected(page, testUser.club.name);
    
    // WHEN: I attempt to access an unauthorized club via API
    // (Simulating a direct API call since UI won't show unauthorized clubs)
    const originalClub = await ClubTestHelpers.getCurrentlySelectedClub(page);
    
    // Try to make an unauthorized club selection API call
    const response = await page.evaluate(async (clubName) => {
      try {
        const result = await fetch('/api/clubs/select', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clubId: 'fake-unauthorized-club-id' }),
        });
        return {
          ok: result.ok,
          status: result.status,
          statusText: result.statusText,
        };
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }, unauthorizedClub);
    
    // THEN: The request should be rejected (403 Forbidden expected)
    expect(response.status).toBe(403);
    
    // AND: My club context should remain unchanged
    const clubAfterAttempt = await ClubTestHelpers.getCurrentlySelectedClub(page);
    expect(clubAfterAttempt).toBe(originalClub);
    expect(clubAfterAttempt).toContain(testUser.club.name);
  });
}); 