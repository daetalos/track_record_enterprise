import { test, expect } from '@playwright/test';
import { AppWorkflow } from './pages';

test.describe('Age Group Management Tests', () => {
  test('should open age groups page and show add button', async ({ page }) => {
    const app = new AppWorkflow(page);
    
    // ✅ Clean setup using Page Object Model - eliminates all duplicated complex logic
    await app.setupForAgeGroups('Elite Athletics Club');
    
    // Verify we're on the age groups page with proper context
    const ageGroupHeading = page.getByRole('heading', { name: 'Age Group Management' });
    await expect(ageGroupHeading).toBeVisible({ timeout: 5000 });
    console.log('✅ Age groups page loads with proper club context');
    
    // Verify Add Age Group button is visible (confirms club is selected)
    const addButton = page.getByRole('button', { name: 'Add Age Group' });
    await expect(addButton).toBeVisible({ timeout: 5000 });
    console.log('✅ Add Age Group button is visible - club is selected');
    
    // Test modal opening workflow
    await addButton.click();
    
    // ✅ Verify modal opens - no arbitrary timeout
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 5000 });
    console.log('✅ Modal opened successfully!');
    
    // Verify modal content
    const createHeading = modal.getByRole('heading', { name: 'Create Age Group' });
    await expect(createHeading).toBeVisible();
    console.log('✅ Modal has correct content');
  });
}); 