# User Story 04: Athlete Management & Core Data Setup

**Priority**: High (Core Feature)
**Epic**: Athlete Management Foundation
**Story Points**: 15

## User Story

As a **club administrator or member**, I want to **manage athletes with proper gender and age group categorization** so that I can **maintain an accurate roster and organize athletes for competition**.

## Business Value

- Enables comprehensive athlete roster management with proper categorization
- Provides foundation for performance tracking with age group context
- Supports club-specific athlete organization
- Establishes core data models needed by other system features
- Creates a complete vertical slice for athlete management

## Acceptance Criteria

### AC1: Gender Data Management

- **Given** the system needs to categorize athletes and performances
- **When** gender data is required
- **Then** the system should support Male and Female genders
- **And** each gender should have a full name and single-character initial (M/F)
- **And** gender data should be consistent across all features
- **And** gender should be enforced as required for all athletes

### AC2: Age Group Management

- **Given** athletics competitions are organized by age groups
- **When** clubs need to categorize athletes and performances
- **Then** each club should be able to define their own age groups
- **And** age groups should have names like U9, U10, U11, Junior, Senior, Masters
- **And** age groups should have ordinal values for proper sorting
- **And** age groups should be unique within each club
- **And** clubs should be able to create, edit, and manage their age groups

### AC3: Individual Athlete Creation

- **Given** I am an authenticated user
- **When** I create a new athlete
- **Then** I should be able to enter first name, last name, and select gender
- **And** the athlete should be associated with my current club
- **And** the athlete should be saved with proper validation
- **And** duplicate athletes within the same club should be prevented

### AC4: Athlete Search and Listing

- **Given** I am viewing the athletes page
- **When** I want to find specific athletes
- **Then** I should see a searchable list of all club athletes
- **And** I should be able to search by name (first or last)
- **And** the search should be case-insensitive
- **And** results should be filtered to my current club only
- **And** athletes should be displayed with their gender information

### AC5: Athlete Detail View

- **Given** I select an athlete from the list
- **When** I view their detail page
- **Then** I should see their complete profile information including gender
- **And** I should see their performance history (when available)
- **And** I should see their current records and personal bests (when available)
- **And** I should see their medal achievements (when available)

### AC6: Age Group Administration

- **Given** I am a staff user
- **When** I access age group management
- **Then** I should be able to create new age groups for my club
- **And** I should be able to edit existing age groups
- **And** I should be able to set ordinal values for proper sorting
- **And** I should not be able to create duplicate age group names within my club

### AC7: Data Validation and Integrity

- **Given** I am creating or editing athletes or age groups
- **When** I submit the form
- **Then** all required fields should be validated
- **And** duplicate names should be prevented
- **And** clear error messages should be displayed for validation failures
- **And** the form should retain valid data on validation errors

### AC8: Club Data Isolation

- **Given** I am working with a specific club
- **When** I access athlete features
- **Then** I should only see athletes and age groups from my current club
- **And** I should not be able to access data from other clubs
- **And** new athletes and age groups should automatically be associated with my current club

## Technical Requirements

### System References

- **Data Models**: Gender, AgeGroup, and Athlete models with relationships
- **User Flows**: Athlete management and age group administration flows
- **API Endpoints**: Athlete and age group CRUD and search endpoints
- **Security Model**: Club-based data isolation and role-based permissions

### Implementation Details

- Gender model with name and initial fields
- AgeGroup model with club relationship and ordinal sorting
- Athlete model with first_name, last_name, gender, and club relationships
- Unique constraint on (club, first_name, last_name) for athletes
- Unique constraint on (club, name) for age groups
- AJAX-powered athlete search functionality
- Responsive athlete listing with pagination
- Comprehensive athlete detail views
- Age group management interface for staff users

### Database Requirements

- Gender table with unique constraints on name and initial
- AgeGroup table with club foreign key and ordinal ordering
- Athlete table with proper foreign key relationships
- Indexes on name fields for efficient searching
- Unique constraints for duplicate prevention
- Audit trail fields for tracking changes

## BDD Test Scenarios

### Scenario 1: Gender Data Setup

```gherkin
Feature: Athlete Management with Core Data
  As a club administrator
  I want to manage athletes with proper categorization
  So that I can organize competition participation

  Scenario: Gender data is available
    Given the system is initialized
    When I check the available genders
    Then I should see "Male" with initial "M"
    And I should see "Female" with initial "F"
    And gender names should be unique
    And gender initials should be unique

  Scenario: Gender validation in athlete creation
    Given I am creating a new athlete
    When I don't select a gender
    Then I should see a validation error
    And the athlete should not be saved
```

### Scenario 2: Age Group Management

```gherkin
  Scenario: Club-specific age group creation
    Given I am logged in as a staff user with "Springfield Athletics Club" selected
    When I navigate to age group management
    And I create an age group "U9" with ordinal 1
    Then the age group should be created successfully
    And it should be associated with "Springfield Athletics Club"
    And it should have ordinal value 1 for sorting

  Scenario: Prevent duplicate age groups within club
    Given I have "Springfield Athletics Club" selected
    And I have already created a "U9" age group
    When I try to create another "U9" age group for the same club
    Then I should see a validation error
    And the duplicate should not be saved

  Scenario: Age group isolation between clubs
    Given I have a "U9" age group in "Springfield Athletics Club"
    When I switch to "Riverside Track Club"
    Then I should be able to create a new "U9" age group for this club
    And it should be separate from the Springfield club's "U9"
```

### Scenario 3: Individual Athlete Creation

```gherkin
  Scenario: Create new athlete successfully with gender
    Given I am logged in and have "Springfield Athletics Club" selected
    When I navigate to the "Create Athlete" page
    And I enter "John" as the first name
    And I enter "Smith" as the last name
    And I select "Male" as the gender
    And I submit the form
    Then the athlete should be created successfully
    And I should see "Athlete created successfully" message
    And the athlete should be associated with "Springfield Athletics Club"
    And the athlete should have gender "Male"

  Scenario: Prevent duplicate athletes in same club
    Given I am logged in with "Springfield Athletics Club" selected
    And an athlete "John Smith" already exists in this club
    When I try to create another athlete with first name "John" and last name "Smith"
    Then I should see a validation error
    And the duplicate athlete should not be created

  Scenario: Gender is required for athlete creation
    Given I am on the "Create Athlete" page
    When I enter "John" as first name and "Smith" as last name
    But I don't select a gender
    Then I should see "Gender is required" error
    And the athlete should not be created
```

### Scenario 4: Athlete Search and Listing

```gherkin
  Scenario: Search athletes by name with gender display
    Given I am on the athletes page for "Springfield Athletics Club"
    And there are athletes "John Smith (Male)", "Jane Doe (Female)", and "Mike Johnson (Male)"
    When I search for "John"
    Then I should see "John Smith" in the results with gender "Male"
    And I should see "Mike Johnson" in the results with gender "Male"
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

### Scenario 5: Athlete Detail View

```gherkin
  Scenario: View athlete profile with gender
    Given I am on the athletes page
    And there is an athlete "John Smith" with gender "Male"
    When I click on "John Smith"
    Then I should be taken to his athlete detail page
    And I should see his name "John Smith"
    And I should see his gender "Male"
    And I should see a placeholder for future performance history
    And I should see a link to "Record Performance" when that feature is available

  Scenario: View athlete with no performances yet
    Given I am on the athletes page
    And there is an athlete "Jane Doe" with no performances
    When I click on "Jane Doe"
    Then I should see her athlete detail page
    And I should see "No performances recorded yet"
    And I should see her gender information
```

### Scenario 6: Age Group Administration

```gherkin
  Scenario: Staff user can manage age groups
    Given I am logged in as a staff user
    When I access the age group management page
    Then I should be able to create new age groups
    And I should be able to edit existing age groups
    And I should be able to set ordinal values for sorting

  Scenario: Age group ordering
    Given I have created age groups "U9" (ordinal 1), "U10" (ordinal 2), "Senior" (ordinal 20)
    When I view the age groups list
    Then they should be displayed in ordinal order
    And "U9" should appear first
    And "Senior" should appear last

  Scenario: Regular user cannot manage age groups
    Given I am logged in as a regular user
    When I try to access age group management
    Then I should be denied access
    And I should see an appropriate error message
```

### Scenario 7: AJAX Athlete Search

```gherkin
  Scenario: Dynamic athlete search for forms
    Given I am on a form that requires athlete selection
    When I start typing "Joh" in the athlete search field
    Then I should see a dropdown with athletes matching "Joh"
    And the search should happen without page reload
    And I should see athlete names with gender indicators

  Scenario: Select athlete from search results
    Given I am searching for athletes in a form
    And I see "John Smith (Male)" in the search results
    When I click on "John Smith (Male)"
    Then "John Smith" should be selected in the form
    And the search dropdown should close
```

### Scenario 8: Data Integrity and Validation

```gherkin
  Scenario: Gender data integrity
    Given the system has gender data
    When I check gender constraints
    Then "Male" and "Female" should be the only available genders
    And each should have unique names and initials
    And they should be available across all clubs

  Scenario: Age group data integrity within clubs
    Given I have age groups in "Springfield Athletics Club"
    When I switch to a different club
    Then I should see only that club's age groups
    And I should not see age groups from other clubs

  Scenario: Form data retention on validation errors
    Given I am creating an athlete
    And I enter "John" as first name and "Smith" as last name
    But I don't select a gender
    When I submit the form
    Then I should see a validation error for gender
    And the first name "John" should still be in the form
    And the last name "Smith" should still be in the form
```

### Scenario 9: Athlete Management Permissions

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

- [ ] Gender model with Male/Female entries and unique constraints
- [ ] AgeGroup model with club relationships and ordinal sorting
- [ ] Athlete model with proper validation and constraints
- [ ] Age group management interface for staff users
- [ ] Athlete creation form with gender selection and validation
- [ ] Athlete search functionality (both UI and AJAX)
- [ ] Athlete listing page with pagination and gender display
- [ ] Athlete detail page with complete profile information
- [ ] Club-specific data isolation enforced for athletes and age groups
- [ ] Duplicate prevention within clubs for both athletes and age groups
- [ ] Proper error handling and user feedback
- [ ] All BDD scenarios pass
- [ ] Responsive design for mobile devices
- [ ] Database constraints and indexes properly configured

## Dependencies

- 01_user_authentication.md (authentication system)
- 02_club_management.md (club context)
- 03_user_roles_permissions.md (permission system)

## Related Stories

- 05_discipline_management.md (can be developed in parallel, will use age groups for performance categorization)
- 06_performance_recording.md (depends on this for athlete and age group data)
- 07_bulk_athlete_upload.md (extends this with bulk operations)
