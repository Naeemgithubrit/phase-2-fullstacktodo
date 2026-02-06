# Phase 0: Research & Technology Decisions

**Feature**: Phase II - Full-Stack Todo Web Application
**Date**: 2026-01-11
**Status**: Completed

---

## Overview

This document captures all technology decisions, architectural patterns, and implementation approaches for Phase II. All decisions are based on specifications in `specs/features/`, `specs/api/`, `specs/database/`, and `specs/ui/`.

---

## Technology Stack Decisions

### Backend Framework: FastAPI

**Decision**: Use FastAPI for backend REST API implementation

**Rationale**:
- Specified in Backend Constitution (Principle 9)
- Native async support for high performance
- Automatic OpenAPI documentation generation
- Built-in request/response validation with Pydantic
- Excellent SQLModel integration
- Type hints throughout for better IDE support

**Alternatives Considered**:
- Django REST Framework: More batteries-included but heavier, slower for async operations
- Flask: Lighter but requires more manual setup for validation and async
- Express.js (Node): Would require JavaScript/TypeScript for backend, breaking monorepo language consistency

**Implementation Notes**:
- Use FastAPI 0.104+ for latest features
- Enable CORS for frontend-backend communication
- Use dependency injection for database sessions
- Implement custom exception handlers for consistent error responses

---

### ORM: SQLModel

**Decision**: Use SQLModel for database models and queries

**Rationale**:
- Specified in Backend Constitution (Principle 9)
- Combines SQLAlchemy and Pydantic for type-safe models
- Single model definition for database and API schemas
- Excellent FastAPI integration
- Type hints enable IDE autocomplete and type checking

**Alternatives Considered**:
- Raw SQLAlchemy: More verbose, requires separate Pydantic models
- Django ORM: Tied to Django framework
- Tortoise ORM: Less mature, smaller ecosystem

**Implementation Notes**:
- Define models with SQLModel's `table=True` parameter
- Use Pydantic models for request/response validation
- Implement automatic timestamp updates with SQLAlchemy events
- Use async session for non-blocking database operations

---

### Database: Neon PostgreSQL

**Decision**: Use Neon PostgreSQL for data persistence

**Rationale**:
- Specified in Database Constitution (Principle 10)
- Serverless PostgreSQL with automatic scaling
- Built-in connection pooling
- Point-in-time recovery and backups
- PostgreSQL compatibility ensures standard SQL features

**Alternatives Considered**:
- Traditional PostgreSQL: Requires manual server management
- MySQL: Less feature-rich for complex queries
- MongoDB: NoSQL not suitable for relational data with foreign keys

**Implementation Notes**:
- Use connection string from environment variable
- Enable SSL mode for secure connections
- Configure connection pool size (10-20 connections)
- Use UUID primary keys for better distribution

---

### Authentication: Better Auth + JWT

**Decision**: Use Better Auth for authentication with JWT tokens

**Rationale**:
- Specified in Authentication Constitution (Principle 5)
- Handles user registration, login, and password hashing
- Issues JWT tokens for stateless authentication
- Integrates with both frontend and backend
- Reduces custom authentication code

**Alternatives Considered**:
- Custom JWT implementation: More work, higher security risk
- Session-based auth: Requires server-side session storage, not stateless
- OAuth2 only: Overkill for Phase II, adds complexity

**Implementation Notes**:
- Configure Better Auth with JWT secret from environment
- Set token expiration to 24 hours
- Implement JWT verification middleware in FastAPI
- Extract user ID from token payload for authorization

---

### Frontend Framework: Next.js 14+ (App Router)

**Decision**: Use Next.js with App Router for frontend

**Rationale**:
- Specified in Frontend Constitution (Principle 8)
- Server components by default reduce client-side JavaScript
- Built-in routing with file-system based structure
- Excellent TypeScript support
- Automatic code splitting and optimization

**Alternatives Considered**:
- Next.js Pages Router: Older pattern, less efficient
- Create React App: No server-side rendering, manual routing
- Vite + React Router: More manual setup, no SSR out of box

**Implementation Notes**:
- Use App Router (`app/` directory structure)
- Server components for static content
- Client components only for interactive elements
- Use React Server Actions for form submissions where appropriate

---

### Styling: Tailwind CSS

**Decision**: Use Tailwind CSS for all styling

**Rationale**:
- Specified in UI Requirements (FR-031)
- Utility-first approach prevents style conflicts
- Consistent spacing and color scales
- Excellent responsive design support
- No runtime CSS-in-JS overhead

**Alternatives Considered**:
- CSS Modules: More verbose, harder to maintain consistency
- Styled Components: Runtime overhead, not specified
- Plain CSS: Harder to maintain, no utility classes

**Implementation Notes**:
- Configure Tailwind with custom theme if needed
- Use Tailwind's spacing scale consistently
- No inline styles permitted per specification
- Use Tailwind's responsive prefixes for mobile support

---

## Architectural Patterns

### API Architecture: RESTful

**Decision**: Implement RESTful API with standard HTTP methods

**Rationale**:
- Specified in API Constitution (Principle 7)
- Standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Resource-based URLs (`/api/{user_id}/tasks`)
- JSON request/response bodies
- Standard HTTP status codes

**Pattern Details**:
- GET for retrieval
- POST for creation
- PUT for full updates
- PATCH for partial updates (completion toggle)
- DELETE for removal
- 200/201 for success, 401/403/404/422 for errors

---

### Authentication Pattern: JWT Bearer Token

**Decision**: Use JWT tokens in Authorization header

**Rationale**:
- Specified in API Specification
- Stateless authentication (no server-side sessions)
- Token contains user ID for authorization
- Standard `Authorization: Bearer <token>` header
- 24-hour expiration for security

**Pattern Details**:
- Frontend stores token securely
- Token attached to every API request
- Backend validates token signature and expiration
- User ID extracted from token payload
- Mismatched user IDs return 403 Forbidden

---

### User Isolation Pattern: Query Filtering

**Decision**: Filter all database queries by authenticated user ID

**Rationale**:
- Specified in User Isolation Rule (Principle 6)
- Prevents cross-user data access
- Enforced at database query level
- URL user_id must match token user_id

**Pattern Details**:
- All task queries include `WHERE user_id = <authenticated_user_id>`
- Middleware extracts user_id from JWT
- Service layer receives authenticated user_id
- No queries without user_id filter

---

### Frontend State Management: React Hooks + Server Components

**Decision**: Use React hooks for client state, server components for data fetching

**Rationale**:
- Specified in Frontend Constitution (Principle 8)
- Server components fetch data on server
- Client components handle interactivity
- No global state management library needed for Phase II

**Pattern Details**:
- Server components for initial data loading
- Client components for forms and interactions
- useState for local component state
- No Redux/Zustand needed for Phase II scope

---

## Security Decisions

### Password Storage: Bcrypt via Better Auth

**Decision**: Use Better Auth's built-in bcrypt password hashing

**Rationale**:
- Industry standard for password hashing
- Automatic salt generation
- Configurable work factor (12 rounds minimum)
- Handled by Better Auth, no custom implementation

---

### SQL Injection Prevention: Parameterized Queries

**Decision**: Use SQLModel's parameterized queries exclusively

**Rationale**:
- SQLModel automatically parameterizes all queries
- No string concatenation of user input
- ORM handles escaping and sanitization

---

### CORS Configuration

**Decision**: Configure CORS to allow frontend origin only

**Rationale**:
- Frontend and backend on different ports in development
- Production may use different domains
- Restrict to specific origins, not wildcard

**Configuration**:
- Allow origin: Frontend URL from environment
- Allow methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allow headers: Authorization, Content-Type
- Allow credentials: true (for cookies if used)

---

## Performance Decisions

### Database Indexing Strategy

**Decision**: Index user_id, (user_id, completed), and created_at

**Rationale**:
- Specified in Database Specification
- user_id index for user-scoped queries
- Composite index for filtered queries
- created_at index for ordering

**Expected Performance**:
- Task list query <100ms for 1000 tasks
- Single task lookup <10ms
- Task operations <50ms

---

### Connection Pooling

**Decision**: Use connection pool with 10-20 connections

**Rationale**:
- Reduces connection overhead
- Handles concurrent requests efficiently
- Neon PostgreSQL supports pooling

---

## Testing Strategy

### Backend Testing: pytest

**Decision**: Use pytest for backend testing

**Rationale**:
- Python standard for testing
- Excellent fixture support
- Async test support
- FastAPI test client integration

**Test Types**:
- Unit tests for services
- Integration tests for API endpoints
- Contract tests for API schemas

---

### Frontend Testing: Jest + React Testing Library

**Decision**: Use Jest and React Testing Library for frontend

**Rationale**:
- Next.js default testing setup
- Component testing without implementation details
- User-centric testing approach

**Test Types**:
- Component unit tests
- Integration tests for user flows
- Accessibility tests

---

## Development Workflow

### Environment Variables

**Backend** (`.env`):
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
BETTER_AUTH_SECRET=<secret-key>
JWT_SECRET=<jwt-secret>
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:8000/auth
```

---

### Development Servers

**Backend**: `uvicorn src.main:app --reload --port 8000`
**Frontend**: `npm run dev` (port 3000)

---

## Migration Strategy

### Database Migrations

**Decision**: Use Alembic for database migrations

**Rationale**:
- SQLAlchemy standard migration tool
- Version-controlled schema changes
- Supports rollback

**Migration Files**:
- `001_create_users_table.py` - Better Auth users
- `002_create_tasks_table.py` - Tasks with foreign key

---

## Deployment Considerations

### Backend Deployment

**Approach**: Docker container with Uvicorn

**Configuration**:
- Python 3.11+ base image
- Install dependencies from requirements.txt
- Expose port 8000
- Use production ASGI server (Uvicorn with workers)

---

### Frontend Deployment

**Approach**: Vercel or Docker with Node.js

**Configuration**:
- Next.js build output
- Environment variables for API URL
- Static asset optimization

---

## Open Questions Resolved

All technical decisions are based on specifications. No open questions remain. All NEEDS CLARIFICATION items from Technical Context were resolved through specification review.

---

## References

- `specs/overview.md` - Project overview and technology stack
- `specs/features/authentication.md` - Authentication requirements
- `specs/features/task-crud.md` - Task management requirements
- `specs/api/rest-endpoints.md` - API endpoint specifications
- `specs/database/schema.md` - Database schema and indexes
- `specs/ui/components.md` - UI component specifications
- `specs/ui/pages.md` - UI page specifications
- `.specify/memory/constitution.md` - Constitutional principles
