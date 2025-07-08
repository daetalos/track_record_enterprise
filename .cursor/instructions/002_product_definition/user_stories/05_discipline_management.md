# User Story 05: Discipline Management & Season Organization

**Priority**: High (Core Feature)
**Epic**: Athletics Events Management
**Story Points**: 10

## User Story

As a **club administrator**, I want to **manage athletic disciplines organized by seasons** so that I can **organize competitions and track performances across different sports categories**.

## Business Value

- Enables comprehensive athletics event organization with seasonal structure
- Supports both timed and measured events with proper categorization
- Provides foundation for performance recording with discipline context
- Supports seasonal competition organization (Track & Field, Indoors, etc.)
- Creates a complete vertical slice for competition organization

## Acceptance Criteria

### AC1: Season Management

- **Given** athletics competitions occur in different seasons
- **When** organizing disciplines and performances
- **Then** the system should support multiple seasons (Track & Field, Indoors, etc.)
- **And** seasons should be global across all clubs
- **And** seasons should be used to organize disciplines
- **And** season names should be unique and properly managed

### AC2: Discipline Creation and Management

- **Given** I am an authenticated user with appropriate permissions
- **When** I create a new discipline
- **Then** I should be able to specify the discipline name, season, and type
- **And** I should be able to indicate if it's timed or measured
- **And** I should be able to set the comparison direction (smaller/larger better)
- **And** I should be able to specify team size for relay events
- **And** the discipline should be associated with the selected season

### AC3: Discipline Type Validation

- **Given** I am creating a discipline
- **When** I specify the discipline type
- **Then** the discipline must be either timed OR measured, not both
- **And** timed disciplines should have "smaller is better" comparison
- **And** measured disciplines should have "larger is better" comparison
- **And** the system should enforce these business rules automatically

### AC4: Season-Based Organization

- **Given** disciplines are organized by seasons
- **When** I view disciplines
- **Then** I should see them grouped by season (Track & Field, Indoors, etc.)
- **And** discipline names should be unique within each season
- **And** the same discipline name can exist in different seasons as separate entities
- **And** seasons should be displayed in a logical order

### AC5: Team vs Individual Events

- **Given** I am creating a discipline
- **When** I specify if it's a team event
- **Then** I should be able to set the number of team members required
- **And** team events should support mixed-gender participation
- **And** individual events should not have team size specified
- **And** team size validation should be enforced

### AC6: Discipline Listing and Search

- **Given** I am viewing disciplines
- **When** I access the disciplines page
- **Then** I should see all available disciplines organized by season
- **And** I should be able to search for specific disciplines
- **And** I should see discipline details including type, season, and team size
- **And** I should be able to filter by season

### AC7: Season Data Integrity

- **Given** the system manages seasonal competition data
- **When** seasons are used throughout the system
- **Then** season data should be consistent and reliable
- **And** standard seasons (Track & Field, Indoors) should be available
- **And** season references should be maintained across all features

## Technical Requirements

### System References

- **Data Models**: Season and Discipline models with relationships
- **User Flows**: Discipline management and season organization flows
- **API Endpoints**: Discipline and season CRUD endpoints
- **Security Model**: Role-based permissions for discipline management

### Implementation Details

- Season model with unique name constraint
- Discipline model with season relationship and type classification
- Unique constraint on (season, name) for disciplines
- Boolean fields for is_timed, is_measured, is_smaller_better
- Optional team_size field for relay/team events
- Admin interface for discipline management
- Season-based discipline organization and filtering

### Database Requirements

- Season table with unique season names
- Discipline table with proper foreign key to Season
- Unique constraints and check constraints for business rules
- Indexes for efficient querying by season and name
- Validation at database level for mutually exclusive types

## BDD Test Scenarios

### Scenario 1: Season Data Setup

```gherkin
Feature: Discipline Management with Season Organization
  As a club administrator
  I want to manage athletic disciplines by season
  So that I can organize competitions properly

  Scenario: Season data is available
    Given the system is initialized
    When I check the available seasons
    Then I should see "Track & Field" season
    And I should see "Indoors" season
    And season names should be unique

  Scenario: Season data validation
    Given I try to create a season with a duplicate name
    When I attempt to save a season named "Track & Field"
    Then I should get a validation error
    And the duplicate should not be saved
```

### Scenario 2: Individual Timed Discipline Creation

```gherkin
  Scenario: Create timed individual discipline
    Given I am logged in as a staff user
    When I navigate to the "Create Discipline" page
    And I enter "100m" as the discipline name
    And I select "Track & Field" as the season
    And I select "Timed" as the discipline type
    And I leave team size empty (individual event)
    And I submit the form
    Then the discipline should be created successfully
    And it should be marked as timed with "smaller is better"
    And it should not be marked as measured
    And it should have no team size specified
    And it should be associated with "Track & Field" season
```

### Scenario 3: Measured Team Discipline Creation

```gherkin
  Scenario: Create measured team discipline
    Given I am logged in as a staff user
    When I create a discipline "4x100m Relay"
    And I select "Track & Field" as the season
    And I select "Measured" as the discipline type
    And I set team size to 4
    Then the discipline should be created successfully
    And it should be marked as measured with "larger is better"
    And it should not be marked as timed
    And it should have team size of 4
    And it should be associated with "Track & Field" season
```

### Scenario 4: Discipline Type Validation

```gherkin
  Scenario: Prevent both timed and measured
    Given I am creating a discipline
    When I try to mark it as both timed and measured
    Then I should see a validation error
    And the discipline should not be saved

  Scenario: Require either timed or measured
    Given I am creating a discipline
    When I don't specify it as either timed or measured
    Then I should see a validation error
    And the discipline should not be saved

  Scenario: Automatic comparison direction setting
    Given I am creating a discipline
    When I select "Timed" as the discipline type
    Then "smaller is better" should be automatically set
    When I select "Measured" as the discipline type
    Then "larger is better" should be automatically set
```

### Scenario 5: Season-Based Uniqueness

```gherkin
  Scenario: Prevent duplicate disciplines in same season
    Given there is already a "100m" discipline in "Track & Field" season
    When I try to create another "100m" discipline in "Track & Field" season
    Then I should see a validation error
    And the duplicate should not be created

  Scenario: Allow same discipline name in different seasons
    Given there is a "100m" discipline in "Track & Field" season
    When I create a "100m" discipline in "Indoors" season
    Then it should be created successfully
    And both disciplines should exist as separate entities
    And each should be properly associated with its season
```

### Scenario 6: Team Size Validation

```gherkin
  Scenario: Team size must be positive
    Given I am creating a team discipline
    When I set team size to 0
    Then I should see a validation error
    And the discipline should not be saved

  Scenario: Team size must be specified for team events
    Given I am creating a discipline with team size specified
    When I set team size to 4
    Then the discipline should be saved as a team event
    And individual performance tracking should be disabled for this discipline

  Scenario: Individual events cannot have team size
    Given I am creating an individual discipline
    When I try to set a team size
    Then I should see a validation error
    And be prompted to choose either individual or team event
```

### Scenario 7: Discipline Listing and Organization

```gherkin
  Scenario: View disciplines organized by season
    Given there are disciplines in "Track & Field" and "Indoors" seasons
    When I visit the disciplines page
    Then I should see disciplines grouped by season
    And "Track & Field" disciplines should be listed together
    And "Indoors" disciplines should be listed together
    And season headings should be clearly displayed

  Scenario: Search for specific disciplines
    Given there are disciplines "100m", "200m", and "High Jump"
    When I search for "100"
    Then I should see "100m" in the results
    And I should not see "200m" or "High Jump"
    And the season should be displayed with each result

  Scenario: Filter disciplines by season
    Given there are disciplines in multiple seasons
    When I filter by "Track & Field" season
    Then I should only see disciplines from "Track & Field"
    And I should not see disciplines from other seasons
```

### Scenario 8: Discipline Detail View

```gherkin
  Scenario: View individual discipline details
    Given there is a "100m" discipline in "Track & Field" season
    When I click on the "100m" discipline
    Then I should see its detail page
    And I should see it's a timed discipline
    And I should see it's an individual event
    And I should see it belongs to "Track & Field" season
    And I should see any current club records for this discipline

  Scenario: View team discipline details
    Given there is a "4x100m Relay" team discipline
    When I view its detail page
    Then I should see it requires 4 team members
    And I should see it's a team event
    And I should see its season association
    And I should see team-specific performance information
```

### Scenario 9: Discipline Management Permissions

```gherkin
  Scenario: Staff user can manage disciplines
    Given I am logged in as a staff user
    When I access discipline management features
    Then I should be able to create, edit, and view disciplines
    And I should be able to select from available seasons

  Scenario: Regular user can view disciplines
    Given I am logged in as a regular user
    When I access the disciplines page
    Then I should be able to view all disciplines organized by season
    But I should not see create or edit options

  Scenario: Anonymous user can view disciplines
    Given I am not logged in
    When I access the disciplines page
    Then I should be able to view all disciplines
    But I should not see any management options
```

### Scenario 10: Season Integration

```gherkin
  Scenario: Season data consistency
    Given I have created disciplines in different seasons
    When I view the system-wide discipline list
    Then all disciplines should show their correct season associations
    And season information should be consistent across all views

  Scenario: Season-based navigation
    Given I am viewing disciplines
    When I click on a season name
    Then I should see only disciplines from that season
    And I should be able to navigate back to all seasons

  Scenario: Season requirements for discipline creation
    Given I am creating a new discipline
    When I don't select a season
    Then I should see a validation error
    And the discipline should not be created
```

## Definition of Done

- [ ] Season model with unique season names and standard seasons
- [ ] Discipline model with proper season relationships and validation
- [ ] Season-based discipline organization throughout the interface
- [ ] Discipline creation and management interface with season selection
- [ ] Type validation (timed vs measured) with automatic comparison direction
- [ ] Team size handling for relay/team events with validation
- [ ] Discipline listing page with season grouping and search functionality
- [ ] Season-based filtering and navigation
- [ ] Discipline detail pages with season information and performance records
- [ ] Proper permission-based access control
- [ ] All BDD scenarios pass
- [ ] Admin interface for discipline and season management
- [ ] Database constraints and indexes properly configured
- [ ] Season data integrity across all features

## Dependencies

- 01_user_authentication.md (authentication system)
- 02_club_management.md (club context)
- 03_user_roles_permissions.md (permission system)

## Related Stories

- 04_athlete_management.md (can be developed in parallel, both provide foundation data)
- 06_performance_recording.md (depends on this for discipline and season data)
- 07_bulk_athlete_upload.md (can be developed in parallel with discipline setup)
