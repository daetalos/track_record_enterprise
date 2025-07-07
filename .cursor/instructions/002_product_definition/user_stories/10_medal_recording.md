# User Story 09: Medal Recording & Competition Management

**Priority**: Medium (Core Feature)
**Epic**: Competition Management
**Story Points**: 13

## User Story

As a **club administrator or coach**, I want to **record competition medals and results** so that I can **track athlete achievements and maintain comprehensive competition records**.

## Business Value

- Enables comprehensive competition result tracking
- Supports athlete achievement recognition
- Provides foundation for medal statistics and analysis
- Enables bulk recording of competition results

## Acceptance Criteria

### AC1: Individual Medal Recording

- **Given** I am an authenticated user
- **When** I record a medal for an athlete
- **Then** I should be able to select the athlete, discipline, age group, and medal position
- **And** I should be able to specify the competition event details and date
- **And** I should be able to optionally include performance values with the medal
- **And** the medal should be validated according to business rules

### AC2: Bulk Medal Recording

- **Given** I want to record multiple medals from a competition
- **When** I access the bulk medal recording interface
- **Then** I should be able to enter event details once for all medals
- **And** I should be able to add multiple medal rows for different athletes
- **And** I should be able to specify different disciplines and positions for each row
- **And** all medals should be validated and saved together

### AC3: Medal Position Validation

- **Given** I am recording medals
- **When** I select medal positions
- **Then** I should be able to select from positions 1-12
- **And** position 1 should be Gold, position 2 Silver, position 3 Bronze
- **And** positions 4-12 should be Bronze (for cross-country events)
- **And** the system should prevent invalid medal positions

### AC4: Competition Event Management

- **Given** I am recording medals
- **When** I specify event details
- **Then** I should be able to enter comprehensive event information
- **And** I should be able to set the competition date
- **And** I should be able to specify the event location or name
- **And** event details should be used for performance uniqueness

### AC5: Medal Statistics and Display

- **Given** medals have been recorded
- **When** I view medal information
- **Then** I should see medal counts by athlete and discipline
- **And** I should see medal statistics for the club
- **And** I should be able to filter medals by various criteria
- **And** medals should be displayed alongside performance records

## Technical Requirements

### System References

- **Data Models**: `02_data_models.md` - Medal and Performance models
- **Business Rules**: `05_business_rules.md` - Medal validation rules
- **User Flows**: `03_user_flows.md` - Medal recording flow
- **API Endpoints**: `06_api_endpoints.md` - Medal management endpoints

### Implementation Details

- Medal recording form with dynamic athlete selection
- Bulk medal entry interface with multiple rows
- Medal validation and duplicate prevention
- Integration with performance recording system
- Medal statistics and reporting components

### Database Requirements

- Medal positions 1-12 with appropriate names
- Performance records linked to medal positions
- Event details for competition context
- Efficient queries for medal statistics

## BDD Test Scenarios

### Scenario 1: Individual Medal Recording

```gherkin
Feature: Medal Recording
  As a club administrator
  I want to record competition medals
  So that I can track athlete achievements

  Scenario: Record individual medal successfully
    Given I am logged in and have "Springfield Athletics Club" selected
    And there is an athlete "John Smith" in the club
    And there is a "100m" discipline
    And there is a "U15" age group
    When I navigate to the "Record Medal" page
    And I search for and select athlete "John Smith"
    And I select age group "U15"
    And I select discipline "100m"
    And I select gender "Male"
    And I select medal position "1" (Gold)
    And I enter event details "City Championships"
    And I enter date "2023-06-15"
    And I submit the form
    Then the medal should be recorded successfully
    And I should see "Medal recorded successfully" message
    And the performance should be linked to the Gold medal
```

### Scenario 2: Medal with Performance Value

```gherkin
  Scenario: Record medal with performance time
    Given I am recording a medal for "Jane Doe"
    And I select discipline "100m" (timed discipline)
    And I select medal position "1" (Gold)
    When I also enter time "12.45" seconds
    And I submit the form
    Then both the medal and performance should be recorded
    And the performance should show both the time and Gold medal
    And the performance should be eligible for record checking
```

### Scenario 3: Bulk Medal Recording

```gherkin
  Scenario: Record multiple medals from same competition
    Given I am on the bulk medal recording page
    When I enter event details "Regional Championships" and date "2023-06-20"
    And I add a medal row for "John Smith", "100m", "U15 Male", "Gold"
    And I add a medal row for "Jane Doe", "100m", "U15 Female", "Silver"
    And I add a medal row for "Mike Johnson", "200m", "U15 Male", "Bronze"
    And I submit the bulk form
    Then all three medals should be recorded successfully
    And all should have the same event details and date
    And I should see "3 medals recorded successfully" message

  Scenario: Validate all medals in bulk entry
    Given I am entering multiple medals in bulk
    When one of the medal entries has validation errors
    Then I should see validation errors for the problematic row
    And valid rows should be highlighted as correct
    And I should be able to fix errors and resubmit
```

### Scenario 4: Medal Position Validation

```gherkin
  Scenario: Valid medal positions
    Given I am recording a medal
    When I select position "1"
    Then it should be labeled as "Gold"
    When I select position "2"
    Then it should be labeled as "Silver"
    When I select position "3"
    Then it should be labeled as "Bronze"
    When I select position "4"
    Then it should be labeled as "Bronze"

  Scenario: Medal position constraints
    Given I am recording a medal
    When I try to select an invalid position like "0" or "13"
    Then I should see a validation error
    And the form should not be submitted
```

### Scenario 5: Competition Event Management

```gherkin
  Scenario: Comprehensive event details
    Given I am recording medals for a competition
    When I enter event details "National Championships - 100m Final"
    And I enter date "2023-07-15"
    Then these details should be saved with all medals from this event
    And the event details should help differentiate multiple competitions on same day

  Scenario: Event details autocomplete
    Given I have previously recorded medals for "City Championships"
    When I start typing "City" in the event details field
    Then I should see "City Championships" as an autocomplete suggestion
    And I should be able to select it to auto-fill the field
```

### Scenario 6: Medal Statistics and Display

```gherkin
  Scenario: View athlete medal counts
    Given "John Smith" has won 2 Gold, 1 Silver, and 3 Bronze medals
    When I view his athlete profile
    Then I should see his medal count summary
    And I should see "2 Gold, 1 Silver, 3 Bronze" displayed
    And I should be able to view details of each medal

  Scenario: Club medal statistics
    Given the club has recorded various medals across different competitions
    When I view the club medal overview
    Then I should see total medal counts by type
    And I should see medal distribution across disciplines
    And I should see recent medal achievements highlighted

  Scenario: Filter medals by criteria
    Given there are medals recorded across multiple competitions
    When I filter medals by "U15" age group
    Then I should only see medals won by U15 athletes
    When I filter by "Track & Field" season
    Then I should only see medals from Track & Field disciplines
```

### Scenario 7: Medal Integration with Performance Records

```gherkin
  Scenario: Medal performance affects records
    Given I record a Gold medal with a time that would be a club record
    When the medal is saved
    Then the performance should be checked for club record status
    And if it's a record, it should be marked accordingly
    And I should be notified of both the medal and record achievement

  Scenario: Medal without performance value
    Given I am recording a medal for participation (no specific time/distance)
    When I select a medal position but don't enter performance values
    Then the medal should be recorded successfully
    And it should not affect performance records
    And it should still count in medal statistics
```

### Scenario 8: Medal Recording Permissions

```gherkin
  Scenario: Authenticated user can record medals
    Given I am logged in as a regular user
    When I access the medal recording features
    Then I should be able to record individual medals
    And medals should be associated with my current club

  Scenario: Staff user can bulk record medals
    Given I am logged in as a staff user
    When I access the medal recording features
    Then I should be able to access bulk medal recording
    And I should be able to record multiple medals efficiently

  Scenario: Anonymous user cannot record medals
    Given I am not logged in
    When I try to access medal recording pages
    Then I should be redirected to the login page
```

### Scenario 9: Medal Data Validation

```gherkin
  Scenario: Prevent duplicate medals
    Given there is already a medal for "John Smith" in "100m" on "2023-06-15" for "City Championships"
    When I try to record another medal with identical details
    Then I should see a duplicate medal error
    And the form should not be submitted

  Scenario: Allow multiple medals same day different events
    Given "John Smith" won a medal in "100m" at "Morning Session"
    When I record another medal for him in "200m" at "Afternoon Session" on the same date
    Then both medals should be recorded successfully
    And they should be differentiated by event details

  Scenario: Validate medal data completeness
    Given I am recording a medal
    When I don't select an athlete
    Then I should see "Athlete is required" error
    When I don't select a medal position
    Then I should see "Medal position is required" error
    When I don't enter event details
    Then I should see "Event details are required" error
```

## Definition of Done

- [ ] Individual medal recording form with validation
- [ ] Bulk medal recording interface for competitions
- [ ] Medal position validation (1-12 with proper names)
- [ ] Competition event management with autocomplete
- [ ] Medal statistics and display components
- [ ] Integration with performance recording system
- [ ] Duplicate medal prevention
- [ ] Medal filtering and search capabilities
- [ ] Proper permission-based access control
- [ ] All BDD scenarios pass
- [ ] Responsive design for mobile devices

## Dependencies

- 01_user_authentication.md (authentication system)
- 02_club_management.md (club context)
- 03_user_roles_permissions.md (permission system)
- 04_basic_data_models.md (Medal model)
- 05_athlete_management.md (athlete selection)
- 06_discipline_management.md (discipline selection)

## Related Stories

- 07_performance_recording.md (can be developed in parallel)
- 08_records_management.md (medal display integration)
- 10_performance_viewing.md (medal display in performance views)
- 13_performance_analytics.md (medal statistics and analysis)
