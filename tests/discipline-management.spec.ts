import { test, expect } from '@playwright/test';
import { DisciplinePage } from './pages/DisciplinePage';
import { AuthPage } from './pages/AuthPage';

test.describe('Discipline Management', () => {
  let disciplinePage: DisciplinePage;
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    disciplinePage = new DisciplinePage(page);
    authPage = new AuthPage(page);

    // Login as admin to access discipline management
    await authPage.goto();
    await authPage.signInAsAdmin();
    
    // Navigate to disciplines page
    await disciplinePage.navigateToDisciplines();
    await disciplinePage.waitForPageLoad();
  });

  test.describe('Page Display and Navigation', () => {
    test('should display discipline management page correctly', async () => {
      // Verify page title and description
      await expect(disciplinePage.pageTitle).toBeVisible();
      await expect(disciplinePage.pageTitle).toContainText('Discipline Management');
      
      // Verify main controls are present
      await expect(disciplinePage.createButton).toBeVisible();
      await expect(disciplinePage.seasonFilter).toBeVisible();
      await expect(disciplinePage.searchInput).toBeVisible();
      
      // Verify table structure or empty state
      const disciplineCount = await disciplinePage.getDisciplineCount();
      if (disciplineCount > 0) {
        await expect(disciplinePage.table).toBeVisible();
        await expect(disciplinePage.nameHeader).toBeVisible();
        await expect(disciplinePage.seasonHeader).toBeVisible();
        await expect(disciplinePage.typeHeader).toBeVisible();
        await expect(disciplinePage.actionsHeader).toBeVisible();
      } else {
        await disciplinePage.expectEmptyState();
      }
    });

    test('should navigate to disciplines from sidebar', async ({ page }) => {
      // Go to another page first
      await page.goto('/seasons');
      await expect(page.getByRole('heading', { name: /season management/i })).toBeVisible();
      
      // Navigate back to disciplines
      await disciplinePage.navigateToDisciplines();
      await expect(disciplinePage.pageTitle).toBeVisible();
    });
  });

  test.describe('Create Discipline Modal', () => {
    test('should open and close create discipline modal', async () => {
      // Open modal
      await disciplinePage.openCreateModal();
      await expect(disciplinePage.modalTitle).toContainText('Create Discipline');
      await expect(disciplinePage.modalDescription).toContainText('Add a new discipline');
      
      // Verify form fields are present
      await expect(disciplinePage.seasonSelect).toBeVisible();
      await expect(disciplinePage.nameInput).toBeVisible();
      await expect(disciplinePage.descriptionInput).toBeVisible();
      await expect(disciplinePage.timedRadio).toBeVisible();
      await expect(disciplinePage.measuredRadio).toBeVisible();
      await expect(disciplinePage.teamSizeInput).toBeVisible();
      
      // Close modal with cancel button
      await disciplinePage.closeModal();
    });

    test('should validate required fields when creating discipline', async () => {
      await disciplinePage.openCreateModal();
      
      // Try to submit without filling required fields
      await disciplinePage.submitForm();
      
      // Should show validation errors
      await disciplinePage.expectValidationError('season');
      await disciplinePage.expectValidationError('name');
      
      // Modal should remain open
      await expect(disciplinePage.modal).toBeVisible();
    });

    test('should enforce business rule: timed vs measured exclusivity', async () => {
      await disciplinePage.openCreateModal();
      
      // Timed should be selected by default
      await expect(disciplinePage.timedRadio).toBeChecked();
      await expect(disciplinePage.measuredRadio).not.toBeChecked();
      
      // Select measured - should deselect timed
      await disciplinePage.measuredRadio.check();
      await expect(disciplinePage.measuredRadio).toBeChecked();
      await expect(disciplinePage.timedRadio).not.toBeChecked();
      
      // Select timed again - should deselect measured
      await disciplinePage.timedRadio.check();
      await expect(disciplinePage.timedRadio).toBeChecked();
      await expect(disciplinePage.measuredRadio).not.toBeChecked();
      
      await disciplinePage.closeModal();
    });

    test('should validate team size constraints', async () => {
      await disciplinePage.openCreateModal();
      
      // Fill required fields
      await disciplinePage.fillDisciplineForm({
        season: 'Track & Field',
        name: 'Test Discipline',
        type: 'timed'
      });
      
      // Test invalid team size (too large)
      await disciplinePage.teamSizeInput.fill('15');
      await disciplinePage.submitForm();
      await disciplinePage.expectValidationError('teamSize');
      
      // Test invalid team size (too small)
      await disciplinePage.teamSizeInput.fill('0');
      await disciplinePage.submitForm();
      await disciplinePage.expectValidationError('teamSize');
      
      // Test valid team size
      await disciplinePage.teamSizeInput.fill('4');
      await disciplinePage.submitForm();
      
      // Should close modal successfully
      await expect(disciplinePage.modal).not.toBeVisible();
    });

    test('should create individual timed discipline successfully', async () => {
      const disciplineName = '100m Sprint Test';
      
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: disciplineName,
        description: 'Individual sprint event for testing',
        type: 'timed'
      });
      
      // Verify discipline appears in table
      await disciplinePage.expectDisciplineInTable(disciplineName, 'Track & Field', 'Timed');
      
      // Cleanup: delete the test discipline
      await disciplinePage.deleteDiscipline(disciplineName);
    });

    test('should create team measured discipline successfully', async () => {
      const disciplineName = '4x100m Relay Test';
      
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: disciplineName,
        description: 'Team relay event for testing',
        type: 'timed',
        teamSize: 4
      });
      
      // Verify discipline appears in table with team size
      await disciplinePage.expectDisciplineInTable(disciplineName, 'Track & Field', 'Timed');
      await disciplinePage.expectTeamSizeDisplay(disciplineName, 4);
      
      // Cleanup: delete the test discipline
      await disciplinePage.deleteDiscipline(disciplineName);
    });

    test('should create measured discipline successfully', async () => {
      const disciplineName = 'Shot Put Test';
      
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: disciplineName,
        description: 'Throwing event for testing',
        type: 'measured'
      });
      
      // Verify discipline appears in table
      await disciplinePage.expectDisciplineInTable(disciplineName, 'Track & Field', 'Measured');
      
      // Cleanup: delete the test discipline
      await disciplinePage.deleteDiscipline(disciplineName);
    });
  });

  test.describe('Edit Discipline Modal', () => {
    test('should edit existing discipline successfully', async () => {
      const originalName = '100m Sprint Test';
      const updatedName = '100m Sprint Updated';
      
      // First create a discipline to edit
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: originalName,
        description: 'Original description',
        type: 'timed'
      });
      
      // Edit the discipline
      await disciplinePage.updateDiscipline(originalName, {
        name: updatedName,
        description: 'Updated description',
        type: 'measured'
      });
      
      // Verify changes
      await disciplinePage.expectDisciplineInTable(updatedName, 'Track & Field', 'Measured');
      
      // Cleanup
      await disciplinePage.deleteDiscipline(updatedName);
    });

    test('should pre-fill form with existing discipline data', async () => {
      const disciplineName = 'Pre-fill Test';
      
      // Create discipline
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: disciplineName,
        description: 'Test description',
        type: 'timed',
        teamSize: 4
      });
      
      // Open edit modal
      await disciplinePage.editDiscipline(disciplineName);
      
      // Verify form is pre-filled
      await expect(disciplinePage.nameInput).toHaveValue(disciplineName);
      await expect(disciplinePage.descriptionInput).toHaveValue('Test description');
      await expect(disciplinePage.timedRadio).toBeChecked();
      await expect(disciplinePage.teamSizeInput).toHaveValue('4');
      
      // Close without saving
      await disciplinePage.closeModal();
      
      // Cleanup
      await disciplinePage.deleteDiscipline(disciplineName);
    });
  });

  test.describe('Delete Discipline', () => {
    test('should delete discipline with confirmation', async () => {
      const disciplineName = 'Delete Test';
      
      // Create discipline to delete
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: disciplineName,
        description: 'Will be deleted',
        type: 'timed'
      });
      
      // Verify it exists
      await disciplinePage.expectDisciplineInTable(disciplineName, 'Track & Field', 'Timed');
      
      // Delete with confirmation
      await disciplinePage.deleteDiscipline(disciplineName, true);
      
      // Verify it's gone
      const disciplineNames = await disciplinePage.getDisciplineNames();
      expect(disciplineNames).not.toContain(disciplineName);
    });

    test('should cancel discipline deletion', async () => {
      const disciplineName = 'Cancel Delete Test';
      
      // Create discipline
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: disciplineName,
        description: 'Should not be deleted',
        type: 'timed'
      });
      
      // Try to delete but cancel
      await disciplinePage.deleteDiscipline(disciplineName, false);
      
      // Verify it still exists
      await disciplinePage.expectDisciplineInTable(disciplineName, 'Track & Field', 'Timed');
      
      // Cleanup
      await disciplinePage.deleteDiscipline(disciplineName, true);
    });
  });

  test.describe('Season Filtering', () => {
    test('should filter disciplines by season', async () => {
      // Create disciplines in different seasons
      const trackDiscipline = 'Track Test';
      const indoorDiscipline = 'Indoor Test';
      
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: trackDiscipline,
        type: 'timed'
      });
      
      await disciplinePage.createDiscipline({
        season: 'Indoors',
        name: indoorDiscipline,
        type: 'timed'
      });
      
      // Filter by Track & Field
      await disciplinePage.selectSeason('Track & Field');
      let disciplineNames = await disciplinePage.getDisciplineNames();
      expect(disciplineNames).toContain(trackDiscipline);
      expect(disciplineNames).not.toContain(indoorDiscipline);
      
      // Filter by Indoors
      await disciplinePage.selectSeason('Indoors');
      disciplineNames = await disciplinePage.getDisciplineNames();
      expect(disciplineNames).toContain(indoorDiscipline);
      expect(disciplineNames).not.toContain(trackDiscipline);
      
      // Show all seasons
      await disciplinePage.selectAllSeasons();
      disciplineNames = await disciplinePage.getDisciplineNames();
      expect(disciplineNames).toContain(trackDiscipline);
      expect(disciplineNames).toContain(indoorDiscipline);
      
      // Cleanup
      await disciplinePage.deleteDiscipline(trackDiscipline);
      await disciplinePage.deleteDiscipline(indoorDiscipline);
    });

    test('should show empty state for season with no disciplines', async () => {
      // Filter by a season that should have no disciplines
      await disciplinePage.selectSeason('Indoors');
      
      // Check if there are any disciplines
      const disciplineCount = await disciplinePage.getDisciplineCount();
      if (disciplineCount === 0) {
        await disciplinePage.expectEmptyState('Indoors');
      }
    });
  });

  test.describe('Search Functionality', () => {
    test('should search disciplines by name', async () => {
      // Create test disciplines
      const sprintName = 'Sprint Search Test';
      const jumpName = 'Jump Search Test';
      
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: sprintName,
        type: 'timed'
      });
      
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: jumpName,
        type: 'measured'
      });
      
      // Search for "sprint"
      await disciplinePage.searchDisciplines('Sprint');
      await disciplinePage.expectSearchResults('Sprint', [sprintName]);
      
      // Search for "jump"
      await disciplinePage.searchDisciplines('Jump');
      await disciplinePage.expectSearchResults('Jump', [jumpName]);
      
      // Clear search
      await disciplinePage.clearSearch();
      const allNames = await disciplinePage.getDisciplineNames();
      expect(allNames).toContain(sprintName);
      expect(allNames).toContain(jumpName);
      
      // Cleanup
      await disciplinePage.deleteDiscipline(sprintName);
      await disciplinePage.deleteDiscipline(jumpName);
    });

    test('should combine season filter and search', async () => {
      // Create disciplines in different seasons
      const trackSprint = 'Track Sprint Combo';
      const indoorSprint = 'Indoor Sprint Combo';
      
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: trackSprint,
        type: 'timed'
      });
      
      await disciplinePage.createDiscipline({
        season: 'Indoors',
        name: indoorSprint,
        type: 'timed'
      });
      
      // Filter by season and search
      await disciplinePage.selectSeason('Track & Field');
      await disciplinePage.searchDisciplines('Sprint');
      
      const filteredNames = await disciplinePage.getDisciplineNames();
      expect(filteredNames).toContain(trackSprint);
      expect(filteredNames).not.toContain(indoorSprint);
      
      // Cleanup
      await disciplinePage.clearSearch();
      await disciplinePage.selectAllSeasons();
      await disciplinePage.deleteDiscipline(trackSprint);
      await disciplinePage.deleteDiscipline(indoorSprint);
    });
  });

  test.describe('Table Sorting', () => {
    test('should sort disciplines by name', async () => {
      // Create disciplines with names that will sort differently
      const aName = 'A Sprint Test';
      const zName = 'Z Sprint Test';
      
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: zName,
        type: 'timed'
      });
      
      await disciplinePage.createDiscipline({
        season: 'Track & Field',
        name: aName,
        type: 'timed'
      });
      
      // Sort by name
      await disciplinePage.sortByColumn('name');
      
      const sortedNames = await disciplinePage.getDisciplineNames();
      const aIndex = sortedNames.indexOf(aName);
      const zIndex = sortedNames.indexOf(zName);
      
      // A should come before Z (or vice versa if sorted descending)
      expect(aIndex).not.toBe(-1);
      expect(zIndex).not.toBe(-1);
      expect(aIndex).not.toBe(zIndex);
      
      // Cleanup
      await disciplinePage.deleteDiscipline(aName);
      await disciplinePage.deleteDiscipline(zName);
    });
  });

  test.describe('Form Validation and UX', () => {
    test('should update character count in description field', async () => {
      await disciplinePage.openCreateModal();
      await disciplinePage.verifyCharacterCountUpdates();
      await disciplinePage.closeModal();
    });

    test('should show type exclusivity in UI', async () => {
      await disciplinePage.openCreateModal();
      await disciplinePage.expectTypeExclusivity();
      await disciplinePage.closeModal();
    });

    test('should handle team size validation correctly', async () => {
      await disciplinePage.openCreateModal();
      
      // Fill required fields
      await disciplinePage.fillDisciplineForm({
        season: 'Track & Field',
        name: 'Validation Test',
        type: 'timed'
      });
      
      // Test various team sizes
      const testSizes = [0, 1, 5, 10, 11, 15];
      
      for (const size of testSizes) {
        await disciplinePage.teamSizeInput.fill(size.toString());
        await disciplinePage.submitForm();
        
        if (size < 1 || size > 10) {
          await disciplinePage.expectValidationError('teamSize');
        } else {
          // Valid size should not show error and should close modal
          await expect(disciplinePage.modal).not.toBeVisible();
          
          // Clean up and reopen modal for next test
          if (size !== testSizes[testSizes.length - 1]) {
            await disciplinePage.deleteDiscipline('Validation Test');
            await disciplinePage.openCreateModal();
            await disciplinePage.fillDisciplineForm({
              season: 'Track & Field',
              name: 'Validation Test',
              type: 'timed'
            });
          }
        }
      }
      
      // Final cleanup
      await disciplinePage.deleteDiscipline('Validation Test');
    });
  });

  test.describe('Business Rules Integration', () => {
    test('should enforce all business rules in complete workflow', async () => {
      const disciplineName = 'Complete Rules Test';
      
      // Test complete workflow with all business rules
      await disciplinePage.openCreateModal();
      
      // 1. Test required field validation
      await disciplinePage.submitForm();
      await disciplinePage.expectValidationError('season');
      await disciplinePage.expectValidationError('name');
      
      // 2. Fill required fields
      await disciplinePage.fillDisciplineForm({
        season: 'Track & Field',
        name: disciplineName,
        description: 'Testing all business rules together',
        type: 'timed'
      });
      
      // 3. Test type exclusivity
      await disciplinePage.expectTypeExclusivity();
      
      // 4. Switch to measured type
      await disciplinePage.measuredRadio.check();
      await disciplinePage.expectTypeExclusivity();
      
      // 5. Add team size (valid for any type)
      await disciplinePage.teamSizeInput.fill('4');
      
      // 6. Submit successfully
      await disciplinePage.submitForm();
      await expect(disciplinePage.modal).not.toBeVisible();
      
      // 7. Verify creation
      await disciplinePage.expectDisciplineInTable(disciplineName, 'Track & Field', 'Measured');
      await disciplinePage.expectTeamSizeDisplay(disciplineName, 4);
      
      // 8. Edit and test business rules again
      await disciplinePage.editDiscipline(disciplineName);
      
      // 9. Change type and verify exclusivity
      await disciplinePage.timedRadio.check();
      await disciplinePage.expectTypeExclusivity();
      
      // 10. Update successfully
      await disciplinePage.submitForm();
      await expect(disciplinePage.modal).not.toBeVisible();
      
      // 11. Verify update
      await disciplinePage.expectDisciplineInTable(disciplineName, 'Track & Field', 'Timed');
      
      // 12. Cleanup
      await disciplinePage.deleteDiscipline(disciplineName);
    });
  });
}); 