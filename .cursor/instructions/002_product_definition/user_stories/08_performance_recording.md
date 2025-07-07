# User Story 07: Performance Recording

**Priority**: High (Core Feature)
**Epic**: Performance Management
**Story Points**: 21

## User Story

As a **club member or coach**, I want to **record athlete performances** so that I can **track progress, maintain records, and document competition results**.

## Business Value

- Enables comprehensive performance tracking
- Provides foundation for record management
- Supports competition result documentation
- Enables athlete progress monitoring

## Acceptance Criteria

### AC1: Individual Performance Recording

- **Given** I am an authenticated user
- **When** I record a performance
- **Then** I should be able to select an athlete, discipline, age group, and date
- **And** I should be able to enter either a time result or distance result
- **And** I should be able to optionally assign a medal position
- **And** I should be able to add event details and upload proof files
- **And** the performance should be validated according to business rules

### AC2: Performance Value Validation

- **Given** I am recording a performance
- **When** I enter performance values
- **Then** timed disciplines should only accept time values in seconds
- **And** measured disciplines should only accept distance values in meters
- **And** I must provide either a performance value OR a medal (or both)
- **And** team disciplines should require team member selection
- **And** all values should be validated for reasonableness

### AC3: Duplicate Performance Prevention

- **Given** I am recording a performance
- **When** I submit the form
- **Then** the system should check for duplicate performances
- **And** duplicate performances should be prevented based on athlete, discipline, age group, gender, date, and event details
- **And** I should receive a clear error message if a duplicate is detected
- **And** I should be able to modify the event details to differentiate performances

### AC4: Automatic Record Detection

- **Given** I record a new performance
- **When** the performance is saved
- **Then** the system should automatically check if it's a club record
- **And** the system should automatically check if it's a personal best
- **And** appropriate flags should be set on the performance
- **And** previous records should be updated accordingly
- **And** I should be notified of any records achieved

### AC5: File Upload Support

- **Given** I am recording a performance
- **When** I want to provide proof of the performance
- **Then** I should be able to upload image files as proof
- **And** the system should validate file types and sizes
- **And** files should be stored securely with proper access controls
- **And** I should be able to view and download uploaded files later

## Technical Requirements

### System References

- **Data Models**: `02_data_models.md` - Performance model and relationships
- **Business Rules**: `05_business_rules.md` - Performance validation rules
- **User Flows**: `03_user_flows.md` - Performance recording flow
- **API Endpoints**: `06_api_endpoints.md` - Performance CRUD and validation endpoints

### Implementation Details

- Performance model with comprehensive validation
- Dynamic form with athlete search and discipline selection
- AJAX validation for real-time feedback
- Automatic record calculation logic
- Secure file upload and storage system
- Duplicate detection and prevention

### Database Requirements

- Performance table with all required fields and constraints
- Unique constraint on (athlete, discipline, age_group, gender, date, event_details)
- Indexes for efficient record calculation queries
- File storage with secure access controls

## BDD Test Scenarios

### Scenario 1: Individual Timed Performance Recording

```gherkin
Feature: Performance Recording
  As a club member
  I want to record athlete performances
  So that I can track progress and maintain records

  Scenario: Record successful timed performance
    Given I am logged in and have "Springfield Athletics Club" selected
    And there is an athlete "John Smith" in the club
    And there is a "100m" timed discipline in "Track & Field" season
    And there is a "U15" age group
    When I navigate to the "Record Performance" page
    And I search for and select athlete "John Smith"
    And I select age group "U15"
    And I select discipline "100m"
    And I select gender "Male"
    And I enter time "12.45" seconds
    And I enter date "2023-06-15"
    And I enter event details "City Championships"
    And I submit the form
    Then the performance should be saved successfully
    And I should see "Performance recorded successfully" message
    And the performance should be marked as timed
    And the system should check for records automatically
```

### Scenario 2: Measured Performance with Medal

```gherkin
  Scenario: Record measured performance with medal
    Given I am logged in
    And there is an athlete "Jane Doe" in my club
    And there is a "High Jump" measured discipline
    When I record a performance for "Jane Doe"
    And I select discipline "High Jump"
    And I enter distance "1.65" meters
    And I select medal "Gold" (1st place)
    And I submit the form
    Then the performance should be saved with both distance and medal
    And the performance should be marked as measured
    And the medal should be recorded as position 1
```

### Scenario 3: Performance Value Validation

```gherkin
  Scenario: Validate timed discipline accepts only time values
    Given I am recording a performance for a timed discipline "100m"
    When I try to enter a distance value instead of time
    Then I should see a validation error
    And the form should not be submitted

  Scenario: Validate measured discipline accepts only distance values
    Given I am recording a performance for a measured discipline "High Jump"
    When I try to enter a time value instead of distance
    Then I should see a validation error
    And the form should not be submitted

  Scenario: Require either performance value or medal
    Given I am recording a performance
    When I don't enter either a performance value or select a medal
    Then I should see a validation error
    And the form should not be submitted
```

### Scenario 4: Duplicate Performance Prevention

```gherkin
  Scenario: Prevent duplicate performances
    Given there is already a performance for "John Smith" in "100m" on "2023-06-15" for "City Championships"
    When I try to record another performance with the same details
    Then I should see a duplicate performance error
    And the form should not be submitted

  Scenario: Allow different event details for same day
    Given there is a performance for "John Smith" in "100m" on "2023-06-15" for "City Championships"
    When I record another performance for the same athlete, discipline, and date
    But with different event details "Regional Championships"
    Then the performance should be saved successfully
    And both performances should exist
```

### Scenario 5: Automatic Record Detection

```gherkin
  Scenario: Detect new club record
    Given the current club record for "100m" in "U15 Male" is 13.00 seconds
    When I record a performance of 12.45 seconds for the same category
    Then the performance should be marked as a current club record
    And the previous record should be updated to "was_club_record"
    And I should be notified "New Club Record!"

  Scenario: Detect new personal best
    Given "John Smith" has a previous best of 13.00 seconds in "100m"
    When I record a performance of 12.45 seconds for "John Smith" in "100m"
    Then the performance should be marked as a personal best
    And the previous best should be updated to "was_personal_best"
    And I should be notified "New Personal Best!"
```

### Scenario 6: Team Performance Recording

```gherkin
  Scenario: Record team relay performance
    Given there is a "4x100m Relay" discipline with team size 4
    And there are 4 athletes available in the club
    When I record a performance for this team discipline
    Then I should be required to select 4 team members
    And all team members should be associated with the performance
    And the performance should be marked as a team event

  Scenario: Team size validation
    Given I am recording a performance for "4x100m Relay" (team size 4)
    When I try to submit with only 3 team members selected
    Then I should see a validation error
    And the form should not be submitted
```

### Scenario 7: File Upload for Performance Proof

```gherkin
  Scenario: Upload performance proof file
    Given I am recording a performance
    When I select a valid image file as proof
    And I submit the form
    Then the file should be uploaded successfully
    And the performance should be saved with the file reference
    And the file should be accessible for download later

  Scenario: File type validation
    Given I am recording a performance
    When I try to upload a non-image file as proof
    Then I should see a file type validation error
    And the form should not be submitted

  Scenario: File size validation
    Given I am recording a performance
    When I try to upload an image file that exceeds the size limit
    Then I should see a file size validation error
    And the form should not be submitted
```

### Scenario 8: Performance Form Usability

```gherkin
  Scenario: Athlete search with autocomplete
    Given I am on the performance recording form
    When I start typing "Joh" in the athlete search field
    Then I should see a dropdown with matching athletes
    And I should be able to select an athlete from the dropdown

  Scenario: Pre-populate form with athlete's last performance
    Given "John Smith" has previous performances recorded
    When I select "John Smith" as the athlete
    Then the form should pre-populate with his last performance details
    And I should be able to modify the pre-populated values

  Scenario: Dynamic discipline filtering by season
    Given there are disciplines in multiple seasons
    When I select "Track & Field" season
    Then I should only see disciplines from that season
    And disciplines from other seasons should be hidden
```

### Scenario 9: Performance Data Validation

```gherkin
  Scenario: Reasonable time validation
    Given I am recording a timed performance for "100m"
    When I enter an unreasonable time like "1.00" seconds
    Then I should see a validation warning
    And be asked to confirm the time is correct

  Scenario: Future date validation
    Given I am recording a performance
    When I enter a future date
    Then I should see a validation error
    And the form should not be submitted

  Scenario: Required field validation
    Given I am on the performance recording form
    When I try to submit without selecting an athlete
    Then I should see "Athlete is required" error
    And the form should not be submitted
```

## Definition of Done

- [ ] Performance model with comprehensive validation
- [ ] Performance recording form with dynamic behavior
- [ ] Athlete search with autocomplete functionality
- [ ] Performance value validation for timed vs measured disciplines
- [ ] Duplicate performance prevention
- [ ] Automatic club record and personal best detection
- [ ] File upload system for performance proof
- [ ] Team performance recording support
- [ ] Real-time form validation with clear error messages
- [ ] Performance confirmation with record notifications
- [ ] All BDD scenarios pass
- [ ] Responsive design for mobile devices

## Dependencies

- 01_user_authentication.md (authentication system)
- 02_club_management.md (club context)
- 03_user_roles_permissions.md (permission system)
- 04_basic_data_models.md (reference models)
- 05_athlete_management.md (athlete selection)
- 06_discipline_management.md (discipline selection)

## Related Stories

- 08_records_management.md (depends on this)
- 09_performance_viewing.md (depends on this)
- 10_medal_recording.md (can be developed in parallel)
