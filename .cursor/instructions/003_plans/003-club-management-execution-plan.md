# Club Management & Context Switching - Execution Plan

## 📊 **PROGRESS TRACKING DASHBOARD**

### **Overall Status**

- **Current Phase**: [ ] Phase 1 | [ ] Phase 2 | [ ] Phase 3 | [ ] Phase 4
- **Overall Progress**: 0% Complete (0 of 12 tasks completed)
- **Last Session Date**: [Current Date]
- **Status**: Ready to begin implementation

### **Phase Progress Summary**

| Phase                                         | Tasks   | Status                                                | Duration Est. | Dependencies |
| --------------------------------------------- | ------- | ----------------------------------------------------- | ------------- | ------------ |
| **Phase 1**: Database Models & Infrastructure | 3 tasks | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | None         |
| **Phase 2**: Session & Context Management     | 3 tasks | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 4-5 hours     | Phase 1      |
| **Phase 3**: API Endpoints & Business Logic   | 3 tasks | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 3-4 hours     | Phase 2      |
| **Phase 4**: UI Components & User Experience  | 3 tasks | [ ] Not Started<br/>[ ] In Progress<br/>[ ] Completed | 4-5 hours     | Phase 3      |

### **Quick Task Status**

**Phase 1 - Database Models & Infrastructure**

- [ ] 1.1: Extend Prisma Schema with Club Models
- [ ] 1.2: Update NextAuth Session Types
- [ ] 1.3: Create Database Migrations & Seed Data

**Phase 2 - Session & Context Management**

- [ ] 2.1: Extend Middleware for Club Context
- [ ] 2.2: Create Club Context Provider
- [ ] 2.3: Update NextAuth Callbacks

**Phase 3 - API Endpoints & Business Logic**

- [ ] 3.1: Create Club Selection API Endpoints
- [ ] 3.2: Implement Access Validation Logic
- [ ] 3.3: Add Security Logging & Data Filtering

**Phase 4 - UI Components & User Experience**

- [ ] 4.1: Build Club Selector Component
- [ ] 4.2: Integrate Club Selector in Navigation
- [ ] 4.3: Implement Automatic Club Selection

### **Session Quick Start**

```powershell
# Context Recovery Commands
Get-Location                    # Verify project directory
Test-Path package.json          # Confirm in correct project
git status                      # See current changes
npm run build                   # Test current state
npx prisma studio              # Check database state
```

## 📋 **PLAN OVERVIEW**

### **Current State Assessment**

- **Project Type**: Next.js 15 TypeScript application with Prisma ORM and NextAuth.js authentication
- **Foundation Quality**: Strong - Authentication system complete, database configured, UI components established
- **Enterprise Readiness**: Partial - Missing multi-club architecture and data isolation

### **Target State**

- **Primary Goals**: Enable multi-club athletics management with secure data isolation and context switching
- **Standards Compliance**: Implement club management following system_review specifications
- **Success Metrics**: Users can manage multiple clubs, data isolation enforced, session-based club context maintained

### **Implementation Strategy**

- **Approach**: Incremental implementation across 4 phases building from database to UI
- **Workflow**: Implement → Test → Commit for each task with feature branch per phase
- **Session Support**: Plan designed for multi-session execution with comprehensive recovery procedures

## 🔍 **CURRENT STATE ANALYSIS**

### ✅ **EXISTING STRENGTHS**

- **Authentication System**: NextAuth.js v4.24.x fully configured with JWT strategy and Prisma adapter
- **Database Infrastructure**: PostgreSQL with Prisma ORM, proper indexing and constraints
- **User Management**: Complete user registration, login, session management
- **UI Framework**: Professional dashboard with sidebar navigation, theme switching, responsive design
- **Development Environment**: TypeScript, ESLint, Prettier, testing framework configured
- **Security Foundation**: Middleware protection, secure headers, input validation patterns
- **Session Provider**: NextAuth SessionProvider properly integrated in layout

### ❌ **CRITICAL GAPS IDENTIFIED**

**Club Data Models (`02_data_models.md`)**

- Missing Club entity with unique name constraint
- Missing UserClub relationship for access control
- Missing club-specific Age Group model
- User model lacks club relationships

**Session Management (`07_security_permissions.md`)**

- NextAuth session missing club context storage
- No middleware for club context filtering
- No session-based club persistence across navigation
- Missing club switching validation logic

**API Endpoints (`06_api_endpoints.md`)**

- Missing `/api/clubs/select` endpoint for club switching
- Missing `/api/clubs/user-clubs` endpoint for user's accessible clubs
- No club access validation in API routes
- Missing security logging for unauthorized club access

**UI Components (`03_user_flows.md`)**

- No club selector component in navigation
- Missing automatic club selection for single-club users
- No club switching interface for multi-club users
- No visual indication of current club context

**Data Isolation (`05_business_rules.md`)**

- No automatic club filtering in database queries
- Missing club context validation in all operations
- No data isolation enforcement at middleware level
- Missing club-specific data scoping patterns

# 🚀 **PHASE 1: DATABASE MODELS & INFRASTRUCTURE**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **PHASE OVERVIEW**

Establish the foundational database models and infrastructure required for multi-club athletics management. This phase creates the core data structures that will support club context switching and data isolation.

**Duration Estimate**: 3-4 hours across multiple sessions
**Dependencies**: None
**Critical Path**: Yes - All subsequent phases depend on this foundation

## **🌿 GIT WORKFLOW FOR PHASE 1**

**Branch**: `feat/phase1-club-database-models`
**PR Title**: `feat(database): implement Phase 1 - club models and infrastructure`

**Git Commands**:

```powershell
# Start Phase 1
git checkout main
git pull origin main
git checkout -b feat/phase1-club-database-models

# During development - commit after each task completion
git add .
git commit -m "feat(database): extend Prisma schema with Club and UserClub models"
git commit -m "feat(auth): update NextAuth session types for club context"
git commit -m "feat(database): create migrations and seed data for clubs"

# End of Phase 1
git push -u origin feat/phase1-club-database-models
# Create PR with detailed description
```

## **📋 PHASE 1 TASKS**

### **Task 1.1: Extend Prisma Schema with Club Models**

**Rule Reference**: `db-schema-standards.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: None

**Implementation Steps**:

1. Add Club model with unique name constraint
2. Add UserClub junction table for many-to-many relationship
3. Update User model with club relationships
4. Add proper indexes and constraints

**Files to Create/Modify**:

- `prisma/schema.prisma` (modify)

**Validation Criteria**:

- [ ] Club model has id and unique name fields
- [ ] UserClub model links users to clubs with role support
- [ ] User model has clubs relationship
- [ ] All foreign key constraints properly defined
- [ ] Indexes on frequently queried fields

**Test Commands**:

```powershell
npx prisma validate
npx prisma format
npx prisma generate
```

**Commit Message**: `feat(database): extend Prisma schema with Club and UserClub models`

### **Task 1.2: Update NextAuth Session Types**

**Rule Reference**: `auth-nextauth-simple.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Task 1.1

**Implementation Steps**:

1. Extend NextAuth session interface to include club context
2. Update JWT token interface for club data
3. Create TypeScript types for club context
4. Update session type declarations

**Files to Create/Modify**:

- `src/types/next-auth.d.ts` (modify)
- `src/types/club.ts` (new)

**Validation Criteria**:

- [ ] Session type includes currentClubId and currentClubName
- [ ] JWT token type includes club context
- [ ] TypeScript compilation passes without errors
- [ ] Club-related types are properly exported

**Test Commands**:

```powershell
npx tsc --noEmit
npm run build
```

**Commit Message**: `feat(auth): update NextAuth session types for club context`

### **Task 1.3: Create Database Migrations & Seed Data**

**Rule Reference**: `db-schema-standards.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Task 1.2

**Implementation Steps**:

1. Generate and apply Prisma migration
2. Create seed script for sample clubs
3. Create seed script for UserClub relationships
4. Verify migration and seed data work correctly

**Files to Create/Modify**:

- `prisma/migrations/` (new migration files)
- `prisma/seed.ts` (modify)

**Validation Criteria**:

- [ ] Migration successfully creates new tables
- [ ] Seed data creates sample clubs
- [ ] UserClub relationships properly established
- [ ] Database constraints working correctly
- [ ] Rollback migration works if needed

**Test Commands**:

```powershell
npx prisma db push
npx prisma db seed
npx prisma studio  # Verify data in database
```

**Commit Message**: `feat(database): create migrations and seed data for clubs`

### **🎯 PHASE 1 COMPLETION CRITERIA**

Before proceeding to Phase 2, verify all items:

- [ ] Club and UserClub models exist in database
- [ ] NextAuth session types include club context
- [ ] Sample clubs and relationships created via seed data
- [ ] All TypeScript compilation passes
- [ ] Database constraints prevent data integrity issues
- [ ] Git branch ready for PR with all commits

**Phase 1 Final Test**:

```powershell
# Full validation sequence
npx prisma validate
npx tsc --noEmit
npm run build
npx prisma studio  # Manual verification of database structure
git status         # Verify all changes committed
```

# 🚀 **PHASE 2: SESSION & CONTEXT MANAGEMENT**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **PHASE OVERVIEW**

Implement session-based club context management with middleware support and React context providers. This phase creates the core logic for maintaining and switching club context throughout the application.

**Duration Estimate**: 4-5 hours across multiple sessions
**Dependencies**: Phase 1 completed
**Critical Path**: Yes - Required for API endpoints and UI components

## **🌿 GIT WORKFLOW FOR PHASE 2**

**Branch**: `feat/phase2-session-context-management`
**PR Title**: `feat(session): implement Phase 2 - club context management system`

**Git Commands**:

```powershell
# Start Phase 2
git checkout main
git pull origin main
git checkout -b feat/phase2-session-context-management

# During development - commit after each task completion
git add .
git commit -m "feat(middleware): extend middleware for club context handling"
git commit -m "feat(context): create club context provider with React hooks"
git commit -m "feat(auth): update NextAuth callbacks for club session management"

# End of Phase 2
git push -u origin feat/phase2-session-context-management
# Create PR with detailed description
```

## **📋 PHASE 2 TASKS**

### **Task 2.1: Extend Middleware for Club Context**

**Rule Reference**: `bp-security-standards.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Phase 1 completed

**Implementation Steps**:

1. Extend existing middleware to handle club context
2. Add club validation for protected routes
3. Implement club context injection into request headers
4. Add security logging for club access attempts

**Files to Create/Modify**:

- `src/middleware.ts` (modify)
- `src/lib/club-middleware.ts` (new)

**Validation Criteria**:

- [ ] Middleware validates club access for authenticated users
- [ ] Club context properly injected into request pipeline
- [ ] Unauthorized club access attempts are blocked
- [ ] Security events are logged appropriately
- [ ] Performance impact is minimal

**Test Commands**:

```powershell
npm run dev
# Test navigation to /dashboard (should work)
# Check console for security logs
curl -H "Authorization: Bearer invalid" http://localhost:3000/api/clubs
```

**Commit Message**: `feat(middleware): extend middleware for club context handling`

### **Task 2.2: Create Club Context Provider**

**Rule Reference**: `state-zustand-management.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Task 2.1

**Implementation Steps**:

1. Create ClubContextProvider component
2. Implement useClub hook for accessing club context
3. Add club switching logic with optimistic updates
4. Integrate with existing Providers component

**Files to Create/Modify**:

- `src/context/ClubContext.tsx` (new)
- `src/hooks/useClub.ts` (new)
- `src/components/providers.tsx` (modify)

**Validation Criteria**:

- [ ] ClubContext provides current club state
- [ ] useClub hook returns club data and actions
- [ ] Club switching updates context immediately
- [ ] Context persists across page navigation
- [ ] TypeScript types are properly defined

**Test Commands**:

```powershell
npm run dev
# Check React DevTools for ClubContext provider
npx tsc --noEmit
npm run build
```

**Commit Message**: `feat(context): create club context provider with React hooks`

### **Task 2.3: Update NextAuth Callbacks**

**Rule Reference**: `auth-nextauth-simple.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Task 2.2

**Implementation Steps**:

1. Update JWT callback to include club context
2. Update session callback to populate club data
3. Add club selection logic for new user sessions
4. Implement automatic club selection for single-club users

**Files to Create/Modify**:

- `src/lib/auth.ts` (modify)
- `src/lib/club-session.ts` (new)

**Validation Criteria**:

- [ ] JWT tokens include current club information
- [ ] Session objects contain club context
- [ ] Single-club users get automatic selection
- [ ] Multi-club users start with no club selected
- [ ] Club switching updates session properly

**Test Commands**:

```powershell
npm run dev
# Test login with single club user
# Test login with multi-club user
# Check session object in browser dev tools
```

**Commit Message**: `feat(auth): update NextAuth callbacks for club session management`

### **🎯 PHASE 2 COMPLETION CRITERIA**

Before proceeding to Phase 3, verify all items:

- [ ] Middleware properly handles club context validation
- [ ] Club context provider works across components
- [ ] NextAuth sessions include club information
- [ ] Single-club users get automatic club selection
- [ ] Multi-club users can switch clubs via context
- [ ] Security logging captures club access events
- [ ] All TypeScript compilation passes

**Phase 2 Final Test**:

```powershell
# Full validation sequence
npm run dev
# Create test users with different club access
# Test automatic club selection for single-club user
# Test club switching for multi-club user
# Verify club context persists across page navigation
npx tsc --noEmit
npm run build
```

# 🚀 **PHASE 3: API ENDPOINTS & BUSINESS LOGIC**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **PHASE OVERVIEW**

Implement RESTful API endpoints for club management with comprehensive access validation and security logging. This phase creates the backend services that power the club switching functionality.

**Duration Estimate**: 3-4 hours across multiple sessions
**Dependencies**: Phase 2 completed
**Critical Path**: Yes - Required for UI components to function

## **🌿 GIT WORKFLOW FOR PHASE 3**

**Branch**: `feat/phase3-api-business-logic`
**PR Title**: `feat(api): implement Phase 3 - club selection and validation APIs`

**Git Commands**:

```powershell
# Start Phase 3
git checkout main
git pull origin main
git checkout -b feat/phase3-api-business-logic

# During development - commit after each task completion
git add .
git commit -m "feat(api): create club selection and user-clubs API endpoints"
git commit -m "feat(security): implement club access validation logic"
git commit -m "feat(logging): add security logging and data filtering utilities"

# End of Phase 3
git push -u origin feat/phase3-api-business-logic
# Create PR with detailed description
```

## **📋 PHASE 3 TASKS**

### **Task 3.1: Create Club Selection API Endpoints**

**Rule Reference**: `bp-engineering-best-practices.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Phase 2 completed

**Implementation Steps**:

1. Create `/api/clubs/user-clubs` GET endpoint
2. Create `/api/clubs/select` POST endpoint
3. Implement proper error handling and validation
4. Add API documentation and TypeScript types

**Files to Create/Modify**:

- `src/app/api/clubs/user-clubs/route.ts` (new)
- `src/app/api/clubs/select/route.ts` (new)
- `src/types/api.ts` (new)

**Validation Criteria**:

- [ ] GET `/api/clubs/user-clubs` returns user's accessible clubs
- [ ] POST `/api/clubs/select` updates user's current club
- [ ] Both endpoints validate authentication
- [ ] Proper HTTP status codes returned
- [ ] Request/response types are properly defined

**Test Commands**:

```powershell
npm run dev
# Test API endpoints manually:
curl -X GET http://localhost:3000/api/clubs/user-clubs
curl -X POST http://localhost:3000/api/clubs/select -H "Content-Type: application/json" -d '{"clubId":"club-id"}'
```

**Commit Message**: `feat(api): create club selection and user-clubs API endpoints`

### **Task 3.2: Implement Access Validation Logic**

**Rule Reference**: `bp-security-standards.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Task 3.1

**Implementation Steps**:

1. Create club access validation utilities
2. Implement user-club relationship verification
3. Add validation middleware for API routes
4. Create database query helpers with access control

**Files to Create/Modify**:

- `src/lib/club-access.ts` (new)
- `src/lib/club-validators.ts` (new)
- `src/lib/db-helpers.ts` (new)

**Validation Criteria**:

- [ ] User can only access clubs they belong to
- [ ] Invalid club access attempts are rejected
- [ ] Database queries automatically filter by club access
- [ ] Validation logic is reusable across endpoints
- [ ] Proper error messages for access violations

**Test Commands**:

```powershell
npm run dev
# Test access validation with different user/club combinations
# Verify unauthorized access is blocked
npx vitest run --reporter=verbose src/lib/__tests__/club-access.test.ts
```

**Commit Message**: `feat(security): implement club access validation logic`

### **Task 3.3: Add Security Logging & Data Filtering**

**Rule Reference**: `bp-security-standards.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Task 3.2

**Implementation Steps**:

1. Implement security event logging system
2. Create data filtering utilities for club isolation
3. Add audit trail for club switching events
4. Implement monitoring and alerting setup

**Files to Create/Modify**:

- `src/lib/security-logger.ts` (new)
- `src/lib/data-filters.ts` (new)
- `src/lib/audit-trail.ts` (new)

**Validation Criteria**:

- [ ] Security events are properly logged
- [ ] Club switching events are audited
- [ ] Data filtering prevents cross-club data access
- [ ] Performance impact is minimal
- [ ] Log format is consistent and searchable

**Test Commands**:

```powershell
npm run dev
# Perform club switching operations
# Check console for security logs
# Verify data isolation works correctly
Get-Content logs/security.log | Select-String "club_switch"
```

**Commit Message**: `feat(logging): add security logging and data filtering utilities`

### **🎯 PHASE 3 COMPLETION CRITERIA**

Before proceeding to Phase 4, verify all items:

- [ ] Club selection API endpoints work correctly
- [ ] User can only access authorized clubs
- [ ] Security events are logged appropriately
- [ ] Data filtering prevents cross-club access
- [ ] API responses include proper error handling
- [ ] All tests pass and TypeScript compiles
- [ ] API documentation is complete

**Phase 3 Final Test**:

```powershell
# Full API validation sequence
npm run dev

# Test user-clubs endpoint
curl -X GET http://localhost:3000/api/clubs/user-clubs -H "Authorization: Bearer [token]"

# Test club selection
curl -X POST http://localhost:3000/api/clubs/select -H "Content-Type: application/json" -d '{"clubId":"valid-club-id"}'

# Test unauthorized access
curl -X POST http://localhost:3000/api/clubs/select -H "Content-Type: application/json" -d '{"clubId":"invalid-club-id"}'

# Verify all tests pass
npx vitest run
npx tsc --noEmit
```

# 🚀 **PHASE 4: UI COMPONENTS & USER EXPERIENCE**

**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed

## **PHASE OVERVIEW**

Build user interface components for club management and context switching with automatic selection logic. This phase completes the user-facing functionality and creates a seamless multi-club experience.

**Duration Estimate**: 4-5 hours across multiple sessions
**Dependencies**: Phase 3 completed
**Critical Path**: Yes - Final phase for complete functionality

## **🌿 GIT WORKFLOW FOR PHASE 4**

**Branch**: `feat/phase4-ui-components`
**PR Title**: `feat(ui): implement Phase 4 - club management UI and user experience`

**Git Commands**:

```powershell
# Start Phase 4
git checkout main
git pull origin main
git checkout -b feat/phase4-ui-components

# During development - commit after each task completion
git add .
git commit -m "feat(ui): build club selector component with dropdown interface"
git commit -m "feat(navigation): integrate club selector in header navigation"
git commit -m "feat(ui): implement automatic club selection and loading states"

# End of Phase 4
git push -u origin feat/phase4-ui-components
# Create PR with detailed description
```

## **📋 PHASE 4 TASKS**

### **Task 4.1: Build Club Selector Component**

**Rule Reference**: `ui-tailwind-css-standards.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Phase 3 completed

**Implementation Steps**:

1. Create ClubSelector dropdown component
2. Implement club loading and selection states
3. Add visual indicators for current club
4. Integrate with club context and API endpoints

**Files to Create/Modify**:

- `src/components/club/ClubSelector.tsx` (new)
- `src/components/club/ClubDropdown.tsx` (new)

**Validation Criteria**:

- [ ] ClubSelector renders with proper styling
- [ ] Dropdown shows user's accessible clubs
- [ ] Current club is visually highlighted
- [ ] Loading states display during API calls
- [ ] Error states handle API failures gracefully

**Test Commands**:

```powershell
npm run dev
# Test club selector with different user types
# Verify dropdown functionality
# Check loading and error states
```

**Commit Message**: `feat(ui): build club selector component with dropdown interface`

### **Task 4.2: Integrate Club Selector in Navigation**

**Rule Reference**: `nextjs-structure-standards.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Task 4.1

**Implementation Steps**:

1. Add ClubSelector to header navigation
2. Position selector for optimal UX
3. Ensure responsive behavior on mobile
4. Integrate with existing header components

**Files to Create/Modify**:

- `src/layout/AppHeader.tsx` (modify)
- `src/components/header/ClubSelectorWrapper.tsx` (new)

**Validation Criteria**:

- [ ] Club selector appears in header navigation
- [ ] Positioning works on desktop and mobile
- [ ] Integration doesn't break existing header
- [ ] Current club name displays prominently
- [ ] Club switching works from header

**Test Commands**:

```powershell
npm run dev
# Test header on different screen sizes
# Verify club selector integration
# Test mobile responsive behavior
```

**Commit Message**: `feat(navigation): integrate club selector in header navigation`

### **Task 4.3: Implement Automatic Club Selection**

**Rule Reference**: `bp-engineering-best-practices.mdc`
**Status**: [ ] Not Started | [ ] In Progress | [ ] Completed
**Dependencies**: Task 4.2

**Implementation Steps**:

1. Create automatic club selection logic
2. Implement single-club auto-selection
3. Add multi-club selection prompt
4. Handle edge cases and error scenarios

**Files to Create/Modify**:

- `src/lib/club-auto-selection.ts` (new)
- `src/components/club/ClubSelectionPrompt.tsx` (new)

**Validation Criteria**:

- [ ] Single-club users automatically get their club selected
- [ ] Multi-club users see selection prompt on first login
- [ ] Club selection persists across sessions
- [ ] Edge cases handled gracefully
- [ ] Loading states during automatic selection

**Test Commands**:

```powershell
npm run dev
# Test with single-club user account
# Test with multi-club user account
# Test with new user (no clubs)
# Verify session persistence
```

**Commit Message**: `feat(ui): implement automatic club selection and loading states`

### **🎯 PHASE 4 COMPLETION CRITERIA**

Before completing the feature, verify all items:

- [ ] Club selector component works correctly
- [ ] Header integration is seamless
- [ ] Automatic selection logic functions properly
- [ ] All user scenarios are handled
- [ ] Responsive design works on all devices
- [ ] Error states provide clear feedback
- [ ] TypeScript compilation passes

**Phase 4 Final Test**:

```powershell
# Full user experience validation
npm run dev

# Test complete user journey:
# 1. Login as single-club user → verify automatic selection
# 2. Login as multi-club user → verify selection prompt
# 3. Switch clubs → verify UI updates immediately
# 4. Navigate between pages → verify club context persists
# 5. Test mobile responsive behavior
# 6. Test error scenarios

# Technical validation
npx tsc --noEmit
npm run build
npx vitest run
```

# 🎉 **PROJECT COMPLETION & VALIDATION**

## **🏆 FINAL SUCCESS CRITERIA**

Verify ALL criteria before marking feature complete:

### **Core Functionality**

- [ ] Single-club users: Automatically get their club selected on login
- [ ] Multi-club users: See club selector and can choose club
- [ ] Club switching: Updates session and reloads page with new club data
- [ ] Data isolation: All features only show data from current club
- [ ] Session persistence: Club context maintained across navigation

### **Security & Access Control**

- [ ] Users can only access clubs they belong to
- [ ] Unauthorized club access attempts are blocked and logged
- [ ] Security events are properly audited
- [ ] Session-based club context is secure

### **Technical Standards**

- [ ] All TypeScript compilation passes
- [ ] Database migrations and seed data work correctly
- [ ] API endpoints follow REST conventions
- [ ] UI components follow design system standards
- [ ] Code follows project conventions and linting rules

### **User Experience**

- [ ] Club selector is intuitive and accessible
- [ ] Loading states provide clear feedback
- [ ] Error states have helpful messaging
- [ ] Mobile responsive design works properly
- [ ] Navigation feels seamless

## **📝 POST-COMPLETION ACTIONS**

### **Documentation Updates**

```powershell
# Update README with club management features
# Update API documentation
# Add deployment notes if necessary
```

### **Production Readiness**

```powershell
# Run full test suite
npx vitest run
npm run build

# Performance testing
npm run build && npm start
# Test with production build

# Security review
# Review all API endpoints for security
# Verify access control logic
# Check logging and monitoring
```

### **Feature Demo Preparation**

```powershell
# Create demo script showing:
# 1. Single-club user automatic selection
# 2. Multi-club user club switching
# 3. Data isolation demonstration
# 4. Security validation
```

## **🔄 RECOVERY PROCEDURES**

### **If Session is Interrupted**

```powershell
# Recovery commands for any phase
Get-Location                    # Verify project directory
git status                      # Check current state
git branch                      # Verify current branch
npm run dev                     # Test current functionality
npx prisma studio              # Check database state

# Continue from last completed task
# Refer to progress tracking dashboard above
```

### **Rollback Procedures**

```powershell
# If need to rollback any phase
git log --oneline              # See recent commits
git reset --hard <commit-hash> # Rollback to specific commit
git push --force-with-lease    # Update remote branch

# Database rollback if needed
npx prisma migrate reset       # Reset database
npx prisma db push            # Reapply migrations
npx prisma db seed            # Reload seed data
```

**🎯 EXECUTION PLAN COMPLETE**
This plan provides comprehensive guidance for implementing multi-club athletics management with secure data isolation and context switching. Follow phases sequentially, test thoroughly, and maintain git workflow best practices throughout implementation.
