# Discipline Management & Season Organization - Execution Plan

## 📊 **PROGRESS TRACKING DASHBOARD**

### **Overall Status**

- **Current Iteration**: [x] Iteration 1 | [x] Iteration 2 | [ ] Iteration 3 | [ ] Iteration 4 | [ ] Iteration 5 | [ ] Iteration 6
- **Overall Progress**: 33% Complete (2 of 6 iterations completed)
- **Last Session Date**: 2025-01-11
- **Status**: Implementation Phase - Iteration 2 Complete, Ready for Iteration 3

### **Iteration Progress Summary**

| Iteration                        | Feature                                                   | Status                                                | Duration Est. | Dependencies       |
| -------------------------------- | --------------------------------------------------------- | ----------------------------------------------------- | ------------- | ------------------ |
| **Iteration 1**: Data Models     | Season & Discipline Prisma models                         | [ ] Not Started<br/>[ ] In Progress<br/>[x] Completed | 2-3 hours     | None               |
| **Iteration 2**: Season API      | Season CRUD endpoints                                     | [ ] Not Started<br/>[ ] In Progress<br/>[x] Completed | 2-3 hours     | Iteration 1        |
| **Iteration 3**: Discipline API  | Discipline CRUD endpoints                                 | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Iterations 1, 2    |
| **Iteration 4**: Season UI       | Season management interface with shadcn/ui tables         | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Iterations 1, 2    |
| **Iteration 5**: Discipline UI   | Discipline management interface with shadcn/ui tables     | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 4-5 hours     | Iterations 1, 2, 3 |
| **Iteration 6**: Table Migration | Upgrade existing table components to shadcn/ui + TanStack | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 4-6 hours     | Iterations 1-5     |

### **Quick Iteration Status**

**Iteration 1 - Data Models & Schema** ✅ COMPLETED

- [x] Branch & Pull Latest
- [x] Develop (Initial)
- [x] Test (Level 1)
- [x] Develop (Refine)
- [x] Test (Level 2)
- [x] Test Release (Level 3)
- [x] Create PR & Merge (Complete)
- [x] **VERIFIED COMPLETE**: Season & Discipline models, migration, seed data, TypeScript types, validation functions all implemented and tested

**Iteration 2 - Season API Endpoints** ✅ COMPLETED

- [x] Branch & Pull Latest
- [x] Develop (Initial)
- [x] Test (Level 1)
- [x] Develop (Refine)
- [x] Test (Level 2)
- [x] Test Release (Level 3)
- [x] Docker Deployment Validation
- [x] Verify Completion Criteria
- [x] Update Progress Tracking
- [x] **VERIFIED COMPLETE**: Season CRUD API endpoints with Zod validation, comprehensive tests (100% coverage), Docker deployment validated

### **Session Quick Start**

**Ready for Iteration 3: Discipline API Endpoints**

```powershell
# Context Recovery Commands
Get-Location                    # Verify project directory
Test-Path package.json          # Confirm in correct project
git status                      # See current changes
git branch                      # Check current branch
npm run quality:check           # Quick validation

# Ready to start Iteration 3
git checkout main
git pull origin main
git checkout -b feat/iteration3-discipline-api-endpoints
```

## 📋 **PLAN OVERVIEW**

### **Current State Assessment**

- **Project Type**: Next.js 15 with TypeScript, Prisma ORM, PostgreSQL database
- **Foundation Quality**: Strong authentication, club management, age groups, and athletes implemented
- **Enterprise Readiness**: Existing foundation meets enterprise standards with proper testing, Docker deployment

### **Target State**

- **Primary Goals**: Complete season and discipline management system enabling athletics event organization
- **Standards Compliance**:
  - `db-schema-standards.mdc` for Prisma model design
  - `typescript-nextjs-standards.mdc` for component architecture
  - `bp-testing-standards.mdc` for comprehensive testing
  - `nextjs-structure-standards.mdc` for proper file organization
- **Success Metrics**:
  - Season CRUD operations with proper validation
  - Discipline management with season relationships and business rules
  - Season-based discipline organization throughout UI
  - Complete BDD scenario coverage
  - Zero breaking changes to existing functionality

### **Implementation Strategy**

- **Approach**: Atomic iterations with continuous testing following established patterns
- **Workflow**: Branch → Develop → Test → Develop → Test → Release → PR
- **Session Support**: Plan designed for multi-session execution with clear context recovery
- **Testing Integration**: Leverages npm scripts and follows existing test patterns (Vitest, React Testing Library)

## 🔍 **CURRENT STATE ANALYSIS**

### ✅ **EXISTING STRENGTHS**

- **Established Data Models**: User, Club, Gender, AgeGroup, Athlete models with proper relationships
- **Component Patterns**: Table, Button, Modal components with consistent styling and dark mode support
- **Testing Infrastructure**: Vitest and React Testing Library setup with comprehensive test utilities
- **API Patterns**: Consistent Next.js API route patterns in `/api/age-groups/`, `/api/athletes/`, etc.
- **Authentication System**: NextAuth.js with club-based permissions and role management
- **UI Design System**: Established component library with responsive design and accessibility
- **Database Infrastructure**: PostgreSQL with Prisma ORM and proper migrations
- **Docker Deployment**: Container setup with multi-stage builds and deployment optimization

### ❌ **CRITICAL GAPS IDENTIFIED**

**Data Layer (db-schema-standards.mdc)**

- Season model missing - required for discipline organization
- Discipline model missing - core entity for athletics events
- No season-discipline relationships in database schema
- Missing business rule validation at database level

**API Layer (typescript-nextjs-standards.mdc)**

- No `/api/seasons/` endpoints for season management
- No `/api/disciplines/` endpoints for discipline CRUD operations
- Missing validation logic for timed vs measured discipline types
- No season-based filtering endpoints for disciplines

**UI Layer (nextjs-structure-standards.mdc, ui-tailwind-css-standards.mdc)**

- No season management interface components
- No discipline management interface components
- Missing season-based navigation and filtering
- No discipline type validation in forms

**Testing Coverage (bp-testing-standards.mdc)**

- No unit tests for Season/Discipline models
- No API endpoint tests for seasons/disciplines
- No component tests for discipline management UI
- Missing E2E tests for complete discipline workflow

## 🔍 **PATTERN DISCOVERY & CONSISTENCY ANALYSIS**

### **⚠️ MANDATORY PRE-IMPLEMENTATION ANALYSIS**

**Rule**: NO development may begin until this analysis is completed and documented with evidence.

### **🔎 DISCOVER SIMILAR EXISTING FEATURES**

Based on codebase analysis, the **Age Group Management** feature serves as the primary reference implementation:

```powershell
# Similar feature implementation found
Get-ChildItem -Path "src/components/age-group" -Recurse | Select-Object Name,Directory
# Result: AgeGroupList.tsx, AgeGroupModal.tsx, index.ts

# Existing API pattern
Get-ChildItem -Path "src/app/api/age-groups" -Recurse | Select-Object Name,Directory
# Result: route.ts, [id]/route.ts, __tests__/

# Table component usage pattern
Select-String -Path "src/components/age-group/AgeGroupList.tsx" -Pattern "Table" | Select-Object LineNumber,Line
# Evidence: Uses @/components/ui/table with TableHeader, TableBody, TableCell, TableRow
```

### **📋 PATTERN ANALYSIS CHECKLIST**

**Similar Feature Identification:**

- [x] **Feature Identified**: Age Group Management
  - Location: `src/components/age-group/`, `src/app/api/age-groups/`
  - Implementation approach: List + Modal pattern with CRUD operations
  - Component architecture used: Table component with edit/delete actions, Modal for create/edit

**UI/UX Pattern Analysis:**

- [x] **Modal vs Page Navigation**: Age Groups use **Modal pattern** for create/edit operations
  - Evidence: `AgeGroupModal.tsx` component with modal-based workflow
- [x] **Button Styles**: Uses `@/components/ui/button/Button` with outline variant for actions
  - Evidence: Edit and Delete buttons with `variant="outline"` and appropriate icons
- [x] **Form Patterns**: Modal-based forms with proper validation and loading states
  - Evidence: AgeGroupModal handles form state, validation, and submission
- [x] **Table/List Display**: Uses `@/components/ui/table` components for data display
  - Evidence: AgeGroupList.tsx uses Table, TableHeader, TableBody, TableCell, TableRow
- [x] **Search Functionality**: No search in age groups (simple list), but athletes have search patterns
  - Evidence: AthleteCombobox.tsx shows search/filter patterns for reference

**Component Reuse Analysis:**

- [x] **Existing Components**: Must use established component library with modern table upgrades
  - Component: Table | Location: `@/components/ui/table` → **New**: shadcn/ui + TanStack Table for discipline management
  - Component: Button | Location: `@/components/ui/button/Button`
  - Component: Modal | Location: `@/components/ui/modal`
- [x] **Styling Systems**: Tailwind CSS with dark mode support and consistent theming
  - Evidence: Classes like `dark:border-white/[0.05]`, `dark:bg-white/[0.03]`
- [x] **Layout Containers**: Uses ComponentCard and standard layout patterns
  - Evidence: Wrapped in card containers with proper padding and spacing

**Testing Pattern Analysis:**

- [x] **Test File Structure**: Tests in `__tests__/` directories alongside source files
  - Pattern: `src/components/age-group/__tests__/`, `src/app/api/age-groups/__tests__/`
- [x] **Mocking Patterns**: Vitest mocking with React Testing Library for component tests
  - Evidence: Existing test files use `vi.mock()` and `@testing-library/react`
- [x] **Test Utilities**: Shared test utilities in `src/test/` directory
  - Location: `src/test/setup.tsx`, `src/test/test-utils.tsx`

### **🎯 IMPLEMENTATION CONSTRAINTS DERIVED**

Based on pattern analysis, document MANDATORY implementation constraints:

**Architecture Constraints:**

- [x] **Component Structure**: Must follow Modal + List pattern as seen in Age Group Management
- [x] **Navigation Pattern**: Must use Modal approach for create/edit operations like Age Groups
- [x] **State Management**: Must use React state with refresh callbacks like AgeGroupList pattern

**UI/UX Constraints:**

- [x] **Component Usage**: MUST use Button, Modal components + NEW shadcn/ui + TanStack Table for advanced features
- [x] **Styling Approach**: MUST follow Tailwind patterns with dark mode support
- [x] **Layout Structure**: MUST use ComponentCard wrapper and consistent spacing
- [x] **Table Implementation**: MUST use gradual migration approach - shadcn/ui for new features, legacy table for existing components

**Testing Constraints:**

- [x] **Test Structure**: MUST follow `__tests__/` pattern from Age Group implementation
- [x] **Mock Patterns**: MUST use Vitest mocking approach consistent with existing tests
- [x] **Test Organization**: MUST place tests alongside source files in `__tests__` directories

### **✅ PATTERN COMPLIANCE VERIFICATION**

**PRE-DEVELOPMENT SIGN-OFF** (Required before ANY iteration begins):

- [x] **Similar feature analyzed** with Age Group Management as reference implementation
- [x] **UI/UX patterns identified** with Modal + Table pattern and component constraints documented
- [x] **Component reuse opportunities** mapped with existing Button, Modal components + NEW shadcn/ui tables
- [x] **Testing patterns analyzed** with `__tests__/` structure and Vitest approach defined
- [x] **Implementation constraints** clearly defined with evidence from Age Group feature
- [x] **Development approach** designed to integrate seamlessly with existing patterns

**⚠️ CRITICAL TABLE COMPONENT CHANGE**:

- **FIRST**: Verify pattern compliance - following established UI patterns with season integration
- **NOTE**: Table components will use NEW shadcn/ui + TanStack Table (different API than existing table components)
- **APPROACH**: Gradual migration - new features use modern tables, existing features remain unchanged until Iteration 6

**✅ APPROVED**: Development may proceed to iterations with clear pattern compliance strategy.

# 🚀 **ITERATION 1: SEASON & DISCIPLINE DATA MODELS**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement Season and Discipline Prisma models with proper relationships, business rules, and database constraints to provide the foundation for athletics event organization.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: None
**Scope**: Database schema extension with models, relationships, and migrations

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration1-season-discipline-models
```

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - extending Prisma schema following existing model patterns
- **Pattern Compliance Check**: Confirm model structure matches existing patterns (Club, AgeGroup, Athlete)
- **Architecture Verification**: Ensure models follow established Prisma conventions and relationships
- Implement Season model with unique name constraint
- Implement Discipline model with Season relationship and business rule validation
- Create Prisma migration for new models
- **DO NOT write tests yet** - focus on schema implementation first
- **DO NOT create API endpoints** - pure data model focus

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
npx prisma validate    # Validate Prisma schema
npx prisma generate    # Generate Prisma client
```

### **Step 4: Develop (Refine)**

- Fix any Prisma validation issues from Level 1 testing
- Add proper indexes for query optimization
- **Write comprehensive unit tests** for business rule validation logic and model constraints
- Add season data to `prisma/seed-data.yaml` (Track & Field, Indoors, Cross Country)
- Update `prisma/seed.js` to read season data from YAML file
- Test Prisma client generation and TypeScript types

**Testing Focus**: Test business logic, validation functions, and constraint enforcement - NOT Prisma ORM functionality

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage (including new tests)
npm run build          # Verify compilation with new Prisma types
npx prisma db push     # Apply schema changes to development database
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
npx prisma migrate dev          # Create and apply migration
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate database schema
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate schema in containerized environment
docker-compose exec web npx prisma db status
docker-compose exec web npx prisma db seed  # Test seed data

# Clean up Docker environment
docker-compose down
```

### **Step 6.8: Verify Completion Criteria (MANDATORY BEFORE PR)**

**🎯 SYSTEMATIC COMPLETION VERIFICATION**

Before creating any PR, ALL criteria must be explicitly verified with evidence:

```powershell
# Final test validation
npm run test:all                # All tests passing
npm run build                   # Clean build confirmation
npm run quality:check          # No linting/formatting issues
npx prisma validate            # Schema validation passes
npx prisma generate            # Client generation successful
```

**⚠️ CRITICAL: MANDATORY COMPLETION CRITERIA CHECK**

**STEP 1: Review the "🎯 ITERATION 1 COMPLETION CRITERIA" section at the bottom of this iteration.**

**STEP 2: Verify EVERY item in that section with evidence before proceeding.**

**ITERATION COMPLETION CRITERIA VERIFICATION:**

⚠️ **Go to the "🎯 ITERATION 1 COMPLETION CRITERIA" section below and check off EVERY item before proceeding.**

- [ ] **I have reviewed and verified ALL items in the "🎯 ITERATION 1 COMPLETION CRITERIA" section**
- [ ] **Every checkbox in that section is completed**
- [ ] **The iteration is ready for progress tracking and PR creation**

**REGRESSION & QUALITY VERIFICATION:**

- [ ] **No breaking changes** to existing functionality
  - Evidence: Existing test suite: **_/_** passing (same as baseline)
- [ ] **No performance degradation** in existing features
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***
- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***
- [ ] **TypeScript compilation clean** with no type errors from new models
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** in the iteration-specific section below
- [ ] **All regression and quality checks passed**
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS ALL CHECKBOXES ABOVE ARE COMPLETED**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark Iteration 1 as completed in progress dashboard
# Update overall progress to 20% (1 of 5 iterations)
# Set Iteration 2 as ready to begin
git add .cursor/instructions/003_plans/05_discipline_management_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 1 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(data): add Season and Discipline models"
git push -u origin feat/iteration1-season-discipline-models
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Season & Discipline Data Models

**Type:** Feature
**Scope:** Database Schema

### Changes

- Add Season model with unique name constraint
- Add Discipline model with season relationship and business rules
- Create database migration for new tables
- Add seasons section to seed-data.yaml (Track & Field, Indoors, Cross Country)
- Update seed script to read season data from YAML configuration
- Generate TypeScript types for new models

### Testing

- Business rule validation tests added
- Prisma schema validation passes
- All existing tests continue to pass

### Dependencies

- None - foundation iteration
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration1-season-discipline-models
```

## **📋 ITERATION 1 IMPLEMENTATION**

**Rule Reference**: `db-schema-standards.mdc`

**Files to Create/Modify**:

- `prisma/schema.prisma` (modify - add Season and Discipline models)
- `prisma/migrations/` (new - migration files)
- `prisma/seed-data.yaml` (modify - add seasons section)
- `prisma/seed.js` (modify - read season data from YAML)

**Implementation Steps**:

1. Add Season model to Prisma schema with unique name constraint and proper indexes
2. Add Discipline model with Season FK, business rule fields, and unique constraints
3. Add seasons section to `prisma/seed-data.yaml` with standard athletics seasons
4. Update `prisma/seed.js` to read and create seasons from YAML configuration
5. Generate and apply Prisma migration for new models
6. Generate Prisma client and verify TypeScript type generation

**Testing Strategy**:

- **Step 4 Focus**: Write tests for business rule validation functions and constraint logic (NOT Prisma ORM functionality)
- **Test Patterns**: Follow existing project test structure (Vitest for validation functions)
- **Coverage Goal**: Achieve 100% coverage for business logic and validation functions
- **Test Files**: Place tests in appropriate business logic directories, not schema testing
- **Testing Scope**: Focus on custom validation functions, business rules, and constraint helpers - avoid testing Prisma's built-in functionality

**Regression Protection**:

- [ ] Existing models remain intact and functional
- [ ] No breaking changes to existing database queries
- [ ] All existing tests continue to pass
- [ ] New models have comprehensive validation coverage

**Commit Strategy**:

- Progressive commits during development
- Final commit: `feat(data): add Season and Discipline models`

### **🎯 ITERATION 1 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run, prisma validate, prisma generate)
- [ ] **New model tests written** with 100% coverage for validation logic
- [ ] Level 2 tests pass (test:coverage, build, db push) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker, migrate dev)
- [ ] Docker deployment validation passes (schema applies, seed works)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Prisma client generation successful** with proper TypeScript types
- [ ] Season model properly implements unique constraints and business rules
- [ ] Discipline model properly implements season relationship and validation
- [ ] Database migration created and successfully applied
- [ ] Seasons section in seed-data.yaml properly configured
- [ ] Seed script reads and creates seasons from YAML correctly
- [ ] Execution plan progress dashboard updated with iteration completion

# 🚀 **ITERATION 2: SEASON API ENDPOINTS**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement complete Season CRUD API endpoints following established Next.js API patterns to enable season management functionality.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 1 (Season model must be implemented)
**Scope**: Season API endpoints with full CRUD operations, validation, and error handling

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration2-season-api-endpoints
```

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - following existing API patterns from `/api/age-groups/`
- **Pattern Compliance Check**: Confirm API structure matches existing `/api/age-groups/` patterns
- **Architecture Verification**: Ensure endpoints follow established Next.js API route conventions
- Implement Season CRUD endpoints (GET, POST for list, GET, PUT, DELETE for individual)
- Add proper request/response validation using Zod schemas
- Implement error handling following existing patterns
- **DO NOT write tests yet** - focus on API implementation first
- **DO NOT create UI components** - pure API focus

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
npm run build          # Verify API routes compile correctly
```

### **Step 4: Develop (Refine)**

- Fix any TypeScript or linting issues from Level 1 testing
- Add comprehensive error handling and status codes
- **Write comprehensive unit tests** for all API endpoints
- Add request/response validation tests
- Test database integration and error scenarios

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage (including new tests)
npm run build          # Verify compilation with new API routes
npm run dev &          # Start development server for API testing
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate API endpoints
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Test API endpoints in containerized environment
Invoke-RestMethod -Uri "http://localhost:3000/api/seasons" -Method GET
Invoke-RestMethod -Uri "http://localhost:3000/api/seasons" -Method POST -ContentType "application/json" -Body '{"name":"Test Season"}'

# Clean up Docker environment
docker-compose down
```

### **Step 6.8: Verify Completion Criteria (MANDATORY BEFORE PR)**

**🎯 SYSTEMATIC COMPLETION VERIFICATION**

Before creating any PR, ALL criteria must be explicitly verified with evidence:

```powershell
# Final test validation
npm run test:all                # All tests passing
npm run build                   # Clean build confirmation
npm run quality:check          # No linting/formatting issues
```

**⚠️ CRITICAL: MANDATORY COMPLETION CRITERIA CHECK**

**STEP 1: Review the "🎯 ITERATION 2 COMPLETION CRITERIA" section at the bottom of this iteration.**

**STEP 2: Verify EVERY item in that section with evidence before proceeding.**

**ITERATION COMPLETION CRITERIA VERIFICATION:**

⚠️ **Go to the "🎯 ITERATION 2 COMPLETION CRITERIA" section below and check off EVERY item before proceeding.**

- [ ] **I have reviewed and verified ALL items in the "🎯 ITERATION 2 COMPLETION CRITERIA" section**
- [ ] **Every checkbox in that section is completed**
- [ ] **The iteration is ready for progress tracking and PR creation**

**REGRESSION & QUALITY VERIFICATION:**

- [ ] **No breaking changes** to existing functionality
  - Evidence: Existing test suite: **_/_** passing (same as baseline)
- [ ] **No performance degradation** in existing features
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***
- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** and evidence provided above
- [ ] **ITERATION-SPECIFIC CRITERIA SECTION** has been reviewed and all items verified
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **No outstanding issues** or incomplete features
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS:**

1. **The "🎯 ITERATION 2 COMPLETION CRITERIA" section has been fully verified**
2. **ALL items above are checked with evidence**
3. **Every checkbox in both sections is completed**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark Iteration 2 as completed in progress dashboard
# Update overall progress to 40% (2 of 5 iterations)
# Set Iteration 3 as ready to begin
git add .cursor/instructions/003_plans/05_discipline_management_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 2 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(api): add Season CRUD endpoints"
git push -u origin feat/iteration2-season-api-endpoints
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Season API Endpoints

**Type:** Feature
**Scope:** API Layer

### Changes

- Add Season CRUD endpoints (GET, POST, PUT, DELETE)
- Implement Zod validation for request/response schemas
- Add comprehensive error handling with proper HTTP status codes
- Follow established Next.js API route patterns

### Testing

- API endpoint tests with 100% coverage
- Request/response validation tests
- Error scenario testing
- All existing tests continue to pass

### Dependencies

- Requires: Season models from Iteration 1
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration2-season-api-endpoints
```

## **📋 ITERATION 2 IMPLEMENTATION**

**Rule Reference**: `typescript-nextjs-standards.mdc`

**Files to Create/Modify**:

- `src/app/api/seasons/route.ts` (new - list and create operations)
- `src/app/api/seasons/[id]/route.ts` (new - individual season operations)
- `src/app/api/seasons/__tests__/` (new - API endpoint tests)
- `src/types/season.ts` (new - Season TypeScript types)

**Implementation Steps**:

1. Create `/api/seasons/route.ts` with GET (list) and POST (create) handlers
2. Create `/api/seasons/[id]/route.ts` with GET, PUT, DELETE handlers
3. Add Zod validation schemas for request/response validation
4. Implement proper error handling and HTTP status codes
5. Add comprehensive unit tests for all endpoints

**Testing Strategy**:

- **Step 4 Focus**: Write comprehensive API tests after initial implementation
- **Test Patterns**: Follow existing API test structure from `/api/age-groups/__tests__/`
- **Coverage Goal**: Achieve 100% coverage for all API endpoints
- **Test Files**: Place tests in `src/app/api/seasons/__tests__/`
- **Mocking**: Mock Prisma client for database operations

### **🎯 ITERATION 2 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run, build)
- [ ] **New API tests written** with 100% coverage for all endpoints
- [ ] Level 2 tests pass (test:coverage, build, dev server starts)
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (API endpoints accessible)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **API routes follow established patterns** consistent with existing endpoints
- [ ] Season CRUD operations fully functional with proper validation
- [ ] Error handling comprehensive with appropriate HTTP status codes
- [ ] Request/response schemas properly validated with Zod
- [ ] Execution plan progress dashboard updated with iteration completion

# 🚀 **ITERATION 3: DISCIPLINE API ENDPOINTS**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement complete Discipline CRUD API endpoints with season relationships, business rule validation, and search functionality to support athletics event management.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: Iterations 1 (Discipline model), 2 (Season API)
**Scope**: Discipline API endpoints with season filtering, type validation, and team size handling

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - following Season API patterns from Iteration 2
- **Pattern Compliance Check**: Confirm API structure matches Season endpoints and existing patterns
- **Architecture Verification**: Ensure endpoints follow established Next.js API route conventions
- Implement Discipline CRUD endpoints with season relationship handling
- Add season-based filtering (GET /api/disciplines?season=id)
- Implement business rule validation (timed vs measured, team size)
- **DO NOT write tests yet** - focus on API implementation first
- **DO NOT create UI components** - pure API focus

### **Step 4: Develop (Refine)**

- Fix any TypeScript or business rule validation issues
- Add comprehensive error handling for business rule violations
- **Write comprehensive unit tests** for all API endpoints and business rules
- Add season relationship validation tests
- Test business rule enforcement (timed/measured exclusivity)

## **📋 ITERATION 3 IMPLEMENTATION**

**Rule Reference**: `typescript-nextjs-standards.mdc`, `db-schema-standards.mdc`

**Files to Create/Modify**:

- `src/app/api/disciplines/route.ts` (new - list, create, and search operations)
- `src/app/api/disciplines/[id]/route.ts` (new - individual discipline operations)
- `src/app/api/disciplines/__tests__/` (new - API endpoint tests)
- `src/app/api/disciplines/search/route.ts` (new - discipline search endpoint)
- `src/types/discipline.ts` (new - Discipline TypeScript types)

**Implementation Steps**:

1. Create `/api/disciplines/route.ts` with GET (list with season filtering) and POST (create) handlers
2. Create `/api/disciplines/[id]/route.ts` with GET, PUT, DELETE handlers
3. Add business rule validation for timed vs measured discipline types
4. Implement season relationship validation and filtering
5. Add team size validation for relay/team events
6. Create search endpoint for discipline name filtering
7. Add comprehensive unit tests for all endpoints and business rules

### **Step 6.8: Verify Completion Criteria (MANDATORY BEFORE PR)**

**🎯 SYSTEMATIC COMPLETION VERIFICATION**

Before creating any PR, ALL criteria must be explicitly verified with evidence:

```powershell
# Final test validation
npm run test:all                # All tests passing
npm run build                   # Clean build confirmation
npm run quality:check          # No linting/formatting issues
```

**⚠️ CRITICAL: MANDATORY COMPLETION CRITERIA CHECK**

**STEP 1: Review the "🎯 ITERATION 3 COMPLETION CRITERIA" section at the bottom of this iteration.**

**STEP 2: Verify EVERY item in that section with evidence before proceeding.**

**ITERATION COMPLETION CRITERIA VERIFICATION:**

⚠️ **Go to the "🎯 ITERATION 3 COMPLETION CRITERIA" section below and check off EVERY item before proceeding.**

- [ ] **I have reviewed and verified ALL items in the "🎯 ITERATION 3 COMPLETION CRITERIA" section**
- [ ] **Every checkbox in that section is completed**
- [ ] **The iteration is ready for progress tracking and PR creation**

**REGRESSION & QUALITY VERIFICATION:**

- [ ] **No breaking changes** to existing functionality
  - Evidence: Existing test suite: **_/_** passing (same as baseline)
- [ ] **No performance degradation** in existing features
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***
- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** and evidence provided above
- [ ] **ITERATION-SPECIFIC CRITERIA SECTION** has been reviewed and all items verified
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **No outstanding issues** or incomplete features
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS:**

1. **The "🎯 ITERATION 3 COMPLETION CRITERIA" section has been fully verified**
2. **ALL items above are checked with evidence**
3. **Every checkbox in both sections is completed**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark Iteration 3 as completed in progress dashboard
# Update overall progress to 60% (3 of 5 iterations)
# Set Iteration 4 as ready to begin
git add .cursor/instructions/003_plans/05_discipline_management_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 3 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(api): add Discipline CRUD endpoints with business rules"
git push -u origin feat/iteration3-discipline-api-endpoints
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Discipline API Endpoints

**Type:** Feature
**Scope:** API Layer

### Changes

- Add Discipline CRUD endpoints with season relationships
- Implement business rule validation (timed vs measured exclusivity)
- Add team size validation for relay events
- Implement season-based filtering (GET /api/disciplines?season=id)
- Add discipline search functionality
- Comprehensive error handling for business rule violations

### Testing

- API endpoint tests with business rule validation
- Season relationship validation tests
- Team size and type validation tests
- All existing tests continue to pass

### Dependencies

- Requires: Season models (Iteration 1), Season API (Iteration 2)
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration3-discipline-api-endpoints
```

### **🎯 ITERATION 3 COMPLETION CRITERIA**

- [ ] Discipline CRUD operations fully functional with season relationships
- [ ] Business rule validation enforced (timed vs measured exclusivity)
- [ ] Team size validation working for relay events
- [ ] Season-based filtering operational (GET /api/disciplines?season=id)
- [ ] Search functionality implemented for discipline names
- [ ] All API endpoints have comprehensive test coverage
- [ ] Error handling covers all business rule violations

# 🚀 **ITERATION 4: SEASON MANAGEMENT UI**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement Season management user interface following established age group patterns to provide season administration functionality.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iterations 1 (Season model), 2 (Season API)
**Scope**: Season list, create, edit, delete UI components with modal-based workflow

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - following established UI patterns with season integration
- **NOTE**: Table components will use NEW shadcn/ui + TanStack Table (different API than existing table components)
- **Pattern Compliance Check**: Confirm component structure matches Modal + List pattern with modern table implementation
- **Architecture Verification**: Ensure components use established Button, Modal components + NEW shadcn/ui tables
- **Install shadcn/ui table components** for advanced table functionality
- Implement SeasonList component with shadcn/ui + TanStack Table (with sorting, filtering)
- Implement SeasonModal component following AgeGroupModal pattern
- Create season management page following established page structure
- **DO NOT write tests yet** - focus on UI implementation first
- **DO NOT modify API endpoints** - pure UI focus

### **Step 4: Develop (Refine)**

- Fix any styling or component integration issues
- Ensure dark mode compatibility and responsive design
- **Write comprehensive component tests** following existing patterns
- Add user interaction tests for CRUD operations
- Test modal workflows and form validation
- **Write Playwright E2E tests** following `@playwright-testing-standards.mdc` one test at a time

## **📋 ITERATION 4 IMPLEMENTATION**

**Rule Reference**: `nextjs-structure-standards.mdc`, `ui-tailwind-css-standards.mdc`

**Files to Create/Modify**:

- `src/components/season/SeasonList.tsx` (new - season list component)
- `src/components/season/SeasonModal.tsx` (new - season create/edit modal)
- `src/components/season/index.ts` (new - component exports)
- `src/components/season/__tests__/` (new - component tests)
- `src/app/(admin)/seasons/page.tsx` (new - season management page)

**Implementation Steps**:

1. **Install shadcn/ui table components**: `npx shadcn-ui@latest add table` and `npm install @tanstack/react-table`
2. Create SeasonList component using NEW shadcn/ui + TanStack Table with sorting and filtering capabilities
3. Create SeasonModal component for create/edit operations following AgeGroupModal patterns
4. Implement season management page with proper authentication and layout
5. Add component tests following existing test patterns (testing business logic, not TanStack functionality)
6. **Create Playwright E2E tests** following `@playwright-testing-standards.mdc` incremental development approach
7. Ensure proper styling and dark mode support with shadcn/ui components

### **Playwright E2E Testing (Following @playwright-testing-standards.mdc)**

**CRITICAL**: Follow "One Test at a Time" development process to avoid past Playwright delays

#### **Page Object Models**

Create dedicated page objects for season management workflow:

```typescript
// tests/pages/SeasonPage.ts
import { Page, expect } from '@playwright/test';

export class SeasonPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/seasons');
    await expect(this.page).toHaveURL(/seasons/);
  }

  async createSeason(name: string, description: string) {
    // Use semantic locators - NO CSS selectors
    await this.page.getByRole('button', { name: 'Add Season' }).click();
    await this.page.getByLabel('Season Name').fill(name);
    await this.page.getByLabel('Description').fill(description);
    await this.page.getByRole('button', { name: 'Create Season' }).click();

    // Proper waiting - NO arbitrary timeouts
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async editSeason(oldName: string, newName: string) {
    await this.page
      .getByRole('row', { name: oldName })
      .getByRole('button', { name: 'Edit' })
      .click();
    await this.page.getByLabel('Season Name').clear();
    await this.page.getByLabel('Season Name').fill(newName);
    await this.page.getByRole('button', { name: 'Update Season' }).click();

    await expect(this.page.getByText(newName)).toBeVisible();
  }

  async deleteSeason(seasonName: string) {
    await this.page
      .getByRole('row', { name: seasonName })
      .getByRole('button', { name: 'Delete' })
      .click();
    await this.page.getByRole('button', { name: 'Confirm Delete' }).click();

    await expect(this.page.getByText(seasonName)).not.toBeVisible();
  }
}
```

#### **Test Implementation (Incremental Approach)**

**Step 1**: Write ONE test skeleton

```typescript
// tests/specs/season-management.spec.ts
import { test, expect } from '@playwright/test';
import { AppWorkflow } from '../pages/AppWorkflow';
import { SeasonPage } from '../pages/SeasonPage';

test('user can manage seasons', async ({ page }) => {
  // TODO: Will implement step by step
});
```

**Step 2**: Add navigation and verify, then debug

```powershell
npx playwright test --grep "user can manage seasons" --debug
```

**Step 3**: Add ONE more action, then debug again

```typescript
test('user can manage seasons', async ({ page }) => {
  const app = new AppWorkflow(page);
  const seasonPage = new SeasonPage(page);

  await app.signInWithClub('admin@example.com', 'password123', 'Test Club');
  await seasonPage.goto();

  // STOP HERE - debug this step before adding more
});
```

**Step 4**: Continue incrementally, debugging each addition

```powershell
# Debug each step individually - NEVER skip this
npx playwright test --grep "user can manage seasons" --debug
```

#### **Required E2E Test Coverage**

- [ ] **Season list display** with shadcn/ui table sorting and filtering
- [ ] **Create season modal** workflow with form validation
- [ ] **Edit season modal** workflow with form updates
- [ ] **Delete season** workflow with confirmation dialog
- [ ] **Season table sorting** by name and creation date
- [ ] **Season table filtering** and search functionality

#### **Debugging Commands (Windows PowerShell)**

```powershell
# Start with one test in debug mode
npx playwright test --grep "specific test name" --debug

# Use UI mode for visual development
npx playwright test --ui

# Generate selectors with Codegen
npx playwright codegen localhost:3000/seasons
```

#### **Smart Waiting - NO Arbitrary Timeouts**

```typescript
// ✅ Proper waiting for shadcn/ui table updates
await expect(page.getByText('Loading...')).not.toBeVisible();
await expect(page.getByRole('button', { name: 'Create Season' })).toBeEnabled();

// ✅ Wait for API responses
await page.waitForResponse(
  response =>
    response.url().includes('/api/seasons') && response.status() === 200
);
```

### **Step 6.8: Verify Completion Criteria (MANDATORY BEFORE PR)**

**🎯 SYSTEMATIC COMPLETION VERIFICATION**

Before creating any PR, ALL criteria must be explicitly verified with evidence:

```powershell
# Final test validation
npm run test:all                # All tests passing
npm run build                   # Clean build confirmation
npm run quality:check          # No linting/formatting issues
```

**⚠️ CRITICAL: MANDATORY COMPLETION CRITERIA CHECK**

**STEP 1: Review the "🎯 ITERATION 4 COMPLETION CRITERIA" section at the bottom of this iteration.**

**STEP 2: Verify EVERY item in that section with evidence before proceeding.**

**ITERATION COMPLETION CRITERIA VERIFICATION:**

⚠️ **Go to the "🎯 ITERATION 4 COMPLETION CRITERIA" section below and check off EVERY item before proceeding.**

- [ ] **I have reviewed and verified ALL items in the "🎯 ITERATION 4 COMPLETION CRITERIA" section**
- [ ] **Every checkbox in that section is completed**
- [ ] **The iteration is ready for progress tracking and PR creation**

**REGRESSION & QUALITY VERIFICATION:**

- [ ] **No breaking changes** to existing functionality
  - Evidence: Existing test suite: **_/_** passing (same as baseline)
- [ ] **No performance degradation** in existing features
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***
- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** and evidence provided above
- [ ] **ITERATION-SPECIFIC CRITERIA SECTION** has been reviewed and all items verified
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **No outstanding issues** or incomplete features
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS:**

1. **The "🎯 ITERATION 4 COMPLETION CRITERIA" section has been fully verified**
2. **ALL items above are checked with evidence**
3. **Every checkbox in both sections is completed**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark Iteration 4 as completed in progress dashboard
# Update overall progress to 80% (4 of 5 iterations)
# Set Iteration 5 as ready to begin
git add .cursor/instructions/003_plans/05_discipline_management_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 4 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(ui): add Season management interface"
git push -u origin feat/iteration4-season-ui
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Season Management UI

**Type:** Feature
**Scope:** User Interface

### Changes

- Add SeasonList component with Table implementation
- Add SeasonModal component for create/edit operations
- Implement season management page with proper authentication
- Follow established UI patterns from Age Group management
- Add responsive design and dark mode support

### Testing

- Component tests following existing patterns
- User interaction tests for CRUD operations
- Modal workflow testing
- All existing tests continue to pass

### Dependencies

- Requires: Season models (Iteration 1), Season API (Iteration 2)
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration4-season-ui
```

### **🎯 ITERATION 4 COMPLETION CRITERIA**

- [ ] shadcn/ui table and @tanstack/react-table packages installed successfully
- [ ] SeasonList component functional with shadcn/ui + TanStack Table (sorting, filtering)
- [ ] SeasonModal component working for create/edit operations
- [ ] Season management page accessible to authorized users
- [ ] Component tests comprehensive with proper coverage (business logic focus)
- [ ] **Playwright E2E tests implemented** following @playwright-testing-standards.mdc one test at a time
- [ ] **SeasonPage object model created** with semantic locators (getByRole, getByLabel)
- [ ] **E2E test coverage complete** for CRUD operations and table functionality
- [ ] UI follows established design patterns with modern table styling
- [ ] Dark mode support and responsive design working with shadcn/ui components
- [ ] Modal workflows properly implemented with validation

# 🚀 **ITERATION 5: DISCIPLINE MANAGEMENT UI**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement comprehensive Discipline management user interface with season-based organization, business rule validation, and team size handling.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: Iterations 1-4 (all previous iterations)
**Scope**: Complete discipline management interface with season filtering, type validation, and search functionality

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - following established UI patterns with season integration
- **NOTE**: Table components will use NEW shadcn/ui + TanStack Table (different API than existing table components)
- **Pattern Compliance Check**: Confirm component structure matches established patterns with season relationships
- **Architecture Verification**: Ensure components properly integrate season filtering and business rules using shadcn/ui tables
- Implement DisciplineList component with season-based organization using shadcn/ui + TanStack Table (advanced sorting, filtering, search)
- Implement DisciplineModal component with business rule validation
- Add season filtering and search functionality leveraging TanStack Table capabilities
- **DO NOT write tests yet** - focus on UI implementation first
- **DO NOT modify API endpoints** - pure UI focus with existing APIs

### **Step 4: Develop (Refine)**

- Fix any business rule validation issues in UI
- Ensure proper season filtering and search functionality
- **Write comprehensive component tests** including business rule validation
- Add user interaction tests for season filtering and search
- Test team size validation and timed vs measured validation
- **Write Playwright E2E tests** following `@playwright-testing-standards.mdc` one test at a time

## **📋 ITERATION 5 IMPLEMENTATION**

**Rule Reference**: `nextjs-structure-standards.mdc`, `ui-tailwind-css-standards.mdc`, `bp-testing-standards.mdc`

**Files to Create/Modify**:

- `src/components/discipline/DisciplineList.tsx` (new - discipline list with season organization)
- `src/components/discipline/DisciplineModal.tsx` (new - discipline create/edit modal)
- `src/components/discipline/DisciplineSearch.tsx` (new - search and filter component)
- `src/components/discipline/index.ts` (new - component exports)
- `src/components/discipline/__tests__/` (new - comprehensive component tests)
- `src/app/(admin)/disciplines/page.tsx` (new - discipline management page)

**Implementation Steps**:

1. Create DisciplineList component with season-based grouping and filtering using shadcn/ui + TanStack Table
2. Create DisciplineModal component with business rule validation forms
3. Implement search functionality for discipline names and season filtering
4. Add discipline management page with proper authentication and navigation
5. Create comprehensive component tests covering all business rules
6. **Create Playwright E2E tests** following `@playwright-testing-standards.mdc` incremental development approach
7. Ensure proper integration with season data and validation

### **Playwright E2E Testing (Following @playwright-testing-standards.mdc)**

**CRITICAL**: Follow "One Test at a Time" development process to avoid past Playwright delays

#### **Page Object Models**

Create dedicated page objects for discipline management workflow:

```typescript
// tests/pages/DisciplinePage.ts
import { Page, expect } from '@playwright/test';

export class DisciplinePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/disciplines');
    await expect(this.page).toHaveURL(/disciplines/);
  }

  async createDiscipline(
    name: string,
    type: 'timed' | 'measured',
    season: string,
    teamSize?: number
  ) {
    // Use semantic locators - NO CSS selectors
    await this.page.getByRole('button', { name: 'Add Discipline' }).click();
    await this.page.getByLabel('Discipline Name').fill(name);
    await this.page.getByRole('combobox', { name: 'Type' }).selectOption(type);
    await this.page
      .getByRole('combobox', { name: 'Season' })
      .selectOption(season);

    if (teamSize) {
      await this.page.getByLabel('Team Size').fill(teamSize.toString());
    }

    await this.page.getByRole('button', { name: 'Create Discipline' }).click();

    // Proper waiting - NO arbitrary timeouts
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async filterBySeason(seasonName: string) {
    await this.page
      .getByRole('combobox', { name: 'Filter by season' })
      .selectOption(seasonName);

    // Wait for table to update with filtered results
    await expect(this.page.getByText('Loading...')).not.toBeVisible();
  }

  async searchDisciplines(searchTerm: string) {
    await this.page
      .getByRole('searchbox', { name: 'Search disciplines' })
      .fill(searchTerm);

    // Wait for search results
    await page.waitForResponse(
      response =>
        response.url().includes('/api/disciplines') && response.status() === 200
    );
  }

  async editDiscipline(disciplineName: string, newName: string) {
    await this.page
      .getByRole('row', { name: disciplineName })
      .getByRole('button', { name: 'Edit' })
      .click();
    await this.page.getByLabel('Discipline Name').clear();
    await this.page.getByLabel('Discipline Name').fill(newName);
    await this.page.getByRole('button', { name: 'Update Discipline' }).click();

    await expect(this.page.getByText(newName)).toBeVisible();
  }

  async deleteDiscipline(disciplineName: string) {
    await this.page
      .getByRole('row', { name: disciplineName })
      .getByRole('button', { name: 'Delete' })
      .click();
    await this.page.getByRole('button', { name: 'Confirm Delete' }).click();

    await expect(this.page.getByText(disciplineName)).not.toBeVisible();
  }

  async expectBusinessRuleValidation(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
```

#### **Test Implementation (Incremental Approach)**

**Step 1**: Write ONE test skeleton

```typescript
// tests/specs/discipline-management.spec.ts
import { test, expect } from '@playwright/test';
import { AppWorkflow } from '../pages/AppWorkflow';
import { DisciplinePage } from '../pages/DisciplinePage';
import { SeasonPage } from '../pages/SeasonPage';

test('user can manage disciplines with business rules', async ({ page }) => {
  // TODO: Will implement step by step
});
```

**Step 2**: Add navigation and verify, then debug

```powershell
npx playwright test --grep "user can manage disciplines" --debug
```

**Step 3**: Add ONE more action, then debug again

```typescript
test('user can manage disciplines with business rules', async ({ page }) => {
  const app = new AppWorkflow(page);
  const disciplinePage = new DisciplinePage(page);
  const seasonPage = new SeasonPage(page);

  await app.signInWithClub('admin@example.com', 'password123', 'Test Club');

  // Create a season first for discipline association
  await seasonPage.goto();
  await seasonPage.createSeason('Track & Field', 'Outdoor track season');

  await disciplinePage.goto();

  // STOP HERE - debug this step before adding more
});
```

**Step 4**: Continue incrementally, debugging each business rule

```powershell
# Debug each business rule individually - NEVER skip this
npx playwright test --grep "user can manage disciplines" --debug
```

#### **Required E2E Test Coverage**

- [ ] **Discipline list display** with shadcn/ui table sorting and filtering
- [ ] **Create discipline modal** workflow with business rule validation
- [ ] **Edit discipline modal** workflow with season relationships
- [ ] **Delete discipline** workflow with confirmation dialog
- [ ] **Season-based filtering** using TanStack Table capabilities
- [ ] **Search functionality** across discipline names and descriptions
- [ ] **Business rule validation**: Timed vs measured discipline types
- [ ] **Business rule validation**: Team size constraints and validation
- [ ] **Season integration**: Discipline-season relationships working correctly

#### **Business Rule Testing (Critical)**

```typescript
// Test timed vs measured validation
test('validates timed vs measured discipline types', async ({ page }) => {
  const disciplinePage = new DisciplinePage(page);

  // Test timed discipline creation
  await disciplinePage.createDiscipline(
    '100m Sprint',
    'timed',
    'Track & Field'
  );

  // Test measured discipline creation
  await disciplinePage.createDiscipline(
    'Shot Put',
    'measured',
    'Track & Field'
  );

  // Test business rule: Invalid team size for individual event
  await disciplinePage.expectBusinessRuleValidation(
    'Individual events cannot have team size > 1'
  );
});
```

#### **Debugging Commands (Windows PowerShell)**

```powershell
# Start with one test in debug mode
npx playwright test --grep "specific test name" --debug

# Use UI mode for visual development
npx playwright test --ui

# Generate selectors with Codegen
npx playwright codegen localhost:3000/disciplines
```

#### **Smart Waiting - NO Arbitrary Timeouts**

```typescript
// ✅ Proper waiting for season filtering
await expect(page.getByText('Loading...')).not.toBeVisible();
await expect(
  page.getByRole('button', { name: 'Create Discipline' })
).toBeEnabled();

// ✅ Wait for search API responses
await page.waitForResponse(
  response =>
    response.url().includes('/api/disciplines') && response.status() === 200
);

// ✅ Wait for season data to load
await page.waitForLoadState('networkidle');
```

### **Step 6.8: Verify Completion Criteria (MANDATORY BEFORE PR)**

**🎯 SYSTEMATIC COMPLETION VERIFICATION**

Before creating any PR, ALL criteria must be explicitly verified with evidence:

```powershell
# Final test validation
npm run test:all                # All tests passing
npm run build                   # Clean build confirmation
npm run quality:check          # No linting/formatting issues
```

**⚠️ CRITICAL: MANDATORY COMPLETION CRITERIA CHECK**

**STEP 1: Review the "🎯 ITERATION 5 COMPLETION CRITERIA" section at the bottom of this iteration.**

**STEP 2: Verify EVERY item in that section with evidence before proceeding.**

**ITERATION COMPLETION CRITERIA VERIFICATION:**

⚠️ **Go to the "🎯 ITERATION 5 COMPLETION CRITERIA" section below and check off EVERY item before proceeding.**

- [ ] **I have reviewed and verified ALL items in the "🎯 ITERATION 5 COMPLETION CRITERIA" section**
- [ ] **Every checkbox in that section is completed**
- [ ] **The iteration is ready for progress tracking and PR creation**

**REGRESSION & QUALITY VERIFICATION:**

- [ ] **No breaking changes** to existing functionality
  - Evidence: Existing test suite: **_/_** passing (same as baseline)
- [ ] **No performance degradation** in existing features
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***
- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** and evidence provided above
- [ ] **ITERATION-SPECIFIC CRITERIA SECTION** has been reviewed and all items verified
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **No outstanding issues** or incomplete features
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS:**

1. **The "🎯 ITERATION 5 COMPLETION CRITERIA" section has been fully verified**
2. **ALL items above are checked with evidence**
3. **Every checkbox in both sections is completed**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark Iteration 5 as completed in progress dashboard
# Update overall progress to 83% (5 of 6 iterations)
# Set Iteration 6 as ready to begin
git add .cursor/instructions/003_plans/05_discipline_management_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 5 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(ui): add Discipline management interface with business rules"
git push -u origin feat/iteration5-discipline-ui
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Discipline Management UI

**Type:** Feature
**Scope:** User Interface

### Changes

- Add DisciplineList component with season-based organization
- Add DisciplineModal component with business rule validation
- Implement season filtering and search functionality
- Add discipline management page with full CRUD workflow
- Enforce business rules (timed vs measured, team size validation)
- Complete integration with season relationships

### Testing

- Component tests covering all business rule scenarios
- User interaction tests for season filtering and search
- Business rule validation testing in UI
- Complete workflow testing from list to CRUD operations
- All existing tests continue to pass

### Dependencies

- Requires: All previous iterations (1-4)
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration5-discipline-ui
```

### **🎯 ITERATION 5 COMPLETION CRITERIA**

- [ ] DisciplineList component functional with season-based organization using shadcn/ui + TanStack Table
- [ ] DisciplineModal component working with complete business rule validation
- [ ] Season filtering and search functionality operational with TanStack Table capabilities
- [ ] Discipline management page fully accessible and functional
- [ ] Business rule validation working (timed vs measured, team size)
- [ ] Component tests comprehensive covering all business scenarios (business logic focus)
- [ ] **Playwright E2E tests implemented** following @playwright-testing-standards.mdc one test at a time
- [ ] **DisciplinePage object model created** with semantic locators for complex workflows
- [ ] **E2E test coverage complete** for CRUD operations, business rules, and season integration
- [ ] **Business rule E2E testing** for timed vs measured validation and team size constraints
- [ ] UI properly integrated with season relationships using modern table components
- [ ] Search and filtering working across all seasons with advanced sorting
- [ ] Complete user workflow functional from list to create/edit/delete with shadcn/ui styling

# 🚀 **ITERATION 6: TABLE COMPONENT MIGRATION**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Migrate existing table components (AthleteList, AgeGroupList, BasicTableOne, RecentOrders) to use shadcn/ui + TanStack Table for consistency and enhanced functionality across the application.

**Duration Estimate**: 4-6 hours (can be split across multiple sessions)
**Dependencies**: Iterations 1-5 (all discipline management features completed)
**Scope**: Upgrade 4 existing components to use modern table implementation with sorting, filtering, and improved UX

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - using established shadcn/ui + TanStack Table patterns from Iterations 4-5
- **Migration Strategy**: Component-by-component migration to minimize risk
- **Priority Order**: AthleteList → AgeGroupList → BasicTableOne → RecentOrders
- **Pattern Compliance Check**: Ensure each migrated component follows shadcn/ui table patterns
- **Architecture Verification**: Maintain existing functionality while adding sorting/filtering capabilities
- Migrate AthleteList to shadcn/ui + TanStack Table (sorting by name, date; filtering by search)
- Migrate AgeGroupList to shadcn/ui + TanStack Table (sorting by name, ordinal; simple functionality)
- **DO NOT write tests yet** - focus on migration implementation first
- **DO NOT modify API endpoints** - pure UI component migration

### **Step 4: Develop (Refine)**

- Complete migration of BasicTableOne and RecentOrders components
- Add enhanced functionality (sorting, filtering) where appropriate
- **Write comprehensive component tests** for migrated components
- **Test migration compatibility** - ensure no regression in existing workflows
- **Test enhanced features** - verify sorting and filtering work correctly

## **📋 ITERATION 6 IMPLEMENTATION**

**Rule Reference**: `nextjs-structure-standards.mdc`, `ui-tailwind-css-standards.mdc`, `bp-testing-standards.mdc`

**Files to Modify**:

- `src/components/athlete/AthleteList.tsx` (migrate to shadcn/ui + TanStack Table)
- `src/components/age-group/AgeGroupList.tsx` (migrate to shadcn/ui + TanStack Table)
- `src/components/tables/BasicTableOne.tsx` (migrate to shadcn/ui + TanStack Table)
- `src/components/ecommerce/RecentOrders.tsx` (migrate to shadcn/ui + TanStack Table)
- `src/components/athlete/__tests__/AthleteList.test.tsx` (update tests)
- `src/components/age-group/__tests__/AgeGroupList.test.tsx` (update tests)

**Files to Remove**:

- `src/components/ui/table/index.tsx` (replace with shadcn/ui table components)

**Implementation Steps**:

1. **Component Migration Priority**: AthleteList (most complex) → AgeGroupList (simpler) → Demo components
2. **AthleteList Migration**:
   - Replace table imports with shadcn/ui components
   - Add TanStack Table with sorting (name, date) and search functionality
   - Maintain existing pagination and delete functionality
   - Test athlete workflow thoroughly
3. **AgeGroupList Migration**:
   - Replace table imports with shadcn/ui components
   - Add TanStack Table with sorting (name, ordinal)
   - Maintain existing edit/delete functionality
   - Test age group management workflow
4. **Demo Component Migration**:
   - Migrate BasicTableOne and RecentOrders to shadcn/ui patterns
   - Add basic sorting functionality for demonstration
5. **Legacy Cleanup**: Remove old `src/components/ui/table/index.tsx` after all migrations complete
6. **Testing**: Update component tests to reflect new table API and test enhanced functionality

### **Step 6.8: Verify Completion Criteria (MANDATORY BEFORE PR)**

**🎯 SYSTEMATIC COMPLETION VERIFICATION**

Before creating any PR, ALL criteria must be explicitly verified with evidence:

```powershell
# Migration validation
npm run test:all                # All tests passing with new table components
npm run build                   # Clean build confirmation
npm run quality:check          # No linting/formatting issues

# Manual testing
# Test AthleteList: sorting, search, pagination, edit/delete
# Test AgeGroupList: sorting, edit/delete
# Test BasicTableOne and RecentOrders: basic functionality
```

**⚠️ CRITICAL: MANDATORY COMPLETION CRITERIA CHECK**

**STEP 1: Review the "🎯 ITERATION 6 COMPLETION CRITERIA" section at the bottom of this iteration.**

**STEP 2: Verify EVERY item in that section with evidence before proceeding.**

**ITERATION COMPLETION CRITERIA VERIFICATION:**

⚠️ **Go to the "🎯 ITERATION 6 COMPLETION CRITERIA" section below and check off EVERY item before proceeding.**

- [ ] **I have reviewed and verified ALL items in the "🎯 ITERATION 6 COMPLETION CRITERIA" section**
- [ ] **Every checkbox in that section is completed**
- [ ] **The iteration is ready for progress tracking and PR creation**

**REGRESSION & QUALITY VERIFICATION:**

- [ ] **No breaking changes** to existing functionality
  - Evidence: AthleteList workflow: **\*\***\_\_\_**\*\***
  - Evidence: AgeGroupList workflow: **\*\***\_\_\_**\*\***
  - Evidence: All existing tests: **_/_** passing
- [ ] **Enhanced functionality working** in migrated components
  - Evidence: AthleteList sorting/search: **\*\***\_\_\_**\*\***
  - Evidence: AgeGroupList sorting: **\*\***\_\_\_**\*\***
- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: \***\*\*\*\*\***\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\***\*\*\*\*\***

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** and evidence provided above
- [ ] **ITERATION-SPECIFIC CRITERIA SECTION** has been reviewed and all items verified
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **No outstanding issues** or incomplete features
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS:**

1. **The "🎯 ITERATION 6 COMPLETION CRITERIA" section has been fully verified**
2. **ALL items above are checked with evidence**
3. **Every checkbox in both sections is completed**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark Iteration 6 as completed in progress dashboard
# Update overall progress to 100% (6 of 6 iterations)
# Mark complete discipline management + table migration done
git add .cursor/instructions/003_plans/05_discipline_management_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 6 completion - table migration complete"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(ui): migrate existing table components to shadcn/ui + TanStack Table"
git push -u origin feat/iteration6-table-migration
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Table Component Migration to shadcn/ui + TanStack Table

**Type:** Refactor
**Scope:** UI Components

### Changes

- Migrate AthleteList to shadcn/ui + TanStack Table with enhanced sorting and search
- Migrate AgeGroupList to shadcn/ui + TanStack Table with sorting capabilities
- Migrate BasicTableOne and RecentOrders to modern table implementation
- Remove legacy table components (`src/components/ui/table/index.tsx`)
- Add sorting, filtering capabilities to existing table workflows
- Maintain all existing functionality while enhancing user experience

### Testing

- Update component tests for new table API
- Test enhanced functionality (sorting, filtering)
- Verify no regression in existing workflows
- All existing business logic preserved and tested

### Benefits

- Consistent table implementation across application
- Enhanced user experience with sorting and filtering
- Better performance with TanStack Table optimizations
- Improved maintainability with single table system
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration6-table-migration
```

### **🎯 ITERATION 6 COMPLETION CRITERIA**

- [ ] AthleteList successfully migrated to shadcn/ui + TanStack Table with sorting and search
- [ ] AgeGroupList successfully migrated to shadcn/ui + TanStack Table with sorting
- [ ] BasicTableOne migrated to shadcn/ui + TanStack Table (demo functionality)
- [ ] RecentOrders migrated to shadcn/ui + TanStack Table (demo functionality)
- [ ] Legacy table components (`src/components/ui/table/index.tsx`) removed
- [ ] All existing functionality preserved (no regressions)
- [ ] Enhanced functionality working (sorting, filtering where appropriate)
- [ ] Component tests updated and passing for new table API
- [ ] Manual testing confirms all table workflows functional
- [ ] Build and quality checks passing
- [ ] Application-wide table consistency achieved

## 📚 **APPENDIX: SESSION MANAGEMENT**

### **Starting a New Session**

1. **Context Recovery**: Read progress dashboard and identify current iteration
2. **Git Status Check**: Verify branch and working directory status
3. **Status Check**: Update iteration checkboxes based on actual completion
4. **Environment Verification**: Run `npm run quality:check` for quick validation
5. **Database Status**: Check Prisma schema and migration status with `npx prisma db status`

### **Iteration Workflow (Per Session)**

1. **Branch & Pull** → Start fresh from main: `git checkout main && git pull origin main`
2. **Create Branch** → `git checkout -b feat/iterationX-feature-name`
3. **Develop** → Implement initial feature functionality following established patterns
4. **Test L1** → `npm run quality:check && npm run test:run`
5. **Develop** → Refine based on immediate feedback and write comprehensive tests
6. **Test L2** → `npm run test:coverage && npm run build`
7. **Test L3** → `npm run test:all && npm run validate:pre-docker`
8. **Docker Validation** → `docker-compose up --build -d` + feature validation
9. **Update Progress** → Update execution plan and commit progress tracking changes
10. **Create PR** → Push branch and create detailed pull request

### **Quality Gates (4-Level Testing Pyramid)**

- **Level 1**: Immediate feedback (quality:check, test:run, prisma validate)
- **Level 2**: Integration validation (test:coverage, build, database operations)
- **Level 3**: Release readiness (test:all, validate:pre-docker)
- **Level 4**: Docker deployment validation (containerized environment testing)

### **Emergency Recovery**

If issues occur during an iteration:

1. Check git status: `git status && git log --oneline -5`
2. Review test failures: Check npm script output logs
3. Run regression check: `npm run test:all` to verify no breaking changes
4. Check Prisma status: `npx prisma db status` for database issues
5. Consult specific rule documentation for guidance
6. Rollback to iteration start if needed: `git checkout main && git branch -D current-branch`

### **Session Continuity Rules**

- Each iteration should complete in a single session (2-4 hours)
- If incomplete, document exact stopping point in progress dashboard
- Always end sessions with a clean git state (committed or stashed)
- Next session starts with fresh main pull and context recovery
- Prisma schema changes require proper migration handling across sessions
