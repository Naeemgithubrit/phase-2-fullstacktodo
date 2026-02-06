# Implementation Plan: Phase II - Full-Stack Todo Web Application

**Branch**: `001-phase-ii-specs` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-phase-ii-specs/spec.md`

**Note**: This plan implements Phase II specifications for a full-stack todo application with authentication and task management.

## Summary

Build a production-quality, multi-user todo list web application with strict security and user isolation. The application enables authenticated users to manage personal task lists through a professional web interface. Core features include user authentication (Better Auth with JWT), task CRUD operations, and a clean Next.js UI with Tailwind CSS. All data persists in Neon PostgreSQL with enforced user ownership and foreign key relationships.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript/JavaScript (frontend with Next.js 14+)
**Primary Dependencies**: FastAPI, SQLModel, Neon PostgreSQL, Next.js (App Router), Better Auth, Tailwind CSS
**Storage**: Neon PostgreSQL with SQLModel ORM
**Testing**: pytest (backend), Jest/React Testing Library (frontend)
**Target Platform**: Web application - Linux/Docker server (backend), modern browsers (frontend)
**Project Type**: Web application (monorepo with separate frontend and backend)
**Performance Goals**:
- Task list loads in <2 seconds for 1000 tasks
- Token validation adds <50ms latency
- Task operations respond in <1 second
- 95% of operations succeed on first attempt

**Constraints**:
- Strict user isolation (zero cross-user data access)
- JWT authentication required on all API requests
- RESTful API conventions mandatory
- Server components default in Next.js
- No inline styles (Tailwind CSS only)

**Scale/Scope**:
- Up to 1000 tasks per user
- Multi-user support with complete data isolation
- 6 REST API endpoints
- 10 reusable UI components
- 5 complete pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitutional Compliance

✅ **Constitutional Authority** (Principle 1): All specifications defined and approved. Implementation will follow specs exactly.

✅ **Phase Enforcement Rule** (Principle 2): Scope strictly limited to Phase II features (task CRUD, authentication). No chatbot or AI features.

✅ **Spec-First Rule** (Principle 3): All specifications created before planning. Implementation will reference specs for every decision.

✅ **Acceptance Criteria Enforcement** (Principle 4): 38 functional requirements defined with clear acceptance criteria. All must be met exactly.

✅ **Authentication Constitution** (Principle 5): JWT authentication specified on all endpoints. Better Auth configured for token issuance.

✅ **User Isolation Rule** (Principle 6): Database queries filtered by user ID. Cross-user access returns 403 Forbidden.

✅ **API Constitution** (Principle 7): 6 RESTful endpoints defined with documented paths, methods, and schemas.

✅ **Frontend Constitution** (Principle 8): Next.js App Router specified. Server components default. Centralized API client with JWT tokens.

✅ **Backend Constitution** (Principle 9): FastAPI with SQLModel specified. All business logic in backend. Stateless and secure.

✅ **Database Constitution** (Principle 10): Foreign key relationships defined. Indexes for user-based filtering. Timestamps managed consistently.

✅ **Security Constitution** (Principle 11): JWT verification on every request. Token expiration enforced. Malformed tokens rejected.

✅ **Monorepo Constitution** (Principle 12): Monorepo structure with frontend/ and backend/ directories. Specs in specs/ directory.

✅ **Change Control Rule** (Principle 13): Specifications finalized before implementation. No undocumented changes permitted.

✅ **Quality Gate Rule** (Principle 14): Implementation not complete until all acceptance criteria met and security enforced.

### Gate Status: ✅ PASSED

All constitutional principles satisfied. No violations to justify. Ready to proceed with Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-phase-ii-specs/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── openapi.yaml     # REST API OpenAPI specification
│   └── schemas/         # Request/response JSON schemas
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Specification quality checklist (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Environment configuration
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py             # User SQLModel (Better Auth managed)
│   │   └── task.py             # Task SQLModel with user FK
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth.py             # JWT verification middleware
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py         # Authentication endpoints
│   │   │   └── tasks.py        # Task CRUD endpoints
│   │   └── schemas/
│   │       ├── __init__.py
│   │       ├── task.py         # Pydantic request/response models
│   │       └── auth.py         # Auth request/response models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── task_service.py     # Task business logic
│   │   └── auth_service.py     # Auth business logic
│   └── database.py             # Database connection and session
├── tests/
│   ├── conftest.py             # Pytest fixtures
│   ├── test_auth.py            # Authentication tests
│   └── test_tasks.py           # Task CRUD tests
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
└── CLAUDE.md                   # Backend-specific development rules

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with AppLayout
│   │   ├── page.tsx            # Home page (redirect to /tasks)
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── signup/
│   │   │   └── page.tsx        # Signup page
│   │   └── tasks/
│   │       ├── page.tsx        # Tasks dashboard
│   │       ├── [id]/
│   │       │   ├── page.tsx    # Task detail page
│   │       │   └── edit/
│   │       │       └── page.tsx # Task edit page
│   │       └── new/
│   │           └── page.tsx    # Task create page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx      # Reusable button component
│   │   │   ├── Input.tsx       # Reusable input component
│   │   │   ├── Textarea.tsx    # Reusable textarea component
│   │   │   ├── Modal.tsx       # Reusable modal component
│   │   │   └── LoadingSpinner.tsx # Loading indicator
│   │   ├── layout/
│   │   │   └── AppLayout.tsx   # Main app layout shell
│   │   ├── auth/
│   │   │   └── AuthForm.tsx    # Login/signup form component
│   │   └── tasks/
│   │       ├── TaskList.tsx    # Task list container
│   │       ├── TaskItem.tsx    # Individual task item
│   │       └── TaskForm.tsx    # Task create/edit form
│   ├── lib/
│   │   ├── api-client.ts       # Centralized API client with JWT
│   │   ├── auth.ts             # Better Auth configuration
│   │   └── types.ts            # TypeScript type definitions
│   └── styles/
│       └── globals.css         # Global styles and Tailwind imports
├── public/                     # Static assets
├── tests/
│   └── components/             # Component tests
├── package.json                # Node dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
├── .env.local.example          # Environment variables template
└── CLAUDE.md                   # Frontend-specific development rules

specs/
├── overview.md                 # Project overview (completed)
├── features/
│   ├── authentication.md       # Auth specification (completed)
│   └── task-crud.md            # Task CRUD specification (completed)
├── api/
│   └── rest-endpoints.md       # API specification (completed)
├── database/
│   └── schema.md               # Database specification (completed)
└── ui/
    ├── components.md           # UI components specification (completed)
    └── pages.md                # UI pages specification (completed)

.specify/
├── memory/
│   └── constitution.md         # Project constitution (v1.1.0)
├── templates/                  # Spec-Kit templates
└── scripts/                    # Automation scripts
```

**Structure Decision**: Web application monorepo structure selected. Backend and frontend are separate directories at repository root, each with their own dependencies and test suites. Specifications live in `specs/` directory following Spec-Kit conventions. This structure enforces clear layer boundaries per Monorepo Constitution (Principle 12) and enables independent development and deployment of frontend and backend.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations. All principles satisfied. No complexity justification required.
No constitutional violations. All principles satisfied. No complexity justification required.

---

## Phase 0: Research & Technology Decisions

**Status**: ✅ Completed

**Output**: `research.md`

**Summary**: All technology decisions documented. Key decisions include:
- Backend: FastAPI + SQLModel + Neon PostgreSQL
- Frontend: Next.js 14+ (App Router) + Tailwind CSS
- Authentication: Better Auth + JWT tokens
- Testing: pytest (backend), Jest (frontend)

**Rationale**: All decisions based on constitutional requirements and specifications. No open questions remain.

---

## Phase 1: Design & Contracts

**Status**: ✅ Completed

**Outputs**:
- `data-model.md` - Entity definitions with validation rules
- `contracts/openapi.yaml` - REST API OpenAPI specification
- `quickstart.md` - Implementation guide

**Summary**: Complete data model with User and Task entities. Foreign key relationships defined. 6 REST API endpoints specified with full request/response schemas. Implementation guide provides step-by-step instructions.

---

## Implementation Execution Plan

The following stages must be executed in order. Each stage builds on the previous stage and has clear acceptance criteria.

### Stage 1: Infrastructure & Environment Setup

**Objective**: Prepare backend, frontend, and shared configuration to support authenticated full-stack development

**Duration**: 2-4 hours

**Spec References**:
- `specs/overview.md`
- `specs/features/authentication.md`
- `specs/database/schema.md`

**Backend Tasks**:
1. Configure FastAPI project structure per monorepo layout
2. Create virtual environment and install dependencies (FastAPI, SQLModel, psycopg2, python-jose, passlib)
3. Configure SQLModel and Neon PostgreSQL connection
4. Load environment variables (DATABASE_URL, JWT_SECRET, BETTER_AUTH_SECRET)
5. Prepare base FastAPI app with CORS configuration
6. Create router structure for API endpoints

**Frontend Tasks**:
1. Initialize Next.js App Router structure
2. Install dependencies (Next.js, React, Tailwind CSS, Better Auth, axios)
3. Configure Tailwind CSS with custom theme
4. Set up global styles
5. Prepare environment variable handling for Better Auth and API URL
6. Create base layout structure

**Dependencies**: None

**Acceptance Criteria**:
- Backend server starts successfully on port 8000
- Frontend dev server starts successfully on port 3000
- Environment variables loaded correctly
- CORS configured for frontend-backend communication
- Project structure matches specification

---

### Stage 2: Authentication & JWT Verification

**Objective**: Establish secure, stateless authentication across frontend and backend

**Duration**: 6-8 hours

**Spec References**:
- `specs/features/authentication.md`
- `specs/api/rest-endpoints.md`
- FR-001 through FR-010 (Authentication requirements)

**Backend Tasks**:
1. Implement JWT verification middleware
2. Create auth dependency for FastAPI routes
3. Enforce user ID matching between JWT and API route parameters
4. Implement Better Auth integration
5. Create auth service with signup and login methods
6. Return appropriate error responses (401 for auth failures)

**Frontend Tasks**:
1. Configure Better Auth client
2. Implement centralized API client with JWT token handling
3. Implement login page
4. Implement signup page
5. Create AuthForm component
6. Implement logout functionality
7. Handle token expiration and session management

**Dependencies**: Stage 1 completed

**Acceptance Criteria**:
- User can sign up with email and password
- User can log in with correct credentials
- JWT token issued on successful authentication
- Token attached to all API requests
- Invalid tokens return 401 Unauthorized
- Expired tokens redirect to login
- User can log out successfully
- All acceptance scenarios from User Story 1 pass

---

### Stage 3: Database Models & Ownership Enforcement

**Objective**: Ensure persistent, user-isolated task storage

**Duration**: 4-6 hours

**Spec References**:
- `specs/database/schema.md`
- `specs/features/task-crud.md`
- `specs/001-phase-ii-specs/data-model.md`
- FR-035 through FR-038 (Data persistence requirements)

**Backend Tasks**:
1. Configure database connection with connection pooling
2. Define User model (managed by Better Auth)
3. Define Task model with foreign key to User
4. Create database tables
5. Create indexes (user_id, user_id+completed, created_at)
6. Implement automatic timestamp updates
7. Test database connection and constraints

**Frontend Tasks**: None

**Dependencies**: Stage 2 completed

**Acceptance Criteria**:
- Database connection successful
- Users and tasks tables created with correct schema
- Foreign key constraint enforced with CASCADE DELETE
- Indexes created and functional
- Timestamps automatically managed
- Check constraints enforced

---

### Stage 4: REST API Implementation

**Objective**: Expose fully authenticated RESTful endpoints for task management

**Duration**: 8-12 hours

**Spec References**:
- `specs/api/rest-endpoints.md`
- `specs/features/task-crud.md`
- `specs/001-phase-ii-specs/contracts/openapi.yaml`
- FR-011 through FR-028 (Task management and API requirements)

**Backend Tasks**:
1. Create Pydantic schemas for requests/responses
2. Implement task service with all CRUD operations
3. Implement 6 task routes (GET, POST, PUT, PATCH, DELETE)
4. Add validation (title 1-200 chars, description 0-1000 chars)
5. Implement error handling (401, 403, 404, 422, 500)
6. Add request/response logging
7. Test all endpoints

**Frontend Tasks**:
1. Create API client methods for all endpoints
2. Define TypeScript types
3. Implement error handling
4. Add loading states
5. Test API integration

**Dependencies**: Stage 3 completed

**Acceptance Criteria**:
- All 6 REST endpoints functional
- JWT authentication enforced on all endpoints
- User isolation working (403 for cross-user access)
- Validation rules enforced
- Appropriate HTTP status codes returned
- Error responses include detailed messages
- Frontend can successfully call all endpoints
- All acceptance scenarios from User Story 2 pass

---

### Stage 5: Pixel-Perfect UI Implementation

**Objective**: Build a professional, responsive, production-quality UI

**Duration**: 24-35 hours

**Spec References**:
- `specs/ui/components.md`
- `specs/ui/pages.md`
- FR-029 through FR-034 (UI requirements)

**Frontend Tasks**:

**Phase 5A: Base UI Components** (4-6 hours)
- Button, Input, Textarea, Modal, LoadingSpinner components

**Phase 5B: Layout Components** (2-3 hours)
- AppLayout with header and user menu

**Phase 5C: Task Components** (6-8 hours)
- TaskList, TaskItem, TaskForm components

**Phase 5D: Pages** (8-12 hours)
- Login, Signup, Tasks dashboard, Task detail, Task create/edit pages

**Phase 5E: Interactions & Polish** (4-6 hours)
- Task completion toggle, deletion with confirmation
- Form validation, loading states, error handling
- Responsive design, accessibility

**Backend Tasks**: None

**Dependencies**: Stage 4 completed

**Acceptance Criteria**:
- All 10 UI components implemented per specification
- All 5 pages implemented with pixel-perfect layouts
- Tailwind CSS used exclusively (no inline styles)
- Responsive design works on mobile and desktop
- All interactions functional
- Loading and error states handled
- Accessibility requirements met
- Professional SaaS-grade appearance

---

### Stage 6: Integration, Validation & Spec Compliance

**Objective**: Ensure the system matches specifications exactly

**Duration**: 8-12 hours

**Spec References**: All Phase II specifications

**Tasks**:
1. Validate JWT enforcement on all endpoints
2. Verify user isolation (cross-user access returns 403)
3. Test all validation rules
4. Verify error responses match specification
5. Test performance (task list <2s for 1000 tasks)
6. Run all test suites
7. Test all user flows end-to-end
8. Verify UI matches specifications
9. Test error handling and edge cases
10. Security testing
11. Performance testing

**Dependencies**: Stage 5 completed

**Acceptance Criteria**:
- All 38 functional requirements verified
- All 16 success criteria met
- All acceptance scenarios pass
- All tests passing
- No spec violations
- Performance targets achieved
- Security audit passed
- Ready for deployment

---

## Total Estimated Effort

- **Stage 1**: 2-4 hours
- **Stage 2**: 6-8 hours
- **Stage 3**: 4-6 hours
- **Stage 4**: 8-12 hours
- **Stage 5**: 24-35 hours
- **Stage 6**: 8-12 hours

**Total**: 52-77 hours (approximately 1-2 weeks for single developer)

---

## Risk Assessment

### Technical Risks

**Risk**: Better Auth integration complexity
- **Mitigation**: Follow Better Auth documentation closely, use official examples
- **Fallback**: Implement custom JWT authentication if needed

**Risk**: Database connection issues with Neon PostgreSQL
- **Mitigation**: Test connection early, use connection pooling, handle timeouts
- **Fallback**: Use local PostgreSQL for development

**Risk**: CORS configuration issues
- **Mitigation**: Configure CORS early, test with frontend immediately
- **Fallback**: Use proxy in development if needed

**Risk**: Performance issues with 1000 tasks
- **Mitigation**: Implement indexes as specified, test with realistic data
- **Fallback**: Add pagination if needed (requires spec update)

### Schedule Risks

**Risk**: UI implementation takes longer than estimated
- **Mitigation**: Start with core components, iterate on polish
- **Fallback**: Simplify UI while maintaining spec compliance

**Risk**: Integration issues between frontend and backend
- **Mitigation**: Test integration early and often
- **Fallback**: Add debugging tools, detailed logging

---

## Success Metrics

### Functional Completeness
- All 38 functional requirements implemented
- All 6 REST API endpoints functional
- All 10 UI components implemented
- All 5 pages implemented

### Quality Metrics
- All acceptance scenarios pass
- All tests passing (backend and frontend)
- Zero security vulnerabilities
- Zero cross-user data access incidents

### Performance Metrics
- Task list loads in <2 seconds for 1000 tasks
- Token validation adds <50ms latency
- Task operations respond in <1 second
- 95% of operations succeed on first attempt

### User Experience Metrics
- Professional SaaS-grade appearance
- Responsive design works on all devices
- Accessibility requirements met
- 90% of users complete primary flows on first attempt

---

## Next Steps

After completing this implementation plan:

1. **Execute Implementation**: Follow stages 1-6 in order
2. **Run `/sp.tasks`**: Generate detailed task breakdown from this plan
3. **Implement Tasks**: Execute tasks following specifications
4. **Validate Compliance**: Ensure all requirements met
5. **Deploy**: Deploy to staging and production environments

---

## References

### Specifications
- `specs/overview.md` - Project overview
- `specs/features/authentication.md` - Authentication specification
- `specs/features/task-crud.md` - Task CRUD specification
- `specs/api/rest-endpoints.md` - API specification
- `specs/database/schema.md` - Database specification
- `specs/ui/components.md` - UI components specification
- `specs/ui/pages.md` - UI pages specification

### Planning Artifacts
- `specs/001-phase-ii-specs/spec.md` - Feature specification
- `specs/001-phase-ii-specs/research.md` - Technology decisions
- `specs/001-phase-ii-specs/data-model.md` - Data model
- `specs/001-phase-ii-specs/contracts/openapi.yaml` - API contract
- `specs/001-phase-ii-specs/quickstart.md` - Implementation guide

### Constitution
- `.specify/memory/constitution.md` - Constitutional principles (v1.1.0)
