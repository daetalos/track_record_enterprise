import { test, expect } from '@playwright/test';
import { AppWorkflow } from './pages';

test.describe('Basic Functionality Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TailAdmin/);
    console.log('✅ Homepage loads successfully');
  });

  test('signin page loads', async ({ page }) => {
    const app = new AppWorkflow(page);
    
    // ✅ Using AuthPage POM instead of manual navigation
    await app.auth.goto();
    await app.auth.expectSignInFormVisible();
    
    console.log('✅ Signin page loads with form fields');
  });

  test('can fill signin form', async ({ page }) => {
    const app = new AppWorkflow(page);
    
    // ✅ Using AuthPage POM - goto() already verifies form is present
    await app.auth.goto();
    
    // ✅ Using semantic locators through POM
    await page.getByPlaceholder('Enter your email').fill('admin@trackrecord.dev');
    await page.getByPlaceholder('Enter your password').fill('password123');
    
    // Check if Sign In button exists
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
    
    console.log('✅ Can fill signin form fields');
  });

  test('can sign in and reach dashboard', async ({ page }) => {
    const app = new AppWorkflow(page);
    
    // ✅ Using AuthPage POM with proper waiting built-in
    await app.auth.goto();
    await app.auth.signInAsAdmin();
    
    console.log('✅ Can sign in and reach dashboard');
  });

  test('can navigate to age groups page', async ({ page }) => {
    const app = new AppWorkflow(page);
    
    // ✅ Using AuthPage POM for authentication
    await app.auth.goto();
    await app.auth.signInAsAdmin();

    // Navigate to age groups
    await page.goto('/age-groups');
    // ✅ Removed arbitrary waiting - Playwright handles page readiness
    
    // Check if page loads - might show "No Club Selected" initially
    const noClubHeading = page.getByRole('heading', { name: 'No Club Selected' });
    const ageGroupHeading = page.getByRole('heading', { name: 'Age Group Management' });
    
    // Wait for either message to appear
    try {
      await expect(noClubHeading).toBeVisible({ timeout: 2000 });
      console.log('✅ Age groups page loads (no club selected)');
    } catch {
      await expect(ageGroupHeading).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add Age Group' })).toBeVisible();
      console.log('✅ Age groups page loads with club selected');
    }
  });
}); 