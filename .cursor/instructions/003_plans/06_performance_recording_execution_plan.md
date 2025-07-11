# Performance Recording & Medal System - Execution Plan

## 📊 **PROGRESS TRACKING DASHBOARD**

### **Overall Status**

- **Current Iteration**: [ ] Iteration 1 | [ ] Iteration 2 | [ ] Iteration 3 | [ ] Iteration 4 | [ ] Iteration 5 | [ ] Iteration 6
- **Overall Progress**: 0% Complete (0 of 6 iterations completed)
- **Last Session Date**: [To be updated]
- **Status**: Ready to begin - All dependencies verified, foundation analysis complete

### **Iteration Progress Summary**

| Iteration                                   | Feature                                                  | Status                                                | Duration Est. | Dependencies       |
| ------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- | ------------- | ------------------ |
| **Iteration 1**: Medal & Performance Models | Medal and Performance Prisma models creation & migration | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | None               |
| **Iteration 2**: Performance API            | Performance CRUD endpoints with comprehensive validation | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Iteration 1        |
| **Iteration 3**: Performance Form UI        | Performance recording form with athlete search           | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 4-5 hours     | Iterations 1, 2    |
| **Iteration 4**: File Upload System         | Secure proof file upload and storage                     | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Iterations 1, 2, 3 |
| **Iteration 5**: Record Detection           | Automatic club record & personal best calculation        | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 4-5 hours     | Iterations 1, 2, 3 |
| **Iteration 6**: Team Performance           | Team member selection and validation                     | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Iterations 1, 2, 3 |

### **Quick Iteration Status**

**Iteration 1 - Medal & Performance Models Creation**

- [ ] Branch & Pull Latest
- [ ] Develop (Initial)
- [ ] Test (Level 1)
- [ ] Develop (Refine)
- [ ] Test (Level 2)
- [ ] Test Release (Level 3)
- [ ] Create PR & Merge

### **Session Quick Start**

```powershell
# Context Recovery Commands
Get-Location                    # Verify project directory
Test-Path package.json          # Confirm in correct project
git status                      # See current changes
git branch                      # Check current branch
npm run quality:check           # Quick validation
```

## 📋 **PLAN OVERVIEW**

### **Current State Assessment**

- **Project Type**: Next.js 15 with TypeScript, Prisma ORM, PostgreSQL database, shadcn/ui components
- **Foundation Quality**: Strong foundation with authentication, club management, athletes, age groups, and disciplines implemented
- **Enterprise Readiness**: Existing foundation meets enterprise standards with proper testing, Docker deployment, and quality gates

### **Target State**

- **Primary Goals**: Complete performance recording system with medal support, file uploads, and automatic record detection
- **Standards Compliance**:
  - `db-schema-standards.mdc` for Prisma model validation and constraints
  - `db-client-standards.mdc` for optimized database queries and transactions
  - `typescript-nextjs-standards.mdc` for component architecture and API routes
  - `bp-testing-standards.mdc` for comprehensive testing with Vitest and React Testing Library
  - `nextjs-structure-standards.mdc` for proper file organization and component structure
  - `ui-tailwind-css-standards.mdc` for consistent styling and responsive design
  - `bp-security-standards.mdc` for secure file upload and data validation
  - `logging-standards.mdc` for comprehensive error handling and logging
  - `playwright-testing-standards.mdc` for E2E testing with semantic locators and Page Object Models
- **Success Metrics**:
  - Performance CRUD operations with comprehensive validation
  - Medal system with positions 1-12 and proper display
  - File upload system with security controls
  - Automatic record detection and calculation
  - Team performance support with member validation
  - Complete BDD scenario coverage
  - Zero breaking changes to existing functionality

### **Implementation Strategy**

- **Approach**: Atomic iterations with continuous testing following established patterns from age-group and discipline management
- **Workflow**: Branch → Develop → Test → Develop → Test → Release → PR
- **Session Support**: Plan designed for multi-session execution with clear context recovery
- **Testing Integration**: Leverages npm scripts and follows existing test patterns (Vitest, React Testing Library, Playwright E2E)

## 🔍 **CURRENT STATE ANALYSIS**

### ✅ **EXISTING STRENGTHS**

- **Established Data Models**: User, Club, Gender, AgeGroup, Athlete, Season, Discipline models exist - **Performance and Medal models need to be created**
- **Component Patterns**: Form components, table components, and modal patterns established with shadcn/ui
- **Testing Infrastructure**: Vitest and React Testing Library setup with comprehensive test utilities
- **API Patterns**: Consistent Next.js API route patterns in `/api/athletes/`, `/api/age-groups/`, `/api/disciplines/`
- **Authentication System**: NextAuth.js with club-based permissions and secure session management
- **UI Design System**: shadcn/ui + TanStack Table components with responsive design and dark mode
- **Database Infrastructure**: PostgreSQL with Prisma ORM, proper migrations, and established seed data patterns
- **Docker Deployment**: Container setup with multi-stage builds and deployment optimization
- **File Handling Foundation**: Basic file input components and upload patterns exist

### ❌ **CRITICAL GAPS IDENTIFIED**

**Medal System Creation (`db-schema-standards.mdc`)**

- **Medal model completely missing** - needs creation in Prisma schema with positions 1-12 and Gold/Silver/Bronze mapping
- Medal seed data needs creation for all positions with proper names
- Medal display components need implementation for form selection and performance display
- Medal validation logic needs comprehensive testing

**Performance System Creation (`db-client-standards.mdc`, `typescript-nextjs-standards.mdc`)**

- **Performance model completely missing** - needs creation in Prisma schema with all required fields (athlete, discipline, age group, gender, medal, time/distance, date, record flags, etc.)
- Performance CRUD endpoints need complete implementation from scratch
- Duplicate performance prevention logic needs implementation
- Performance value validation for timed vs measured disciplines needs implementation
- Team performance API endpoints missing for member association

**Performance Recording UI (`nextjs-structure-standards.mdc`, `ui-tailwind-css-standards.mdc`)**

- No comprehensive performance recording form component
- Athlete search integration needed for performance form
- Dynamic discipline filtering and validation needs implementation
- Medal selection UI components missing

**File Upload System (`bp-security-standards.mdc`)**

- Secure file upload system for performance proof missing
- File type and size validation needs implementation
- File storage and access control system needs development

**Automatic Record Detection (`db-client-standards.mdc`)**

- Background record calculation logic needs implementation
- Club record and personal best detection algorithms missing
- Record flag updates and historical preservation needs development

**Team Performance Support (`bp-testing-standards.mdc`)**

- Team member selection UI components missing
- Team performance validation logic needs implementation
- Team medal association functionality needs development

## 🔍 **PATTERN DISCOVERY & CONSISTENCY ANALYSIS**

### **⚠️ MANDATORY PRE-IMPLEMENTATION ANALYSIS**

**Rule**: NO development may begin until this analysis is completed and documented with evidence.

### **🔎 DISCOVER SIMILAR EXISTING FEATURES**

Based on codebase analysis, the **Age Group Management** and **Discipline Management** features serve as primary reference implementations:

```powershell
# Primary reference: Age Group management
Get-ChildItem -Path "src/components/age-group" -Recurse | Select-Object Name,Directory
# Result: AgeGroupList.tsx, AgeGroupModal.tsx, index.ts

# Secondary reference: Discipline management
Get-ChildItem -Path "src/components/discipline" -Recurse | Select-Object Name,Directory
# Result: DisciplineList.tsx, DisciplineModal.tsx, index.ts

# API pattern reference
Get-ChildItem -Path "src/app/api/athletes" -Recurse | Select-Object Name,Directory
# Result: route.ts, [id]/route.ts, search/route.ts, __tests__/

# Form patterns reference
Get-ChildItem -Path "src/components/form" -Recurse -Include "*.tsx" | Select-Object Name,Directory
# Result: Form.tsx, InputField.tsx, FileInput.tsx, etc.
```

### **📋 PATTERN ANALYSIS CHECKLIST**

**Similar Feature Identification:**

- [x] **Feature Identified**: Age Group Management at `src/components/age-group/`
  - Location: Complete CRUD with modal-based workflow
  - Implementation approach: Modal forms + table display with shadcn/ui
  - Component architecture used: Modal + Table + Form components with TypeScript

- [x] **Feature Identified**: Discipline Management at `src/components/discipline/`
  - Location: Advanced CRUD with season relationships
  - Implementation approach: Modal forms + advanced table with filtering
  - Component architecture used: Modal + TanStack Table + Form validation

- [x] **Feature Identified**: Athlete Management at `src/components/athlete/`
  - Location: Complex forms with search and validation
  - Implementation approach: Page-based forms + search components
  - Component architecture used: Form components + search + combobox patterns

**UI/UX Pattern Analysis:**

- [x] **Modal vs Page Navigation**: Age groups and disciplines use modal-based workflow for CRUD operations
  - Evidence: `AgeGroupModal.tsx`, `DisciplineModal.tsx` for create/edit operations
- [x] **Button Styles**: Consistent Button component usage with icon + text patterns
  - Evidence: `<Button><Plus className="mr-2 h-4 w-4" /> Add Age Group</Button>`
- [x] **Form Patterns**: Form components use shadcn/ui with Zod validation
  - Evidence: Form components in `src/components/form/` with TypeScript and validation
- [x] **Table/List Display**: TanStack Table with shadcn/ui styling and filtering
  - Evidence: `AgeGroupList.tsx`, `DisciplineList.tsx` use Table components with sorting/filtering
- [x] **Search Functionality**: Athlete search uses combobox pattern with async search
  - Evidence: `AthleteCombobox.tsx` with search functionality and autocomplete

**Component Reuse Analysis:**

- [x] **Existing Components**: Reusable components available for performance recording
  - Component: Button | Location: `src/components/ui/button/Button.tsx`
  - Component: Modal | Location: `src/components/ui/modal/index.tsx`
  - Component: Table | Location: `src/components/ui/table.tsx`
  - Component: Form | Location: `src/components/form/Form.tsx`
  - Component: InputField | Location: `src/components/form/input/InputField.tsx`
  - Component: FileInput | Location: `src/components/form/input/FileInput.tsx`
- [x] **Styling Systems**: Tailwind CSS with shadcn/ui design system and dark mode support
  - Evidence: Consistent className patterns and CSS variable usage across components
- [x] **Layout Containers**: ComponentCard wrapper for consistent component styling
  - Evidence: Used in age groups, disciplines, and athlete components for consistent layout

**Testing Pattern Analysis:**

- [x] **Test File Structure**: Tests in `__tests__` directories alongside components
  - Pattern: Component tests next to source files with `.test.tsx` extension
- [x] **Mocking Patterns**: MSW for API mocking, React Testing Library for component testing
  - Evidence: Test utilities in `src/test/` directory with setup and mocking patterns
- [x] **Test Utilities**: Comprehensive test utilities for rendering and assertions
  - Location: `src/test/test-utils.tsx` with custom render functions and providers

### **🎯 IMPLEMENTATION CONSTRAINTS DERIVED**

Based on pattern analysis, document MANDATORY implementation constraints:

**Architecture Constraints:**

- [x] **Component Structure**: Must follow modal-based workflow like age groups and disciplines for CRUD operations
- [x] **Navigation Pattern**: Must use modal approach for create/edit operations, not page navigation
- [x] **State Management**: Must use React state with proper form validation using Zod schemas

**UI/UX Constraints:**

- [x] **Component Usage**: MUST use existing Button, Modal, Table, and Form components from shadcn/ui
- [x] **Styling Approach**: MUST follow Tailwind CSS patterns with shadcn/ui design system
- [x] **Layout Structure**: MUST use ComponentCard wrapper for consistent component presentation

**Testing Constraints:**

- [x] **Test Structure**: MUST follow existing pattern with `__tests__` directories and `.test.tsx` files
- [x] **Mock Patterns**: MUST use MSW for API mocking and React Testing Library for component testing
- [x] **Test Organization**: MUST place tests alongside source files in component directories

### **✅ PATTERN COMPLIANCE VERIFICATION**

**PRE-DEVELOPMENT SIGN-OFF** (Required before ANY iteration begins):

- [x] **Similar feature analyzed** with documented evidence (Age Group + Discipline management)
- [x] **UI/UX patterns identified** and constraints documented (Modal-based CRUD workflow)
- [x] **Component reuse opportunities** mapped and documented (Button, Modal, Table, Form components)
- [x] **Testing patterns analyzed** and approach defined (Vitest + React Testing Library in `__tests__`)
- [x] **Implementation constraints** clearly defined with evidence (shadcn/ui + modal workflow)
- [x] **Development approach** designed to integrate seamlessly with existing patterns

**⚠️ CRITICAL**: Development may proceed to iterations - ALL pattern analysis completed with evidence.

# 🚀 **ITERATION 1: MEDAL & PERFORMANCE MODELS CREATION**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Create Medal and Performance Prisma models from scratch with comprehensive fields, database migration, and seed data to establish the foundation for performance recording system.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: None
**Scope**: Single, atomic, testable enhancement to medal system

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration1-medal-system-enhancement
```

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - medal system follows existing seed data patterns
- **Pattern Compliance Check**: Confirm medal implementation uses established Prisma patterns
- **Architecture Verification**: Ensure medal structure matches analyzed similar reference data
- Enhance medal seed data in `prisma/seed-data.yaml` for positions 1-12
- Verify Medal model in schema for proper constraints and validation
- **DO NOT write tests yet** - focus on implementation first
- **DO NOT create new models** - enhance existing Medal model if needed

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Fix issues found in Level 1 testing
- Improve implementation based on feedback
- **Write comprehensive unit tests** for medal validation functions and constraints
- **Write medal-specific API tests** for medal endpoints if they exist
- Follow existing test patterns in the project (Vitest, React Testing Library)
- Achieve 100% test coverage for new medal validation logic

**Testing Focus**: Test YOUR medal validation code - position validation, name mapping, and constraint logic. Do NOT test Prisma ORM, database operations, or framework functionality.

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage (including new tests)
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate medal system in containerized environment
# Test medal seed data is properly loaded
Invoke-RestMethod -Uri "http://localhost:3000/api/medals" -Method GET

# Verify medal positions 1-12 are available
# Check Gold/Silver/Bronze mapping is correct

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

**STEP 1: Review the "ITERATION 1 COMPLETION CRITERIA" section at the bottom of this iteration.**

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
  - Evidence: **********************\_\_\_**********************

- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: **********************\_\_\_**********************

- [ ] **TypeScript compilation clean** with no type errors
  - Evidence: **********************\_\_\_**********************

**DOCUMENTATION & PLAN UPDATES:**

- [ ] **Execution plan updated** with iteration completion status
  - Evidence: Progress dashboard shows iteration marked complete

- [ ] **Implementation deviations documented** (if any)
  - Evidence: **********************\_\_\_**********************

- [ ] **Next iteration dependencies** confirmed ready
  - Evidence: **********************\_\_\_**********************

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** in the iteration-specific section below
- [ ] **All regression and quality checks passed**
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS ALL CHECKBOXES ABOVE ARE COMPLETED**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark iteration as completed in progress dashboard
# Update overall progress percentage
# Set next iteration as ready to begin
git add .cursor/instructions/003_plans/06_performance_recording_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 1 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(medals): enhance medal system with positions 1-12 and validation"
git push -u origin feat/iteration1-medal-system-enhancement
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Medal System Enhancement

**Type:** Enhancement
**Scope:** Database/API

### Changes

- Enhanced medal seed data for positions 1-12 with proper Gold/Silver/Bronze mapping
- Added comprehensive medal validation logic and constraints
- Implemented medal position validation functions
- Added medal-specific unit tests with 100% coverage

### Testing

- Medal validation logic comprehensively tested
- Seed data loading verified in Docker environment
- All existing tests continue to pass

### Dependencies

- None - foundational enhancement for performance recording
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration1-medal-system-enhancement
```

## **📋 ITERATION 1 IMPLEMENTATION**

**Rule Reference**: `db-schema-standards.mdc`, `db-client-standards.mdc`

**Files to Create/Modify**:

- `prisma/seed-data.yaml` (modify - add comprehensive medal data)
- `src/types/medal.ts` (new - TypeScript types for medals)
- `src/lib/medalValidation.ts` (new - medal validation functions)
- `src/app/api/medals/route.ts` (new/modify - medal API endpoints)
- `src/app/api/medals/__tests__/medals.test.ts` (new - medal API tests)

**Implementation Steps**:

1. **Verify/Enhance Medal Model in Prisma Schema**:

   ```powershell
   # Check current medal model in schema
   Get-Content prisma/schema.prisma | Select-String -Pattern "Medal" -A 10
   ```

2. **Add/Enhance Medal Seed Data**:

   ```yaml
   # Add to prisma/seed-data.yaml
   medals:
     - position: 1
       name: 'Gold'
     - position: 2
       name: 'Silver'
     - position: 3
       name: 'Bronze'
     - position: 4
       name: 'Bronze'
     # ... positions 5-12 as Bronze
   ```

3. **Create Medal TypeScript Types**:

   ```typescript
   # src/types/medal.ts
   export interface Medal {
     id: string;
     position: number;
     name: string;
   }
   ```

4. **Implement Medal Validation Functions**:

   ```typescript
   # src/lib/medalValidation.ts
   export function validateMedalPosition(position: number): boolean
   export function getMedalName(position: number): string
   export function getMedalsByPosition(): Medal[]
   ```

**Testing Strategy**:

- **Step 4 Focus**: Write tests for medal validation functions and position constraints
- **Test Patterns**: Follow existing project test structure (Vitest)
- **Coverage Goal**: Achieve 100% coverage for medal validation logic
- **Test Files**: Place tests in `__tests__` directories alongside source files
- **Testing Scope**: Focus on position validation, name mapping, and constraint enforcement - test YOUR code only. Do NOT test Prisma ORM, database functionality, or framework code
- **Seed Data**: Verify medal data loads correctly in development and test environments

**Regression Protection**:

- [ ] Existing functionality remains intact
- [ ] No breaking changes to previous iterations
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

**Commit Strategy**:

- Progressive commits during development
- Final commit: `feat(medals): enhance medal system with positions 1-12 and validation`

### **🎯 ITERATION 1 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] **Medal seed data enhanced** with positions 1-12 and proper Gold/Silver/Bronze mapping in `prisma/seed-data.yaml`
- [ ] **Medal validation functions implemented** with 100% test coverage in `src/lib/medalValidation.ts`
- [ ] **TypeScript types created** for medal interfaces in `src/types/medal.ts`
- [ ] **Medal API endpoints tested** (if existing) or created with proper validation
- [ ] Level 2 tests pass (test:coverage, build) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (medals load correctly in container)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Test files follow project patterns** (Vitest in `__tests__` directories)
- [ ] **Medal system is completely functional** and ready for performance recording integration
- [ ] Documentation updated if needed
- [ ] Execution plan progress dashboard updated with iteration completion

# 🚀 **ITERATION 2: PERFORMANCE API ENHANCEMENT**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Enhance and implement comprehensive Performance API endpoints with full validation, duplicate prevention, and medal integration building on the medal system from Iteration 1.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: Iteration 1 (Medal System Enhancement)
**Scope**: Single, atomic, testable API enhancement for performance CRUD operations

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration2-performance-api-enhancement
```

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - performance API follows existing API patterns
- **Pattern Compliance Check**: Confirm implementation uses established Next.js API route patterns from athletes/age-groups
- **Architecture Verification**: Ensure API structure matches analyzed similar API endpoints
- Implement/enhance performance CRUD endpoints in `src/app/api/performances/`
- Add comprehensive Zod validation schemas for performance data
- Implement duplicate performance prevention logic
- **DO NOT write tests yet** - focus on implementation first
- **DO NOT create new models** - enhance existing Performance model usage

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Fix issues found in Level 1 testing
- Improve implementation based on feedback
- **Write comprehensive unit tests** for performance API endpoints and validation logic
- **Write API endpoint tests** for performance CRUD operations with medal integration using mocked database calls
- Follow existing test patterns in the project (Vitest, MSW for API mocking)
- Achieve 100% test coverage for new performance API logic

**Testing Focus**: Test YOUR performance API code - validation functions, duplicate prevention, and business logic using mocked database calls (MSW, Jest mocks). Do NOT test Prisma ORM, Next.js framework, or actual database operations.

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage (including new tests)
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate performance API in containerized environment
# Test performance CRUD operations
Invoke-RestMethod -Uri "http://localhost:3000/api/performances" -Method GET

# Test performance creation with medal
$performanceData = @{
  athleteId = "test-athlete-id"
  disciplineId = "test-discipline-id"
  ageGroupId = "test-age-group-id"
  medalId = "test-medal-id"
  timeSeconds = 12.45
  eventDetails = "Test Event"
  date = "2023-06-15"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/performances" -Method POST -Body $performanceData -ContentType "application/json"

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

**STEP 1: Review the "ITERATION 2 COMPLETION CRITERIA" section at the bottom of this iteration.**

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
  - Evidence: **********************\_\_\_**********************

- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: **********************\_\_\_**********************

- [ ] **TypeScript compilation clean** with no type errors
  - Evidence: **********************\_\_\_**********************

**DOCUMENTATION & PLAN UPDATES:**

- [ ] **Execution plan updated** with iteration completion status
  - Evidence: Progress dashboard shows iteration marked complete

- [ ] **Implementation deviations documented** (if any)
  - Evidence: **********************\_\_\_**********************

- [ ] **Next iteration dependencies** confirmed ready
  - Evidence: **********************\_\_\_**********************

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** in the iteration-specific section below
- [ ] **All regression and quality checks passed**
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS ALL CHECKBOXES ABOVE ARE COMPLETED**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark iteration as completed in progress dashboard
# Update overall progress percentage
# Set next iteration as ready to begin
git add .cursor/instructions/003_plans/06_performance_recording_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 2 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(performance): implement comprehensive performance API with validation"
git push -u origin feat/iteration2-performance-api-enhancement
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Performance API Enhancement

**Type:** Feature
**Scope:** API/Backend

### Changes

- Implemented comprehensive performance CRUD API endpoints
- Added Zod validation schemas for performance data validation
- Implemented duplicate performance prevention logic
- Added medal integration and timed vs measured discipline validation
- Enhanced performance model usage with comprehensive error handling

### Testing

- Performance API endpoints comprehensively tested with 100% coverage
- Duplicate prevention logic validated with edge case testing
- Medal association logic tested with various scenarios using mocked data
- All existing tests continue to pass

### Dependencies

- Iteration 1 (Medal System Enhancement) - successful integration verified
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration2-performance-api-enhancement
```

## **📋 ITERATION 2 IMPLEMENTATION**

**Rule Reference**: `typescript-nextjs-standards.mdc`, `db-client-standards.mdc`, `bp-testing-standards.mdc`

**Files to Create/Modify**:

- `src/app/api/performances/route.ts` (new/modify - main CRUD endpoints)
- `src/app/api/performances/[id]/route.ts` (new/modify - individual performance operations)
- `src/app/api/performances/validate/route.ts` (new - validation endpoint)
- `src/app/api/performances/__tests__/performances.test.ts` (new - comprehensive API tests)
- `src/lib/performanceValidation.ts` (new - performance validation functions)
- `src/types/performance.ts` (new - TypeScript types for performances)

**Implementation Steps**:

1. **Create/Enhance Performance API Routes**:

   ```powershell
   # Ensure API directory structure
   New-Item -ItemType Directory -Force -Path "src/app/api/performances"
   New-Item -ItemType Directory -Force -Path "src/app/api/performances/[id]"
   New-Item -ItemType Directory -Force -Path "src/app/api/performances/__tests__"
   ```

2. **Implement Main CRUD Endpoints**:

   ```typescript
   # src/app/api/performances/route.ts
   export async function GET(request: Request) // List performances with filtering
   export async function POST(request: Request) // Create new performance
   ```

3. **Implement Individual Performance Operations**:

   ```typescript
   # src/app/api/performances/[id]/route.ts
   export async function GET(request: Request, { params }: { params: { id: string } })
   export async function PUT(request: Request, { params }: { params: { id: string } })
   export async function DELETE(request: Request, { params }: { params: { id: string } })
   ```

4. **Create Performance Validation Functions**:

   ```typescript
   # src/lib/performanceValidation.ts
   export function validatePerformanceValue(discipline: Discipline, value: number): boolean
   export function checkDuplicatePerformance(data: PerformanceData): Promise<boolean>
   export function validateTimedDiscipline(timeSeconds: number): boolean
   export function validateMeasuredDiscipline(distanceMeters: number): boolean
   ```

**Testing Strategy**:

- **Step 4 Focus**: Write tests for YOUR performance API endpoints and validation functions
- **Test Patterns**: Follow existing project test structure (Vitest, MSW for API mocking)
- **Coverage Goal**: Achieve 100% coverage for performance API logic
- **Test Files**: Place tests in `__tests__` directories alongside API routes
- **Testing Scope**: Focus on validation logic, duplicate prevention, and business rules
- **Mock Strategy**: Use MSW to mock external dependencies, focus on testing YOUR code

**Regression Protection**:

- [ ] Existing functionality remains intact
- [ ] No breaking changes to medal system from Iteration 1
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

**Commit Strategy**:

- Progressive commits during development
- Final commit: `feat(performance): implement comprehensive performance API with validation`

### **🎯 ITERATION 2 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] **Performance CRUD endpoints implemented** with comprehensive validation in `src/app/api/performances/`
- [ ] **Zod validation schemas created** for performance data validation
- [ ] **Duplicate prevention logic implemented** with comprehensive edge case testing
- [ ] **Medal integration verified** with various performance scenarios
- [ ] **Performance validation functions implemented** with 100% test coverage
- [ ] **TypeScript types created** for performance interfaces
- [ ] Level 2 tests pass (test:coverage, build) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (API endpoints work in container)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Test files follow project patterns** (Vitest with MSW mocking)
- [ ] **Performance API is completely functional** and ready for UI integration
- [ ] **Timed vs measured discipline validation working** correctly
- [ ] **Medal system integration verified** from Iteration 1
- [ ] Documentation updated if needed
- [ ] Execution plan progress dashboard updated with iteration completion

# 🚀 **ITERATION 3: PERFORMANCE RECORDING FORM UI**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement comprehensive Performance Recording Form UI with athlete search, discipline selection, medal assignment, and real-time validation building on the API from Iteration 2.

**Duration Estimate**: 4-5 hours in single session
**Dependencies**: Iterations 1 (Medal System), 2 (Performance API)
**Scope**: Single, atomic, testable UI component for performance recording

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration3-performance-form-ui
```

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - performance form follows modal-based CRUD patterns
- **Pattern Compliance Check**: Confirm implementation uses established modal workflow like age groups/disciplines
- **Architecture Verification**: Ensure form structure matches analyzed similar form components
- Implement PerformanceModal component for create/edit operations
- Add PerformanceList component for displaying performances with table patterns
- Integrate athlete search with combobox pattern from existing AthleteCombobox
- **DO NOT write tests yet** - focus on implementation first
- **DO NOT create new base components** - reuse existing Button, Modal, Form components

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Fix issues found in Level 1 testing
- Improve implementation based on feedback
- **Write comprehensive unit tests** for performance form components and validation logic
- **Write Playwright E2E tests** following `@playwright-testing-standards.mdc` using "One Test at a Time" development with semantic locators (getByRole, getByLabel, getByText) and Page Object Models
- Follow existing test patterns in the project (Vitest, React Testing Library)
- Achieve 100% test coverage for new performance form components

**Testing Focus**: Test YOUR performance form components - form validation, user interactions, and component logic. Do NOT test shadcn/ui, React framework, or library functionality.

**E2E Testing Focus**: Implement Playwright tests following `@playwright-testing-standards.mdc` using "One Test at a Time" development process with semantic locators and Page Object Models.

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage (including new tests)
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate performance form UI in containerized environment
# Navigate to performance recording page and test form functionality
# Verify athlete search, discipline selection, and medal assignment work
# Test form submission and validation messages

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

**STEP 1: Review the "ITERATION 3 COMPLETION CRITERIA" section at the bottom of this iteration.**

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
  - Evidence: **********************\_\_\_**********************

- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: **********************\_\_\_**********************

- [ ] **TypeScript compilation clean** with no type errors
  - Evidence: **********************\_\_\_**********************

**DOCUMENTATION & PLAN UPDATES:**

- [ ] **Execution plan updated** with iteration completion status
  - Evidence: Progress dashboard shows iteration marked complete

- [ ] **Implementation deviations documented** (if any)
  - Evidence: **********************\_\_\_**********************

- [ ] **Next iteration dependencies** confirmed ready
  - Evidence: **********************\_\_\_**********************

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** in the iteration-specific section below
- [ ] **All regression and quality checks passed**
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS ALL CHECKBOXES ABOVE ARE COMPLETED**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark iteration as completed in progress dashboard
# Update overall progress percentage
# Set next iteration as ready to begin
git add .cursor/instructions/003_plans/06_performance_recording_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 3 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(performance-ui): implement performance recording form with validation"
git push -u origin feat/iteration3-performance-form-ui
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Performance Recording Form UI

**Type:** Feature
**Scope:** UI/Frontend

### Changes

- Implemented PerformanceModal component for create/edit operations following modal patterns
- Added PerformanceList component with TanStack Table for data display
- Integrated athlete search with existing AthleteCombobox patterns
- Added real-time form validation with Zod schemas
- Implemented medal selection and discipline filtering
- Added comprehensive component tests and E2E tests

### Testing

- Performance form components comprehensively tested with React Testing Library
- Playwright E2E tests for complete recording workflow
- Form validation and user interaction scenarios covered
- All existing tests continue to pass

### Dependencies

- Iteration 1 (Medal System) - medal selection integration verified
- Iteration 2 (Performance API) - API integration working correctly
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration3-performance-form-ui
```

## **📋 ITERATION 3 IMPLEMENTATION**

**Rule Reference**: `nextjs-structure-standards.mdc`, `ui-tailwind-css-standards.mdc`, `bp-testing-standards.mdc`

**Files to Create/Modify**:

- `src/components/performance/PerformanceModal.tsx` (new - modal form component)
- `src/components/performance/PerformanceList.tsx` (new - table display component)
- `src/components/performance/PerformanceForm.tsx` (new - form logic component)
- `src/components/performance/index.ts` (new - component exports)
- `src/components/performance/__tests__/PerformanceModal.test.tsx` (new - component tests)
- `src/components/performance/__tests__/PerformanceList.test.tsx` (new - component tests)
- `src/app/(admin)/performances/page.tsx` (new - performance management page)
- `tests/performance-recording.spec.ts` (new - E2E tests following @playwright-testing-standards.mdc)
- `tests/pages/PerformancePage.ts` (new - Page Object Model for performance recording)

**Implementation Steps**:

1. **Create Performance Component Directory**:

   ```powershell
   # Ensure component directory structure
   New-Item -ItemType Directory -Force -Path "src/components/performance"
   New-Item -ItemType Directory -Force -Path "src/components/performance/__tests__"
   ```

2. **Implement PerformanceModal Component**:

   ```typescript
   # src/components/performance/PerformanceModal.tsx
   export function PerformanceModal({ isOpen, onClose, onSave, performanceData }: PerformanceModalProps)
   // Modal wrapper with form for create/edit operations
   ```

3. **Implement PerformanceForm Component**:

   ```typescript
   # src/components/performance/PerformanceForm.tsx
   export function PerformanceForm({ onSubmit, initialData }: PerformanceFormProps)
   // Form logic with athlete search, discipline selection, medal assignment
   ```

4. **Implement PerformanceList Component**:

   ```typescript
   # src/components/performance/PerformanceList.tsx
   export function PerformanceList({ performances, onEdit, onDelete }: PerformanceListProps)
   // Table display with sorting, filtering, and action buttons
   ```

5. **Create Performance Management Page**:

   ```typescript
   # src/app/(admin)/performances/page.tsx
   export default function PerformancesPage()
   // Main page integrating list and modal components
   ```

**Testing Strategy**:

- **Step 4 Focus**: Write tests for YOUR performance form components and user interactions
- **Test Patterns**: Follow existing project test structure (Vitest, React Testing Library)
- **Coverage Goal**: Achieve 100% coverage for performance form logic
- **Test Files**: Place tests in `__tests__` directories alongside components
- **Testing Scope**: Focus on form validation, user interactions, and component state management
- **E2E Testing**: Implement Playwright tests following `@playwright-testing-standards.mdc` with semantic locators and Page Object Models

**Regression Protection**:

- [ ] Existing functionality remains intact
- [ ] No breaking changes to API from Iteration 2
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

**Commit Strategy**:

- Progressive commits during development
- Final commit: `feat(performance-ui): implement performance recording form with validation`

### **🎯 ITERATION 3 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] **PerformanceModal component implemented** following modal patterns from age groups/disciplines
- [ ] **PerformanceForm component implemented** with athlete search and validation
- [ ] **PerformanceList component implemented** with TanStack Table for data display
- [ ] **Athlete search integration working** with existing AthleteCombobox patterns
- [ ] **Medal selection UI implemented** with proper display of Gold/Silver/Bronze
- [ ] **Discipline filtering working** with season-based organization
- [ ] **Real-time form validation implemented** with Zod schemas and error display
- [ ] **Component tests written** with 100% coverage for form logic
- [ ] **Playwright E2E tests implemented** following `@playwright-testing-standards.mdc` with semantic locators and Page Object Models
- [ ] Level 2 tests pass (test:coverage, build) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (UI works correctly in container)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Test files follow project patterns** (Vitest, React Testing Library, Playwright)
- [ ] **Performance form is completely functional** and ready for file upload integration
- [ ] **Modal-based workflow matches** existing patterns (age groups, disciplines)
- [ ] **Table display follows** TanStack Table patterns with proper styling
- [ ] Documentation updated if needed
- [ ] Execution plan progress dashboard updated with iteration completion

# 🚀 **ITERATION 4: FILE UPLOAD SYSTEM**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement secure file upload system for performance proof using shadcn/ui + react-dropzone with comprehensive OWASP-compliant validation, drag-and-drop functionality, and secure storage integration with the performance recording form from Iteration 3.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: Iterations 1 (Medal System), 2 (Performance API), 3 (Performance Form UI)
**Scope**: Single, atomic, testable file upload enhancement for performance proof

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration4-file-upload-system
```

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - file upload follows existing form component patterns with shadcn/ui design system
- **Pattern Compliance Check**: Confirm implementation uses established shadcn/ui + react-hook-form patterns from existing components
- **Architecture Verification**: Ensure file upload integrates with existing ComponentCard and form validation patterns
- Create PerformanceProofUpload component combining shadcn/ui design with react-dropzone functionality
- Implement OWASP-compliant file validation (MIME type + extension + content validation)
- Add drag-and-drop functionality with progress indicators and file preview
- Implement secure file storage API endpoints with comprehensive validation
- **DO NOT write tests yet** - focus on implementation first
- **DO NOT reinvent file upload** - leverage react-dropzone for proven security and UX patterns

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Fix issues found in Level 1 testing
- Improve implementation based on feedback
- **Write comprehensive unit tests** for file upload components and validation logic
- **Write file upload API tests** with mock file uploads and validation scenarios
- Follow existing test patterns in the project (Vitest, React Testing Library)
- Achieve 100% test coverage for new file upload logic

**Testing Focus**: Test YOUR file upload code - validation functions, security checks, and file handling logic. Do NOT test Next.js file handling, external storage services, or framework functionality.

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage (including new tests)
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate file upload system in containerized environment
# Test file upload through performance form
# Verify file validation and storage work correctly
# Test file download and access controls

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

**STEP 1: Review the "ITERATION 4 COMPLETION CRITERIA" section at the bottom of this iteration.**

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
  - Evidence: **********************\_\_\_**********************

- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: **********************\_\_\_**********************

- [ ] **TypeScript compilation clean** with no type errors
  - Evidence: **********************\_\_\_**********************

**DOCUMENTATION & PLAN UPDATES:**

- [ ] **Execution plan updated** with iteration completion status
  - Evidence: Progress dashboard shows iteration marked complete

- [ ] **Implementation deviations documented** (if any)
  - Evidence: **********************\_\_\_**********************

- [ ] **Next iteration dependencies** confirmed ready
  - Evidence: **********************\_\_\_**********************

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** in the iteration-specific section below
- [ ] **All regression and quality checks passed**
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS ALL CHECKBOXES ABOVE ARE COMPLETED**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark iteration as completed in progress dashboard
# Update overall progress percentage
# Set next iteration as ready to begin
git add .cursor/instructions/003_plans/06_performance_recording_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 4 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(file-upload): implement secure file upload for performance proof"
git push -u origin feat/iteration4-file-upload-system
```

**PR Summary (Copy for manual PR creation):**

```markdown
## File Upload System for Performance Proof

**Type:** Feature
**Scope:** Security/File Handling

### Changes

- Enhanced FileInput component for performance proof uploads
- Implemented secure file storage API endpoints with validation
- Added file type and size validation logic
- Integrated file upload with performance recording form
- Added comprehensive security controls and access management

### Testing

- File upload components and validation comprehensively tested
- Security validation scenarios covered with edge cases
- File storage and retrieval functionality verified
- All existing tests continue to pass

### Dependencies

- Iteration 3 (Performance Form UI) - file upload integration verified
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration4-file-upload-system
```

## **📋 ITERATION 4 IMPLEMENTATION**

**Rule Reference**: `bp-security-standards.mdc`, `nextjs-structure-standards.mdc`, `bp-testing-standards.mdc`, `ui-tailwind-css-standards.mdc`

**Files to Create/Modify**:

- `src/components/performance/PerformanceProofUpload.tsx` (new - shadcn/ui + react-dropzone component)
- `src/app/api/upload/performance-proof/route.ts` (new - secure file upload API)
- `src/app/api/files/[id]/route.ts` (new - file download API with access controls)
- `src/lib/fileValidation.ts` (new - OWASP-compliant validation functions)
- `src/lib/fileStorage.ts` (new - secure file storage utilities)
- `src/components/performance/__tests__/PerformanceProofUpload.test.tsx` (new - component tests)
- `src/app/api/upload/__tests__/performance-proof.test.ts` (new - API tests)
- `package.json` (modify - add react-dropzone@14.3.8 dependency)

**Implementation Steps**:

1. **Install react-dropzone Dependency**:

   ```powershell
   # Add react-dropzone to project dependencies
   npm install react-dropzone@14.3.8
   npm install @types/file-type  # For enhanced MIME type validation
   ```

2. **Create OWASP-Compliant File Validation**:

   ```typescript
   # src/lib/fileValidation.ts
   export function validateFileType(file: File): Promise<boolean>  // MIME + extension + content validation
   export function validateFileSize(file: File, maxSize: number): boolean
   export function sanitizeFileName(fileName: string): string  // Prevent path traversal
   export function generateSecureFilename(): string  // UUID-based naming
   ```

3. **Create shadcn/ui + react-dropzone Component**:

   ```typescript
   # src/components/performance/PerformanceProofUpload.tsx
   import { useDropzone } from 'react-dropzone'
   import { Button } from '@/components/ui/button'
   import { Progress } from '@/components/ui/progress'

   export function PerformanceProofUpload({ onFileUploaded, initialFile }: UploadProps)
   // Combines shadcn/ui design system with react-dropzone functionality
   // Implements drag-and-drop, progress tracking, file preview
   ```

4. **Create Secure File Upload API**:

   ```typescript
   # src/app/api/upload/performance-proof/route.ts
   export async function POST(request: Request)
   // Server-side validation using fileValidation functions
   // Secure file storage with access controls
   // Returns secure file URL and metadata
   ```

5. **Create File Storage Utilities**:

   ```typescript
   # src/lib/fileStorage.ts
   export function storePerformanceProof(file: File, performanceId: string): Promise<string>
   export function getSecureFileUrl(fileId: string, userId: string): Promise<string>
   export function deletePerformanceProof(fileId: string): Promise<void>
   // Implements club-based access controls
   ```

6. **Create File Download API with Access Controls**:

   ```typescript
   # src/app/api/files/[id]/route.ts
   export async function GET(request: Request, { params }: { params: { id: string } })
   // Validates user permissions before serving files
   // Implements club-based access control
   ```

**Testing Strategy**:

- **Step 4 Focus**: Write tests for YOUR file upload and validation logic using mocked react-dropzone and File API
- **Test Patterns**: Follow existing project test structure (Vitest, React Testing Library with file upload mocks)
- **Coverage Goal**: Achieve 100% coverage for file upload logic and OWASP validation functions
- **Test Files**: Place tests in `__tests__` directories alongside components and APIs
- **Testing Scope**: Focus on validation logic, security checks, and file handling - test YOUR code only. Do NOT test react-dropzone, File API, or framework functionality
- **Security Testing**: Test OWASP-compliant validation (MIME type spoofing, size limits, filename sanitization), access controls
- **Mock Strategy**: Mock react-dropzone hooks, File constructor, and FormData for isolated testing

**Regression Protection**:

- [ ] Existing functionality remains intact
- [ ] No breaking changes to performance form from Iteration 3
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

**Commit Strategy**:

- Progressive commits during development
- Final commit: `feat(file-upload): implement secure file upload for performance proof`

### **🎯 ITERATION 4 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] **react-dropzone@14.3.8 dependency installed** and integrated successfully
- [ ] **OWASP-compliant file validation implemented** with MIME + extension + content validation
- [ ] **PerformanceProofUpload component implemented** combining shadcn/ui design with react-dropzone functionality
- [ ] **Drag-and-drop functionality working** with progress indicators and file preview
- [ ] **Secure file upload API implemented** with server-side validation and access controls
- [ ] **File storage utilities created** with club-based access management and secure URLs
- [ ] **File download API implemented** with proper permission validation
- [ ] **Security controls implemented** following `bp-security-standards.mdc` and OWASP guidelines
- [ ] **Component tests written** with 100% coverage for upload logic using mocked react-dropzone
- [ ] **API tests written** with mock file upload scenarios and security validation tests
- [ ] **Security testing completed** for MIME type spoofing, size limits, filename sanitization
- [ ] Level 2 tests pass (test:coverage, build) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (file upload with react-dropzone works in container)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Test files follow project patterns** (Vitest with react-dropzone and File API mocking)
- [ ] **File upload is completely functional** and ready for record detection integration
- [ ] **Integration working** with performance recording form from Iteration 3
- [ ] **shadcn/ui design consistency** maintained across upload component
- [ ] Documentation updated if needed
- [ ] Execution plan progress dashboard updated with iteration completion

# 🚀 **ITERATION 5: AUTOMATIC RECORD DETECTION**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement automatic club record and personal best detection system with background calculation, historical preservation, and record flag updates building on the complete performance system from previous iterations.

**Duration Estimate**: 4-5 hours in single session
**Dependencies**: Iterations 1-4 (Complete performance recording system)
**Scope**: Single, atomic, testable record calculation enhancement

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration5-automatic-record-detection
```

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - record detection follows established business logic patterns
- **Pattern Compliance Check**: Confirm implementation uses established validation and calculation patterns
- **Architecture Verification**: Ensure record calculation integrates with existing performance model
- Implement record calculation algorithms for club records and personal bests
- Add background processing logic for record updates
- Implement historical record preservation with was_record flags
- **DO NOT write tests yet** - focus on implementation first
- **DO NOT modify existing models** - enhance usage of existing record flags in Performance model

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Fix issues found in Level 1 testing
- Improve implementation based on feedback
- **Write comprehensive unit tests** for record calculation algorithms and business logic
- **Write algorithm tests** for record detection workflow with various scenarios using mocked data
- Follow existing test patterns in the project (Vitest, React Testing Library)
- Achieve 100% test coverage for new record detection logic

**Testing Focus**: Test YOUR record calculation code - algorithms, business logic, and data updates using mocked data inputs. Do NOT test Prisma ORM, actual database operations, or framework functionality.

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage (including new tests)
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate record detection in containerized environment
# Create test performances and verify record calculation
# Test club record and personal best detection
# Verify record flags are updated correctly

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

**STEP 1: Review the "ITERATION 5 COMPLETION CRITERIA" section at the bottom of this iteration.**

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
  - Evidence: **********************\_\_\_**********************

- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: **********************\_\_\_**********************

- [ ] **TypeScript compilation clean** with no type errors
  - Evidence: **********************\_\_\_**********************

**DOCUMENTATION & PLAN UPDATES:**

- [ ] **Execution plan updated** with iteration completion status
  - Evidence: Progress dashboard shows iteration marked complete

- [ ] **Implementation deviations documented** (if any)
  - Evidence: **********************\_\_\_**********************

- [ ] **Next iteration dependencies** confirmed ready
  - Evidence: **********************\_\_\_**********************

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** in the iteration-specific section below
- [ ] **All regression and quality checks passed**
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS ALL CHECKBOXES ABOVE ARE COMPLETED**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark iteration as completed in progress dashboard
# Update overall progress percentage
# Set next iteration as ready to begin
git add .cursor/instructions/003_plans/06_performance_recording_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 5 completion"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(records): implement automatic record detection and calculation"
git push -u origin feat/iteration5-automatic-record-detection
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Automatic Record Detection System

**Type:** Feature
**Scope:** Business Logic/Backend

### Changes

- Implemented automatic club record and personal best detection algorithms
- Added background processing for record calculation and updates
- Implemented historical record preservation with was_record flags
- Added comprehensive record notification system
- Enhanced performance creation workflow with record detection

### Testing

- Record calculation algorithms comprehensively tested with various scenarios
- Historical record preservation logic validated
- Performance integration with record detection verified
- All existing tests continue to pass

### Dependencies

- Iterations 1-4 (Complete performance recording system) - full integration verified
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration5-automatic-record-detection
```

## **📋 ITERATION 5 IMPLEMENTATION**

**Rule Reference**: `db-client-standards.mdc`, `bp-testing-standards.mdc`, `logging-standards.mdc`

**Files to Create/Modify**:

- `src/lib/recordCalculation.ts` (new - record calculation algorithms)
- `src/lib/recordDetection.ts` (new - record detection logic)
- `src/app/api/performances/route.ts` (modify - integrate record detection)
- `src/app/api/records/club/route.ts` (new - club records API)
- `src/app/api/records/personal/route.ts` (new - personal bests API)
- `src/lib/__tests__/recordCalculation.test.ts` (new - algorithm tests)
- `src/lib/__tests__/recordDetection.test.ts` (new - detection tests)
- `src/components/performance/RecordNotification.tsx` (new - record notification component)

**Implementation Steps**:

1. **Create Record Calculation Algorithms**:

   ```typescript
   # src/lib/recordCalculation.ts
   export function calculateClubRecord(performance: Performance): Promise<boolean>
   export function calculatePersonalBest(performance: Performance): Promise<boolean>
   export function updatePreviousRecords(performance: Performance): Promise<void>
   export function preserveHistoricalRecords(performance: Performance): Promise<void>
   ```

2. **Implement Record Detection Logic**:

   ```typescript
   # src/lib/recordDetection.ts
   export function detectNewRecords(performance: Performance): Promise<RecordDetectionResult>
   export function processRecordUpdates(performance: Performance): Promise<void>
   export function generateRecordNotifications(records: RecordDetectionResult): RecordNotification[]
   ```

3. **Create Club Records API**:

   ```typescript
   # src/app/api/records/club/route.ts
   export async function GET(request: Request)
   // Retrieve current club records with filtering
   ```

4. **Create Personal Bests API**:

   ```typescript
   # src/app/api/records/personal/route.ts
   export async function GET(request: Request)
   // Retrieve personal bests for athlete or all athletes
   ```

5. **Enhance Performance Creation with Record Detection**:

   ```typescript
   # src/app/api/performances/route.ts (modify)
   // Integrate record detection into performance creation workflow
   // Add record notification generation
   ```

**Testing Strategy**:

- **Step 4 Focus**: Write tests for YOUR record calculation and detection algorithms
- **Test Patterns**: Follow existing project test structure (Vitest with comprehensive scenarios)
- **Coverage Goal**: Achieve 100% coverage for record calculation logic
- **Test Files**: Place tests in `__tests__` directories alongside source files
- **Testing Scope**: Focus on calculation algorithms, business logic, and data integrity - test YOUR code only. Do NOT test Prisma ORM, database queries, or framework functionality
- **Scenario Testing**: Test various record scenarios with edge cases and historical data

**Regression Protection**:

- [ ] Existing functionality remains intact
- [ ] No breaking changes to performance system from previous iterations
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

**Commit Strategy**:

- Progressive commits during development
- Final commit: `feat(records): implement automatic record detection and calculation`

### **🎯 ITERATION 5 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] **Record calculation algorithms implemented** with comprehensive business logic
- [ ] **Club record detection working** correctly for all discipline/age group combinations
- [ ] **Personal best detection working** correctly for individual athletes
- [ ] **Historical record preservation implemented** with was_record flags
- [ ] **Background processing integrated** into performance creation workflow
- [ ] **Record notification system implemented** with appropriate user feedback
- [ ] **Club records API created** with filtering and sorting capabilities
- [ ] **Personal bests API created** with athlete-specific data
- [ ] **Algorithm tests written** with 100% coverage for calculation logic
- [ ] **Algorithm tests written** for complete record detection workflow using mocked data
- [ ] Level 2 tests pass (test:coverage, build) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (record detection works in container)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Test files follow project patterns** (Vitest with comprehensive scenarios)
- [ ] **Record detection is completely functional** and ready for team performance integration
- [ ] **Performance integration working** seamlessly with record calculation
- [ ] **Data integrity maintained** with proper transaction handling
- [ ] Documentation updated if needed
- [ ] Execution plan progress dashboard updated with iteration completion

# 🚀 **ITERATION 6: TEAM PERFORMANCE SUPPORT**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement team performance support with team member selection, validation, and shared medal association building on the complete performance recording system with record detection.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: Iterations 1-5 (Complete performance recording system with record detection)
**Scope**: Single, atomic, testable team performance enhancement

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration6-team-performance-support
```

### **Step 2: Develop (Initial)**

- **FIRST**: Verify pattern compliance - team performance follows established form patterns
- **Pattern Compliance Check**: Confirm implementation uses established multi-select and validation patterns
- **Architecture Verification**: Ensure team performance integrates with existing performance model
- Implement team member selection UI component with multi-athlete selection
- Add team performance validation logic for required team size
- Enhance performance recording form for team disciplines
- **DO NOT write tests yet** - focus on implementation first
- **DO NOT modify existing models** - enhance usage of existing team_size field in Discipline model

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Fix issues found in Level 1 testing
- Improve implementation based on feedback
- **Write comprehensive unit tests** for team performance components and validation logic
- **Write E2E tests** for complete team performance recording workflow
- Follow existing test patterns in the project (Vitest, React Testing Library, Playwright)
- Achieve 100% test coverage for new team performance logic

**Testing Focus**: Test YOUR team performance code - selection logic, validation functions, and UI components. Do NOT test existing multi-select libraries, React framework, or external library functionality.

**E2E Testing Focus**: Implement Playwright tests for complete team performance recording workflow.

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage (including new tests)
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate team performance in containerized environment
# Test team member selection and validation
# Verify team performance creation with medals
# Test team performance record detection

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

**STEP 1: Review the "ITERATION 6 COMPLETION CRITERIA" section at the bottom of this iteration.**

**STEP 2: Verify EVERY item in that section with evidence before proceeding.**

**ITERATION COMPLETION CRITERIA VERIFICATION:**

⚠️ **Go to the "🎯 ITERATION 6 COMPLETION CRITERIA" section below and check off EVERY item before proceeding.**

- [ ] **I have reviewed and verified ALL items in the "🎯 ITERATION 6 COMPLETION CRITERIA" section**
- [ ] **Every checkbox in that section is completed**
- [ ] **The iteration is ready for progress tracking and PR creation**

**REGRESSION & QUALITY VERIFICATION:**

- [ ] **No breaking changes** to existing functionality
  - Evidence: Existing test suite: **_/_** passing (same as baseline)

- [ ] **No performance degradation** in existing features
  - Evidence: **********************\_\_\_**********************

- [ ] **All npm scripts working** (test, build, lint, format)
  - Evidence: **********************\_\_\_**********************

- [ ] **TypeScript compilation clean** with no type errors
  - Evidence: **********************\_\_\_**********************

**DOCUMENTATION & PLAN UPDATES:**

- [ ] **Execution plan updated** with iteration completion status
  - Evidence: Progress dashboard shows iteration marked complete

- [ ] **Implementation deviations documented** (if any)
  - Evidence: **********************\_\_\_**********************

- [ ] **Next iteration dependencies** confirmed ready
  - Evidence: **********************\_\_\_**********************

**FINAL SIGN-OFF:**

- [ ] **ALL completion criteria verified** in the iteration-specific section below
- [ ] **All regression and quality checks passed**
- [ ] **Iteration is COMPLETE** and ready for progress tracking update
- [ ] **Ready to proceed** with Step 7: Update Progress Tracking

**⚠️ DO NOT PROCEED TO PROGRESS TRACKING UNLESS ALL CHECKBOXES ABOVE ARE COMPLETED**

### **Step 7: Update Progress Tracking**

```powershell
# Update execution plan with iteration completion
# Mark iteration as completed in progress dashboard
# Update overall progress percentage (100% complete)
# Update final completion status
git add .cursor/instructions/003_plans/06_performance_recording_execution_plan.md
git commit -m "docs: update progress tracking for Iteration 6 completion - PLAN COMPLETE"
```

### **Step 8: Create PR & Merge**

```powershell
# Push feature branch with concise commit
git add .
git commit -m "feat(team-performance): implement team performance support with member selection"
git push -u origin feat/iteration6-team-performance-support
```

**PR Summary (Copy for manual PR creation):**

```markdown
## Team Performance Support

**Type:** Feature
**Scope:** UI/Business Logic

### Changes

- Implemented team member selection UI component with multi-athlete selection
- Added team performance validation logic for required team size
- Enhanced performance recording form for team disciplines
- Integrated team performance with medal system and record detection
- Added comprehensive team performance workflow tests

### Testing

- Team performance components comprehensively tested with validation scenarios
- Complete team performance recording workflow verified with E2E tests
- Team medal association and record detection tested
- All existing tests continue to pass

### Dependencies

- Iterations 1-5 (Complete performance recording system) - full integration verified
- **COMPLETES USER STORY**: All acceptance criteria from 06_performance_recording.md fulfilled
```

```powershell
# After PR approval and merge, clean up
git checkout main
git pull origin main
git branch -d feat/iteration6-team-performance-support
```

## **📋 ITERATION 6 IMPLEMENTATION**

**Rule Reference**: `ui-tailwind-css-standards.mdc`, `bp-testing-standards.mdc`, `nextjs-structure-standards.mdc`

**Files to Create/Modify**:

- `src/components/performance/TeamMemberSelector.tsx` (new - multi-athlete selection component)
- `src/components/performance/PerformanceForm.tsx` (modify - integrate team support)
- `src/lib/teamPerformanceValidation.ts` (new - team validation functions)
- `src/app/api/performances/team/route.ts` (new - team performance API)
- `src/components/performance/__tests__/TeamMemberSelector.test.tsx` (new - component tests)
- `src/lib/__tests__/teamPerformanceValidation.test.ts` (new - validation tests)
- `tests/team-performance-recording.spec.ts` (new - E2E tests)

**Implementation Steps**:

1. **Create Team Member Selector Component**:

   ```typescript
   # src/components/performance/TeamMemberSelector.tsx
   export function TeamMemberSelector({ teamSize, onSelectionChange, selectedMembers }: TeamSelectorProps)
   // Multi-athlete selection with validation for team size
   ```

2. **Enhance Performance Form for Team Support**:

   ```typescript
   # src/components/performance/PerformanceForm.tsx (modify)
   // Add conditional team member selection
   // Integrate team size validation
   // Handle team performance submission
   ```

3. **Create Team Performance Validation Functions**:

   ```typescript
   # src/lib/teamPerformanceValidation.ts
   export function validateTeamSize(selectedMembers: string[], requiredSize: number): boolean
   export function validateTeamMembers(memberIds: string[]): Promise<boolean>
   export function createTeamPerformance(data: TeamPerformanceData): Promise<Performance>
   ```

4. **Create Team Performance API**:

   ```typescript
   # src/app/api/performances/team/route.ts
   export async function POST(request: Request)
   // Handle team performance creation with member association
   ```

5. **Add E2E Tests for Team Performance**:

   ```typescript
   # tests/team-performance-recording.spec.ts
   // Complete workflow test for team performance recording
   // Validation scenarios for team size and member selection
   ```

**Testing Strategy**:

- **Step 4 Focus**: Write tests for YOUR team performance components and validation logic
- **Test Patterns**: Follow existing project test structure (Vitest, React Testing Library, Playwright)
- **Coverage Goal**: Achieve 100% coverage for team performance logic
- **Test Files**: Place tests in `__tests__` directories alongside components
- **Testing Scope**: Focus on team selection logic, validation functions, and UI interactions - test YOUR code only. Do NOT test React components library, framework, or external dependencies
- **E2E Testing**: Test complete team performance recording workflow with various team sizes

**Regression Protection**:

- [ ] Existing functionality remains intact
- [ ] No breaking changes to individual performance recording
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

**Commit Strategy**:

- Progressive commits during development
- Final commit: `feat(team-performance): implement team performance support with member selection`

### **🎯 ITERATION 6 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] **TeamMemberSelector component implemented** with multi-athlete selection and validation
- [ ] **Performance form enhanced** for team disciplines with conditional team member selection
- [ ] **Team performance validation implemented** with team size and member validation
- [ ] **Team performance API created** for handling team performance creation
- [ ] **Team medal association working** with shared medals for all team members
- [ ] **Team performance record detection integrated** with existing record calculation system
- [ ] **Component tests written** with 100% coverage for team selection logic
- [ ] **Validation tests written** for team size and member validation functions
- [ ] **E2E tests implemented** for complete team performance recording workflow
- [ ] Level 2 tests pass (test:coverage, build) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (team performance works in container)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Test files follow project patterns** (Vitest, React Testing Library, Playwright)
- [ ] **Team performance is completely functional** and integrates seamlessly with existing system
- [ ] **Individual performance recording unaffected** by team performance additions
- [ ] **Complete user story fulfilled** - all acceptance criteria from 06_performance_recording.md met
- [ ] Documentation updated if needed
- [ ] Execution plan progress dashboard updated with iteration completion and plan completion status

## 📚 **APPENDIX: SESSION MANAGEMENT**

### **Starting a New Session**

1. **Context Recovery**: Read progress dashboard and identify current iteration
2. **Git Status Check**: Verify branch and working directory status
3. **Status Check**: Update iteration checkboxes based on actual completion
4. **Environment Verification**: Run `npm run quality:check` for quick validation
5. **Iteration Identification**: Find next uncompleted iteration

### **Iteration Workflow (Per Session)**

1. **Branch & Pull** → Start fresh from main: `git checkout main && git pull origin main`
2. **Create Branch** → `git checkout -b feat/iterationX-feature-name`
3. **Develop** → Implement initial feature functionality
4. **Test L1** → `npm run quality:check && npm run test:run`
5. **Develop** → Refine based on immediate feedback
6. **Test L2** → `npm run test:coverage && npm run build`
7. **Test L3** → `npm run test:all && npm run validate:pre-docker`
8. **Docker Validation** → `docker-compose up --build -d` + feature validation
9. **⚠️ MANDATORY: Verify Completion Criteria** → Review and verify EVERY item in the "🎯 ITERATION X COMPLETION CRITERIA" section
10. **Update Progress** → Update execution plan and commit progress tracking changes
11. **Create PR** → Push branch and create detailed pull request

### **Quality Gates (4-Level Testing Pyramid)**

- **Level 1**: Immediate feedback (quality:check, test:run)
- **Level 2**: Integration validation (test:coverage, build)
- **Level 3**: Release readiness (test:all, validate:pre-docker)
- **Level 4**: Docker deployment validation (containerized environment testing)

### **Emergency Recovery**

If issues occur during an iteration:

1. Check git status: `git status && git log --oneline -5`
2. Review test failures: Check npm script output logs
3. Run regression check: `npm run test:all` to verify no breaking changes
4. Consult specific rule documentation for guidance
5. Rollback to iteration start if needed: `git checkout main && git branch -D current-branch`

### **Session Continuity Rules**

- Each iteration should complete in a single session (2-5 hours)
- If incomplete, document exact stopping point in progress dashboard
- Always end sessions with a clean git state (committed or stashed)
- Next session starts with fresh main pull and context recovery
