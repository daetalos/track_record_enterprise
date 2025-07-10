import { Page } from '@playwright/test';
import { AuthPage } from './AuthPage';
import { ClubPage } from './ClubPage';

/**
 * AppWorkflow - Combined Page Object Model for common app workflows
 * 
 * Provides high-level workflow methods that combine authentication
 * and club management operations. This eliminates the need for tests
 * to manually orchestrate multiple page objects.
 * 
 * Key benefits:
 * - Single entry point for common workflows
 * - Eliminates code duplication across tests
 * - Follows Playwright standards with proper waiting
 * - Provides both basic and advanced workflow methods
 */
export class AppWorkflow {
  readonly auth: AuthPage;
  readonly club: ClubPage;

  constructor(private page: Page) {
    this.auth = new AuthPage(page);
    this.club = new ClubPage(page);
  }

  /**
   * Complete authentication and club selection workflow
   * This is the most common workflow used by tests
   * 
   * @param email - User email
   * @param password - User password  
   * @param clubName - Club to select after authentication
   */
  async signInWithClub(email: string, password: string, clubName: string) {
    await this.auth.goto();
    await this.auth.signIn(email, password);
    await this.club.selectClub(clubName);
  }

  /**
   * Sign in as admin user with club selection
   * Convenience method for admin test scenarios
   * 
   * @param clubName - Club to select after admin authentication
   */
  async signInAsAdminWithClub(clubName: string = 'Elite Athletics Club') {
    await this.signInWithClub('admin@trackrecord.dev', 'password123', clubName);
  }

  /**
   * Navigate to a specific page with authentication and club context
   * Combines sign-in, club selection, and navigation in one step
   * 
   * @param url - Target page URL
   * @param email - User email
   * @param password - User password
   * @param clubName - Club to select
   */
  async navigateWithAuth(url: string, email: string, password: string, clubName: string) {
    await this.signInWithClub(email, password, clubName);
    await this.club.navigateWithClubContext(url, clubName);
  }

  /**
   * Navigate to a page as admin with club context
   * Convenience method for admin page testing
   * 
   * @param url - Target page URL
   * @param clubName - Club to select (defaults to Elite Athletics Club)
   */
  async navigateAsAdmin(url: string, clubName: string = 'Elite Athletics Club') {
    await this.navigateWithAuth(url, 'admin@trackrecord.dev', 'password123', clubName);
  }

  /**
   * Start from dashboard with authenticated user and club selected
   * Useful for tests that don't need to test the auth flow itself
   * 
   * @param clubName - Club to select (defaults to Elite Athletics Club)
   */
  async startFromDashboard(clubName: string = 'Elite Athletics Club') {
    await this.signInAsAdminWithClub(clubName);
    // User is now on dashboard with club selected
  }

  /**
   * Verify user is fully set up (authenticated + club selected)
   * 
   * @param clubName - Expected club name
   */
  async expectFullyAuthenticated(clubName: string) {
    await this.auth.expectAuthenticated();
    await this.club.expectClubSelected(clubName);
  }

  /**
   * Handle the complete age groups workflow setup
   * Specialized method for age group testing
   * 
   * @param clubName - Club to select for age group management
   */
  async setupForAgeGroups(clubName: string = 'Elite Athletics Club') {
    await this.signInAsAdminWithClub(clubName);
    await this.club.navigateWithClubContext('/age-groups', clubName);
  }

  /**
   * Handle the complete athlete management workflow setup
   * Specialized method for athlete testing (future iterations)
   * 
   * @param clubName - Club to select for athlete management
   */
  async setupForAthletes(clubName: string = 'Elite Athletics Club') {
    await this.signInAsAdminWithClub(clubName);
    await this.club.navigateWithClubContext('/athletes', clubName);
  }

  /**
   * Quick setup for testing administrative features
   * Ensures admin user with proper club context
   * 
   * @param adminUrl - Administrative page URL
   * @param clubName - Club context for admin operations
   */
  async setupAdminContext(adminUrl: string, clubName: string = 'Elite Athletics Club') {
    await this.signInAsAdminWithClub(clubName);
    await this.page.goto(adminUrl);
    await this.club.handleNoClubSelected(clubName);
    await this.club.expectClubContextLoaded();
  }

  /**
   * Reset to clean state (sign out)
   * Useful for tests that need to verify unauthenticated behavior
   */
  async reset() {
    try {
      await this.auth.signOut();
    } catch {
      // User might not be signed in, that's okay
      await this.page.goto('/signin');
    }
  }
} 