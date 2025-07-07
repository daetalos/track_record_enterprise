# User Story 05: Athlete Management

**Priority**: High (Core Feature)
**Epic**: Athlete Management
**Story Points**: 13

## User Story

As a **club administrator or member**, I want to **create, manage, and search for athletes** so that I can **maintain an accurate roster of club members and their information**.

## Business Value

- Enables comprehensive athlete roster management
- Provides foundation for performance tracking
- Supports club-specific athlete organization
- Enables efficient athlete search and selection

## Acceptance Criteria

### AC1: Individual Athlete Creation

- **Given** I am an authenticated user
- **When** I create a new athlete
- **Then** I should be able to enter first name, last name, and gender
- **And** the athlete should be associated with my current club
- **And** the athlete should be saved with proper validation
- **And** duplicate athletes within the same club should be prevented

### AC2: Athlete Search and Listing

- **Given** I am viewing the athletes page
- **When** I want to find specific athletes
- **Then** I should see a searchable list of all club athletes
- **And** I should be able to search by name (first or last)
- **And** the search should be case-insensitive
- **And** results should be filtered to my current club only

### AC3: Athlete Detail View

- **Given** I select an athlete from the list
- **When** I view their detail page
- **Then** I should see their complete profile information
- **And** I should see their performance history
- **And** I should see their current records and personal bests
- **And** I should see their medal achievements

### AC4: Athlete Data Validation

- **Given** I am creating or editing an athlete
- **When** I submit the form
- **Then** all required fields should be validated
- **And** duplicate names within the club should be prevented
- **And** clear error messages should be displayed for validation failures
- **And** the form should retain valid data on validation errors

### AC5: Club Data Isolation

- **Given** I am working with a specific club
- **When** I access athlete features
- **Then** I should only see athletes from my current club
- **And** I should not be able to access athletes from other clubs
- **And** new athletes should automatically be associated with my current club

## Technical Requirements

### System References

- **Data Models**: `02_data_models.md` - Athlete model and relationships
- **Business Rules**: `05_business_rules.md` - Athlete validation rules
- **User Flows**: `03_user_flows.md` - Athlete management flows
- **API Endpoints**: `06_api_endpoints.md` - Athlete search and CRUD endpoints

### Implementation Details

- Athlete model with first_name, last_name, gender, and club relationships
- Unique constraint on (club, first_name, last_name)
- AJAX-powered athlete search functionality
- Responsive athlete listing with pagination
- Comprehensive athlete detail views

### Database Requirements

- Athlete table with proper foreign key relationships
- Indexes on name fields for efficient searching
- Unique constraints for duplicate prevention
- Audit trail fields for tracking changes

## BDD Test Scenarios

### Scenario 1: Individual Athlete Creation

```gherkin
Feature: Athlete Management
  As a club administrator
  I want to manage athlete information
  So that I can maintain accurate club rosters

  Scenario: Create new athlete successfully
    Given I am logged in and have "Springfield Athletics Club" selected
    When I navigate to the "Create Athlete" page
    And I enter "John" as the first name
    And I enter "Smith" as the last name
    And I select "Male" as the gender
    And I submit the form
    Then the athlete should be created successfully
    And I should see "Athlete created successfully" message
    And the athlete should be associated with "Springfield Athletics Club"

  Scenario: Prevent duplicate athletes in same club
    Given I am logged in with "Springfield Athletics Club" selected
    And an athlete "John Smith" already exists in this club
    When I try to create another athlete with first name "John" and last name "Smith"
    Then I should see a validation error
    And the duplicate athlete should not be created
```

### Scenario 2: Athlete Search and Listing

```gherkin
  Scenario: Search athletes by name
    Given I am on the athletes page for "Springfield Athletics Club"
    And there are athletes "John Smith", "Jane Doe", and "Mike Johnson"
    When I search for "John"
    Then I should see "John Smith" in the results
    And I should see "Mike Johnson" in the results
    And I should not see "Jane Doe" in the results

  Scenario: Case-insensitive search
    Given I am on the athletes page
    And there is an athlete "John Smith"
    When I search for "john"
    Then I should see "John Smith" in the results

  Scenario: Club-specific athlete filtering
    Given I am working with "Springfield Athletics Club"
    And there are athletes in both "Springfield Athletics Club" and "Riverside Track Club"
    When I view the athletes list
    Then I should only see athletes from "Springfield Athletics Club"
    And I should not see athletes from "Riverside Track Club"
```

### Scenario 3: Athlete Detail View

```gherkin
  Scenario: View athlete profile
    Given I am on the athletes page
    And there is an athlete "John Smith" with performances
    When I click on "John Smith"
    Then I should be taken to his athlete detail page
    And I should see his name "John Smith"
    And I should see his gender "Male"
    And I should see his performance history
    And I should see any current records he holds

  Scenario: View athlete with no performances
    Given I am on the athletes page
    And there is an athlete "Jane Doe" with no performances
    When I click on "Jane Doe"
    Then I should see her athlete detail page
    And I should see "No performances recorded yet"
    And I should see a link to "Record Performance"
```

### Scenario 4: Athlete Data Validation

```gherkin
  Scenario: Required field validation
    Given I am on the "Create Athlete" page
    When I submit the form without entering a first name
    Then I should see "First name is required" error
    And the form should not be submitted

  Scenario: Name length validation
    Given I am on the "Create Athlete" page
    When I enter a first name longer than 64 characters
    Then I should see "First name must be 64 characters or less" error

  Scenario: Form data retention on validation errors
    Given I am creating an athlete
    And I enter "John" as first name and "Smith" as last name
    But I don't select a gender
    When I submit the form
    Then I should see a validation error for gender
    And the first name "John" should still be in the form
    And the last name "Smith" should still be in the form
```

### Scenario 5: AJAX Athlete Search

```gherkin
  Scenario: Dynamic athlete search for forms
    Given I am on a form that requires athlete selection
    When I start typing "Joh" in the athlete search field
    Then I should see a dropdown with athletes matching "Joh"
    And the search should happen without page reload

  Scenario: Select athlete from search results
    Given I am searching for athletes in a form
    And I see "John Smith" in the search results
    When I click on "John Smith"
    Then "John Smith" should be selected in the form
    And the search dropdown should close
```

### Scenario 6: Athlete Management Permissions

```gherkin
  Scenario: Authenticated user can create athletes
    Given I am logged in as a regular user
    When I access the athlete creation page
    Then I should be able to create new athletes
    And the athletes should be associated with my current club

  Scenario: Anonymous user cannot create athletes
    Given I am not logged in
    When I try to access the athlete creation page
    Then I should be redirected to the login page

  Scenario: User cannot access other clubs' athletes
    Given I am logged in with access to "Springfield Athletics Club" only
    When I try to access athlete data from "Riverside Track Club"
    Then I should be denied access
    And I should see an appropriate error message
```

## Definition of Done

- [ ] Athlete model with proper validation and constraints
- [ ] Athlete creation form with validation
- [ ] Athlete search functionality (both UI and AJAX)
- [ ] Athlete listing page with pagination
- [ ] Athlete detail page with performance history
- [ ] Club-specific data isolation enforced
- [ ] Duplicate prevention within clubs
- [ ] Proper error handling and user feedback
- [ ] All BDD scenarios pass
- [ ] Responsive design for mobile devices

## Dependencies

- 01_user_authentication.md (authentication system)
- 02_club_management.md (club context)
- 03_user_roles_permissions.md (permission system)
- 04_basic_data_models.md (Gender model)

## Related Stories

- 06_discipline_management.md (can be developed in parallel)
- 07_performance_recording.md (depends on this)
- 11_bulk_athlete_upload.md (extends this with bulk operations)
