import { test, expect } from '@playwright/test';

test.describe('Basic Functionality Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TailAdmin/);
    console.log('✅ Homepage loads successfully');
  });

  test('signin page loads', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    
    // Check if signin form is present
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    
    console.log('✅ Signin page loads with form fields');
  });

  test('can fill signin form', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    
    // Fill the form using placeholders (not labels)
    await page.getByPlaceholder('Enter your email').fill('admin@trackrecord.dev');
    await page.getByPlaceholder('Enter your password').fill('password123');
    
    // Check if Sign In button exists
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
    
    console.log('✅ Can fill signin form fields');
  });

  test('can sign in and reach dashboard', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    
    // Sign in
    await page.getByPlaceholder('Enter your email').fill('admin@trackrecord.dev');
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    // Wait for dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL('/dashboard');
    
    console.log('✅ Can sign in and reach dashboard');
  });

  test('can navigate to age groups page', async ({ page }) => {
    // Sign in first
    await page.goto('/signin');
    await page.getByPlaceholder('Enter your email').fill('admin@trackrecord.dev');
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForURL('/dashboard');

    // Navigate to age groups
    await page.goto('/age-groups');
    await page.waitForLoadState('networkidle');
    
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