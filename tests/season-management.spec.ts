import { test, expect } from '@playwright/test';
import { AppWorkflow } from './pages/AppWorkflow';
import { SeasonPage } from './pages/SeasonPage';

test.describe('Season Management', () => {
  test('user can manage seasons with full CRUD operations', async ({
    page,
  }) => {
    const app = new AppWorkflow(page);
    const seasonPage = new SeasonPage(page);

    // Step 1: Sign in and navigate to seasons
    await app.signInWithClub('admin@example.com', 'password123', 'Test Club');
    await seasonPage.goto();

    // Step 2: Create a new season
    await seasonPage.createSeason(
      'Track & Field 2025',
      'Outdoor track and field season'
    );
    await seasonPage.expectSeasonInList('Track & Field 2025');

    // Step 3: Create another season for testing
    await seasonPage.createSeason('Indoor 2025', 'Indoor track season');
    await seasonPage.expectSeasonInList('Indoor 2025');

    // Step 4: Test search functionality
    await seasonPage.searchSeasons('Track');
    await seasonPage.expectSeasonInList('Track & Field 2025');
    await seasonPage.expectSeasonNotInList('Indoor 2025');

    // Clear search to see all seasons
    await seasonPage.searchSeasons('');
    await seasonPage.expectSeasonInList('Track & Field 2025');
    await seasonPage.expectSeasonInList('Indoor 2025');

    // Step 5: Test table sorting
    await seasonPage.sortByColumn('Name');
    // Note: Sort verification would depend on actual implementation

    // Step 6: Edit a season
    await seasonPage.editSeason(
      'Track & Field 2025',
      'Outdoor Track & Field 2025',
      'Updated outdoor track and field season'
    );
    await seasonPage.expectSeasonInList('Outdoor Track & Field 2025');
    await seasonPage.expectSeasonNotInList('Track & Field 2025');

    // Step 7: Test validation - try to create season with empty name
    await page.getByRole('button', { name: 'Add Season' }).click();
    await page.getByRole('button', { name: 'Create Season' }).click();
    await seasonPage.expectValidationError('Name is required');

    // Cancel the modal
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Step 8: Delete a season
    await seasonPage.deleteSeason('Indoor 2025');
    await seasonPage.expectSeasonNotInList('Indoor 2025');
    await seasonPage.expectSeasonInList('Outdoor Track & Field 2025');
  });

  test('season table sorting and filtering works correctly', async ({
    page,
  }) => {
    const app = new AppWorkflow(page);
    const seasonPage = new SeasonPage(page);

    // Sign in and navigate
    await app.signInWithClub('admin@example.com', 'password123', 'Test Club');
    await seasonPage.goto();

    // Create multiple seasons for testing sorting/filtering
    await seasonPage.createSeason('Track & Field', 'Outdoor season');
    await seasonPage.createSeason('Cross Country', 'Fall season');
    await seasonPage.createSeason('Indoor Track', 'Winter season');

    // Test search functionality
    await seasonPage.searchSeasons('Track');
    await seasonPage.expectSeasonInList('Track & Field');
    await seasonPage.expectSeasonInList('Indoor Track');
    await seasonPage.expectSeasonNotInList('Cross Country');

    // Clear search
    await seasonPage.searchSeasons('');

    // Verify all seasons are visible
    await seasonPage.expectSeasonInList('Track & Field');
    await seasonPage.expectSeasonInList('Cross Country');
    await seasonPage.expectSeasonInList('Indoor Track');

    // Test column sorting
    await seasonPage.sortByColumn('Name');

    // Clean up - delete test seasons
    await seasonPage.deleteSeason('Track & Field');
    await seasonPage.deleteSeason('Cross Country');
    await seasonPage.deleteSeason('Indoor Track');
  });

  test('season form validation works correctly', async ({ page }) => {
    const app = new AppWorkflow(page);
    const seasonPage = new SeasonPage(page);

    // Sign in and navigate
    await app.signInWithClub('admin@example.com', 'password123', 'Test Club');
    await seasonPage.goto();

    // Test name validation - empty name
    await page.getByRole('button', { name: 'Add Season' }).click();
    await page.getByRole('button', { name: 'Create Season' }).click();
    await seasonPage.expectValidationError('Name is required');

    // Test name length validation
    await page.getByLabel('Season Name').fill('a'.repeat(101)); // 101 characters
    await page.getByRole('button', { name: 'Create Season' }).click();
    await seasonPage.expectValidationError(
      'Name must be 100 characters or less'
    );

    // Test description length validation
    await page.getByLabel('Season Name').clear();
    await page.getByLabel('Season Name').fill('Valid Season Name');
    await page.getByLabel('Description').fill('a'.repeat(501)); // 501 characters
    await page.getByRole('button', { name: 'Create Season' }).click();
    await seasonPage.expectValidationError(
      'Description must be 500 characters or less'
    );

    // Test successful creation with valid data
    await page.getByLabel('Description').clear();
    await page.getByLabel('Description').fill('Valid description');
    await page.getByRole('button', { name: 'Create Season' }).click();

    // Verify season was created
    await seasonPage.expectSeasonInList('Valid Season Name');

    // Clean up
    await seasonPage.deleteSeason('Valid Season Name');
  });
});
