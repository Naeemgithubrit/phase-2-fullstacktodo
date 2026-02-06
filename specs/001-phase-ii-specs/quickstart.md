# Phase II Quickstart Guide

**Feature**: Phase II - Full-Stack Todo Web Application
**Date**: 2026-01-11
**Audience**: Developers implementing Phase II specifications

---

## Overview

This guide provides step-by-step instructions for implementing Phase II of the Todo Full-Stack Web Application. Follow these stages in order to build a production-quality application with authentication and task management.

---

## Prerequisites

### Required Software

- **Python 3.11+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **PostgreSQL** - Database (Neon PostgreSQL account)
- **Git** - Version control
- **Code Editor** - VS Code recommended

### Required Accounts

- **Neon PostgreSQL** - Database hosting
- **Better Auth** - Authentication service (or self-hosted)

### Environment Setup

1. Clone repository
2. Create virtual environment for backend
3. Install dependencies for both frontend and backend
4. Configure environment variables

---

## Implementation Stages

### Stage 1: Infrastructure & Environment Setup

**Objective**: Prepare backend, frontend, and shared configuration

**Backend Setup**:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlmodel psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart

# Create requirements.txt
pip freeze > requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

**Frontend Setup**:

```bash
# Navigate to frontend directory
cd frontend

# Initialize Next.js project (if not already done)
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Install dependencies
npm install better-auth axios

# Create .env.local file
cp .env.local.example .env.local
# Edit .env.local with API URL
```

**Verification**:
- Backend virtual environment activates successfully
- Frontend dependencies install without errors
- Environment files created and configured

---

### Stage 2: Authentication & JWT Verification

**Objective**: Establish secure, stateless authentication

**Backend Tasks**:

1. **Configure Better Auth** (`backend/src/config.py`):
   - Load JWT_SECRET from environment
   - Configure token expiration (24 hours)

2. **Implement JWT Middleware** (`backend/src/middleware/auth.py`):
   - Verify JWT token signature
   - Extract user ID from token payload
   - Reject invalid/expired tokens with 401

3. **Create Auth Service** (`backend/src/services/auth_service.py`):
   - Integrate with Better Auth
   - Handle user registration
   - Handle user login
   - Issue JWT tokens

**Frontend Tasks**:

1. **Configure Better Auth** (`frontend/src/lib/auth.ts`):
   - Set up Better Auth client
   - Configure API endpoints

2. **Create API Client** (`frontend/src/lib/api-client.ts`):
   - Centralized HTTP client
   - Attach JWT token to all requests
   - Handle 401 responses (redirect to login)

3. **Implement Auth Pages**:
   - Login page (`frontend/src/app/login/page.tsx`)
   - Signup page (`frontend/src/app/signup/page.tsx`)
   - AuthForm component (`frontend/src/components/auth/AuthForm.tsx`)

**Verification**:
- User can sign up successfully
- User can log in and receive JWT token
- Token is attached to API requests
- Invalid tokens return 401

**Spec References**:
- `specs/features/authentication.md`
- `specs/api/rest-endpoints.md`

---

### Stage 3: Database Models & Ownership Enforcement

**Objective**: Ensure persistent, user-isolated task storage

**Backend Tasks**:

1. **Configure Database** (`backend/src/database.py`):
   - Create SQLModel engine with Neon PostgreSQL connection
   - Configure connection pooling
   - Create session dependency for FastAPI

2. **Define User Model** (`backend/src/models/user.py`):
   - SQLModel with table=True
   - Fields: id, email, password_hash, created_at, updated_at
   - Managed by Better Auth

3. **Define Task Model** (`backend/src/models/task.py`):
   - SQLModel with table=True
   - Fields: id, user_id (FK), title, description, completed, timestamps
   - Validation constraints
   - Foreign key to User with CASCADE DELETE

4. **Create Database Tables**:
   - Run migrations or use SQLModel.metadata.create_all()
   - Verify tables created with correct schema

5. **Create Indexes**:
   - Index on tasks.user_id
   - Composite index on (user_id, completed)
   - Index on created_at DESC

**Verification**:
- Database connection successful
- Tables created with correct schema
- Foreign key constraints enforced
- Indexes created

**Spec References**:
- `specs/database/schema.md`
- `specs/001-phase-ii-specs/data-model.md`

---

### Stage 4: REST API Implementation

**Objective**: Expose fully authenticated RESTful endpoints

**Backend Tasks**:

1. **Create Pydantic Schemas** (`backend/src/api/schemas/task.py`):
   - TaskCreateRequest
   - TaskUpdateRequest
   - TaskCompletionRequest
   - TaskResponse

2. **Implement Task Service** (`backend/src/services/task_service.py`):
   - get_tasks(user_id) - Filter by user
   - get_task(user_id, task_id) - Ownership check
   - create_task(user_id, data) - Associate with user
   - update_task(user_id, task_id, data) - Ownership check
   - delete_task(user_id, task_id) - Ownership check
   - toggle_completion(user_id, task_id, completed) - Ownership check

3. **Implement Task Routes** (`backend/src/api/routes/tasks.py`):
   - GET /api/{user_id}/tasks
   - POST /api/{user_id}/tasks
   - GET /api/{user_id}/tasks/{id}
   - PUT /api/{user_id}/tasks/{id}
   - DELETE /api/{user_id}/tasks/{id}
   - PATCH /api/{user_id}/tasks/{id}/complete

4. **Add Validation**:
   - Title: 1-200 characters, trim whitespace
   - Description: 0-1000 characters, optional
   - User ID matching between JWT and URL

5. **Configure CORS**:
   - Allow frontend origin
   - Allow credentials
   - Allow required headers and methods

**Frontend Tasks**:

1. **Create API Client Methods** (`frontend/src/lib/api-client.ts`):
   - getTasks(userId)
   - getTask(userId, taskId)
   - createTask(userId, data)
   - updateTask(userId, taskId, data)
   - deleteTask(userId, taskId)
   - toggleCompletion(userId, taskId, completed)

2. **Define TypeScript Types** (`frontend/src/lib/types.ts`):
   - Task interface
   - TaskCreateData interface
   - TaskUpdateData interface

**Verification**:
- All 6 endpoints respond correctly
- JWT authentication enforced
- User isolation working (403 for cross-user access)
- Validation errors return 422
- CORS configured correctly

**Spec References**:
- `specs/api/rest-endpoints.md`
- `specs/features/task-crud.md`
- `specs/001-phase-ii-specs/contracts/openapi.yaml`

---

### Stage 5: Pixel-Perfect UI Implementation

**Objective**: Build professional, responsive, production-quality UI

**Frontend Tasks**:

1. **Create Base UI Components** (`frontend/src/components/ui/`):
   - Button.tsx - Reusable button with variants
   - Input.tsx - Text input with validation
   - Textarea.tsx - Multi-line input
   - Modal.tsx - Dialog component
   - LoadingSpinner.tsx - Loading indicator

2. **Create Layout Components**:
   - AppLayout.tsx - Main app shell with header
   - Header with logo and user menu

3. **Create Task Components** (`frontend/src/components/tasks/`):
   - TaskList.tsx - Task list container
   - TaskItem.tsx - Individual task with checkbox
   - TaskForm.tsx - Create/edit form with validation

4. **Implement Pages** (`frontend/src/app/`):
   - Login page - AuthForm in login mode
   - Signup page - AuthForm in signup mode
   - Tasks dashboard - TaskList with all tasks
   - Task detail page - Full task information
   - Task create page - TaskForm for new task
   - Task edit page - TaskForm with existing data

5. **Configure Tailwind**:
   - Custom theme if needed
   - Consistent spacing scale
   - Color palette

6. **Implement Interactions**:
   - Task completion toggle
   - Task deletion with confirmation
   - Form validation
   - Error handling
   - Loading states

**Verification**:
- All pages render correctly
- Components match specifications
- Tailwind CSS applied consistently
- No inline styles
- Responsive design works
- Accessibility features present

**Spec References**:
- `specs/ui/components.md`
- `specs/ui/pages.md`

---

### Stage 6: Integration, Validation & Spec Compliance

**Objective**: Ensure system matches specifications exactly

**Backend Validation**:
- JWT verification on all endpoints
- User isolation enforced
- Validation rules applied
- Error responses correct
- Performance targets met

**Frontend Validation**:
- All pages functional
- Components match specs
- API integration working
- Error handling complete
- Empty states displayed

**End-to-End Testing**:
1. User signup flow
2. User login flow
3. Create task
4. View task list
5. View task detail
6. Edit task
7. Toggle completion
8. Delete task
9. Logout

**Spec Compliance Checklist**:
- [ ] All 38 functional requirements met
- [ ] All 16 success criteria achieved
- [ ] All acceptance scenarios pass
- [ ] Security requirements enforced
- [ ] Performance targets met
- [ ] UI matches pixel-perfect specs

**Spec References**:
- All Phase II specifications
- `specs/001-phase-ii-specs/checklists/requirements.md`

---

## Running the Application

### Development Mode

**Backend**:
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn src.main:app --reload --port 8000
```

**Frontend**:
```bash
cd frontend
npm run dev
```

**Access**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## Deployment

### Backend Deployment

1. Build Docker image
2. Set environment variables
3. Deploy to cloud provider
4. Configure database connection
5. Enable HTTPS

### Frontend Deployment

1. Build Next.js application: `npm run build`
2. Deploy to Vercel or similar
3. Set environment variables
4. Configure custom domain

---

## Troubleshooting

### Common Issues

**Database Connection Failed**:
- Check DATABASE_URL in .env
- Verify Neon PostgreSQL credentials
- Ensure SSL mode enabled

**JWT Token Invalid**:
- Check JWT_SECRET matches between frontend and backend
- Verify token not expired
- Check Authorization header format

**CORS Errors**:
- Verify CORS configuration in backend
- Check frontend URL in allowed origins
- Ensure credentials enabled

**Task Not Found (404)**:
- Verify user_id matches authenticated user
- Check task exists in database
- Verify ownership

---

## Next Steps

After completing all stages:

1. Run full test suite
2. Validate against specifications
3. Perform security audit
4. Test performance under load
5. Deploy to staging environment
6. User acceptance testing
7. Deploy to production

---

## References

- **Specifications**: `specs/` directory
- **Constitution**: `.specify/memory/constitution.md`
- **API Contracts**: `specs/001-phase-ii-specs/contracts/openapi.yaml`
- **Data Model**: `specs/001-phase-ii-specs/data-model.md`
- **Research**: `specs/001-phase-ii-specs/research.md`
