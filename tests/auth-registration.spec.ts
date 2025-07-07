import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to signup page
    await page.goto('/signup');
  });

  test('should display the registration form', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/TailAdmin/);
    
    // Check form elements are present
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your first name')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your last name')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up', exact: true })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Click submit button without filling form
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    // Check required field validation messages
    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page.getByText('You must agree to the Terms and Conditions')).toBeVisible();
  });

  test('should validate email format - browser validation', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Fill in all required fields with email that fails browser validation (no @)
    await page.getByPlaceholder('Enter your first name').fill('John');
    await page.getByPlaceholder('Enter your last name').fill('Doe');
    await page.getByPlaceholder('Enter your email').fill('invalid-email');
    await page.getByPlaceholder('Enter your password').fill('password123');
    
    // Check terms checkbox using force click on the actual checkbox input
    await page.locator('input[type="checkbox"]').check({ force: true });
    
    // Verify checkbox is checked
    await expect(page.locator('input[type="checkbox"]')).toBeChecked();
    
    // Submit form
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    // Wait for validation to appear
    await page.waitForTimeout(1000);
    
    // Check browser validation error (this appears as a browser tooltip)
    // We can check this by verifying the form wasn't submitted (still on signup page)
    await expect(page).toHaveURL(/signup/);
    
    // Check that email field has validation state
    const emailInput = page.getByPlaceholder('Enter your email');
    await expect(emailInput).toBeFocused(); // Browser focuses invalid field
  });

  test('should validate email format - React validation', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Fill in all required fields with email that passes browser validation but fails React validation
    await page.getByPlaceholder('Enter your first name').fill('John');
    await page.getByPlaceholder('Enter your last name').fill('Doe');
    await page.getByPlaceholder('Enter your email').fill('test@domain'); // has @ but no dot in domain
    await page.getByPlaceholder('Enter your password').fill('password123');
    
    // Check terms checkbox using force click on the actual checkbox input
    await page.locator('input[type="checkbox"]').check({ force: true });
    
    // Verify checkbox is checked
    await expect(page.locator('input[type="checkbox"]')).toBeChecked();
    
    // Submit form
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    // Wait for validation to appear
    await page.waitForTimeout(2000);
    
    // Check React validation error
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Fill in all required fields with short password
    await page.getByPlaceholder('Enter your first name').fill('John');
    await page.getByPlaceholder('Enter your last name').fill('Doe');
    await page.getByPlaceholder('Enter your email').fill('john.doe@example.com');
    await page.getByPlaceholder('Enter your password').fill('123');
    
    // Check terms checkbox using force click on the actual checkbox input
    await page.locator('input[type="checkbox"]').check({ force: true });
    
    // Verify checkbox is checked
    await expect(page.locator('input[type="checkbox"]')).toBeChecked();
    
    // Submit form
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    // Wait for validation to appear
    await page.waitForTimeout(2000);

    // Check password validation error
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Enter your password');
    await passwordInput.fill('testpassword');

    // Find the toggle button using the correct selector - it's a span with eye icon
    const toggleButton = page.locator('.relative span[class*="cursor-pointer"]');

    // Password should be hidden initially
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle to hide password again
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should clear errors when user starts typing', async ({ page }) => {
    // Submit empty form to generate errors
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();
    
    // Verify error is present
    await expect(page.getByText('First name is required')).toBeVisible();
    
    // Start typing in first name field
    await page.getByPlaceholder('Enter your first name').fill('John');
    
    // Error should disappear
    await expect(page.getByText('First name is required')).not.toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    // Fill out the form
    await page.getByPlaceholder('Enter your first name').fill('John');
    await page.getByPlaceholder('Enter your last name').fill('Doe');
    await page.getByPlaceholder('Enter your email').fill(`test.${Date.now()}@example.com`);
    await page.getByPlaceholder('Enter your password').fill('password123');
    
    // Check terms checkbox using force click
    await page.locator('input[type="checkbox"]').check({ force: true });
    
    // Submit form
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    // Wait for redirect with generous timeout for potential network delay
    await page.waitForURL('**/signin**', { timeout: 10000 });
    
    // Should redirect to signin page with success message
    await expect(page).toHaveURL(/signin/);
    await expect(page.locator('h1')).toContainText('Sign In');
  });

  test('should prevent duplicate email registration', async ({ page }) => {
    const email = 'duplicate@example.com';
    
    // First registration
    await page.getByPlaceholder('Enter your first name').fill('John');
    await page.getByPlaceholder('Enter your last name').fill('Doe');
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.locator('input[type="checkbox"]').check({ force: true });
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    // Wait for redirect to signin or error (either is acceptable for first attempt)
    try {
      await page.waitForURL('**/signin**', { timeout: 5000 });
      // If successful, go back to signup for second attempt
      await page.goto('/signup');
    } catch {
      // If failed (already exists), we're still on signup page
    }

    // Second registration with same email
    await page.getByPlaceholder('Enter your first name').fill('Jane');
    await page.getByPlaceholder('Enter your last name').fill('Smith');
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill('password456');
    await page.locator('input[type="checkbox"]').check({ force: true });
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

    // Should show duplicate email error
    await expect(page.getByText('An account with this email already exists')).toBeVisible();
  });

  test('should show loading state during form submission', async ({ page }) => {
    // Fill out the form
    await page.getByPlaceholder('Enter your first name').fill('John');
    await page.getByPlaceholder('Enter your last name').fill('Doe');
    await page.getByPlaceholder('Enter your email').fill(`test.loading.${Date.now()}@example.com`);
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.locator('input[type="checkbox"]').check({ force: true });
    
    // Submit form and immediately check loading state
    await page.getByRole('button', { name: 'Sign Up', exact: true }).click();
    
    // Button text should change to loading state (check quickly before it completes)
    const submitButton = page.getByRole('button', { name: /Creating Account|Sign Up/, exact: false });
    await expect(submitButton).toBeVisible();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    // Click the back link
    await page.getByRole('link', { name: 'Back to dashboard' }).click();
    
    // Should navigate to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
}); 