# User Story 02: Club Management & Context Switching

**Priority**: Critical (Foundation)
**Epic**: Core System Foundation
**Story Points**: 5

## User Story

As a **system user**, I want to **manage club contexts and switch between clubs** so that I can **access the appropriate club's data and maintain proper data isolation**.

## Business Value

- Enables multi-club architecture
- Ensures data privacy and isolation between clubs
- Provides foundation for all club-specific features
- Supports users who work with multiple clubs

## Acceptance Criteria

### AC1: Club Context Establishment

- **Given** a user logs into the system
- **When** they have access to only one club
- **Then** that club should be automatically set as their current context
- **And** all subsequent data should be filtered to that club

### AC2: Multi-Club Selection

- **Given** a user has access to multiple clubs
- **When** they log into the system
- **Then** they should see a club selector interface
- **And** be able to choose which club to work with
- **And** their selection should be remembered in their session

### AC3: Club Context Switching

- **Given** a user is working with one club
- **When** they select a different club from the club selector
- **Then** their session should be updated with the new club context
- **And** the page should reload with data from the new club
- **And** all navigation should reflect the new club context

### AC4: Data Isolation

- **Given** a user is working in a specific club context
- **When** they access any system feature
- **Then** they should only see data belonging to their current club
- **And** should not be able to access data from other clubs

### AC5: Session Persistence

- **Given** a user has selected a club context
- **When** they navigate to different pages in the system
- **Then** their club context should remain consistent
- **And** persist until they explicitly change it or log out

## Technical Requirements

### System References

- **Data Models**: `02_data_models.md` - Club entity and relationships
- **Security Model**: `07_security_permissions.md` - Club Data Isolation
- **User Flows**: `03_user_flows.md` - Club Switching Flow
- **API Endpoints**: `06_api_endpoints.md` - Club Selection endpoint

### Implementation Details

- Club model with unique name constraint
- Session-based club context storage
- Middleware for automatic club context filtering
- Club selector component in navigation
- Secure club switching with validation

### Database Requirements

- Club table with club_id and name fields
- User-club relationship for access control
- Session storage for current club context

## BDD Test Scenarios

### Scenario 1: Single Club Auto-Selection

```gherkin
Feature: Club Context Management
  As a club member
  I want the system to automatically select my club
  So that I can immediately access my club's data

  Scenario: User with single club access
    Given I have access to only "Springfield Athletics Club"
    When I log into the system
    Then "Springfield Athletics Club" should be automatically selected
    And I should see "Springfield Athletics Club" in the club selector
    And all data should be filtered to this club
```

### Scenario 2: Multi-Club Selection

```gherkin
  Scenario: User with multiple club access
    Given I have access to "Springfield Athletics Club" and "Riverside Track Club"
    When I log into the system
    Then I should see a club selector with both clubs
    And I should be prompted to select a club
    And no club data should be displayed until I make a selection
```

### Scenario 3: Club Context Switching

```gherkin
  Scenario: Switching between clubs
    Given I am logged in and working with "Springfield Athletics Club"
    And I have access to "Riverside Track Club"
    When I select "Riverside Track Club" from the club selector
    Then the page should reload with "Riverside Track Club" data
    And the club selector should show "Riverside Track Club" as selected
    And I should only see athletes and performances from "Riverside Track Club"
```

### Scenario 4: Data Isolation Verification

```gherkin
  Scenario: Club data isolation
    Given I am working with "Springfield Athletics Club"
    And there are athletes in both "Springfield Athletics Club" and "Riverside Track Club"
    When I view the athletes list
    Then I should only see athletes from "Springfield Athletics Club"
    And I should not see any athletes from "Riverside Track Club"
```

### Scenario 5: Session Persistence

```gherkin
  Scenario: Club context persists across pages
    Given I am logged in with "Springfield Athletics Club" selected
    When I navigate to the performances page
    And then navigate to the athletes page
    And then navigate to the records page
    Then "Springfield Athletics Club" should remain selected on all pages
    And all data should consistently be from "Springfield Athletics Club"
```

### Scenario 6: Club Access Validation

```gherkin
  Scenario: Unauthorized club access attempt
    Given I am logged in with access only to "Springfield Athletics Club"
    When I attempt to switch to "Riverside Track Club" (which I don't have access to)
    Then I should see an "Access Denied" error message
    And my club context should remain "Springfield Athletics Club"
    And the attempt should be logged for security monitoring
```

## Definition of Done

- [ ] Club model is created and properly configured
- [ ] Single club users have their club automatically selected
- [ ] Multi-club users can select from available clubs
- [ ] Club context switching works correctly
- [ ] Data isolation is enforced across all features
- [ ] Session persistence maintains club context
- [ ] Unauthorized club access is prevented
- [ ] All BDD scenarios pass
- [ ] Club selector UI is intuitive and responsive
- [ ] Security logging captures club access attempts

## Dependencies

- 01_user_authentication.md (authentication system must exist)

## Related Stories

- 03_user_roles_permissions.md (extends this with role-based access)
- 04_basic_data_models.md (depends on this for club context)
- All subsequent stories depend on club context being established
