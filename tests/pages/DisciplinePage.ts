import { Page, Locator, expect } from '@playwright/test';

export class DisciplinePage {
  readonly page: Page;
  
  // Navigation
  readonly disciplineNavLink: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;
  
  // Season Filter Controls
  readonly seasonFilter: Locator;
  readonly allSeasonsOption: Locator;
  
  // Search and Filter Controls
  readonly searchInput: Locator;
  readonly resultsInfo: Locator;
  
  // Create Button
  readonly createButton: Locator;
  
  // Table Elements (shadcn/ui + TanStack Table)
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;
  readonly nameHeader: Locator;
  readonly seasonHeader: Locator;
  readonly typeHeader: Locator;
  readonly createdHeader: Locator;
  readonly actionsHeader: Locator;
  
  // Table Actions
  readonly editButtons: Locator;
  readonly deleteButtons: Locator;
  
  // Modal Elements
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalDescription: Locator;
  readonly closeModalButton: Locator;
  
  // Form Elements
  readonly seasonSelect: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly characterCount: Locator;
  
  // Discipline Type Radio Buttons
  readonly timedRadio: Locator;
  readonly measuredRadio: Locator;
  readonly timedLabel: Locator;
  readonly measuredLabel: Locator;
  
  // Team Size Input
  readonly teamSizeInput: Locator;
  readonly teamSizeHelp: Locator;
  
  // Form Buttons
  readonly cancelButton: Locator;
  readonly submitButton: Locator;
  readonly createSubmitButton: Locator;
  readonly updateSubmitButton: Locator;
  
  // Error Messages
  readonly errorMessages: Locator;
  readonly seasonError: Locator;
  readonly nameError: Locator;
  readonly typeError: Locator;
  readonly teamSizeError: Locator;
  
  // Success/Loading States
  readonly loadingMessage: Locator;
  readonly emptyState: Locator;
  readonly emptyStateTitle: Locator;
  readonly emptyStateMessage: Locator;
  
  // Confirmation Dialog
  readonly confirmDialog: Locator;
  
  // Badges and Display Elements
  readonly typeBadges: Locator;
  readonly timedBadges: Locator;
  readonly measuredBadges: Locator;
  readonly teamSizeLabels: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigation
    this.disciplineNavLink = page.getByRole('link', { name: /disciplines/i });
    this.pageTitle = page.getByRole('heading', { name: /discipline management/i });
    this.pageDescription = page.getByText(/manage athletic disciplines/i);
    
    // Season Filter Controls
    this.seasonFilter = page.getByLabel(/season filter/i);
    this.allSeasonsOption = page.getByRole('option', { name: /all seasons/i });
    
    // Search and Filter Controls
    this.searchInput = page.getByPlaceholder(/search disciplines/i);
    this.resultsInfo = page.getByText(/showing \d+ of \d+ discipline/i);
    
    // Create Button
    this.createButton = page.getByRole('button', { name: /create discipline/i });
    
    // Table Elements
    this.table = page.getByTestId('table');
    this.tableHeaders = page.locator('thead th');
    this.tableRows = page.locator('tbody tr');
    this.nameHeader = page.getByRole('button', { name: /^name/i });
    this.seasonHeader = page.getByRole('button', { name: /season/i });
    this.typeHeader = page.getByRole('button', { name: /type/i });
    this.createdHeader = page.getByRole('button', { name: /created/i });
    this.actionsHeader = page.getByText(/actions/i);
    
    // Table Actions
    this.editButtons = page.getByRole('button', { name: /edit/i });
    this.deleteButtons = page.getByRole('button', { name: /delete/i });
    
    // Modal Elements
    this.modal = page.getByRole('dialog');
    this.modalTitle = page.getByRole('heading', { name: /(create|edit) discipline/i });
    this.modalDescription = page.getByText(/(add a new discipline|update the discipline)/i);
    this.closeModalButton = page.getByRole('button', { name: /close/i });
    
    // Form Elements
    this.seasonSelect = page.getByLabel(/season/i);
    this.nameInput = page.getByLabel(/discipline name/i);
    this.descriptionInput = page.getByLabel(/description/i);
    this.characterCount = page.getByText(/\d+\/500 characters/);
    
    // Discipline Type Radio Buttons
    this.timedRadio = page.getByLabel(/timed/i);
    this.measuredRadio = page.getByLabel(/measured/i);
    this.timedLabel = page.getByText(/timed.*events measured by time/i);
    this.measuredLabel = page.getByText(/measured.*events measured by distance/i);
    
    // Team Size Input
    this.teamSizeInput = page.getByLabel(/team size/i);
    this.teamSizeHelp = page.getByText(/for relay or team events/i);
    
    // Form Buttons
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.submitButton = page.getByRole('button', { name: /(create|update) discipline/i });
    this.createSubmitButton = page.getByRole('button', { name: /create discipline/i });
    this.updateSubmitButton = page.getByRole('button', { name: /update discipline/i });
    
    // Error Messages
    this.errorMessages = page.locator('.text-red-500, .text-red-600');
    this.seasonError = page.getByText(/season is required/i);
    this.nameError = page.getByText(/name is required/i);
    this.typeError = page.getByText(/(timed|measured).*required/i);
    this.teamSizeError = page.getByText(/team size/i);
    
    // Success/Loading States
    this.loadingMessage = page.getByText(/loading disciplines/i);
    this.emptyState = page.getByText(/no disciplines/i);
    this.emptyStateTitle = page.getByRole('heading', { name: /no disciplines/i });
    this.emptyStateMessage = page.getByText(/get started by creating/i);
    
    // Confirmation Dialog (handled by browser confirm)
    this.confirmDialog = page.locator('[role=\"dialog\"]');
    
    // Badges and Display Elements
    this.typeBadges = page.locator('.bg-blue-100, .bg-green-100');
    this.timedBadges = page.getByText(/^timed$/i);
    this.measuredBadges = page.getByText(/^measured$/i);
    this.teamSizeLabels = page.getByText(/\\(team: \\d+\\)/i);
  }

  // Navigation Methods
  async navigateToDisciplines() {
    await this.disciplineNavLink.click();
    await expect(this.pageTitle).toBeVisible();
  }

  async waitForPageLoad() {
    await expect(this.pageTitle).toBeVisible();
    // Wait for either table or empty state to load
    await Promise.race([
      this.table.waitFor({ state: 'visible' }),
      this.emptyState.waitFor({ state: 'visible' })
    ]);
  }

  // Season Filter Methods
  async selectSeason(seasonName: string) {
    await this.seasonFilter.selectOption({ label: seasonName });
    await this.page.waitForTimeout(500); // Allow for filtering
  }

  async selectAllSeasons() {
    await this.seasonFilter.selectOption({ label: 'All Seasons' });
    await this.page.waitForTimeout(500);
  }

  async getCurrentSeasonFilter(): Promise<string> {
    return await this.seasonFilter.inputValue();
  }

  // Search Methods
  async searchDisciplines(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.page.waitForTimeout(500); // Allow for search filtering
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(500);
  }

  // Table Interaction Methods
  async getDisciplineCount(): Promise<number> {
    const rows = await this.tableRows.count();
    return rows;
  }

  async getDisciplineNames(): Promise<string[]> {
    const nameElements = this.tableRows.locator('td:first-child');
    return await nameElements.allTextContents();
  }

  async sortByColumn(columnName: 'name' | 'season' | 'type' | 'created') {
    const headerMap = {
      name: this.nameHeader,
      season: this.seasonHeader,
      type: this.typeHeader,
      created: this.createdHeader
    };
    
    await headerMap[columnName].click();
    await this.page.waitForTimeout(500); // Allow for sorting
  }

  async getDisciplineByName(name: string): Promise<Locator> {
    return this.tableRows.filter({ hasText: name });
  }

  async editDiscipline(disciplineName: string) {
    const row = await this.getDisciplineByName(disciplineName);
    await row.getByRole('button', { name: /edit/i }).click();
    await expect(this.modal).toBeVisible();
  }

  async deleteDiscipline(disciplineName: string, confirm: boolean = true) {
    const row = await this.getDisciplineByName(disciplineName);
    
    // Set up dialog handler before clicking delete
    this.page.on('dialog', async dialog => {
      expect(dialog.message()).toContain(disciplineName);
      if (confirm) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
    
    await row.getByRole('button', { name: /delete/i }).click();
  }

  // Modal Methods
  async openCreateModal() {
    await this.createButton.click();
    await expect(this.modal).toBeVisible();
    await expect(this.modalTitle).toContainText('Create Discipline');
  }

  async closeModal() {
    await this.cancelButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  async closeModalByX() {
    await this.closeModalButton.click();
    await expect(this.modal).not.toBeVisible();
  }

  // Form Methods
  async fillDisciplineForm(data: {
    season?: string;
    name?: string;
    description?: string;
    type?: 'timed' | 'measured';
    teamSize?: number;
  }) {
    if (data.season) {
      await this.seasonSelect.selectOption({ label: data.season });
    }
    
    if (data.name) {
      await this.nameInput.fill(data.name);
    }
    
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
    
    if (data.type === 'timed') {
      await this.timedRadio.check();
    } else if (data.type === 'measured') {
      await this.measuredRadio.check();
    }
    
    if (data.teamSize !== undefined) {
      await this.teamSizeInput.fill(data.teamSize.toString());
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async createDiscipline(data: {
    season: string;
    name: string;
    description?: string;
    type: 'timed' | 'measured';
    teamSize?: number;
  }) {
    await this.openCreateModal();
    await this.fillDisciplineForm(data);
    await this.submitForm();
    await expect(this.modal).not.toBeVisible();
  }

  async updateDiscipline(currentName: string, data: {
    season?: string;
    name?: string;
    description?: string;
    type?: 'timed' | 'measured';
    teamSize?: number;
  }) {
    await this.editDiscipline(currentName);
    await this.fillDisciplineForm(data);
    await this.submitForm();
    await expect(this.modal).not.toBeVisible();
  }

  // Validation Methods
  async expectValidationError(field: 'season' | 'name' | 'type' | 'teamSize') {
    const errorMap = {
      season: this.seasonError,
      name: this.nameError,
      type: this.typeError,
      teamSize: this.teamSizeError
    };
    
    await expect(errorMap[field]).toBeVisible();
  }

  async expectNoValidationErrors() {
    await expect(this.errorMessages).toHaveCount(0);
  }

  // Business Rule Validation Methods
  async expectTypeExclusivity() {
    // When timed is selected, measured should not be checked
    if (await this.timedRadio.isChecked()) {
      await expect(this.measuredRadio).not.toBeChecked();
    }
    
    // When measured is selected, timed should not be checked
    if (await this.measuredRadio.isChecked()) {
      await expect(this.timedRadio).not.toBeChecked();
    }
  }

  async expectTeamSizeValidation(min: number = 1, max: number = 10) {
    const teamSizeValue = await this.teamSizeInput.inputValue();
    const value = parseInt(teamSizeValue);
    
    if (value < min || value > max) {
      await expect(this.teamSizeError).toBeVisible();
    }
  }

  // Display Verification Methods
  async expectDisciplineInTable(name: string, season: string, type: 'Timed' | 'Measured') {
    const row = await this.getDisciplineByName(name);
    await expect(row).toBeVisible();
    await expect(row).toContainText(season);
    await expect(row).toContainText(type);
  }

  async expectTeamSizeDisplay(disciplineName: string, teamSize: number) {
    const row = await this.getDisciplineByName(disciplineName);
    await expect(row).toContainText(`(Team: ${teamSize})`);
  }

  async expectEmptyState(seasonName?: string) {
    if (seasonName) {
      await expect(this.emptyStateTitle).toContainText(`No Disciplines in ${seasonName}`);
      await expect(this.emptyStateMessage).toContainText('doesn\'t have any disciplines yet');
    } else {
      await expect(this.emptyStateTitle).toContainText('No Disciplines');
      await expect(this.emptyStateMessage).toContainText('Get started by creating');
    }
  }

  // Results and Filtering Verification
  async expectResultsCount(count: number) {
    await expect(this.resultsInfo).toContainText(`Showing ${count} of ${count} discipline`);
  }

  async expectSeasonFilteredResults(seasonName: string, count: number) {
    await expect(this.resultsInfo).toContainText(`in ${seasonName}`);
    await expect(this.resultsInfo).toContainText(`Showing ${count}`);
  }

  async expectSearchResults(searchTerm: string, expectedNames: string[]) {
    const actualNames = await this.getDisciplineNames();
    
    // All results should contain the search term
    for (const name of actualNames) {
      expect(name.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
    
    // Should match expected results
    expect(actualNames.sort()).toEqual(expectedNames.sort());
  }

  // Character Count Verification
  async expectCharacterCount(count: number) {
    await expect(this.characterCount).toContainText(`${count}/500 characters`);
  }

  async verifyCharacterCountUpdates() {
    const testText = 'Test description';
    await this.descriptionInput.fill(testText);
    await this.expectCharacterCount(testText.length);
  }
} 