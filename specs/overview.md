# Project Overview: Todo Full-Stack Web Application

**Phase**: Phase II - Full-Stack Web Application
**Created**: 2026-01-11
**Status**: Active Development
**Constitution**: `.specify/memory/constitution.md` v1.1.0

---

## Purpose

This project delivers a production-quality, multi-user todo list web application demonstrating modern full-stack development practices with strict security and user isolation. The application enables authenticated users to manage personal task lists through a clean, professional web interface.

---

## Current Phase: Phase II

**In Scope**:
- Task CRUD operations (Create, Read, Update, Delete)
- User authentication and authorization (Better Auth with JWT)
- RESTful API backend
- Persistent storage with user isolation
- Professional web UI with Next.js
- Multi-user support with strict data separation

**Explicitly Out of Scope**:
- Chatbot features
- AI automation or intelligent task suggestions
- Phase III functionality (advanced features)
- Real-time collaboration
- Task sharing between users
- Mobile native applications

---

## Technology Stack

### Frontend
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth client integration
- **State Management**: React hooks and server components
- **API Communication**: Centralized API client with JWT token management

### Backend
- **Framework**: FastAPI (Python)
- **Database ORM**: SQLModel
- **Database**: Neon PostgreSQL
- **Authentication**: Better Auth with JWT tokens
- **Validation**: Pydantic models

### Authentication Model
- **Method**: JWT-based authentication
- **Token Issuance**: Better Auth handles signup/login flows
- **Token Verification**: Backend validates JWT on every request
- **Token Storage**: Frontend stores tokens securely
- **Token Transmission**: Authorization header (`Bearer <token>`)
- **User Isolation**: User ID extracted from JWT, enforced in all queries

---

## Architecture Principles

### Specifications as Single Source of Truth
All behavior, requirements, and acceptance criteria are defined in specification files under `/specs`. Implementation must strictly follow specifications. When conflicts arise between code and specifications, specifications take precedence.

### Security First
- Every API request requires valid JWT authentication
- User isolation enforced at database query level
- No cross-user data access permitted
- Token expiration enforced
- Malformed tokens rejected with 401 Unauthorized

### Monorepo Structure
```
/
├── backend/          # FastAPI application
├── frontend/         # Next.js application
├── specs/            # All specifications (this directory)
└── .specify/         # Spec-Kit Plus templates and tools
```

### Layer Boundaries
- **Frontend**: UI components, pages, API client, no business logic
- **Backend**: All business logic, validation, database access, stateless
- **Database**: Data persistence, foreign key enforcement, indexes

---

## Feature Overview

### 1. User Authentication
Users can sign up, log in, and log out. Authentication uses Better Auth with JWT tokens. All application features require authentication.

**Specification**: `specs/features/authentication.md`

### 2. Task Management
Authenticated users can create, view, update, delete, and mark tasks as complete. Each task belongs to exactly one user. Users can only access their own tasks.

**Specification**: `specs/features/task-crud.md`

---

## API Architecture

RESTful API following standard HTTP conventions:
- JSON request/response bodies
- Standard HTTP status codes
- JWT authentication on all endpoints
- User ID in URL path for user-scoped resources

**Specification**: `specs/api/rest-endpoints.md`

---

## Database Architecture

PostgreSQL database with two primary tables:
- `users` - Managed by Better Auth
- `tasks` - User-owned task records

Foreign key relationships enforce data integrity. Indexes optimize user-scoped queries.

**Specification**: `specs/database/schema.md`

---

## User Interface

Professional, clean, minimal SaaS-grade interface built with Next.js and Tailwind CSS. Desktop-first responsive design with mobile support.

**Specifications**:
- `specs/ui/components.md` - Reusable UI components
- `specs/ui/pages.md` - Page layouts and composition

---

## Quality Standards

### Acceptance Criteria
All features must meet documented acceptance criteria exactly. Partial compliance is considered non-compliant.

### User Isolation
Strict enforcement: users can only access their own data. All database queries filtered by authenticated user ID. URL parameters must match authenticated identity.

### API Compliance
All endpoints must follow documented paths, methods, request/response schemas, and error handling patterns.

### UI Quality
Production-quality visual design suitable for professional SaaS demonstration. Consistent spacing, accessible contrast, clear visual hierarchy.

---

## Development Workflow

1. **Specification First**: All features defined in specs before implementation
2. **Constitutional Compliance**: All work follows `.specify/memory/constitution.md`
3. **Planning**: Architecture decisions documented in `plan.md` files
4. **Task Breakdown**: Implementation tasks in `tasks.md` files
5. **Implementation**: Code follows specifications exactly
6. **Quality Gates**: Work complete only when all acceptance criteria met

---

## Success Metrics

- **Authentication**: Users can sign up and log in within 2 minutes
- **Task Operations**: Users can create, view, update, and delete tasks with immediate feedback
- **Performance**: Task list loads in under 2 seconds for up to 1000 tasks
- **Security**: Zero cross-user data access incidents
- **User Experience**: 90% of users successfully complete primary task flows on first attempt
- **Visual Quality**: Professional appearance suitable for portfolio demonstration

---

## Related Documents

- **Constitution**: `.specify/memory/constitution.md` - Governance and principles
- **Feature Specs**: `specs/features/` - Detailed feature requirements
- **API Specs**: `specs/api/` - REST endpoint definitions
- **Database Specs**: `specs/database/` - Schema and data model
- **UI Specs**: `specs/ui/` - Component and page specifications
