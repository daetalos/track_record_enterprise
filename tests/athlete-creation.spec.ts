import { test, expect } from '@playwright/test';
import { AppWorkflow } from './pages';

test.describe('Athlete Creation E2E', () => {
  let app: AppWorkflow;

  test.beforeEach(async ({ page }) => {
    app = new AppWorkflow(page);
  });

  // Test 1: Start with the simplest test - navigation
  test('user can navigate to athlete creation page', async () => {
    await app.setupForAthleteCreation('Elite Athletics Club');

    // Verify we're on the athlete creation page
    await app.athlete.expectCreateFormVisible();
  });

  // Test 2: Add basic form interaction
  test('athlete creation form displays all required fields', async () => {
    await app.setupForAthleteCreation('Elite Athletics Club');

    // Verify all form elements are present
    await app.athlete.expectCreateFormVisible();

    // Verify club context is maintained
    await app.club.expectClubSelected('Elite Athletics Club');
  });

  // Test 3: Add form validation testing
  test('form shows validation errors for empty required fields', async () => {
    await app.setupForAthleteCreation('Elite Athletics Club');

    // Try to submit empty form
    await app.athlete.submitForm();

    // Verify validation messages appear
    await app.athlete.expectFieldRequired('First Name');
    await app.athlete.expectFieldRequired('Last Name');
  });

  // Test 4: Test successful athlete creation
  test('user can successfully create a new athlete', async () => {
    await app.setupForAthleteCreation('Elite Athletics Club');

    // Use unique names to avoid database conflicts
    const timestamp = Date.now();
    const firstName = `TestJohn${timestamp}`;
    const lastName = `TestDoe${timestamp}`;

    // Fill and submit the form
    await app.athlete.createAthlete(firstName, lastName, 'Male');

    // Verify success message
    await app.athlete.expectCreateSuccess(firstName, lastName);

    // Verify form is reset after success
    await app.athlete.expectFormEmpty();
  });

  // Test 5: Test form clearing functionality
  test('user can clear form data', async () => {
    await app.setupForAthleteCreation('Elite Athletics Club');

    // Use unique names to avoid any potential conflicts
    const timestamp = Date.now();
    const firstName = `TestJane${timestamp}`;
    const lastName = `TestSmith${timestamp}`;

    // Fill form partially
    await app.athlete.fillCreateForm(firstName, lastName, 'Female');

    // Clear the form
    await app.athlete.clearForm();

    // Verify form is empty
    await app.athlete.expectFormEmpty();
  });
});
