# Phase 1: Data Model

**Feature**: Phase II - Full-Stack Todo Web Application
**Date**: 2026-01-11
**Status**: Completed

---

## Overview

This document defines all data entities, their relationships, validation rules, and state transitions for Phase II. All entities are derived from specifications in `specs/database/schema.md` and `specs/features/`.

---

## Entities

### 1. User

**Purpose**: Represents an authenticated user account

**Source Specification**: `specs/database/schema.md`, `specs/features/authentication.md`

**Fields**:

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address (username) |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last account update timestamp |

**Validation Rules**:
- Email must be valid format (RFC 5322)
- Email must be unique across all users
- Password must be at least 8 characters before hashing
- Password must be hashed with bcrypt (12+ rounds)
- Timestamps must be in UTC with timezone

**Relationships**:
- One-to-Many with Task (one user has many tasks)

**Indexes**:
- Primary key index on `id` (automatic)
- Unique index on `email` (automatic from UNIQUE constraint)

**Managed By**: Better Auth library handles user creation, password hashing, and authentication

**State Transitions**: None (users don't have state beyond creation)

---

### 2. Task

**Purpose**: Represents a user's todo item

**Source Specification**: `specs/database/schema.md`, `specs/features/task-crud.md`

**Fields**:

| Field Name | Type | Constraints | Description |
|------------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() | Unique task identifier |
| user_id | UUID | FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE, NOT NULL | Task owner (foreign key) |
| title | VARCHAR(200) | NOT NULL, CHECK(LENGTH(TRIM(title)) >= 1 AND LENGTH(title) <= 200) | Task title (1-200 characters) |
| description | TEXT | NULL, CHECK(description IS NULL OR LENGTH(description) <= 1000) | Task description (0-1000 characters, optional) |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Task completion status |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Task creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last task update timestamp |

**Validation Rules**:
- Title must not be empty or whitespace-only (trimmed length >= 1)
- Title must be 1-200 characters after trimming
- Description must be 0-1000 characters if provided
- Description can be NULL (optional field)
- Completed must be boolean (true/false)
- user_id must reference valid user
- Timestamps must be in UTC with timezone

**Relationships**:
- Many-to-One with User (many tasks belong to one user)
- Foreign key constraint with CASCADE DELETE (deleting user deletes all their tasks)

**Indexes**:
- Primary key index on `id` (automatic)
- Index on `user_id` for user-scoped queries: `idx_tasks_user_id`
- Composite index on `(user_id, completed)` for filtered queries: `idx_tasks_user_completed`
- Index on `created_at DESC` for ordering: `idx_tasks_created_at`

**State Transitions**:

```
[Created] ---> [Active] (completed = false)
              |
              v
          [Completed] (completed = true)
              |
              v
          [Active] (can be toggled back)
```

**State Rules**:
- New tasks start in Active state (completed = false)
- Tasks can be toggled between Active and Completed
- Tasks can be deleted from any state
- Completion state persists across sessions

---

### 3. JWT Token (Logical Entity)

**Purpose**: Authentication credential for API requests

**Source Specification**: `specs/features/authentication.md`, `specs/api/rest-endpoints.md`

**Note**: This is a logical entity, not stored in database. Tokens are issued by Better Auth and validated by backend.

**Structure** (JWT Payload):

| Field Name | Type | Description |
|------------|------|-------------|
| user_id | UUID | Authenticated user identifier |
| email | String | User email address |
| exp | Integer | Expiration timestamp (Unix epoch) |
| iat | Integer | Issued at timestamp (Unix epoch) |

**Validation Rules**:
- Token must be signed with JWT_SECRET
- Token must not be expired (exp > current time)
- Token signature must be valid
- user_id must match URL parameter in API requests

**Lifetime**: 24 hours from issuance

**Transmission**: Authorization header (`Bearer <token>`)

---

## Relationships Diagram

```
┌─────────────────┐
│     User        │
│  (Better Auth)  │
│                 │
│  - id (PK)      │
│  - email        │
│  - password_hash│
│  - created_at   │
│  - updated_at   │
└────────┬────────┘
         │
         │ 1:N (One user has many tasks)
         │ ON DELETE CASCADE
         │
         v
┌─────────────────┐
│      Task       │
│                 │
│  - id (PK)      │
│  - user_id (FK) │◄─── Foreign Key to User
│  - title        │
│  - description  │
│  - completed    │
│  - created_at   │
│  - updated_at   │
└─────────────────┘
```

---

## Data Integrity Rules

### Ownership Enforcement

**Rule**: Every task MUST belong to exactly one user

**Implementation**:
- `user_id` column is NOT NULL
- Foreign key constraint enforces valid user reference
- Application layer filters all queries by authenticated user_id

**Validation Query**:
```sql
-- This should return 0 (no orphaned tasks)
SELECT COUNT(*) FROM tasks WHERE user_id NOT IN (SELECT id FROM users);
```

---

### User Isolation

**Rule**: Users can only access their own tasks

**Implementation**:
- All task queries include `WHERE user_id = <authenticated_user_id>`
- Backend extracts user_id from JWT token
- URL user_id parameter must match JWT user_id
- Mismatched user_ids return 403 Forbidden

**Validation Pattern**:
```sql
-- Correct pattern (always used)
SELECT * FROM tasks WHERE user_id = <authenticated_user_id> AND id = <task_id>;

-- Forbidden pattern (never used)
SELECT * FROM tasks WHERE id = <task_id>; -- Missing user_id filter
```

---

### Cascade Delete

**Rule**: Deleting a user deletes all their tasks

**Implementation**:
- Foreign key constraint: `ON DELETE CASCADE`
- Automatic cleanup by database
- No orphaned tasks remain after user deletion

---

## Validation Constraints

### Title Validation

**Constraints**:
- NOT NULL
- CHECK: `LENGTH(TRIM(title)) >= 1`
- CHECK: `LENGTH(title) <= 200`

**Application Layer**:
- Trim whitespace before validation
- Reject empty or whitespace-only titles
- Enforce 1-200 character limit

---

### Description Validation

**Constraints**:
- NULL allowed (optional field)
- CHECK: `description IS NULL OR LENGTH(description) <= 1000`

**Application Layer**:
- Accept NULL or empty string
- Enforce 0-1000 character limit if provided

---

### Email Validation

**Constraints**:
- UNIQUE
- NOT NULL
- Valid email format (RFC 5322)

**Application Layer**:
- Validate email format before submission
- Handle duplicate email errors gracefully
- Case-insensitive comparison for lookups

---

## Timestamp Management

### Automatic Timestamps

**created_at**:
- Set automatically on INSERT
- Never updated after creation
- Used for ordering tasks (newest first)

**updated_at**:
- Set automatically on INSERT
- Updated automatically on UPDATE
- Tracks last modification time

### Implementation

**Database Trigger** (optional, can be handled by ORM):
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**SQLModel Alternative**:
- Use SQLAlchemy's `onupdate` parameter
- Automatic timestamp updates without triggers

---

## Query Patterns

### Common Queries

**Get all tasks for user** (most common):
```sql
SELECT * FROM tasks
WHERE user_id = <authenticated_user_id>
ORDER BY created_at DESC;
```

**Get single task** (with ownership check):
```sql
SELECT * FROM tasks
WHERE user_id = <authenticated_user_id>
AND id = <task_id>;
```

**Get completed tasks**:
```sql
SELECT * FROM tasks
WHERE user_id = <authenticated_user_id>
AND completed = TRUE
ORDER BY created_at DESC;
```

**Create task**:
```sql
INSERT INTO tasks (user_id, title, description, completed)
VALUES (<authenticated_user_id>, <title>, <description>, FALSE)
RETURNING *;
```

**Update task**:
```sql
UPDATE tasks
SET title = <new_title>,
    description = <new_description>,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = <authenticated_user_id>
AND id = <task_id>
RETURNING *;
```

**Toggle completion**:
```sql
UPDATE tasks
SET completed = <new_status>,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = <authenticated_user_id>
AND id = <task_id>
RETURNING *;
```

**Delete task**:
```sql
DELETE FROM tasks
WHERE user_id = <authenticated_user_id>
AND id = <task_id>;
```

---

## Performance Considerations

### Index Usage

**Query**: Get all tasks for user
- **Index Used**: `idx_tasks_user_id`
- **Expected Performance**: <100ms for 1000 tasks

**Query**: Get completed tasks for user
- **Index Used**: `idx_tasks_user_completed` (composite)
- **Expected Performance**: <100ms

**Query**: Get tasks ordered by creation date
- **Index Used**: `idx_tasks_created_at`
- **Expected Performance**: <100ms

---

## Migration Strategy

### Initial Schema Creation

**Migration 001**: Create users table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**Migration 002**: Create tasks table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL CHECK(LENGTH(TRIM(title)) >= 1 AND LENGTH(title) <= 200),
    description TEXT CHECK(description IS NULL OR LENGTH(description) <= 1000),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

---

## References

- `specs/database/schema.md` - Complete database specification
- `specs/features/authentication.md` - User authentication requirements
- `specs/features/task-crud.md` - Task management requirements
- `specs/api/rest-endpoints.md` - API endpoint specifications
