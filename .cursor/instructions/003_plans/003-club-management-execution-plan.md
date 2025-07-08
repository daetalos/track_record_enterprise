# Club Management & Context Switching Implementation Plan

**User Story 02: Club Management & Context Switching → Foundation Feature Implementation**

## 📊 **PROGRESS TRACKING DASHBOARD**

### **Overall Status**

- **Current Iteration**: [ ] Iteration 1 | [ ] Iteration 2 | [ ] Iteration 3 | [ ] Iteration 4 | [ ] Iteration 5
- **Overall Progress**: 0% Complete (0 of 5 iterations completed)
- **Last Session Date**: [To be updated]
- **Status**: Ready to begin implementation

### **Iteration Progress Summary**

| Iteration                         | Feature                 | Status                                                | Duration Est. | Dependencies |
| --------------------------------- | ----------------------- | ----------------------------------------------------- | ------------- | ------------ |
| **Iteration 1**: Database Schema  | Club & UserClub models  | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | None         |
| **Iteration 2**: State Management | Zustand club context    | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 1  |
| **Iteration 3**: API Endpoints    | Club selection APIs     | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 2  |
| **Iteration 4**: UI Components    | Club selector interface | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 2-3 hours     | Iteration 3  |
| **Iteration 5**: Data Isolation   | Middleware integration  | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Iteration 4  |

### **Quick Iteration Status**

**Iteration 1 - Database Schema & Models**

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

---

## 📋 **PLAN OVERVIEW**

### **Current State Assessment**

- **Project Type**: NextJS 15 enterprise dashboard with complete modernization foundation
- **Foundation Quality**: Excellent (authentication, testing, quality tools, Docker all implemented)
- **Enterprise Readiness**: Strong foundation, needs club management layer

### **Target State**

- **Primary Goals**: Multi-club context management with secure data isolation
- **Standards Compliance**: db-schema-standards.mdc, state-zustand-management.mdc, typescript-nextjs-standards.mdc
- **Success Metrics**: Users can switch between clubs, data is properly isolated, session persistence works

### **Implementation Strategy**

- **Approach**: Atomic iterations with continuous testing
- **Workflow**: Branch → Develop → Test → Develop → Test → Release → PR
- **Session Support**: Plan designed for multi-session execution
- **Testing Integration**: Leverages existing npm scripts for consistent validation

---

## 🔍 **CURRENT STATE ANALYSIS**

### ✅ **EXISTING STRENGTHS**

- NextJS 15 with App Router and TypeScript ✅
- Complete authentication system with NextAuth + Prisma ✅
- Database setup with PostgreSQL and Prisma ORM ✅
- Comprehensive testing infrastructure (Vitest, Playwright, React Testing Library) ✅
- Quality automation (ESLint, Prettier, Husky pre-commit hooks) ✅
- Docker containerization and production deployment ready ✅
- Available npm scripts: `quality:check`, `test:run`, `test:coverage`, `test:all` ✅

### ❌ **CRITICAL GAPS IDENTIFIED**

**Database Schema (db-schema-standards.mdc)**

- No Club entity model in Prisma schema
- No UserClub relationship for multi-club access control
- Missing club context validation in database layer

**State Management (state-zustand-management.mdc)**

- No Zustand installed for client-side state management
- No club context store implementation
- No session persistence for selected club context

**API Layer (typescript-nextjs-standards.mdc)**

- No club selection API endpoints
- No club validation middleware
- Missing club context filtering in data queries

**User Interface (nextjs-structure-standards.mdc)**

- No club selector component in navigation
- No club switching functionality
- Missing club context display elements

**Data Isolation (bp-security-standards.mdc)**

- No middleware to enforce club-based data filtering
- No protection against cross-club data access
- Missing club context validation in API routes

---

# 🚀 **ITERATION 1: DATABASE SCHEMA & MODELS**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement Club and UserClub database models in Prisma schema to establish the foundation for multi-club support with proper user-club relationships.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: None (foundation iteration)
**Scope**: Database schema, models, and basic validation

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration1-club-database-schema
```

### **Step 2: Develop (Initial)**

- Add Club model to Prisma schema
- Add UserClub junction table for many-to-many relationship
- Configure proper indexes and constraints

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Run database migration and generate Prisma client
- Create basic database queries for club operations
- Add TypeScript types for club entities

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate database schema changes
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate database schema in containerized environment
docker-compose exec db psql -U postgres -d modern_web_app -c "\dt"  # List tables
docker-compose exec db psql -U postgres -d modern_web_app -c "\d clubs"  # Check Club table structure
docker-compose exec db psql -U postgres -d modern_web_app -c "\d user_clubs"  # Check UserClub table structure

# Test application startup with new schema
curl http://localhost:3000/api/health || echo "Health check endpoint test"

# Clean up Docker environment
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
# Push feature branch
git push -u origin feat/iteration1-club-database-schema

# Create PR with detailed description
gh pr create --title "feat(database): implement club and user-club database schema" --body "Implements Club and UserClub models with proper relationships and constraints for multi-club support"

# After review and approval, update main
git checkout main
git pull origin main
git branch -d feat/iteration1-club-database-schema
```

## **📋 ITERATION 1 IMPLEMENTATION**

**Rule Reference**: `db-schema-standards.mdc`

**Files to Create/Modify**:

- `prisma/schema.prisma` (modify - add Club and UserClub models)
- `src/lib/db.ts` (modify - add club-related queries)
- `src/types/club.ts` (new - TypeScript types)

**Implementation Steps**:

1. Add Club model with id, name, description, createdAt, updatedAt
2. Add UserClub model for many-to-many user-club relationships
3. Configure unique constraints and indexes for performance
4. Run `npx prisma migrate dev --name add-club-models`
5. Generate Prisma client: `npx prisma generate`
6. Create TypeScript interfaces for Club entities
7. Add basic database query functions for clubs

**Regression Protection**:

- [ ] Existing User authentication functionality remains intact
- [ ] No breaking changes to current database schema
- [ ] Migration runs successfully without data loss

**Commit Strategy**:

- Commit after schema changes: `feat(db): add Club and UserClub models to schema`
- Commit after migration: `feat(db): run migration for club models`
- Commit after types: `feat(types): add TypeScript interfaces for club entities`

### **🎯 ITERATION 1 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] Level 2 tests pass (test:coverage, build)
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (containers start, database schema is accessible)
- [ ] Database migration executes successfully
- [ ] Prisma client generates without errors
- [ ] TypeScript compilation succeeds with new models
- [ ] No regression in existing authentication functionality

---

# 🚀 **ITERATION 2: CLUB CONTEXT STATE MANAGEMENT**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement Zustand-based club context state management with session persistence to handle club selection and switching functionality.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 1 (Database Schema)
**Scope**: State management, session handling, and club context provider

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration2-club-context-state
```

### **Step 2: Develop (Initial)**

- Install Zustand: `npm install zustand`
- Create club context Zustand store
- Implement session persistence for club selection

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Create club context provider component
- Add React hooks for club context access
- Implement club switching logic with validation

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate state management functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate Zustand integration in containerized environment
curl http://localhost:3000 -I  # Test application loads
# Manual validation: Open browser, check localStorage persistence
# Manual validation: Verify club context provider loads without errors

# Check for hydration and SSR compatibility
docker-compose logs web | grep -i "error\|warning" | head -10

# Clean up Docker environment
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
# Push feature branch
git push -u origin feat/iteration2-club-context-state

# Create PR with detailed description
gh pr create --title "feat(state): implement Zustand club context management with session persistence" --body "Adds club context state management, session persistence, and provider component for club switching"

# After review and approval, update main
git checkout main
git pull origin main
git branch -d feat/iteration2-club-context-state
```

## **📋 ITERATION 2 IMPLEMENTATION**

**Rule Reference**: `state-zustand-management.mdc`

**Files to Create/Modify**:

- `package.json` (modify - add Zustand dependency)
- `src/stores/clubStore.ts` (new - Zustand club context store)
- `src/context/ClubContext.tsx` (new - React context provider)
- `src/hooks/useClub.ts` (new - custom hooks for club operations)
- `src/types/club.ts` (modify - add state management types)

**Implementation Steps**:

1. Install Zustand state management library
2. Create clubStore with selectedClub, userClubs, and switching functions
3. Implement localStorage persistence for selected club
4. Create ClubContext provider component
5. Add useClub hooks for accessing club state
6. Integrate session-based club persistence
7. Add TypeScript interfaces for club state

**Regression Protection**:

- [ ] Existing authentication flow remains intact
- [ ] No breaking changes to current state management
- [ ] Club context gracefully handles missing data

**Commit Strategy**:

- Commit after Zustand setup: `feat(state): add Zustand club context store`
- Commit after provider: `feat(context): create ClubContext provider component`
- Commit after hooks: `feat(hooks): add useClub hooks for state access`

### **🎯 ITERATION 2 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] Level 2 tests pass (test:coverage, build)
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (application loads, no SSR/hydration issues)
- [ ] Zustand store functions correctly with TypeScript
- [ ] Session persistence saves and restores club selection
- [ ] Club context provider integrates without errors
- [ ] Hooks provide proper club state access

---

# 🚀 **ITERATION 3: CLUB API ENDPOINTS & SERVICES**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement API endpoints for club operations including fetching user clubs, setting club context, and validating club access permissions.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 2 (State Management)
**Scope**: API routes, validation, and server-side club operations

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration3-club-api-endpoints
```

### **Step 2: Develop (Initial)**

- Create API route for fetching user's clubs
- Implement club selection validation endpoint
- Add server-side club access verification

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Add API route for setting club context
- Implement proper error handling and validation
- Create service functions for club operations

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate API endpoints functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate API endpoints in containerized environment
curl http://localhost:3000/api/clubs -H "Authorization: Bearer [token]" || echo "GET clubs endpoint test"
curl -X POST http://localhost:3000/api/clubs/select -H "Content-Type: application/json" -d '{"clubId":"test"}' || echo "POST select endpoint test"

# Test API endpoint accessibility and error handling
curl http://localhost:3000/api/clubs -I  # Check endpoint is accessible
docker-compose logs web | grep -i "API\|endpoint\|clubs" | tail -5

# Clean up Docker environment
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
# Push feature branch
git push -u origin feat/iteration3-club-api-endpoints

# Create PR with detailed description
gh pr create --title "feat(api): implement club management API endpoints with validation" --body "Adds API routes for club selection, validation, and server-side club operations"

# After review and approval, update main
git checkout main
git pull origin main
git branch -d feat/iteration3-club-api-endpoints
```

## **📋 ITERATION 3 IMPLEMENTATION**

**Rule Reference**: `typescript-nextjs-standards.mdc`

**Files to Create/Modify**:

- `src/app/api/clubs/route.ts` (new - GET user clubs endpoint)
- `src/app/api/clubs/select/route.ts` (new - POST club selection endpoint)
- `src/lib/services/clubService.ts` (new - club business logic)
- `src/lib/validations/club.ts` (new - Zod validation schemas)

**Implementation Steps**:

1. Create GET /api/clubs endpoint to fetch user's accessible clubs
2. Create POST /api/clubs/select endpoint for club context switching
3. Add Zod validation schemas for club-related requests
4. Implement clubService functions for database operations
5. Add proper error handling and HTTP status codes
6. Create API response types and interfaces
7. Add server-side session handling for club context

**Regression Protection**:

- [ ] Existing API routes continue to function normally
- [ ] Authentication middleware remains intact
- [ ] No breaking changes to current API structure

**Commit Strategy**:

- Commit after club fetch API: `feat(api): add GET /api/clubs endpoint`
- Commit after selection API: `feat(api): add POST /api/clubs/select endpoint`
- Commit after services: `feat(services): create clubService for business logic`

### **🎯 ITERATION 3 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] Level 2 tests pass (test:coverage, build)
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (API endpoints accessible and functional)
- [ ] GET /api/clubs returns user's accessible clubs correctly
- [ ] POST /api/clubs/select validates and sets club context
- [ ] Proper error handling for unauthorized club access
- [ ] API responses follow consistent TypeScript interfaces

---

# 🚀 **ITERATION 4: CLUB SELECTOR UI COMPONENT**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement club selector UI component with dropdown interface, club switching functionality, and integration with the navigation system.

**Duration Estimate**: 2-3 hours in single session
**Dependencies**: Iteration 3 (API Endpoints)
**Scope**: UI components, user interactions, and visual feedback

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration4-club-selector-ui
```

### **Step 2: Develop (Initial)**

- Create ClubSelector dropdown component
- Implement club switching user interface
- Add loading states and error handling

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Integrate ClubSelector into navigation header
- Add club context display indicators
- Implement responsive design and accessibility

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate UI components functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate club selector UI in containerized environment
curl http://localhost:3000 -I  # Test application loads with UI components
# Manual validation: Open browser at http://localhost:3000
# Manual validation: Verify club selector renders in navigation
# Manual validation: Test club switching functionality
# Manual validation: Check responsive design on different screen sizes

# Check for component rendering issues
docker-compose logs web | grep -i "error\|hydration\|rendering" | head -10

# Clean up Docker environment
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
# Push feature branch
git push -u origin feat/iteration4-club-selector-ui

# Create PR with detailed description
gh pr create --title "feat(ui): implement club selector component with navigation integration" --body "Adds club selector dropdown, club switching UI, and navigation integration with responsive design"

# After review and approval, update main
git checkout main
git pull origin main
git branch -d feat/iteration4-club-selector-ui
```

## **📋 ITERATION 4 IMPLEMENTATION**

**Rule Reference**: `nextjs-structure-standards.mdc`, `ui-tailwind-css-standards.mdc`

**Files to Create/Modify**:

- `src/components/club/ClubSelector.tsx` (new - main club selector component)
- `src/components/club/ClubIndicator.tsx` (new - current club display)
- `src/layout/AppHeader.tsx` (modify - integrate club selector)
- `src/components/club/index.ts` (new - export barrel)

**Implementation Steps**:

1. Create ClubSelector component with dropdown functionality
2. Add ClubIndicator component to show current club
3. Implement club switching with API integration
4. Add loading spinners and error states
5. Integrate components into AppHeader navigation
6. Apply Tailwind CSS styling with responsive design
7. Add accessibility attributes (ARIA labels, keyboard navigation)

**Regression Protection**:

- [ ] Existing navigation functionality remains intact
- [ ] Header layout doesn't break on different screen sizes
- [ ] No styling conflicts with existing components

**Commit Strategy**:

- Commit after ClubSelector: `feat(ui): create ClubSelector dropdown component`
- Commit after integration: `feat(layout): integrate club selector into navigation`
- Commit after styling: `feat(ui): add responsive styling and accessibility`

### **🎯 ITERATION 4 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] Level 2 tests pass (test:coverage, build)
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (UI renders correctly, no hydration issues)
- [ ] ClubSelector renders correctly with proper styling
- [ ] Club switching triggers API calls and updates state
- [ ] Loading states and error handling work properly
- [ ] Component is accessible with keyboard navigation
- [ ] Responsive design works on mobile and desktop

---

# 🚀 **ITERATION 5: DATA ISOLATION MIDDLEWARE & INTEGRATION**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement data isolation middleware to enforce club-based filtering across all API endpoints and integrate club context validation throughout the application.

**Duration Estimate**: 3-4 hours in single session
**Dependencies**: Iteration 4 (UI Components)
**Scope**: Middleware, data filtering, security validation, and end-to-end integration

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration5-data-isolation-middleware
```

### **Step 2: Develop (Initial)**

- Create club context middleware for API routes
- Implement automatic club filtering in database queries
- Add club validation to existing endpoints

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Update existing API routes to respect club context
- Add club-based authorization checks
- Implement comprehensive error handling for unauthorized access

### **Step 5: Test (Level 2 - Integration Validation)**

```powershell
npm run test:coverage  # Unit tests with coverage
npm run build          # Verify compilation
```

### **Step 6: Test Release (Level 3 - Full Validation)**

```powershell
npm run test:all                # Complete unit + E2E tests
npm run validate:pre-docker     # Full validation pipeline
```

### **Step 6.5: Docker Deployment Validation**

```powershell
# Deploy to Docker and validate complete end-to-end functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate complete club management functionality in containerized environment
curl http://localhost:3000 -I  # Test application loads
# Manual validation: Complete end-to-end test
# Manual validation: Sign in as different users
# Manual validation: Verify club context switching works
# Manual validation: Confirm data isolation between clubs
# Manual validation: Test unauthorized club access is blocked

# Test API security and data isolation
curl http://localhost:3000/api/clubs -H "Authorization: Bearer [token]"
curl http://localhost:3000/api/clubs/select -X POST -H "Content-Type: application/json" -d '{"clubId":"unauthorized"}'

# Performance validation
docker-compose logs web | grep -i "performance\|slow\|timeout" | head -10

# Clean up Docker environment
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
# Push feature branch
git push -u origin feat/iteration5-data-isolation-middleware

# Create PR with detailed description
gh pr create --title "feat(middleware): implement club data isolation and security validation" --body "Adds middleware for club-based data filtering, authorization checks, and complete integration of club context throughout the application"

# After review and approval, update main
git checkout main
git pull origin main
git branch -d feat/iteration5-data-isolation-middleware
```

## **📋 ITERATION 5 IMPLEMENTATION**

**Rule Reference**: `bp-security-standards.mdc`, `middleware.ts` patterns

**Files to Create/Modify**:

- `src/middleware.ts` (modify - add club context validation)
- `src/lib/middleware/clubAuth.ts` (new - club authorization middleware)
- `src/lib/db.ts` (modify - add club filtering utilities)
- `src/app/api/*/route.ts` (modify - integrate club validation)

**Implementation Steps**:

1. Create clubAuth middleware for route-level club validation
2. Update middleware.ts to include club context checking
3. Add club filtering utilities to database operations
4. Update existing API routes to use club context
5. Implement comprehensive authorization checks
6. Add logging for club access attempts
7. Create end-to-end tests for data isolation

**Regression Protection**:

- [ ] All existing functionality works with club context
- [ ] No data leakage between different clubs
- [ ] Proper error handling for missing club context
- [ ] Performance remains acceptable with additional filtering

**Commit Strategy**:

- Commit after middleware: `feat(middleware): add club authorization middleware`
- Commit after API updates: `feat(api): integrate club context into all routes`
- Commit after testing: `feat(tests): add comprehensive club isolation tests`

### **🎯 ITERATION 5 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] Level 2 tests pass (test:coverage, build)
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (complete end-to-end functionality works)
- [ ] Data isolation prevents cross-club data access
- [ ] All API endpoints respect club context
- [ ] Unauthorized club access is properly blocked
- [ ] Club switching works end-to-end with UI
- [ ] Session persistence maintains club context across navigation
- [ ] Performance benchmarks meet acceptable standards

---

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
9. **Create PR** → Push branch and create detailed pull request
10. **Update Progress** → Mark iteration as completed

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

- Each iteration should complete in a single session (2-4 hours)
- If incomplete, document exact stopping point in progress dashboard
- Always end sessions with a clean git state (committed or stashed)
- Next session starts with fresh main pull and context recovery

### **Acceptance Criteria Validation**

After completing all iterations, verify these user story acceptance criteria:

**AC1: Club Context Establishment**

- [ ] Single club users have club automatically selected
- [ ] All data is filtered to user's club context

**AC2: Multi-Club Selection**

- [ ] Multi-club users see club selector interface
- [ ] Users can choose which club to work with
- [ ] Selection is remembered in session

**AC3: Club Context Switching**

- [ ] Users can switch between clubs via selector
- [ ] Session updates with new club context
- [ ] Page reloads with new club data

**AC4: Data Isolation**

- [ ] Users only see data from current club
- [ ] No access to other clubs' data

**AC5: Session Persistence**

- [ ] Club context persists across page navigation
- [ ] Context remains until explicitly changed or logout
