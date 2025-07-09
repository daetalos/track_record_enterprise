# Athlete Management & Core Data Setup - Execution Plan

## 📊 **PROGRESS TRACKING DASHBOARD**

### **Overall Status**

- **Current Iteration**: [ ] Iteration 1 | [ ] Iteration 2 | [ ] Iteration 3 | [ ] Iteration 4
- **Overall Progress**: 0% Complete (0 of 4 iterations completed)
- **Last Session Date**: [To be updated during execution]
- **Status**: Ready to begin - Core data foundation implementation

### **Iteration Progress Summary**

| Iteration                                      | Feature                                | Status                                                | Duration Est. | Dependencies           |
| ---------------------------------------------- | -------------------------------------- | ----------------------------------------------------- | ------------- | ---------------------- |
| **Iteration 1**: Core Data Foundation          | Gender + AgeGroup models, API, seeding | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Club management system |
| **Iteration 2**: Individual Athlete Management | Athlete model, creation, validation    | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Iteration 1            |
| **Iteration 3**: Athlete Search & Listing      | Search functionality, AJAX, pagination | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Iteration 2            |
| **Iteration 4**: Detail Views & Integration    | Detail pages, integration testing      | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 3            |

### **Quick Iteration Status**

**Iteration 1 - Core Data Foundation**

- [ ] Branch & Pull Latest
- [ ] Develop (Initial) - Gender/AgeGroup models & migrations
- [ ] Test (Level 1) - Quality check & existing tests
- [ ] Develop (Refine) - API endpoints & comprehensive unit tests
- [ ] Test (Level 2) - Integration validation with new tests
- [ ] Test (Level 3) - Full validation pipeline
- [ ] Docker Validation - Containerized environment testing
- [ ] Create PR & Merge

### **Session Quick Start**

```powershell
# Context Recovery Commands
Get-Location                    # Verify project directory: track_record_enterprise
Test-Path package.json          # Confirm in correct project
git status                      # See current changes
git branch                      # Check current branch
npm run test:run               # Quick test validation
npm run quality:check          # Lint + format + type check
```

## 📋 **PLAN OVERVIEW**

### **Current State Assessment**

- **Project Type**: NextJS 15 with TypeScript, Prisma ORM, NextAuth authentication
- **Foundation Quality**: Strong authentication system, club management, and testing infrastructure
- **Enterprise Readiness**: Missing core athlete data models and management interfaces

### **Target State**

- **Primary Goals**: Complete athlete management system with proper gender/age categorization
- **Standards Compliance**:
  - `db-schema-standards.mdc` - Prisma schema design with relationships
  - `nextjs-structure-standards.mdc` - Component and API organization
  - `bp-testing-standards.mdc` - Comprehensive test coverage
- **Success Metrics**:
  - All acceptance criteria from User Story 04 implemented
  - 100% test coverage for new functionality
  - Club-based data isolation enforced
  - AJAX search functionality working
  - Age group administration for staff users

### **Implementation Strategy**

- **Approach**: Atomic iterations with continuous testing and database-first design
- **Workflow**: Branch → Develop → Test → Develop → Test → Release → PR (4-level testing pyramid)
- **Session Support**: Plan designed for multi-session execution with context recovery
- **Testing Integration**: Vitest unit tests + React Testing Library + Playwright E2E

## 🔍 **CURRENT STATE ANALYSIS**

### ✅ **EXISTING STRENGTHS**

- Complete authentication system with NextAuth and user sessions
- Robust club management with UserClub relationships and role-based access
- Well-structured NextJS 15 App Router with TypeScript
- Comprehensive testing setup (Vitest + React Testing Library + Playwright)
- Prisma ORM with PostgreSQL and proper indexing
- Docker containerization with multi-stage builds
- Quality tooling: ESLint, Prettier, Husky pre-commit hooks
- Established npm scripts for testing and validation

### ❌ **CRITICAL GAPS IDENTIFIED**

**Athlete Data Foundation (`db-schema-standards.mdc`)**

- No Gender model for athlete categorization (Male/Female with initials)
- No AgeGroup model for competition categorization (U9, U10, Senior, etc.)
- No Athlete model with proper validation and club relationships
- Missing database constraints for duplicate prevention

**Athlete Management Interface (`nextjs-structure-standards.mdc`)**

- No athlete creation forms with validation
- No athlete search and listing functionality
- No AJAX search components for athlete selection
- No athlete detail pages for profile viewing

**Age Group Administration (`bp-security-standards.mdc`)**

- No age group management interface for staff users
- No club-specific age group configuration
- No ordinal sorting for proper age group display

**API Endpoints (`typescript-nextjs-standards.mdc`)**

- No athlete CRUD API routes
- No age group management API
- No athlete search endpoints for AJAX functionality
- Missing club-based data isolation in API layer

**Testing Coverage (`bp-testing-standards.mdc`)**

- No unit tests for athlete-related functionality
- No integration tests for athlete data flows
- No E2E tests for athlete management workflows

## 🚀 **ITERATION 1: CORE DATA FOUNDATION**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement the foundational data models (Gender, AgeGroup) with database migrations, API endpoints, and age group administration interface for staff users.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: Club management system (existing)
**Scope**: Database models, migrations, API endpoints, age group admin UI

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration1-core-data-foundation
```

### **Step 2: Develop (Initial)**

- Create Gender and AgeGroup Prisma models with proper constraints
- Generate and run database migrations
- Implement database seeding for Gender data
- Focus on getting basic models and database structure working

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Create API routes for age group CRUD operations with club isolation
- Build age group administration interface for staff users (ADMIN/OWNER roles only)
- Implement ClubContext integration using existing `useClub()` hook patterns
- Add Gender seed data to `prisma/seed.js` with Male/Female entries
- Implement proper error handling and validation
- **Write comprehensive unit tests** for new functionality:
  - API route tests for age group operations
  - Database model validation tests
  - Component tests for age group admin interface
  - Staff permission enforcement tests
- Follow existing test patterns (Vitest, React Testing Library)

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage (including new tests)
npm run build          # Verify compilation and type checking
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline (if exists)
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate database migrations ran successfully
# Test age group creation via admin interface
# Verify staff user permissions for age group management

# Clean up Docker environment
docker-compose down
```

### **Step 7: Create PR & Merge (From git-standards.mdc)**

```powershell
# Push feature branch
git push -u origin feat/iteration1-core-data-foundation

# Create PR with detailed description
gh pr create --title "feat(athlete): implement core data foundation with Gender and AgeGroup models" --body "Implements User Story 04 Iteration 1: Core data models, migrations, and age group administration interface"

# After review and approval, update main
git checkout main
git pull origin main
git branch -d feat/iteration1-core-data-foundation
```

## **📋 ITERATION 1 IMPLEMENTATION**

**Rule References**: `db-schema-standards.mdc`, `nextjs-structure-standards.mdc`, `bp-testing-standards.mdc`

**Files to Create/Modify**:

- `prisma/schema.prisma` (modify) - Add Gender and AgeGroup models with proper relationships
- `prisma/seed.js` (modify) - Add Gender seed data (Male/M, Female/F) and migration handling
- `src/app/api/age-groups/route.ts` (new) - Age group CRUD endpoints with ADMIN/OWNER permission checks
- `src/app/api/age-groups/[id]/route.ts` (new) - Individual age group operations
- `src/app/(admin)/age-groups/page.tsx` (new) - Age group administration interface with role-based access
- `src/components/age-group/AgeGroupForm.tsx` (new) - Age group creation/edit form using ClubContext
- `src/components/age-group/AgeGroupList.tsx` (new) - Age group listing component with club filtering
- `src/types/athlete.ts` (new) - TypeScript types for athlete domain (Gender, AgeGroup, Athlete)
- `src/lib/permissions.ts` (new) - Staff permission utility functions for age group access

**Implementation Steps**:

1. **Database Models**: Add Gender and AgeGroup models to Prisma schema with club foreign keys and unique constraints
2. **Seed Data Implementation**: Update `prisma/seed.js` with Gender entries and database migration workflow
3. **Permission System**: Create staff permission utilities that check UserClub.role for ADMIN/OWNER access
4. **API Endpoints**: Create RESTful API routes for age group management with role-based access control
5. **ClubContext Integration**: Build components that use existing `useClub()` hook for club selection and filtering
6. **Admin Interface**: Build age group administration page accessible only to ADMIN/OWNER users
7. **Type Definitions**: Create comprehensive TypeScript types for Gender, AgeGroup, and Athlete models
8. **Migration Workflow**: Implement database migration commands and rollback procedures for development

**Testing Strategy**:

- **Unit Tests**: API route tests, model validation, component rendering
- **Integration Tests**: Database operations, API endpoint flows, form submissions
- **E2E Tests**: Age group administration workflow for staff users
- **Coverage Goal**: 100% test coverage for new functionality

**Commit Strategy**:

- `feat(athlete): add Gender and AgeGroup models with migrations`
- `feat(athlete): implement age group CRUD API endpoints`
- `feat(athlete): add age group administration interface`
- `test(athlete): add comprehensive unit tests for core data foundation`

### **🎯 ITERATION 1 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Gender model with Male/Female entries and unique constraints implemented
- [ ] AgeGroup model with club relationships and ordinal sorting implemented
- [ ] Database migrations run successfully with proper indexes
- [ ] Gender seed data populates correctly (Male/M, Female/F)
- [ ] Age group CRUD API endpoints functional with club isolation
- [ ] Age group administration interface accessible to staff users only
- [ ] **New unit tests written** with 100% coverage for models and API routes
- [ ] Level 1-3 tests pass including new comprehensive test suite
- [ ] Docker deployment validation passes with database connectivity
- [ ] Age group creation and management working in containerized environment
- [ ] **All existing tests continue to pass** (no regression)
- [ ] Staff user permissions enforced for age group management
- [ ] Club-specific age group isolation working correctly

## 🚀 **ITERATION 2: INDIVIDUAL ATHLETE MANAGEMENT**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement the Athlete model with proper validation, creation forms, and club-based data isolation with duplicate prevention.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: Iteration 1 (Gender and AgeGroup models)
**Scope**: Athlete model, CRUD operations, creation forms, validation

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
git checkout main
git pull origin main
git checkout -b feat/iteration2-athlete-management
```

### **Step 2: Develop (Initial)**

- Create Athlete Prisma model with relationships to Gender and Club
- Generate database migrations for Athlete table
- Implement basic athlete creation API endpoint
- Focus on core athlete data structure and relationships

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Build athlete creation form with gender selection using existing ClubContext patterns
- Implement duplicate prevention within clubs using (club, first_name, last_name) constraint
- Integrate with existing `useClub()` hook for automatic club association
- Add comprehensive error handling and user feedback
- **Write comprehensive unit tests**:
  - Athlete model validation tests
  - API endpoint tests for creation and validation
  - Form component tests with ClubContext integration
  - Club isolation and duplicate prevention tests

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete test suite
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
docker-compose up --build -d
# Test athlete creation through web interface
# Verify club isolation and duplicate prevention
# Test form validation and error handling
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
git push -u origin feat/iteration2-athlete-management
gh pr create --title "feat(athlete): implement individual athlete management with validation" --body "Implements User Story 04 Iteration 2: Athlete model, creation forms, and club-based validation"
```

## **📋 ITERATION 2 IMPLEMENTATION**

**Rule References**: `db-schema-standards.mdc`, `bp-security-standards.mdc`, `ui-tailwind-css-standards.mdc`

**Files to Create/Modify**:

- `prisma/schema.prisma` (modify) - Add Athlete model with Gender/Club foreign keys and unique constraints
- `src/app/api/athletes/route.ts` (new) - Athlete CRUD endpoints with club-based filtering
- `src/app/api/athletes/[id]/route.ts` (new) - Individual athlete operations
- `src/app/(admin)/athletes/new/page.tsx` (new) - Athlete creation page using ClubContext
- `src/components/athlete/AthleteForm.tsx` (new) - Athlete form with `useClub()` integration for automatic club assignment
- `src/components/athlete/AthleteCard.tsx` (new) - Athlete display component with gender and club information
- `src/lib/validations/athlete.ts` (new) - Zod validation schemas for athlete creation/editing
- `src/hooks/useAthletes.ts` (new) - Custom hook for athlete data management with club filtering

**Implementation Steps**:

1. **Database Model**: Create Athlete model with Gender and Club foreign keys, unique constraint on (club, first_name, last_name)
2. **ClubContext Integration**: Build custom hooks that leverage existing `useClub()` patterns for automatic club filtering
3. **API Endpoints**: Build athlete CRUD operations with club-based access control using existing auth patterns
4. **Creation Form**: Design responsive athlete creation form that uses ClubContext for automatic club assignment
5. **Validation**: Implement Zod schemas for client/server validation with duplicate prevention logic
6. **Error Handling**: Add comprehensive error messages and form state management following existing patterns

**Testing Strategy**:

- **Model Tests**: Athlete creation, validation, relationships
- **API Tests**: CRUD operations, club isolation, duplicate prevention
- **Component Tests**: Form rendering, validation, submission
- **Integration Tests**: End-to-end athlete creation flow

### **🎯 ITERATION 2 COMPLETION CRITERIA**

- [ ] Athlete model implemented with proper relationships and constraints
- [ ] Unique constraint on (club, first_name, last_name) working
- [ ] Athlete creation API endpoints functional with validation
- [ ] Athlete creation form with gender selection implemented
- [ ] Club-based data isolation enforced for athlete operations
- [ ] Duplicate prevention working within clubs
- [ ] Comprehensive validation error messages displayed
- [ ] **New unit tests achieve 100% coverage** for athlete functionality
- [ ] All test levels pass including new test suite
- [ ] Docker validation passes with athlete creation working
- [ ] Form data retention on validation errors implemented

## 🚀 **ITERATION 3: ATHLETE SEARCH & LISTING**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement athlete search functionality, listing pages with pagination, and AJAX search components for dynamic athlete selection.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: Iteration 2 (Athlete model and creation)
**Scope**: Search functionality, listing pages, AJAX components, pagination

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
git checkout main
git pull origin main
git checkout -b feat/iteration3-athlete-search-listing
```

### **Step 2: Develop (Initial)**

- Create athlete listing page with basic search functionality
- Implement athlete search API endpoint
- Add basic pagination for athlete lists
- Focus on core search and listing functionality

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check
npm run test:run
```

### **Step 4: Develop (Refine)**

- Build AJAX search component for dynamic athlete selection using ClubContext for filtering
- Implement case-insensitive search functionality with club-based result filtering
- Add advanced filtering and sorting options that respect club boundaries
- Integrate search components with existing pagination patterns
- **Write comprehensive unit tests**:
  - Search API endpoint tests with club isolation verification
  - Search component tests with ClubContext integration scenarios
  - Pagination component tests with club-filtered data
  - AJAX functionality tests with existing authentication patterns

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage
npm run build
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all
npm run validate:pre-docker
```

### **Step 6.5: Docker Deployment Validation**

```powershell
docker-compose up --build -d
# Test athlete search functionality
# Verify AJAX search components work
# Test pagination and filtering
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
git push -u origin feat/iteration3-athlete-search-listing
gh pr create --title "feat(athlete): implement search and listing functionality" --body "Implements User Story 04 Iteration 3: Athlete search, listing, and AJAX components"
```

## **📋 ITERATION 3 IMPLEMENTATION**

**Rule References**: `nextjs-structure-standards.mdc`, `ui-tailwind-css-standards.mdc`, `typescript-nextjs-standards.mdc`

**Files to Create/Modify**:

- `src/app/api/athletes/search/route.ts` (new) - Athlete search endpoint with club-based filtering
- `src/app/(admin)/athletes/page.tsx` (new) - Athlete listing page using ClubContext for data filtering
- `src/components/athlete/AthleteList.tsx` (new) - Athlete listing component with club-aware pagination
- `src/components/athlete/AthleteSearch.tsx` (new) - Search functionality integrated with existing ClubContext
- `src/components/athlete/AthleteSearchAjax.tsx` (new) - AJAX search component for form integration
- `src/components/tables/Pagination.tsx` (modify) - Enhanced pagination following existing patterns
- `src/hooks/useAthleteSearch.ts` (new) - Search hook that leverages `useClub()` for automatic filtering

**Implementation Steps**:

1. **Search API**: Create athlete search endpoint with name-based filtering and automatic club-based result limitation
2. **ClubContext Integration**: Build search functionality that uses existing `useClub()` hook for seamless club filtering
3. **Listing Page**: Build comprehensive athlete listing with search and pagination, respecting club boundaries
4. **AJAX Search**: Implement dynamic search component that integrates with existing form patterns
5. **Filtering**: Add gender-based filtering and sorting options within club scope
6. **Performance**: Optimize search queries with proper indexing and club-based query optimization

**Testing Strategy**:

- **API Tests**: Search endpoint functionality, filtering, performance
- **Component Tests**: Search inputs, result display, pagination
- **Hook Tests**: Search state management and debouncing
- **E2E Tests**: Complete search workflow with various scenarios

### **🎯 ITERATION 3 COMPLETION CRITERIA**

- [ ] Athlete search API endpoint functional with case-insensitive search
- [ ] Athlete listing page with search and pagination implemented
- [ ] AJAX search component working for dynamic athlete selection
- [ ] Club-specific athlete filtering enforced in all search operations
- [ ] Search by first name and last name working correctly
- [ ] Pagination working with proper page size and navigation
- [ ] Gender display included in search results
- [ ] **Comprehensive unit tests** for all search functionality
- [ ] All test levels pass with new search test suite
- [ ] Docker validation confirms search functionality works
- [ ] Performance optimized with proper database indexes

## 🚀 **ITERATION 4: ATHLETE DETAIL VIEWS & INTEGRATION**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement athlete detail pages, complete integration testing, and add placeholder sections for future performance tracking features.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 3 (Search and listing functionality)
**Scope**: Detail pages, integration testing, performance placeholders, final validation

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
git checkout main
git pull origin main
git checkout -b feat/iteration4-athlete-details-integration
```

### **Step 2: Develop (Initial)**

- Create athlete detail page with complete profile information
- Implement navigation from listing to detail pages
- Add basic athlete profile layout with gender display
- Focus on core detail page functionality

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check
npm run test:run
```

### **Step 4: Develop (Refine)**

- Add placeholder sections for performance history and records
- Implement responsive design for mobile devices
- Add navigation breadcrumbs and back functionality
- **Write comprehensive unit tests**:
  - Detail page component tests
  - Navigation tests
  - Responsive design tests
  - Integration tests across all athlete management features

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage
npm run build
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all
npm run validate:pre-docker
```

### **Step 6.5: Docker Deployment Validation**

```powershell
docker-compose up --build -d
# Test complete athlete management workflow
# Verify all features work in containerized environment
# Test responsive design and navigation
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
git push -u origin feat/iteration4-athlete-details-integration
gh pr create --title "feat(athlete): implement detail views and complete integration" --body "Implements User Story 04 Iteration 4: Athlete detail pages and final integration testing"
```

## **📋 ITERATION 4 IMPLEMENTATION**

**Rule References**: `ui-tailwind-css-standards.mdc`, `bp-testing-standards.mdc`, `nextjs-performance-standards.mdc`

**Files to Create/Modify**:

- `src/app/(admin)/athletes/[id]/page.tsx` (new) - Athlete detail page
- `src/components/athlete/AthleteProfile.tsx` (new) - Athlete profile component
- `src/components/athlete/PerformancePlaceholder.tsx` (new) - Future performance section
- `src/components/common/PageBreadCrumb.tsx` (modify) - Enhanced breadcrumbs
- `src/hooks/useGoBack.ts` (modify) - Enhanced navigation
- `tests/athlete-management.spec.ts` (new) - E2E tests for complete workflow

**Implementation Steps**:

1. **Detail Pages**: Create comprehensive athlete profile pages
2. **Navigation**: Implement proper navigation and breadcrumbs
3. **Placeholders**: Add sections for future performance features
4. **Responsive Design**: Ensure mobile-friendly layout
5. **Integration Testing**: Complete end-to-end testing of all functionality

**Testing Strategy**:

- **Component Tests**: Detail page rendering and data display
- **Navigation Tests**: Routing and breadcrumb functionality
- **Integration Tests**: Complete athlete management workflow
- **E2E Tests**: Full user journey from creation to detail viewing
- **Responsive Tests**: Mobile and tablet layout validation

### **🎯 ITERATION 4 COMPLETION CRITERIA**

- [ ] Athlete detail pages implemented with complete profile information
- [ ] Navigation from listing to detail pages working correctly
- [ ] Gender information prominently displayed on detail pages
- [ ] Placeholder sections for performance history implemented
- [ ] Responsive design working on mobile and tablet devices
- [ ] Breadcrumb navigation implemented throughout athlete section
- [ ] **Complete integration test suite** covering all athlete features
- [ ] All test levels pass with comprehensive coverage
- [ ] Docker validation confirms complete workflow functionality
- [ ] Performance optimized for detail page loading
- [ ] **User Story 04 acceptance criteria fully satisfied**
- [ ] Ready for future performance tracking integration

## 📚 **APPENDIX: SESSION MANAGEMENT**

### **Starting a New Session**

1. **Context Recovery**: Check progress dashboard and identify current iteration
2. **Git Status Check**: `git status && git branch` to verify state
3. **Environment Verification**: `npm run quality:check` for quick validation
4. **Database Status**: Check if migrations are up to date
5. **Iteration Identification**: Find next uncompleted iteration and resume at appropriate step

### **Iteration Workflow (Per Session)**

1. **Branch & Pull** → `git checkout main && git pull origin main`
2. **Create Branch** → `git checkout -b feat/iterationX-feature-name`
3. **Develop (Initial)** → Core functionality implementation
4. **Test L1** → `npm run quality:check && npm run test:run`
5. **Develop (Refine)** → Add tests and refined functionality
6. **Test L2** → `npm run test:coverage && npm run build`
7. **Test L3** → `npm run test:all && npm run validate:pre-docker`
8. **Docker Validation** → `docker-compose up --build -d` + feature testing
9. **Create PR** → Push branch and create detailed pull request
10. **Update Progress** → Mark iteration completed in dashboard

### **Quality Gates (4-Level Testing Pyramid)**

- **Level 1**: Immediate feedback (quality:check, test:run) - existing tests only
- **Level 2**: Integration validation (test:coverage, build) - including new tests
- **Level 3**: Release readiness (test:all, validate:pre-docker) - full suite
- **Level 4**: Docker deployment validation - containerized environment testing

### **Emergency Recovery**

If issues occur during an iteration:

1. **Git Status**: `git status && git log --oneline -5`
2. **Test Status**: Check which test level failed and review output
3. **Database Status**: Verify migrations and seed data integrity
4. **Rollback**: `git checkout main && git branch -D current-branch` if needed
5. **Fresh Start**: Begin iteration again with clean state

### **Session Continuity Rules**

- Each iteration should complete in single session (2-4 hours maximum)
- Always end sessions with clean git state (committed or stashed)
- Update progress dashboard before ending sessions
- Next session starts with fresh main pull and context recovery
- Document any blocking issues in progress dashboard

### **Rule Reference Quick Guide**

- **Database**: `db-schema-standards.mdc`, `db-client-standards.mdc`
- **API**: `typescript-nextjs-standards.mdc`, `nextjs-structure-standards.mdc`
- **UI**: `ui-tailwind-css-standards.mdc`, `dashboard-ui-patterns.mdc`
- **Testing**: `bp-testing-standards.mdc`
- **Security**: `bp-security-standards.mdc`
- **Git**: `git-standards.mdc`

## 📋 **DETAILED IMPLEMENTATION SPECIFICATIONS**

### **1. ClubContext Integration Patterns**

**Existing Pattern to Follow:**

```typescript
// From existing ClubSelector.tsx - use this pattern
const { selectedClub, userClubs, isLoading, error, selectClub } = useClub();

// Apply to all athlete components:
// - AthleteForm: Use selectedClub.id for automatic club assignment
// - AthleteList: Filter athletes by selectedClub.id
// - AthleteSearch: Limit search results to selectedClub.id
// - AgeGroupAdmin: Manage age groups for selectedClub.id only
```

**Component Integration Requirements:**

- All athlete components MUST use `useClub()` hook from existing ClubContext
- Automatic club filtering applied to all data operations
- No manual club selection - always use currently selected club
- Error handling patterns match existing ClubSelector component

### **3. Staff Permission Integration Specifications**

**Permission Check Implementation:**

```typescript
// src/lib/permissions.ts - Create this utility
import { UserClub, ClubRole } from '@prisma/client';

export const canManageAgeGroups = (userRole: ClubRole): boolean => {
  return userRole === 'ADMIN' || userRole === 'OWNER';
};

export const canCreateAthletes = (userRole: ClubRole): boolean => {
  return userRole === 'ADMIN' || userRole === 'OWNER' || userRole === 'MEMBER';
};
```

**API Integration Pattern:**

```typescript
// Use existing getUserClubRole pattern from db.ts
const userRole = await getUserClubRole(userId, clubId);
if (!canManageAgeGroups(userRole)) {
  return NextResponse.json(
    { error: 'Insufficient permissions' },
    { status: 403 }
  );
}
```

**UI Permission Integration:**

- Age group administration pages: Check ADMIN/OWNER roles only
- Athlete creation: Available to all authenticated club members
- Use existing authentication patterns from ClubSelector

### **4. Seed Data Implementation Details**

**prisma/seed.js Modifications:**

```javascript
// Add to existing seed.js file
async function seedGenderData() {
  console.log('🌱 Seeding Gender data...');

  // Create Gender entries with proper constraints
  const maleGender = await prisma.gender.upsert({
    where: { name: 'Male' },
    update: {},
    create: {
      name: 'Male',
      initial: 'M',
    },
  });

  const femaleGender = await prisma.gender.upsert({
    where: { name: 'Female' },
    update: {},
    create: {
      name: 'Female',
      initial: 'F',
    },
  });

  console.log('✅ Gender data seeded successfully');
  return { maleGender, femaleGender };
}

// Add to main seed function
async function main() {
  // ... existing seed code ...

  // Add gender seeding
  await seedGenderData();

  // ... rest of existing seed code ...
}
```

**Migration Commands for Development:**

```powershell
# Generate migration after schema changes
npx prisma migrate dev --name add-athlete-management-models

# Reset and reseed database (development only)
npx prisma migrate reset --force

# Run seed explicitly
npm run db:seed

# Check migration status
npx prisma migrate status
```

**Database Migration Workflow:**

1. **Iteration 1**: Generate migration for Gender and AgeGroup models
2. **Iteration 2**: Generate migration for Athlete model with foreign keys
3. **Each Iteration**: Verify migration runs successfully before proceeding
4. **Rollback Plan**: Use `npx prisma migrate reset` if iteration fails

### **Implementation Verification Checklist**

**ClubContext Integration:**

- [ ] All components use `useClub()` hook from existing context
- [ ] No manual club selection in athlete components
- [ ] Automatic filtering by `selectedClub.id` in all data operations
- [ ] Error handling matches existing ClubSelector patterns

**Staff Permission Integration:**

- [ ] Age group admin pages restricted to ADMIN/OWNER roles
- [ ] Permission utility functions created and tested
- [ ] API endpoints enforce role-based access control
- [ ] UI components hide/show features based on user role

**Seed Data Implementation:**

- [ ] Gender seed data (Male/M, Female/F) successfully created
- [ ] Upsert patterns prevent duplicate entries on re-seeding
- [ ] Migration commands documented and tested
- [ ] Rollback procedures verified in development environment

---

**Note**: This execution plan delivers the complete athlete management system through four atomic iterations, each with comprehensive testing and validation. The plan follows enterprise standards and ensures proper integration with existing club management and authentication systems.
