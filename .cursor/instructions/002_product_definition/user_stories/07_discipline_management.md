# User Story 06: Discipline Management

**Priority**: High (Core Feature)
**Epic**: Athletics Events Management
**Story Points**: 8

## User Story

As a **club administrator**, I want to **manage athletic disciplines and events** so that I can **organize competitions and track performances across different sports categories**.

## Business Value

- Enables comprehensive athletics event organization
- Supports both timed and measured events
- Provides foundation for performance recording
- Supports seasonal competition organization

## Acceptance Criteria

### AC1: Discipline Creation and Management

- **Given** I am an authenticated user with appropriate permissions
- **When** I create a new discipline
- **Then** I should be able to specify the discipline name, season, and type
- **And** I should be able to indicate if it's timed or measured
- **And** I should be able to set the comparison direction (smaller/larger better)
- **And** I should be able to specify team size for relay events

### AC2: Discipline Type Validation

- **Given** I am creating a discipline
- **When** I specify the discipline type
- **Then** the discipline must be either timed OR measured, not both
- **And** timed disciplines should have "smaller is better" comparison
- **And** measured disciplines should have "larger is better" comparison
- **And** the system should enforce these business rules

### AC3: Season-Based Organization

- **Given** disciplines are organized by seasons
- **When** I view disciplines
- **Then** I should see them grouped by season (Track & Field, Indoors, etc.)
- **And** discipline names should be unique within each season
- **And** the same discipline name can exist in different seasons as separate entities

### AC4: Team vs Individual Events

- **Given** I am creating a discipline
- **When** I specify if it's a team event
- **Then** I should be able to set the number of team members required
- **And** team events should support mixed-gender participation
- **And** individual events should not have team size specified

### AC5: Discipline Listing and Search

- **Given** I am viewing disciplines
- **When** I access the disciplines page
- **Then** I should see all available disciplines organized by season
- **And** I should be able to search for specific disciplines
- **And** I should see discipline details including type and team size

## Technical Requirements

### System References

- **Data Models**: `02_data_models.md` - Discipline model and relationships
- **Business Rules**: `05_business_rules.md` - Discipline validation rules
- **User Flows**: `03_user_flows.md` - Discipline management flows
- **API Endpoints**: `06_api_endpoints.md` - Discipline CRUD endpoints

### Implementation Details

- Discipline model with season relationship and type classification
- Unique constraint on (season, name)
- Boolean fields for is_timed, is_measured, is_smaller_better
- Optional team_size field for relay/team events
- Admin interface for discipline management

### Database Requirements

- Discipline table with proper foreign key to Season
- Unique constraints and check constraints for business rules
- Indexes for efficient querying by season and name
- Validation at database level for mutually exclusive types

## BDD Test Scenarios

### Scenario 1: Individual Timed Discipline Creation

```gherkin
Feature: Discipline Management
  As a club administrator
  I want to manage athletic disciplines
  So that I can organize competitions properly

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
```

### Scenario 2: Measured Team Discipline Creation

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
```

### Scenario 3: Discipline Type Validation

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
```

### Scenario 4: Season-Based Uniqueness

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
```

### Scenario 5: Team Size Validation

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
```

### Scenario 6: Discipline Listing and Organization

```gherkin
  Scenario: View disciplines organized by season
    Given there are disciplines in "Track & Field" and "Indoors" seasons
    When I visit the disciplines page
    Then I should see disciplines grouped by season
    And "Track & Field" disciplines should be listed together
    And "Indoors" disciplines should be listed together

  Scenario: Search for specific disciplines
    Given there are disciplines "100m", "200m", and "High Jump"
    When I search for "100"
    Then I should see "100m" in the results
    And I should not see "200m" or "High Jump"
```

### Scenario 7: Discipline Detail View

```gherkin
  Scenario: View discipline details
    Given there is a "100m" discipline in "Track & Field" season
    When I click on the "100m" discipline
    Then I should see its detail page
    And I should see it's a timed discipline
    And I should see it's an individual event
    And I should see any current club records for this discipline

  Scenario: View team discipline details
    Given there is a "4x100m Relay" team discipline
    When I view its detail page
    Then I should see it requires 4 team members
    And I should see it's a team event
    And I should see team-specific performance information
```

### Scenario 8: Discipline Management Permissions

```gherkin
  Scenario: Staff user can manage disciplines
    Given I am logged in as a staff user
    When I access discipline management features
    Then I should be able to create, edit, and view disciplines

  Scenario: Regular user can view disciplines
    Given I am logged in as a regular user
    When I access the disciplines page
    Then I should be able to view all disciplines
    But I should not see create or edit options

  Scenario: Anonymous user can view disciplines
    Given I am not logged in
    When I access the disciplines page
    Then I should be able to view all disciplines
    But I should not see any management options
```

## Definition of Done

- [ ] Discipline model with proper validation and constraints
- [ ] Discipline creation and management interface
- [ ] Season-based discipline organization
- [ ] Type validation (timed vs measured) with business rules
- [ ] Team size handling for relay/team events
- [ ] Discipline listing page with search functionality
- [ ] Discipline detail pages with performance records
- [ ] Proper permission-based access control
- [ ] All BDD scenarios pass
- [ ] Admin interface for discipline management

## Dependencies

- 01_user_authentication.md (authentication system)
- 02_club_management.md (club context)
- 03_user_roles_permissions.md (permission system)
- 04_basic_data_models.md (Season model)

## Related Stories

- 05_athlete_management.md (can be developed in parallel)
- 07_performance_recording.md (depends on this)
- 08_records_management.md (depends on this)
