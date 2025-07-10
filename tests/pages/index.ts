/**
 * Page Object Models for Playwright E2E Tests
 * 
 * This module exports all Page Object Models following the Playwright
 * testing standards. Import what you need for your test scenarios.
 * 
 * @example Basic usage:
 * ```typescript
 * import { AuthPage, ClubPage } from './pages';
 * 
 * test('my test', async ({ page }) => {
 *   const auth = new AuthPage(page);
 *   const club = new ClubPage(page);
 *   // ...
 * });
 * ```
 * 
 * @example Workflow usage (recommended):
 * ```typescript
 * import { AppWorkflow } from './pages';
 * 
 * test('my test', async ({ page }) => {
 *   const app = new AppWorkflow(page);
 *   await app.signInWithClub('user@example.com', 'password', 'Club Name');
 * });
 * ```
 */

export { AuthPage } from './AuthPage';
export { ClubPage } from './ClubPage';
export { AppWorkflow } from './AppWorkflow'; 