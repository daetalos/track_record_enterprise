# Club Management & Context Switching Implementation Plan

**User Story 02: Club Management & Context Switching → Foundation Feature Implementation**

## 📊 **PROGRESS TRACKING DASHBOARD**

### **Overall Status**

- **Current Iteration**: [x] Iteration 1 | [x] Iteration 2 | [x] Iteration 3 | [x] Iteration 4 | [x] Iteration 5 | [ ] Iteration 6
- **Overall Progress**: 83% Complete (5 of 6 iterations completed)
- **Last Session Date**: July 2025
- **Status**: Iteration 5 completed successfully, ready for Iteration 6
- **Recent Completions**: Iteration 5 completed - ClubSelector and ClubIndicator UI components implemented and tested
- **Additional Achievements**: Docker health checks and YAML-based database seeding system implemented
- **Total Estimated Time**: ~3 hours (down from 12-16 hours with simplified approach)

### **Iteration Progress Summary**

| Iteration                          | Feature                    | Status                                                | Duration Est. | Dependencies |
| ---------------------------------- | -------------------------- | ----------------------------------------------------- | ------------- | ------------ |
| **Iteration 1**: Database Schema   | Club & UserClub models     | [x] Not Started<br/>[x] In Progress<br/>[x] Completed | ✅ Complete   | None         |
| **Iteration 2**: Session Extension | NextAuth club context      | [x] Not Started<br/>[x] In Progress<br/>[x] Completed | ✅ Complete   | Iteration 1  |
| **Iteration 3**: API Endpoints     | Simple club selection APIs | [x] Not Started<br/>[x] In Progress<br/>[x] Completed | ✅ Complete   | Iteration 2  |
| **Iteration 4**: Club Context      | Lightweight React context  | [x] Not Started<br/>[x] In Progress<br/>[x] Completed | ✅ Complete   | Iteration 3  |
| **Iteration 5**: UI Components     | Basic club selector        | [x] Not Started<br/>[x] In Progress<br/>[x] Completed | ✅ Complete   | Iteration 4  |
| **Iteration 6**: Data Isolation    | Middleware integration     | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 30 minutes    | Iteration 5  |

### **Quick Iteration Status**

**Iteration 1 - Database Schema & Models** ✅ COMPLETED

- [x] Branch & Pull Latest
- [x] Develop (Initial)
- [x] Test (Level 1)
- [x] Develop (Refine)
- [x] Test (Level 2)
- [x] Test Release (Level 3)
- [x] Docker Deployment Validation
- [x] Create PR & Merge

**Iteration 2 - NextAuth Session Extension** ✅ COMPLETED

- [x] Branch & Pull Latest
- [x] Develop (Initial)
- [x] Test (Level 1)
- [x] Develop (Refine)
- [x] Test (Level 2)
- [x] Test Release (Level 3)
- [x] Docker Deployment Validation
- [x] Create PR & Merge

**Iteration 3 - Simple Club API Endpoints** ✅ COMPLETED

- [x] Branch & Pull Latest
- [x] Develop (Initial)
- [x] Test (Level 1)
- [x] Develop (Refine)
- [x] Test (Level 2)
- [x] Test Release (Level 3)
- [x] Docker Deployment Validation
- [x] Create PR & Merge

**Iteration 4 - Lightweight Club Context** ✅ COMPLETED

- [x] Branch & Pull Latest
- [x] Develop (Initial)
- [x] Test (Level 1)
- [x] Develop (Refine)
- [x] Test (Level 2)
- [x] Test Release (Level 3)
- [x] Docker Deployment Validation
- [x] Create PR & Merge

**Iteration 5 - Basic UI Components** ✅ COMPLETED

- [x] Branch & Pull Latest
- [x] Develop (Initial)
- [x] Test (Level 1)
- [x] Develop (Refine)
- [x] Test (Level 2)
- [x] Test Release (Level 3)
- [x] Docker Deployment Validation
- [x] Create PR & Merge

**Iteration 6 - Data Isolation Middleware** (NEXT)

- [ ] Branch & Pull Latest
- [ ] Develop (Initial)
- [ ] Test (Level 1)
- [ ] Develop (Refine)
- [ ] Test (Level 2)
- [ ] Test Release (Level 3)
- [ ] Docker Deployment Validation
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

**Database Schema (db-schema-standards.mdc)** ✅ COMPLETED

- ✅ Club entity model implemented in Prisma schema
- ✅ UserClub relationship for multi-club access control added
- ✅ Club context validation in database layer established

**Session Management (NextAuth Extension)**

- No club context in NextAuth session
- No server-side persistence for selected club
- No session-based club filtering

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

**Status**: [x] Not Started | [x] In Progress | [x] Completed ✅

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

### **Step 8: Update Progress Tracking**

```powershell
# Update execution plan with Iteration 1 completion
# Mark Iteration 1 as completed in progress dashboard
# Update overall progress from 0% to 20% (1 of 5 iterations)
# Update current iteration status to show Iteration 2 as next
# Update last session date and status
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
- [ ] Execution plan progress dashboard updated with Iteration 1 completion

---

# 🚀 **ITERATION 2: NEXTAUTH SESSION EXTENSION**

**Status**: [x] Not Started | [x] In Progress | [x] Completed

## **ITERATION OVERVIEW**

Extend NextAuth session to include selectedClubId for server-side club context persistence, eliminating need for complex client-side state management.

**Duration Estimate**: 30 minutes in single session
**Dependencies**: Iteration 1 (Database Schema)
**Scope**: Session extension, type definitions, and server-side persistence

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration2-nextauth-session-extension
```

### **Step 2: Develop (Initial)**

- Extend NextAuth session type to include selectedClubId
- Update auth.ts session callback to handle club context
- Add TypeScript declarations for extended session

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Test session extension with existing auth flow
- Verify TypeScript compilation with new session types
- Add session helper functions for club context access

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

### **Step 8: Update Progress Tracking**

```powershell
# Update execution plan with Iteration 2 completion
# Mark Iteration 2 as completed in progress dashboard
# Update overall progress from 20% to 40% (2 of 5 iterations)
# Update current iteration status to show Iteration 3 as next
# Update last session date and status
```

## **📋 ITERATION 2 IMPLEMENTATION**

**Rule Reference**: `NextAuth session extension patterns`

**Files to Create/Modify**:

- `src/lib/auth.ts` (modify - extend session interface and callback)
- `src/types/club.ts` (modify - add session-related types)

**Implementation Steps**:

1. Extend NextAuth Session interface to include selectedClubId
2. Update session callback to persist club context
3. Add TypeScript declarations for extended session
4. Create helper functions for session club access
5. Test session persistence across page loads
6. Verify compatibility with existing auth flow

**Regression Protection**:

- [ ] Existing authentication flow remains intact
- [ ] No breaking changes to NextAuth configuration
- [ ] Session extension gracefully handles missing club data

**Commit Strategy**:

- Commit after session extension: `feat(auth): extend NextAuth session with club context`
- Commit after TypeScript types: `feat(types): add session club context types`
- Commit after helper functions: `feat(auth): add club session helper functions`

### **🎯 ITERATION 2 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] Level 2 tests pass (test:coverage, build)
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (auth system works with extended session)
- [ ] Extended session types compile correctly with TypeScript
- [ ] Session persistence maintains club context across page loads
- [ ] NextAuth callbacks handle club context without errors
- [ ] Helper functions provide proper session club access
- [ ] Execution plan progress dashboard updated with Iteration 2 completion

---

# 🚀 **ITERATION 3: SIMPLE CLUB API ENDPOINTS**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement basic API endpoints for club operations: fetching user clubs and setting club context in session. Focus on simplicity and leveraging existing database functions.

**Duration Estimate**: 45 minutes in single session
**Dependencies**: Iteration 2 (Session Extension)
**Scope**: Two simple API routes with session management

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration3-simple-club-apis
```

### **Step 2: Develop (Initial)**

- Create GET /api/clubs route using existing getUserClubs function
- Create POST /api/clubs/select route for session updates
- Add basic request validation

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution
```

### **Step 4: Develop (Refine)**

- Add proper error handling and HTTP status codes
- Implement session integration for club persistence
- Test API endpoints with existing auth system

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

### **Step 8: Update Progress Tracking**

```powershell
# Update execution plan with Iteration 3 completion
# Mark Iteration 3 as completed in progress dashboard
# Update overall progress from 40% to 60% (3 of 5 iterations)
# Update current iteration status to show Iteration 4 as next
# Update last session date and status
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
- [ ] Execution plan progress dashboard updated with Iteration 3 completion

---

# 🚀 **ITERATION 4: LIGHTWEIGHT CLUB CONTEXT**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Create a simple React context for club state management following the existing ThemeContext pattern. Provides UI state synchronization without complex state management.

**Duration Estimate**: 30 minutes in single session
**Dependencies**: Iteration 3 (API Endpoints)
**Scope**: Simple React context, hooks, and UI state management

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration4-lightweight-club-context
```

### **Step 2: Develop (Initial)**

- Create ClubContext following ThemeContext pattern
- Add useClub hook for context access
- Implement basic club state management
- **DO NOT write tests yet** - focus on implementation first

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Integrate with API endpoints from Iteration 3
- Add error handling and loading states
- **Write comprehensive unit tests** for the new functionality
- Follow existing test patterns in the project (Vitest, React Testing Library)
- Achieve 100% test coverage for new code

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
# Deploy to Docker and validate context functionality
docker-compose up --build -d
docker-compose ps              # Verify all containers are running
docker-compose logs web --tail=50  # Check for deployment errors

# Validate club context in containerized environment
curl http://localhost:3000 -I  # Test application loads
# Manual validation: Open browser, check context provides club state
# Manual validation: Verify no hydration issues with context

# Check for React context issues
docker-compose logs web | grep -i "context\|provider\|hydration" | head -10

# Clean up Docker environment
docker-compose down
```

### **Step 7: Create PR & Merge**

```powershell
# Push feature branch
git push -u origin feat/iteration4-lightweight-club-context

# Create PR with detailed description
gh pr create --title "feat(context): implement lightweight club context following ThemeContext pattern" --body "Adds simple React context for club state management, following existing patterns in codebase"

# After review and approval, update main
git checkout main
git pull origin main
git branch -d feat/iteration4-lightweight-club-context
```

### **Step 8: Update Progress Tracking**

```powershell
# Update execution plan with Iteration 4 completion
# Mark Iteration 4 as completed in progress dashboard
# Update overall progress from 50% to 67% (4 of 6 iterations)
# Update current iteration status to show Iteration 5 as next
# Update last session date and status
```

## **📋 ITERATION 4 IMPLEMENTATION**

**Rule Reference**: Existing `ThemeContext.tsx` and `SidebarContext.tsx` patterns

**Files to Create/Modify**:

- `src/context/ClubContext.tsx` (new - club context provider)
- `src/hooks/useClub.ts` (new - club context hook)
- `src/types/club.ts` (modify - add context types)

**Implementation Steps**:

1. Create ClubContext following existing context patterns
2. Add ClubProvider component with state management
3. Implement useClub hook for context access
4. Add loading states and error handling
5. Integrate with API endpoints for data fetching
6. Add TypeScript interfaces for context types

**Testing Strategy**:

- **Step 4 Focus**: Write comprehensive unit tests after initial implementation
- **Test Patterns**: Follow existing project test structure (Vitest, React Testing Library)
- **Coverage Goal**: Achieve 100% test coverage for new functionality
- **Test Files**: Place tests in `__tests__` directories alongside source files
- **Mocking**: Use Vitest mocking patterns consistent with existing tests

**Regression Protection**:

- [ ] Existing context providers remain functional
- [ ] No breaking changes to current React patterns
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

**Commit Strategy**:

- Commit after initial implementation: `feat(context): implement ClubContext and useClub hook`
- Commit after tests: `test(context): add comprehensive unit tests for club context`
- Commit after refinements: `feat(context): integrate club context with API endpoints`

### **🎯 ITERATION 4 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] **New unit tests written** with 100% coverage for new functionality
- [ ] Level 2 tests pass (test:coverage, build) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (context works without hydration issues)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Test files follow project patterns** (Vitest, proper mocking)
- [ ] ClubContext follows existing ThemeContext patterns
- [ ] useClub hook provides proper state access
- [ ] Context integrates with API endpoints correctly
- [ ] Loading states and error handling work properly
- [ ] No breaking changes to existing context providers
- [ ] Execution plan progress dashboard updated with Iteration 4 completion

---

# 🚀 **ITERATION 5: BASIC CLUB SELECTOR UI**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Create a simple club selector dropdown component integrated into navigation header. Focus on basic functionality with clean UI following existing design patterns.

**Duration Estimate**: 45 minutes in single session
**Dependencies**: Iteration 4 (Club Context)
**Scope**: Single dropdown component with basic club switching

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration5-basic-club-selector
```

### **Step 2: Develop (Initial)**

- Create ClubSelector dropdown component
- Implement club switching user interface
- Add loading states and error handling
- **DO NOT write tests yet** - focus on implementation first

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Integrate ClubSelector into navigation header
- Add club context display indicators
- Implement responsive design and accessibility
- **Write comprehensive unit tests** for the new functionality
- Follow existing test patterns in the project (Vitest, React Testing Library)
- Achieve 100% test coverage for new code

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

### **Step 8: Update Progress Tracking**

```powershell
# Update execution plan with Iteration 4 completion
# Mark Iteration 4 as completed in progress dashboard
# Update overall progress from 60% to 80% (4 of 5 iterations)
# Update current iteration status to show Iteration 5 as next
# Update last session date and status
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

**Testing Strategy**:

- **Step 4 Focus**: Write comprehensive unit tests after initial implementation
- **Test Patterns**: Follow existing project test structure (Vitest, React Testing Library)
- **Coverage Goal**: Achieve 100% test coverage for new functionality
- **Test Files**: Place tests in `__tests__` directories alongside source files
- **Mocking**: Use Vitest mocking patterns consistent with existing tests

**Regression Protection**:

- [ ] Existing navigation functionality remains intact
- [ ] Header layout doesn't break on different screen sizes
- [ ] No styling conflicts with existing components
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

**Commit Strategy**:

- Commit after initial implementation: `feat(ui): implement ClubSelector and ClubIndicator components`
- Commit after tests: `test(ui): add comprehensive unit tests for club selector components`
- Commit after refinements: `feat(layout): integrate club selector into navigation with styling`

### **🎯 ITERATION 5 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] **New unit tests written** with 100% coverage for new functionality
- [ ] Level 2 tests pass (test:coverage, build) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (UI renders correctly, no hydration issues)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Test files follow project patterns** (Vitest, proper mocking)
- [ ] ClubSelector renders correctly with proper styling
- [ ] Club switching triggers API calls and updates state
- [ ] Loading states and error handling work properly
- [ ] Component is accessible with keyboard navigation
- [ ] Responsive design works on mobile and desktop
- [ ] Execution plan progress dashboard updated with Iteration 5 completion

---

# 🚀 **ITERATION 6: DATA ISOLATION MIDDLEWARE**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **ITERATION OVERVIEW**

Implement data isolation middleware to enforce club-based filtering across all API endpoints and integrate club context validation throughout the application.

**Duration Estimate**: 30 minutes in single session
**Dependencies**: Iteration 5 (UI Components)
**Scope**: Simple middleware extension for automatic club-based data filtering

## **🔄 STRICT ITERATION WORKFLOW**

### **Step 1: Branch & Pull Latest**

```powershell
# Always start with fresh main
git checkout main
git pull origin main
git checkout -b feat/iteration6-data-isolation-middleware
```

### **Step 2: Develop (Initial)**

- Create club context middleware for API routes
- Implement automatic club filtering in database queries
- Add club validation to existing endpoints
- **DO NOT write tests yet** - focus on implementation first

### **Step 3: Test (Level 1 - Immediate Feedback)**

```powershell
npm run quality:check  # Lint + format + type check
npm run test:run       # Quick unit test execution (existing tests only)
```

### **Step 4: Develop (Refine)**

- Update existing API routes to respect club context
- Add club-based authorization checks
- Implement comprehensive error handling for unauthorized access
- **Write comprehensive unit tests** for the new functionality
- Follow existing test patterns in the project (Vitest, React Testing Library)
- Achieve 100% test coverage for new code

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

### **Step 8: Update Progress Tracking**

```powershell
# Update execution plan with Iteration 5 completion
# Mark Iteration 5 as completed in progress dashboard
# Update overall progress from 80% to 100% (5 of 5 iterations)
# Update current iteration status to show project as COMPLETED
# Update last session date and final status
# Mark entire club management feature as production-ready
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

**Testing Strategy**:

- **Step 4 Focus**: Write comprehensive unit tests after initial implementation
- **Test Patterns**: Follow existing project test structure (Vitest, React Testing Library)
- **Coverage Goal**: Achieve 100% test coverage for new functionality
- **Test Files**: Place tests in `__tests__` directories alongside source files
- **Mocking**: Use Vitest mocking patterns consistent with existing tests

**Regression Protection**:

- [ ] All existing functionality works with club context
- [ ] No data leakage between different clubs
- [ ] Proper error handling for missing club context
- [ ] Performance remains acceptable with additional filtering
- [ ] All existing tests continue to pass
- [ ] New functionality has comprehensive test coverage

**Commit Strategy**:

- Commit after initial implementation: `feat(middleware): implement club authorization middleware`
- Commit after tests: `test(middleware): add comprehensive unit tests for club isolation`
- Commit after refinements: `feat(api): integrate club context into all routes with validation`

### **🎯 ITERATION 6 COMPLETION CRITERIA**

ALL items must be verified before creating PR:

- [ ] Level 1 tests pass (quality:check, test:run)
- [ ] **New unit tests written** with 100% coverage for new functionality
- [ ] Level 2 tests pass (test:coverage, build) including new tests
- [ ] Level 3 tests pass (test:all, validate:pre-docker)
- [ ] Docker deployment validation passes (complete end-to-end functionality works)
- [ ] **All existing tests continue to pass** (no regression)
- [ ] **Test files follow project patterns** (Vitest, proper mocking)
- [ ] Data isolation prevents cross-club data access
- [ ] All API endpoints respect club context
- [ ] Unauthorized club access is properly blocked
- [ ] Club switching works end-to-end with UI
- [ ] Session persistence maintains club context across navigation
- [ ] Performance benchmarks meet acceptable standards
- [ ] Execution plan progress dashboard updated with Iteration 6 completion and project finalization

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
