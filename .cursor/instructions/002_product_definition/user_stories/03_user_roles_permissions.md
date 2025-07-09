# User Story 03: User Roles & Permissions

**Priority**: Critical (Foundation)
**Epic**: Core System Foundation
**Story Points**: 6
**Status**: ✅ COMPLETE

## User Story

As a **club administrator**, I want to **manage user roles and permissions within club contexts** so that I can **control access to different system features based on user responsibilities within each club**.

## Business Value

- Ensures appropriate access control for different user types
- Protects sensitive data from unauthorized access
- Supports different organizational roles within clubs
- Enables secure delegation of administrative tasks
- Provides superior club-based data isolation

## Acceptance Criteria

### AC1: Anonymous User Access

- **Given** an anonymous (non-logged-in) user
- **When** they access the system
- **Then** they should only see public club records and general information
- **And** should not be able to create, edit, or delete any data
- **And** should not see sensitive athlete information

### AC2: Authenticated User Permissions

- **Given** a logged-in authenticated user
- **When** they access the system
- **Then** they should have full read access to their club's data
- **And** be able to create and manage performances
- **And** be able to create and manage athletes
- **And** be able to upload and download performance proof files
- **And** be restricted to their club's data only

### AC3: Club Admin Permissions

- **Given** a user with ADMIN role in a club
- **When** they access the system
- **Then** they should have all authenticated user permissions
- **And** be able to manage club members and their roles
- **And** have access to administrative features within their club
- **And** still be limited to their club's data

### AC4: Club Owner Permissions

- **Given** a user with OWNER role in a club
- **When** they access the system
- **Then** they should have complete administrative access within their club
- **And** be able to manage all club data and settings
- **And** be able to assign and modify user roles within the club
- **And** have the highest level of permissions within their club context

### AC5: Permission Enforcement

- **Given** a user attempts to access a feature
- **When** they don't have the required permissions
- **Then** they should be denied access with appropriate error handling
- **And** they should be redirected to an appropriate page
- **And** the system maintains security through API-level authorization

## Technical Requirements

### System References

- **Security Model**: NextAuth-based authentication with JWT sessions
- **User Flows**: Club context management and role-based access
- **Data Models**: Prisma schema with User, Club, and UserClub models

### Implementation Details

- NextAuth for authentication with Prisma adapter
- Club-based role system using UserClub junction table
- ClubRole enum with MEMBER, ADMIN, OWNER values
- API route protection via validateApiClubAuth middleware
- Session-based club context management

### Database Requirements

- User model with NextAuth integration
- Club model for multi-club support
- UserClub junction table with role field
- Role-based access validation functions

## BDD Test Scenarios

### Scenario 1: Anonymous User Access

```gherkin
Feature: User Roles and Permissions
  As a club administrator
  I want to control access based on user roles
  So that data security is maintained

  Scenario: Anonymous user viewing public data
    Given I am not logged in
    When I visit the club records page
    Then I should see public club records
    And I should not see any "Create" or "Edit" buttons
    And I should not see sensitive athlete information

  Scenario: Anonymous user blocked from protected features
    Given I am not logged in
    When I try to access the "Dashboard" page
    Then I should be redirected to the login page
    And I should see authentication required message
```

### Scenario 2: Authenticated User Permissions

```gherkin
  Scenario: Authenticated user accessing club data
    Given I am logged in as a MEMBER of "Springfield Athletics Club"
    When I visit the athletes page
    Then I should see all athletes from "Springfield Athletics Club"
    And I should see "Create Athlete" button
    And I should not see athletes from other clubs

  Scenario: Authenticated user creating performance
    Given I am logged in as a MEMBER with selected club context
    When I access the "Create Performance" page
    Then I should see the performance creation form
    And I should be able to submit valid performance data
    And the performance should be saved successfully
```

### Scenario 3: Club Admin Permissions

```gherkin
  Scenario: Club admin managing members
    Given I am logged in as an ADMIN of "Springfield Athletics Club"
    When I navigate to the club management section
    Then I should see member management options
    And I should be able to view club member roles
    And I should have administrative capabilities within my club

  Scenario: Club admin data isolation
    Given I am logged in as an ADMIN of "Springfield Athletics Club"
    When I access any club data
    Then I should only see data from "Springfield Athletics Club"
    And I should not have access to other clubs' data
```

### Scenario 4: Club Owner Permissions

```gherkin
  Scenario: Club owner complete access
    Given I am logged in as an OWNER of "Springfield Athletics Club"
    When I access club management features
    Then I should have complete administrative access
    And I should be able to manage all club settings
    And I should be able to modify user roles within my club

  Scenario: Multi-club owner context switching
    Given I am an OWNER of multiple clubs
    When I switch between club contexts
    Then I should maintain appropriate permissions for each club
    And data should be properly isolated by club context
```

### Scenario 5: Permission Enforcement

```gherkin
  Scenario: Member blocked from admin features
    Given I am logged in as a MEMBER
    When I try to access administrative functions
    Then I should see appropriate access restrictions
    And I should only see features appropriate for my role

  Scenario: Cross-club access prevention
    Given I am logged in with access to one club
    When I attempt to access another club's data
    Then I should be denied access
    And the system should maintain strict club isolation
```

### Scenario 6: Role-Based UI Elements

```gherkin
  Scenario: UI elements based on club role
    Given I am logged in as a MEMBER
    When I view any page
    Then I should only see UI elements appropriate for my role
    And I should not see admin-only buttons or links

  Scenario: Admin user sees additional options
    Given I am logged in as an ADMIN
    When I view club management pages
    Then I should see additional administrative options
    And I should see role-appropriate functionality
```

## Definition of Done

- [x] Anonymous users can view public data only
- [x] Authenticated users have appropriate club-specific permissions
- [x] Club admins have extended administrative capabilities within their clubs
- [x] Club owners have complete access within their club contexts
- [x] Permission checks are enforced at API route level
- [x] UI elements are shown/hidden based on club roles
- [x] Data isolation prevents cross-club access
- [x] All BDD scenarios reflect club-based permission model
- [x] Role-based access is consistent across all features
- [x] Error handling provides appropriate user feedback

## Dependencies

- 01_user_authentication.md (NextAuth authentication system)
- 02_club_management.md (club context system)

## Related Stories

- 04_basic_data_models.md (uses club-based permission system)
- All subsequent stories inherit club permission requirements

## Implementation Notes

The current implementation uses a sophisticated club-based permission system that exceeds the original requirements:

- **Superior Data Isolation**: Club-based roles provide better security than global roles
- **Flexible Multi-Club Support**: Users can have different roles in different clubs
- **Real-World Alignment**: Permission model matches actual athletics club structures
- **NextJS Integration**: Built on modern NextAuth and Prisma architecture

This implementation is complete and production-ready.
