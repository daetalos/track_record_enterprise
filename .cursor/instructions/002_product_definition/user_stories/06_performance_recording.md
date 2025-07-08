# User Story 06: Performance Recording & Medal System

**Priority**: High (Core Feature)
**Epic**: Performance Management Foundation
**Story Points**: 25

## User Story

As a **club member or coach**, I want to **record athlete performances with medal awards** so that I can **track progress, maintain records, and document competition results with proper recognition**.

## Business Value

- Enables comprehensive performance tracking with competitive context
- Provides foundation for record management with medal recognition
- Supports competition result documentation with awards
- Enables athlete progress monitoring with achievement tracking
- Creates a complete vertical slice for performance and medal management

## Acceptance Criteria

### AC1: Medal System Management

- **Given** competitions award medals for different positions
- **When** recording competition results
- **Then** the system should support positions 1-12
- **And** position 1 should be Gold, position 2 Silver, position 3 Bronze
- **And** positions 4-12 should be Bronze (for cross-country events)
- **And** medal positions should be unique and properly ordered
- **And** medals should be available for performance recording

### AC2: Individual Performance Recording

- **Given** I am an authenticated user
- **When** I record a performance
- **Then** I should be able to select an athlete, discipline, age group, and date
- **And** I should be able to enter either a time result or distance result
- **And** I should be able to optionally assign a medal position
- **And** I should be able to add event details and upload proof files
- **And** the performance should be validated according to business rules

### AC3: Performance Value Validation

- **Given** I am recording a performance
- **When** I enter performance values
- **Then** timed disciplines should only accept time values in seconds
- **And** measured disciplines should only accept distance values in meters
- **And** I must provide either a performance value OR a medal (or both)
- **And** team disciplines should require team member selection
- **And** all values should be validated for reasonableness

### AC4: Medal Assignment and Validation

- **Given** I am recording a performance with a medal
- **When** I select a medal position
- **Then** I should be able to choose from positions 1-12
- **And** position 1 should display as "Gold"
- **And** position 2 should display as "Silver"
- **And** position 3 should display as "Bronze"
- **And** positions 4-12 should display as "Bronze"
- **And** the medal should be properly associated with the performance

### AC5: Duplicate Performance Prevention

- **Given** I am recording a performance
- **When** I submit the form
- **Then** the system should check for duplicate performances
- **And** duplicate performances should be prevented based on athlete, discipline, age group, gender, date, and event details
- **And** I should receive a clear error message if a duplicate is detected
- **And** I should be able to modify the event details to differentiate performances

### AC6: Automatic Record Detection

- **Given** I record a new performance
- **When** the performance is saved
- **Then** the system should automatically check if it's a club record
- **And** the system should automatically check if it's a personal best
- **And** appropriate flags should be set on the performance
- **And** previous records should be updated accordingly
- **And** I should be notified of any records achieved

### AC7: File Upload Support

- **Given** I am recording a performance
- **When** I want to provide proof of the performance
- **Then** I should be able to upload image files as proof
- **And** the system should validate file types and sizes
- **And** files should be stored securely with proper access controls
- **And** I should be able to view and download uploaded files later

### AC8: Team Performance Recording

- **Given** I am recording a performance for a team discipline
- **When** I select the team discipline
- **Then** I should be required to select the appropriate number of team members
- **And** all team members should be associated with the performance
- **And** the medal (if awarded) should apply to all team members
- **And** team performance validation should be enforced

## Technical Requirements

### System References

- **Data Models**: Medal, Performance models with relationships to athletes, disciplines, and age groups
- **User Flows**: Performance recording flow with medal assignment
- **API Endpoints**: Performance CRUD and validation endpoints with medal support
- **Security Model**: Club-based data isolation and file upload security

### Implementation Details

- Medal model with position and name fields (Gold, Silver, Bronze)
- Performance model with comprehensive validation and medal relationships
- Dynamic form with athlete search and discipline selection
- AJAX validation for real-time feedback
- Automatic record calculation logic with medal consideration
- Secure file upload and storage system
- Duplicate detection and prevention
- Team performance support with member association

### Database Requirements

- Medal table with position and name fields
- Performance table with all required fields and medal foreign key
- Unique constraint on (athlete, discipline, age_group, gender, date, event_details)
- Indexes for efficient record calculation queries
- File storage with secure access controls

## BDD Test Scenarios

### Scenario 1: Medal System Setup

```gherkin
Feature: Performance Recording with Medal System
  As a club member
  I want to record athlete performances with medals
  So that I can track progress and competition achievements

  Scenario: Medal positions are available
    Given the system is initialized
    When I check the available medals
    Then I should see position 1 as "Gold"
    And I should see position 2 as "Silver"
    And I should see position 3 as "Bronze"
    And I should see positions 4-12 as "Bronze"
    And medal positions should be unique

  Scenario: Medal ordering
    Given medals are configured in the system
    When I retrieve medals ordered by position
    Then they should be in ascending order from 1 to 12
    And position 1 should come first
    And position 12 should come last
```

### Scenario 2: Individual Timed Performance Recording

```gherkin
  Scenario: Record successful timed performance with medal
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
    And I select medal "Gold" (1st place)
    And I enter date "2023-06-15"
    And I enter event details "City Championships"
    And I submit the form
    Then the performance should be saved successfully
    And I should see "Performance recorded successfully" message
    And the performance should be marked as timed
    And the performance should have a Gold medal (position 1)
    And the system should check for records automatically
```

### Scenario 3: Measured Performance with Medal Only

```gherkin
  Scenario: Record performance with medal but no measured value
    Given I am logged in
    And there is an athlete "Jane Doe" in my club
    And there is a "High Jump" measured discipline
    When I record a performance for "Jane Doe"
    And I select discipline "High Jump"
    And I select medal "Silver" (2nd place)
    And I don't enter a distance value
    And I submit the form
    Then the performance should be saved with medal only
    And the performance should show Silver medal (position 2)
    And no distance value should be recorded
```

### Scenario 4: Performance Value and Medal Validation

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

  Scenario: Allow both performance value and medal
    Given I am recording a performance
    When I enter a valid time "12.45" seconds
    And I select medal "Gold" (1st place)
    Then both should be accepted
    And the performance should be saved with both time and medal
```

### Scenario 5: Medal Display and Selection

```gherkin
  Scenario: Medal selection shows proper names
    Given I am on the performance recording form
    When I click on the medal dropdown
    Then I should see "1st - Gold" for position 1
    And I should see "2nd - Silver" for position 2
    And I should see "3rd - Bronze" for position 3
    And I should see "4th - Bronze" through "12th - Bronze" for positions 4-12

  Scenario: Medal validation
    Given I am recording a performance
    When I select an invalid medal position
    Then I should see a validation error
    And the form should not be submitted
```

### Scenario 6: Duplicate Performance Prevention

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

### Scenario 7: Automatic Record Detection with Medals

```gherkin
  Scenario: Detect new club record with medal
    Given the current club record for "100m" in "U15 Male" is 13.00 seconds
    When I record a performance of 12.45 seconds with Gold medal for the same category
    Then the performance should be marked as a current club record
    And the medal should be preserved in the record
    And the previous record should be updated to "was_club_record"
    And I should be notified "New Club Record with Gold Medal!"

  Scenario: Detect new personal best with medal
    Given "John Smith" has a previous best of 13.00 seconds in "100m"
    When I record a performance of 12.45 seconds with Silver medal for "John Smith" in "100m"
    Then the performance should be marked as a personal best
    And the medal should be preserved
    And the previous best should be updated to "was_personal_best"
    And I should be notified "New Personal Best with Silver Medal!"
```

### Scenario 8: Team Performance Recording with Medals

```gherkin
  Scenario: Record team relay performance with medal
    Given there is a "4x100m Relay" discipline with team size 4
    And there are 4 athletes available in the club
    When I record a performance for this team discipline
    And I select 4 team members
    And I enter time "45.23" seconds
    And I select medal "Gold" (1st place)
    Then all team members should be associated with the performance
    And all team members should be associated with the Gold medal
    And the performance should be marked as a team event

  Scenario: Team size validation with medal
    Given I am recording a performance for "4x100m Relay" (team size 4)
    When I try to submit with only 3 team members selected
    And I select medal "Bronze"
    Then I should see a validation error about team size
    And the medal should not be saved
    And the form should not be submitted
```

### Scenario 9: File Upload for Performance Proof

```gherkin
  Scenario: Upload performance proof file with medal
    Given I am recording a performance with Gold medal
    When I select a valid image file as proof
    And I submit the form
    Then the file should be uploaded successfully
    And the performance should be saved with both the file reference and medal
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

### Scenario 10: Performance Form Usability

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
    And previous medal information should be shown as reference

  Scenario: Dynamic discipline filtering by season
    Given there are disciplines in multiple seasons
    When I select "Track & Field" season
    Then I should only see disciplines from that season
    And disciplines from other seasons should be hidden
```

### Scenario 11: Performance Data Validation

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

### Scenario 12: Medal Integration and Display

```gherkin
  Scenario: Performance list shows medals
    Given there are performances with various medals
    When I view the performance list
    Then performances with Gold medals should be clearly marked
    And Silver and Bronze medals should be displayed appropriately
    And performances without medals should not show medal indicators

  Scenario: Performance detail view includes medal
    Given there is a performance with a Gold medal
    When I view the performance detail page
    Then I should see the Gold medal prominently displayed
    And the medal position should be clearly shown
    And any medal ceremony photos should be displayed if available
```

## Definition of Done

- [ ] Medal model with positions 1-12 and appropriate names (Gold/Silver/Bronze)
- [ ] Performance model with comprehensive validation and medal relationships
- [ ] Performance recording form with medal selection and dynamic behavior
- [ ] Athlete search with autocomplete functionality
- [ ] Performance value validation for timed vs measured disciplines
- [ ] Medal assignment and validation with proper display
- [ ] Duplicate performance prevention
- [ ] Automatic club record and personal best detection with medal preservation
- [ ] File upload system for performance proof
- [ ] Team performance recording support with shared medals
- [ ] Real-time form validation with clear error messages
- [ ] Performance confirmation with record and medal notifications
- [ ] Medal display in performance lists and detail views
- [ ] All BDD scenarios pass
- [ ] Responsive design for mobile devices
- [ ] Database constraints and indexes properly configured

## Dependencies

- 01_user_authentication.md (authentication system)
- 02_club_management.md (club context)
- 03_user_roles_permissions.md (permission system)
- 04_athlete_management.md (athlete selection and age groups)
- 05_discipline_management.md (discipline selection and seasons)

## Related Stories

- 07_bulk_athlete_upload.md (can be developed in parallel)
- 08_records_management.md (depends on this for performance and medal data)
- 09_medal_recording.md (may be redundant or focused on medal ceremonies)
