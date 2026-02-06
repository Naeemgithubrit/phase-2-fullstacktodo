# Tasks: Phase II - Full-Stack Todo Web Application

**Input**: Design documents from `/specs/001-phase-ii-specs/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app monorepo**: `backend/src/`, `frontend/src/`
- Backend: Python 3.11+, FastAPI, SQLModel, Neon PostgreSQL
- Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Better Auth

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Duration**: 2-4 hours

- [X] T001 Create backend project structure with src/, tests/, requirements.txt in backend/
- [X] T002 Create frontend project structure with Next.js App Router in frontend/
- [ ] T003 [P] Configure Python virtual environment and install FastAPI, SQLModel, psycopg2-binary, python-jose, passlib in backend/
- [ ] T004 [P] Install Next.js dependencies: better-auth, axios, tailwindcss in frontend/
- [X] T005 [P] Create .env.example in backend/ with DATABASE_URL, JWT_SECRET, BETTER_AUTH_SECRET, FRONTEND_URL
- [X] T006 [P] Create .env.local.example in frontend/ with NEXT_PUBLIC_API_URL, BETTER_AUTH_URL
- [X] T007 [P] Configure Tailwind CSS with custom theme in frontend/tailwind.config.js
- [X] T008 [P] Create global styles in frontend/src/styles/globals.css

**Acceptance Criteria**:
- Backend virtual environment activates successfully
- Frontend dev server starts on port 3000
- Backend server starts on port 8000
- Environment files created with all required variables

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Duration**: 10-14 hours

### Database & Configuration (4-6 hours)

- [X] T009 Create database configuration in backend/src/config.py with environment variable loading
- [X] T010 Create database connection and session management in backend/src/database.py with SQLModel engine
- [X] T011 Create User model in backend/src/models/user.py (id, email, password_hash, created_at, updated_at)
- [X] T012 Create Task model in backend/src/models/task.py (id, user_id FK, title, description, completed, timestamps)
- [X] T013 Create database tables with SQLModel.metadata.create_all() and verify schema
- [X] T014 [P] Create indexes: user_id, (user_id, completed), created_at DESC on tasks table
- [X] T015 Verify foreign key constraint (user_id → users.id) with CASCADE DELETE

### Authentication Framework (6-8 hours)

- [X] T016 Configure Better Auth in backend/src/config.py with JWT_SECRET and 24-hour expiration
- [X] T017 Create JWT verification middleware in backend/src/middleware/auth.py
- [X] T018 Create auth dependency for FastAPI routes in backend/src/middleware/auth.py (get_current_user)
- [X] T019 Create auth service in backend/src/services/auth_service.py with signup and login methods
- [X] T020 Create auth Pydantic schemas in backend/src/api/schemas/auth.py (SignupRequest, LoginRequest, TokenResponse)
- [X] T021 Create auth routes in backend/src/api/routes/auth.py (POST /auth/signup, POST /auth/login)
- [X] T022 Configure CORS in backend/src/main.py to allow frontend origin with credentials
- [X] T023 [P] Configure Better Auth client in frontend/src/lib/auth.ts
- [X] T024 [P] Create centralized API client in frontend/src/lib/api-client.ts with JWT token attachment
- [X] T025 [P] Create TypeScript types in frontend/src/lib/types.ts (User, Task, TaskCreateData, TaskUpdateData)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

**Acceptance Criteria**:
- Database connection successful
- Tables created with correct schema and indexes
- JWT middleware validates tokens correctly
- Auth endpoints return 401 for invalid credentials
- API client attaches JWT token to requests
- CORS configured for frontend-backend communication

---

## Phase 3: User Story 1 - User Authentication and Account Access (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts, log in securely, and access their personal workspace

**Independent Test**: Visit application, create account, logout, login, verify secure access to dashboard

**Duration**: 6-8 hours

### Frontend Authentication UI (6-8 hours)

- [X] T026 [P] [US1] Create Button component in frontend/src/components/ui/Button.tsx with variants (primary, secondary, danger)
- [X] T027 [P] [US1] Create Input component in frontend/src/components/ui/Input.tsx with validation states
- [X] T028 [P] [US1] Create LoadingSpinner component in frontend/src/components/ui/LoadingSpinner.tsx
- [X] T029 [US1] Create AuthForm component in frontend/src/components/auth/AuthForm.tsx (handles login and signup modes)
- [X] T030 [US1] Create login page in frontend/src/app/login/page.tsx with AuthForm in login mode
- [X] T031 [US1] Create signup page in frontend/src/app/signup/page.tsx with AuthForm in signup mode
- [X] T032 [US1] Create AppLayout component in frontend/src/components/layout/AppLayout.tsx with header and user menu
- [X] T033 [US1] Implement logout functionality in AppLayout with token clearing
- [X] T034 [US1] Add authentication redirect logic: unauthenticated users → login page
- [X] T035 [US1] Add token expiration handling: expired tokens → login with "Session expired" message

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

**Acceptance Criteria**:
- User can sign up with email and password
- User can log in with correct credentials
- JWT token issued on successful authentication
- User can log out successfully
- Unauthenticated users redirected to login
- Expired tokens redirect to login with message
- All acceptance scenarios from US1 pass

---

## Phase 4: User Story 2 - Task Creation and Management (Priority: P1) 🎯 MVP

**Goal**: Enable authenticated users to create, view, update, delete, and complete tasks

**Independent Test**: Login, create multiple tasks, view list, edit tasks, mark complete, delete tasks

**Duration**: 16-20 hours

### Backend Task API (8-12 hours)

- [X] T036 [P] [US2] Create Task Pydantic schemas in backend/src/api/schemas/task.py (TaskCreateRequest, TaskUpdateRequest, TaskCompletionRequest, TaskResponse)
- [X] T037 [US2] Create task service in backend/src/services/task_service.py with get_tasks(user_id) method
- [X] T038 [US2] Add create_task(user_id, data) method to task service with user association
- [X] T039 [US2] Add get_task(user_id, task_id) method to task service with ownership check
- [X] T040 [US2] Add update_task(user_id, task_id, data) method to task service with ownership check
- [X] T041 [US2] Add delete_task(user_id, task_id) method to task service with ownership check
- [X] T042 [US2] Add toggle_completion(user_id, task_id, completed) method to task service
- [X] T043 [US2] Create task routes in backend/src/api/routes/tasks.py with GET /api/{user_id}/tasks endpoint
- [X] T044 [US2] Add POST /api/{user_id}/tasks endpoint with validation (title 1-200 chars, description 0-1000 chars)
- [X] T045 [US2] Add GET /api/{user_id}/tasks/{id} endpoint with 404 handling
- [X] T046 [US2] Add PUT /api/{user_id}/tasks/{id} endpoint with validation
- [X] T047 [US2] Add DELETE /api/{user_id}/tasks/{id} endpoint with 204 response
- [X] T048 [US2] Add PATCH /api/{user_id}/tasks/{id}/complete endpoint
- [X] T049 [US2] Add error handling: 401 for auth failures, 403 for cross-user access, 422 for validation errors
- [X] T050 [US2] Verify user ID in URL matches JWT user ID, return 403 if mismatch

### Frontend Task UI (8-12 hours)

- [X] T051 [P] [US2] Create Textarea component in frontend/src/components/ui/Textarea.tsx
- [X] T052 [P] [US2] Create Modal component in frontend/src/components/ui/Modal.tsx for confirmations
- [X] T053 [US2] Add API client methods in frontend/src/lib/api-client.ts: getTasks, createTask, updateTask, deleteTask, toggleCompletion
- [X] T054 [US2] Create TaskItem component in frontend/src/components/tasks/TaskItem.tsx with checkbox and delete button
- [X] T055 [US2] Create TaskList component in frontend/src/components/tasks/TaskList.tsx displaying tasks in reverse chronological order
- [X] T056 [US2] Create TaskForm component in frontend/src/components/tasks/TaskForm.tsx for create/edit with validation
- [X] T057 [US2] Create tasks dashboard page in frontend/src/app/tasks/page.tsx with TaskList and "Create Task" button
- [X] T058 [US2] Create task create page in frontend/src/app/tasks/new/page.tsx with TaskForm
- [X] T059 [US2] Create task edit page in frontend/src/app/tasks/[id]/edit/page.tsx with TaskForm pre-filled
- [X] T060 [US2] Implement task completion toggle with immediate visual feedback and debouncing
- [X] T061 [US2] Implement task deletion with confirmation modal
- [X] T062 [US2] Add empty state display: "Create your first task" message when no tasks exist
- [X] T063 [US2] Add loading states for all task operations
- [X] T064 [US2] Add error handling with user-friendly messages for all operations
- [ ] T052 [P] [US2] Create Modal component in frontend/src/components/ui/Modal.tsx for confirmations
- [ ] T053 [US2] Add API client methods in frontend/src/lib/api-client.ts: getTasks, createTask, updateTask, deleteTask, toggleCompletion
- [ ] T054 [US2] Create TaskItem component in frontend/src/components/tasks/TaskItem.tsx with checkbox and delete button
- [ ] T055 [US2] Create TaskList component in frontend/src/components/tasks/TaskList.tsx displaying tasks in reverse chronological order
- [ ] T056 [US2] Create TaskForm component in frontend/src/components/tasks/TaskForm.tsx for create/edit with validation
- [ ] T057 [US2] Create tasks dashboard page in frontend/src/app/tasks/page.tsx with TaskList and "Create Task" button
- [ ] T058 [US2] Create task create page in frontend/src/app/tasks/new/page.tsx with TaskForm
- [ ] T059 [US2] Create task edit page in frontend/src/app/tasks/[id]/edit/page.tsx with TaskForm pre-filled
- [ ] T060 [US2] Implement task completion toggle with immediate visual feedback and debouncing
- [ ] T061 [US2] Implement task deletion with confirmation modal
- [ ] T062 [US2] Add empty state display: "Create your first task" message when no tasks exist
- [ ] T063 [US2] Add loading states for all task operations
- [ ] T064 [US2] Add error handling with user-friendly messages for all operations

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

**Acceptance Criteria**:
- User can create task with title (required) and description (optional)
- Task list displays all user's tasks in reverse chronological order
- User can edit task title and description
- User can toggle task completion with visual feedback
- User can delete task with confirmation
- Empty state displayed when no tasks
- Cross-user access returns 403 Forbidden
- All validation rules enforced (title 1-200 chars, description 0-1000 chars)
- All acceptance scenarios from US2 pass

---

## Phase 5: User Story 3 - Task Detail Viewing (Priority: P2)

**Goal**: Enable users to view complete task information including full description and metadata

**Independent Test**: Create task with long description, click from list, verify all details displayed

**Duration**: 4-6 hours

### Frontend Task Detail Page (4-6 hours)

- [X] T065 [US3] Create task detail page in frontend/src/app/tasks/[id]/page.tsx
- [X] T066 [US3] Display full task information: title, complete description, completion status
- [X] T067 [US3] Display timestamps: creation date and last updated date with formatting
- [X] T068 [US3] Add "Edit" button linking to edit page
- [X] T069 [US3] Add "Back to Tasks" navigation link
- [X] T070 [US3] Handle long descriptions with proper text wrapping and formatting
- [X] T071 [US3] Add loading state while fetching task details
- [X] T072 [US3] Handle 404 error when task not found or access denied

**Checkpoint**: All user stories should now be independently functional

**Acceptance Criteria**:
- User can click task from list to view detail page
- Full description displayed with proper formatting
- Creation date and updated date displayed
- Completion status clearly indicated
- Edit button navigates to edit page
- 404 handling for non-existent or unauthorized tasks
- All acceptance scenarios from US3 pass

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

**Duration**: 8-12 hours

### Integration & Validation (8-12 hours)

- [ ] T073 [P] Verify JWT authentication enforced on all 6 API endpoints
- [ ] T074 [P] Verify user isolation: cross-user access returns 403 for all endpoints
- [ ] T075 [P] Verify all validation rules: title length, description length, whitespace trimming
- [ ] T076 [P] Verify error responses match OpenAPI specification (401, 403, 404, 422, 500)
- [ ] T077 Test performance: task list loads in <2 seconds for 1000 tasks
- [ ] T078 Test performance: token validation adds <50ms latency
- [ ] T079 Test performance: task operations respond in <1 second
- [ ] T080 [P] Test all user flows end-to-end: signup → login → create task → edit → complete → delete → logout
- [ ] T081 [P] Verify UI matches specifications: Tailwind CSS only, no inline styles
- [ ] T082 [P] Test responsive design on mobile and desktop viewports
- [ ] T083 [P] Test accessibility: keyboard navigation, screen reader support, ARIA labels
- [ ] T084 Verify all 38 functional requirements (FR-001 through FR-038) are met
- [ ] T085 Verify all 16 success criteria (SC-001 through SC-016) are achieved
- [ ] T086 Run security audit: SQL injection prevention, XSS prevention, CSRF protection
- [ ] T087 Test edge cases: empty title, whitespace-only title, expired token, database unavailable
- [ ] T088 Validate against quickstart.md: all setup steps work correctly
- [ ] T089 Create backend tests in backend/tests/test_tasks.py for task CRUD operations
- [ ] T090 Create backend tests in backend/tests/test_auth.py for authentication flows
- [ ] T091 Run all backend tests with pytest and verify 100% pass rate
- [ ] T092 Document any deviations from specifications in specs/001-phase-ii-specs/deviations.md (if any)

**Acceptance Criteria**:
- All 38 functional requirements verified
- All 16 success criteria met
- All acceptance scenarios pass
- Performance targets achieved
- Security audit passed
- No spec violations
- Ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Requires US1 for authentication but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Requires US2 for task data but independently testable

### Within Each User Story

- Backend API before Frontend UI (for US2)
- Models before services (in Foundational)
- Services before endpoints (in Foundational and US2)
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004, T005, T006, T007, T008)
- Database & Configuration tasks can run parallel to Authentication Framework tasks in Foundational
- Within Foundational: T014, T023, T024, T025 can run in parallel
- Within US1: T026, T027, T028 can run in parallel
- Within US2 Backend: T036 can run parallel to service implementation
- Within US2 Frontend: T051, T052 can run in parallel
- Within Phase 6: T073, T074, T075, T076, T080, T081, T082, T083 can run in parallel
- Different user stories can be worked on in parallel by different team members after Foundational

---

## Parallel Example: User Story 2 Backend

```bash
# Launch schema creation in parallel:
Task T036: "Create Task Pydantic schemas in backend/src/api/schemas/task.py"

# Then launch service methods (after schemas complete):
Task T037: "Create task service with get_tasks method"
Task T038: "Add create_task method"
Task T039: "Add get_task method"
# ... etc
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (2-4 hours)
2. Complete Phase 2: Foundational (10-14 hours) - CRITICAL
3. Complete Phase 3: User Story 1 (6-8 hours)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Complete Phase 4: User Story 2 (16-20 hours)
6. **STOP and VALIDATE**: Test User Stories 1 and 2 together
7. Complete Phase 6: Integration & Validation (8-12 hours)
8. **Deploy MVP**: Full authentication + task management

**Total MVP Effort**: 42-68 hours

### Full Feature Set (All User Stories)

1. Complete MVP (User Stories 1 + 2)
2. Add Phase 5: User Story 3 (4-6 hours)
3. **STOP and VALIDATE**: Test all three stories
4. Complete Phase 6: Final validation
5. **Deploy Full Feature Set**

**Total Full Effort**: 46-74 hours

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (12-18 hours)
2. Once Foundational is done:
   - Developer A: User Story 1 (Frontend Auth UI)
   - Developer B: User Story 2 Backend (Task API)
   - Developer C: User Story 2 Frontend (Task UI) - starts after B completes API
3. Developer A helps with User Story 3 after US1 complete
4. Team completes Phase 6 together

---

## Task Summary

- **Total Tasks**: 92
- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 17 tasks
- **Phase 3 (US1 - Authentication)**: 10 tasks
- **Phase 4 (US2 - Task CRUD)**: 29 tasks
- **Phase 5 (US3 - Task Detail)**: 8 tasks
- **Phase 6 (Polish & Validation)**: 20 tasks

**Parallelizable Tasks**: 23 tasks marked with [P]

**MVP Scope (US1 + US2)**: 64 tasks (Phase 1 + 2 + 3 + 4 + partial Phase 6)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow specifications exactly - no undocumented changes
- All file paths assume monorepo structure with backend/ and frontend/
- Refer to plan.md for detailed acceptance criteria per stage
- Refer to contracts/openapi.yaml for exact API specifications
- Refer to data-model.md for entity definitions and relationships
