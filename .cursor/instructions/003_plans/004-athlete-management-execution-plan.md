# Athlete Management & Core Data Setup - Execution Plan

## 📊 **PROGRESS TRACKING DASHBOARD**

### **Overall Status**

- **Current Iteration**: [ ] Iteration 1A | [ ] Iteration 1B | [ ] Iteration 2A | [ ] Iteration 2B | [ ] Iteration 3A | [ ] Iteration 3B | [ ] Iteration 4
- **Overall Progress**: 0% Complete (0 of 7 iterations completed)
- **Last Session Date**: [To be updated during execution]
- **Status**: Ready to begin - Core data foundation implementation

### **Iteration Progress Summary**

| Iteration                                    | Feature                                 | Status                                                | Duration Est. | Dependencies           |
| -------------------------------------------- | --------------------------------------- | ----------------------------------------------------- | ------------- | ---------------------- |
| **Iteration 1A**: Basic Data Models          | Gender + AgeGroup models, migrations    | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Club management system |
| **Iteration 1B**: Age Group Management       | Age group CRUD API, admin interface     | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 1A           |
| **Iteration 2A**: Athlete Model Foundation   | Athlete model, basic API                | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 1B           |
| **Iteration 2B**: Athlete Creation Interface | Creation forms, validation, UI          | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 2A           |
| **Iteration 3A**: Basic Search & Listing     | Listing page, simple search, pagination | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 2B           |
| **Iteration 3B**: Advanced Search Features   | AJAX search, filtering, optimization    | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 3A           |
| **Iteration 4**: Detail Views & Integration  | Detail pages, final integration         | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 3B           |

### **Quick Iteration Status**

**Iteration 1A - Basic Data Models**

- [ ] Branch & Pull Latest
- [ ] Develop (Initial) - Gender/AgeGroup models & migrations
- [ ] Test (Level 1) - Quality check & existing tests
- [ ] Develop (Refine) - Seed data & basic model tests
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

## 🚀 **ITERATION 1A: BASIC DATA MODELS**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement the foundational data models (Gender, AgeGroup) with database migrations and basic seed data. Focus on getting the core database structure working without UI complexity.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Club management system (existing)
**Scope**: Database models, migrations, seed data, basic model tests

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration1a-basic-data-models
```

### **Step 2: Develop (Initial)**

- Create Gender and AgeGroup Prisma models with proper constraints
- Generate and run database migrations
- Focus on getting basic models and database structure working
- Add TypeScript types for Gender and AgeGroup

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Implement Gender seed data in `prisma/seed.js` with Male/Female entries
- Add basic model validation tests
- Implement proper database constraints and indexes
- **Write focused unit tests** for new functionality:
  - Database model validation tests
  - Seed data integrity tests
  - Schema constraint tests
- Follow existing test patterns (Vitest)

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
# Deploy to Docker and validate database setup
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate database migrations ran successfully
# Test seed data population
# Verify database constraints work correctly

# Clean up Docker environment
docker-compose down
```

### **Step 7: Create PR & Merge (From git-standards.mdc)**

```powershell
# Push feature branch
git push -u origin feat/iteration1a-basic-data-models

# Create PR with detailed description
gh pr create --title "feat(athlete): implement basic Gender and AgeGroup data models" --body "Implements User Story 04 Iteration 1A: Core data models, migrations, and seed data foundation"

# After review and approval, update main
git checkout main
git pull origin main
git branch -d feat/iteration1a-basic-data-models
```

## **📋 ITERATION 1A IMPLEMENTATION**

**Rule References**: `db-schema-standards.mdc`, `bp-testing-standards.mdc`

**Files to Create/Modify**:

- `prisma/schema.prisma` (modify) - Add Gender and AgeGroup models with proper relationships
- `prisma/seed.js` (modify) - Add Gender seed data (Male/M, Female/F)
- `src/types/athlete.ts` (new) - TypeScript types for Gender and AgeGroup models

**Implementation Steps**:

1. **Database Models**: Add Gender and AgeGroup models to Prisma schema with club foreign keys and unique constraints
2. **Seed Data Implementation**: Update `prisma/seed.js` with Gender entries (Male/M, Female/F)
3. **Type Definitions**: Create TypeScript types for Gender and AgeGroup models
4. **Migration Workflow**: Generate and test database migrations
5. **Basic Validation**: Add database constraints and basic validation tests

**Testing Strategy**:

- **Unit Tests**: Model validation, seed data integrity, database constraints
- **Coverage Goal**: 100% test coverage for new models and seed functionality

**Commit Strategy**:

- `feat(athlete): add Gender and AgeGroup models with migrations`
- `feat(athlete): implement Gender seed data and database constraints`
- `test(athlete): add unit tests for basic data models`

### **🎯 ITERATION 1A COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Gender model with Male/Female entries and unique constraints implemented
- [ ] AgeGroup model with club relationships and ordinal sorting implemented
- [ ] Database migrations run successfully with proper indexes
- [ ] Gender seed data populates correctly (Male/M, Female/F)
- [ ] TypeScript types created for Gender and AgeGroup models
- [ ] **New unit tests written** with 100% coverage for models and seed data
- [ ] Level 1-3 tests pass including new focused test suite
- [ ] Docker deployment validation passes with database connectivity
- [ ] Database setup working correctly in containerized environment
- [ ] **All existing tests continue to pass** (no regression)
- [ ] Database constraints prevent invalid data entry

## 🚀 **ITERATION 1B: AGE GROUP MANAGEMENT**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement age group CRUD API endpoints and administration interface for staff users, building on the data models from Iteration 1A.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 1A (Gender and AgeGroup models)
**Scope**: API endpoints, admin interface, permission system

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
git checkout main
git pull origin main
git checkout -b feat/iteration1b-age-group-management
```

### **Step 2: Develop (Initial)**

- Create age group CRUD API endpoints with basic functionality
- Implement permission utilities for staff access control
- Focus on core API operations working

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Build age group administration interface for staff users (ADMIN/OWNER roles only)
- Implement ClubContext integration using existing `useClub()` hook patterns
- Add comprehensive error handling and validation
- **Write comprehensive unit tests** for new functionality:
  - API route tests for age group operations
  - Component tests for age group admin interface
  - Staff permission enforcement tests
- Follow existing test patterns (Vitest, React Testing Library)

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
# Test age group creation via admin interface
# Verify staff user permissions for age group management
# Test club-based isolation in age group operations
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
git push -u origin feat/iteration1b-age-group-management
gh pr create --title "feat(athlete): implement age group management interface and API" --body "Implements User Story 04 Iteration 1B: Age group CRUD operations and staff administration interface"
```

## **📋 ITERATION 1B IMPLEMENTATION**

**Rule References**: `nextjs-structure-standards.mdc`, `bp-security-standards.mdc`, `bp-testing-standards.mdc`

**Files to Create/Modify**:

- `src/app/api/age-groups/route.ts` (new) - Age group CRUD endpoints with ADMIN/OWNER permission checks
- `src/app/api/age-groups/[id]/route.ts` (new) - Individual age group operations
- `src/app/(admin)/age-groups/page.tsx` (new) - Age group administration interface with role-based access
- `src/components/age-group/AgeGroupForm.tsx` (new) - Age group creation/edit form using ClubContext
- `src/components/age-group/AgeGroupList.tsx` (new) - Age group listing component with club filtering
- `src/lib/permissions.ts` (new) - Staff permission utility functions for age group access

**Implementation Steps**:

1. **Permission System**: Create staff permission utilities that check UserClub.role for ADMIN/OWNER access
2. **API Endpoints**: Create RESTful API routes for age group management with role-based access control
3. **ClubContext Integration**: Build components that use existing `useClub()` hook for club selection and filtering
4. **Admin Interface**: Build age group administration page accessible only to ADMIN/OWNER users

**Testing Strategy**:

- **Unit Tests**: API route tests, permission validation, component rendering
- **Integration Tests**: API endpoint flows, form submissions, club isolation
- **Coverage Goal**: 100% test coverage for new functionality

### **🎯 ITERATION 1B COMPLETION CRITERIA**

- [ ] Age group CRUD API endpoints functional with club isolation
- [ ] Age group administration interface accessible to staff users only
- [ ] Permission system enforces ADMIN/OWNER access correctly
- [ ] ClubContext integration working with existing patterns
- [ ] **New unit tests written** with 100% coverage for API and UI
- [ ] All test levels pass including new comprehensive test suite
- [ ] Docker validation passes with age group management working
- [ ] Club-specific age group isolation working correctly

## 🚀 **ITERATION 2A: ATHLETE MODEL FOUNDATION**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement the Athlete model with database relationships and basic API endpoints. Focus on core data structure without UI complexity.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 1B (Age group management)
**Scope**: Athlete model, migrations, basic API, model validation

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
git checkout main
git pull origin main
git checkout -b feat/iteration2a-athlete-model-foundation
```

### **Step 2: Develop (Initial)**

- Create Athlete Prisma model with relationships to Gender and Club
- Generate database migrations for Athlete table
- Add unique constraints for duplicate prevention
- Focus on core athlete data structure and relationships

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Implement basic athlete creation API endpoint with validation
- Add Athlete types to existing athlete.ts type definitions
- Implement duplicate prevention constraint on (club, first_name, last_name)
- **Write focused unit tests**:
  - Athlete model validation tests
  - Database constraint tests
  - Basic API endpoint tests
  - Relationship validation tests

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
# Test athlete model creation via API
# Verify database constraints work correctly
# Test club and gender relationships
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
git push -u origin feat/iteration2a-athlete-model-foundation
gh pr create --title "feat(athlete): implement Athlete model with relationships and constraints" --body "Implements User Story 04 Iteration 2A: Athlete model foundation with database relationships"
```

## **📋 ITERATION 2A IMPLEMENTATION**

**Rule References**: `db-schema-standards.mdc`, `bp-testing-standards.mdc`

**Files to Create/Modify**:

- `prisma/schema.prisma` (modify) - Add Athlete model with Gender/Club foreign keys and unique constraints
- `src/app/api/athletes/route.ts` (new) - Basic athlete CRUD endpoints with club-based filtering
- `src/types/athlete.ts` (modify) - Add Athlete type definitions
- `src/lib/validations/athlete.ts` (new) - Basic Zod validation schemas for athlete data

**Implementation Steps**:

1. **Database Model**: Create Athlete model with Gender and Club foreign keys, unique constraint on (club, first_name, last_name)
2. **API Foundation**: Build basic athlete CRUD operations with club-based access control
3. **Type Definitions**: Add Athlete types to existing type definitions
4. **Validation**: Implement basic Zod schemas for athlete data validation

**Testing Strategy**:

- **Model Tests**: Athlete creation, validation, relationships, constraints
- **API Tests**: Basic CRUD operations, club isolation, duplicate prevention
- **Coverage Goal**: 100% test coverage for new model and API functionality

### **🎯 ITERATION 2A COMPLETION CRITERIA**

- [ ] Athlete model implemented with proper relationships and constraints
- [ ] Unique constraint on (club, first_name, last_name) working
- [ ] Basic athlete API endpoints functional with club filtering
- [ ] Database migrations run successfully
- [ ] Athlete types added to existing type definitions
- [ ] **New unit tests written** with 100% coverage for model and basic API
- [ ] All test levels pass including new focused test suite
- [ ] Docker validation passes with athlete model working
- [ ] Database constraints prevent duplicate athletes within clubs

## 🚀 **ITERATION 2B: ATHLETE CREATION INTERFACE**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement athlete creation forms and UI components with validation, building on the Athlete model from Iteration 2A.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 2A (Athlete model foundation)
**Scope**: Creation forms, UI components, validation, ClubContext integration

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
git checkout main
git pull origin main
git checkout -b feat/iteration2b-athlete-creation-interface
```

### **Step 2: Develop (Initial)**

- Create basic athlete creation form component
- Implement ClubContext integration for automatic club assignment
- Focus on core form functionality working

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Build athlete creation page with gender selection using existing ClubContext patterns
- Integrate with existing `useClub()` hook for automatic club association
- Add comprehensive error handling and user feedback
- Implement form validation with duplicate prevention messaging
- **Write comprehensive unit tests**:
  - Form component tests with ClubContext integration
  - Validation tests for athlete creation
  - Error handling and user feedback tests
  - Integration tests for form submission

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
# Verify form validation and error handling
# Test duplicate prevention in UI
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
git push -u origin feat/iteration2b-athlete-creation-interface
gh pr create --title "feat(athlete): implement athlete creation interface with validation" --body "Implements User Story 04 Iteration 2B: Athlete creation forms and UI components"
```

## **📋 ITERATION 2B IMPLEMENTATION**

**Rule References**: `ui-tailwind-css-standards.mdc`, `nextjs-structure-standards.mdc`, `bp-testing-standards.mdc`

**Files to Create/Modify**:

- `src/app/(admin)/athletes/new/page.tsx` (new) - Athlete creation page using ClubContext
- `src/components/athlete/AthleteForm.tsx` (new) - Athlete form with `useClub()` integration for automatic club assignment
- `src/components/athlete/AthleteCard.tsx` (new) - Athlete display component with gender and club information
- `src/hooks/useAthletes.ts` (new) - Custom hook for athlete data management with club filtering

**Implementation Steps**:

1. **ClubContext Integration**: Build form components that leverage existing `useClub()` patterns for automatic club filtering
2. **Creation Form**: Design responsive athlete creation form that uses ClubContext for automatic club assignment
3. **Validation UI**: Implement client-side validation with comprehensive error messages
4. **Error Handling**: Add form state management and user feedback following existing patterns

**Testing Strategy**:

- **Component Tests**: Form rendering, validation, submission, ClubContext integration
- **Integration Tests**: End-to-end athlete creation flow
- **Coverage Goal**: 100% test coverage for new UI functionality

### **🎯 ITERATION 2B COMPLETION CRITERIA**

- [ ] Athlete creation form with gender selection implemented
- [ ] ClubContext integration working with existing `useClub()` patterns
- [ ] Comprehensive validation error messages displayed
- [ ] Form data retention on validation errors implemented
- [ ] Duplicate prevention messaging working in UI
- [ ] **New unit tests written** with 100% coverage for form functionality
- [ ] All test levels pass including new comprehensive test suite
- [ ] Docker validation passes with athlete creation working
- [ ] Responsive design working on mobile and tablet devices

## 🚀 **ITERATION 3A: BASIC SEARCH & LISTING**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement basic athlete listing and search functionality with simple pagination. Focus on core search capabilities without advanced features.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 2B (Athlete creation interface)
**Scope**: Basic listing page, simple search, pagination

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
git checkout main
git pull origin main
git checkout -b feat/iteration3a-basic-search-listing
```

### **Step 2: Develop (Initial)**

- Create athlete listing page with basic search functionality
- Implement basic athlete search API endpoint
- Add simple pagination for athlete lists
- Focus on core search and listing functionality

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check
npm run test:run
```

### **Step 4: Develop (Refine)**

- Implement case-insensitive search functionality with club-based result filtering
- Integrate with existing ClubContext using `useClub()` patterns
- Add basic sorting by name and creation date
- **Write focused unit tests**:
  - Search API endpoint tests with club isolation
  - Basic listing component tests
  - Pagination tests with club-filtered data
  - Search functionality tests

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
# Test basic athlete search functionality
# Verify listing page with club filtering
# Test simple pagination
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
git push -u origin feat/iteration3a-basic-search-listing
gh pr create --title "feat(athlete): implement basic search and listing functionality" --body "Implements User Story 04 Iteration 3A: Basic athlete search, listing, and pagination"
```

## **📋 ITERATION 3A IMPLEMENTATION**

**Rule References**: `nextjs-structure-standards.mdc`, `ui-tailwind-css-standards.mdc`

**Files to Create/Modify**:

- `src/app/api/athletes/search/route.ts` (new) - Basic athlete search endpoint with club-based filtering
- `src/app/(admin)/athletes/page.tsx` (new) - Athlete listing page using ClubContext for data filtering
- `src/components/athlete/AthleteList.tsx` (new) - Basic athlete listing component with simple pagination
- `src/components/athlete/AthleteSearch.tsx` (new) - Basic search functionality integrated with ClubContext

**Implementation Steps**:

1. **Search API**: Create basic athlete search endpoint with name-based filtering and club isolation
2. **ClubContext Integration**: Build search functionality using existing `useClub()` hook for club filtering
3. **Listing Page**: Build simple athlete listing with search and pagination
4. **Basic Sorting**: Add simple sorting by name and creation date

**Testing Strategy**:

- **API Tests**: Search endpoint functionality, basic filtering
- **Component Tests**: Search inputs, result display, basic pagination
- **Coverage Goal**: 100% test coverage for basic search functionality

### **🎯 ITERATION 3A COMPLETION CRITERIA**

- [ ] Basic athlete search API endpoint functional with case-insensitive search
- [ ] Athlete listing page with search implemented
- [ ] Club-specific athlete filtering enforced in search operations
- [ ] Search by first name and last name working correctly
- [ ] Basic pagination working with proper navigation
- [ ] **New unit tests written** with 100% coverage for basic search
- [ ] All test levels pass with new search test suite
- [ ] Docker validation confirms basic search functionality works

## 🚀 **ITERATION 3B: ADVANCED SEARCH FEATURES**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement advanced search features including AJAX search components, advanced filtering, and performance optimization.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 3A (Basic search and listing)
**Scope**: AJAX components, advanced filtering, performance optimization

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
git checkout main
git pull origin main
git checkout -b feat/iteration3b-advanced-search-features
```

### **Step 2: Develop (Initial)**

- Create AJAX search component for dynamic athlete selection
- Implement advanced filtering options (gender, age group)
- Focus on core AJAX functionality working

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check
npm run test:run
```

### **Step 4: Develop (Refine)**

- Build advanced filtering and sorting options that respect club boundaries
- Implement search debouncing and performance optimization
- Add database indexing for search performance
- **Write comprehensive unit tests**:
  - AJAX search component tests with ClubContext integration
  - Advanced filtering tests
  - Performance and debouncing tests
  - Search hook tests with state management

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
# Test AJAX search components
# Verify advanced filtering and sorting
# Test search performance and optimization
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
git push -u origin feat/iteration3b-advanced-search-features
gh pr create --title "feat(athlete): implement advanced search features and optimization" --body "Implements User Story 04 Iteration 3B: AJAX search, advanced filtering, and performance optimization"
```

## **📋 ITERATION 3B IMPLEMENTATION**

**Rule References**: `nextjs-performance-standards.mdc`, `typescript-nextjs-standards.mdc`, `bp-testing-standards.mdc`

**Files to Create/Modify**:

- `src/components/athlete/AthleteSearchAjax.tsx` (new) - AJAX search component for form integration
- `src/components/tables/Pagination.tsx` (modify) - Enhanced pagination following existing patterns
- `src/hooks/useAthleteSearch.ts` (new) - Advanced search hook with debouncing and state management
- Database indexes for search performance optimization

**Implementation Steps**:

1. **AJAX Search**: Implement dynamic search component that integrates with existing form patterns
2. **Advanced Filtering**: Add gender and age group filtering options within club scope
3. **Performance Optimization**: Implement search debouncing and database indexing
4. **Search Hooks**: Create custom hooks for advanced search state management

**Testing Strategy**:

- **Component Tests**: AJAX functionality, advanced filtering
- **Hook Tests**: Search state management, debouncing
- **Performance Tests**: Search optimization validation
- **E2E Tests**: Complete advanced search workflow

### **🎯 ITERATION 3B COMPLETION CRITERIA**

- [ ] AJAX search component working for dynamic athlete selection
- [ ] Advanced filtering by gender and age group implemented
- [ ] Search debouncing working for performance optimization
- [ ] Database indexes implemented for search performance
- [ ] **Comprehensive unit tests** for all advanced search functionality
- [ ] All test levels pass with advanced search test suite
- [ ] Docker validation confirms advanced search features work
- [ ] Performance optimized with proper indexing and debouncing

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
2. **Create Branch** → `git checkout -b feat/iterationXX-feature-name` (e.g., iteration1a, iteration2b)
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
