# Database Specification: Schema and Data Model

**Feature Branch**: `001-phase-ii-specs`
**Created**: 2026-01-11
**Status**: Draft
**Phase**: Phase II - Full-Stack Web Application

---

## Overview

This document defines the database schema for the Todo Full-Stack Web Application using PostgreSQL with SQLModel ORM. The schema enforces user isolation, data integrity, and optimizes for user-scoped queries.

**Database**: Neon PostgreSQL
**ORM**: SQLModel (Python)
**Migration Tool**: Alembic (or SQLModel's built-in migrations)

---

## Tables

### 1. Users Table

**Table Name**: `users`

**Description**: Stores user account information. Managed by Better Auth.

**Columns**:

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address (username) |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last account update timestamp |

**Indexes**:
- Primary key index on `id` (automatic)
- Unique index on `email` (automatic from UNIQUE constraint)

**Notes**:
- Better Auth manages this table structure
- Password is hashed using bcrypt before storage
- Email is case-insensitive for lookups (handled by Better Auth)
- No soft delete in Phase II (account deletion not implemented)

**Sample Data**:
```sql
INSERT INTO users (id, email, password_hash, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'user@example.com', '$2b$12$...', '2026-01-11 10:00:00+00', '2026-01-11 10:00:00+00');
```

---

### 2. Tasks Table

**Table Name**: `tasks`

**Description**: Stores user tasks with ownership enforcement.

**Columns**:

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique task identifier |
| user_id | UUID | FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE, NOT NULL | Task owner (foreign key) |
| title | VARCHAR(200) | NOT NULL | Task title (1-200 characters) |
| description | TEXT | NULL | Task description (0-1000 characters, optional) |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Task completion status |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Task creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last task update timestamp |

**Indexes**:
- Primary key index on `id` (automatic)
- Index on `user_id` for user-scoped queries: `CREATE INDEX idx_tasks_user_id ON tasks(user_id);`
- Composite index on `user_id` and `completed` for filtered queries: `CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);`
- Index on `created_at` for ordering: `CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);`

**Foreign Key Constraints**:
- `user_id` references `users(id)` with `ON DELETE CASCADE`
  - When a user is deleted, all their tasks are automatically deleted
  - Enforces referential integrity

**Check Constraints**:
- Title length: `CHECK (LENGTH(TRIM(title)) >= 1 AND LENGTH(title) <= 200)`
- Description length: `CHECK (description IS NULL OR LENGTH(description) <= 1000)`

**Notes**:
- Every task MUST have a user_id (no orphaned tasks)
- Title is trimmed before storage (whitespace removed)
- Description can be NULL (no description provided)
- Completed defaults to FALSE (new tasks are incomplete)
- Timestamps are in UTC with timezone awareness
- Cascade delete ensures no orphaned tasks when user is deleted

**Sample Data**:
```sql
INSERT INTO tasks (id, user_id, title, description, completed, created_at, updated_at)
VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Complete project documentation', 'Write comprehensive API documentation for Phase II', FALSE, '2026-01-11 10:30:00+00', '2026-01-11 10:30:00+00'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Review pull requests', NULL, TRUE, '2026-01-10 14:20:00+00', '2026-01-11 09:15:00+00');
```

---

## Relationships

### User → Tasks (One-to-Many)

**Relationship**: One user can have many tasks

**Foreign Key**: `tasks.user_id` → `users.id`

**Cascade Behavior**: `ON DELETE CASCADE`
- When a user is deleted, all their tasks are automatically deleted
- Prevents orphaned tasks in the database

**Query Pattern**:
```sql
-- Get all tasks for a user
SELECT * FROM tasks WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' ORDER BY created_at DESC;

-- Get completed tasks for a user
SELECT * FROM tasks WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND completed = TRUE;
```

---

## Indexes and Performance

### Index Strategy

**Primary Indexes** (automatic):
- `users.id` - Primary key lookup
- `tasks.id` - Primary key lookup
- `users.email` - Unique constraint for login

**Secondary Indexes** (explicit):
1. **`idx_tasks_user_id`** on `tasks(user_id)`
   - Purpose: Fast user-scoped task queries
   - Query: `SELECT * FROM tasks WHERE user_id = ?`
   - Cardinality: High (many tasks per user)

2. **`idx_tasks_user_completed`** on `tasks(user_id, completed)`
   - Purpose: Fast filtered queries (e.g., show only incomplete tasks)
   - Query: `SELECT * FROM tasks WHERE user_id = ? AND completed = ?`
   - Composite index for optimal performance

3. **`idx_tasks_created_at`** on `tasks(created_at DESC)`
   - Purpose: Fast ordering by creation date
   - Query: `ORDER BY created_at DESC`
   - Descending order for newest-first display

### Query Performance Targets

- User task list (up to 1000 tasks): < 100ms
- Single task lookup by ID: < 10ms
- Task creation: < 50ms
- Task update: < 50ms
- Task deletion: < 50ms

### Index Maintenance

- Indexes are automatically maintained by PostgreSQL
- No manual index rebuilding required in Phase II
- Monitor index usage with `pg_stat_user_indexes`

---

## Data Integrity Rules

### Ownership Enforcement

**Rule**: Every task MUST belong to exactly one user

**Implementation**:
- `user_id` column is NOT NULL
- Foreign key constraint enforces valid user reference
- Application layer filters all queries by authenticated user_id

**Validation**:
```sql
-- This query should return 0 (no orphaned tasks)
SELECT COUNT(*) FROM tasks WHERE user_id NOT IN (SELECT id FROM users);
```

### User Isolation

**Rule**: Users can only access their own tasks

**Implementation**:
- All task queries include `WHERE user_id = <authenticated_user_id>`
- Backend extracts user_id from JWT token
- No cross-user queries permitted

**Validation**:
```sql
-- Application ensures this pattern is always used
SELECT * FROM tasks WHERE user_id = <authenticated_user_id> AND id = <task_id>;

-- Never use this pattern (missing user_id filter)
-- SELECT * FROM tasks WHERE id = <task_id>; -- FORBIDDEN
```

### Data Validation

**Title Validation**:
- NOT NULL constraint prevents empty titles
- CHECK constraint ensures 1-200 character length
- Application trims whitespace before insertion

**Description Validation**:
- NULL allowed (optional field)
- CHECK constraint ensures ≤1000 characters if provided

**Completion Status**:
- Boolean type ensures only TRUE/FALSE values
- DEFAULT FALSE for new tasks

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

### Trigger for updated_at (Optional)

PostgreSQL trigger to automatically update `updated_at`:

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

**Note**: SQLModel may handle this automatically; verify during implementation.

---

## Migration Strategy

### Initial Schema Creation

**Migration 001**: Create users table (Better Auth)
- Create users table with columns
- Add unique constraint on email
- Add indexes

**Migration 002**: Create tasks table
- Create tasks table with columns
- Add foreign key to users
- Add indexes (user_id, user_id+completed, created_at)
- Add check constraints

### Schema Evolution

Future migrations will:
- Add new columns with DEFAULT values (non-breaking)
- Create new indexes (non-breaking)
- Add new tables (non-breaking)
- Modify constraints carefully (potentially breaking)

**Migration Tool**: Alembic or SQLModel migrations

---

## Data Retention

### Phase II Policy

- User data retained indefinitely (no automatic deletion)
- Task data retained indefinitely (no automatic archival)
- Deleted tasks are permanently removed (no soft delete)
- Deleted users cascade delete all their tasks

### Future Considerations

- Soft delete for tasks (add `deleted_at` column)
- Data archival for old completed tasks
- User account deactivation vs deletion
- GDPR compliance (right to be forgotten)

---

## Backup and Recovery

### Backup Strategy

- Neon PostgreSQL provides automatic backups
- Point-in-time recovery available
- Daily full backups recommended
- Transaction log backups for recovery

### Recovery Scenarios

- Accidental task deletion: No recovery in Phase II (permanent delete)
- Database corruption: Restore from Neon backup
- User account deletion: No recovery (cascade delete is permanent)

---

## Security Considerations

### Password Storage

- Passwords hashed with bcrypt (handled by Better Auth)
- Never store plaintext passwords
- Hash includes salt (automatic with bcrypt)
- Minimum 12 rounds for bcrypt

### SQL Injection Prevention

- SQLModel uses parameterized queries (automatic protection)
- Never concatenate user input into SQL strings
- ORM handles escaping and sanitization

### Access Control

- Database user has minimal required permissions
- Application connects with dedicated database user
- No direct database access from frontend
- All queries go through backend API

---

## Database Connection

### Connection String Format

```
postgresql://username:password@host:port/database?sslmode=require
```

### Connection Pooling

- Use connection pooling for performance
- Recommended pool size: 10-20 connections
- Timeout: 30 seconds
- Max overflow: 10 connections

### Environment Variables

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=10
```

---

## Monitoring and Maintenance

### Key Metrics

- Query execution time (target: <100ms for task list)
- Connection pool utilization
- Index hit ratio (target: >95%)
- Table size growth
- Slow query log

### Maintenance Tasks

- Vacuum tables periodically (automatic in PostgreSQL)
- Analyze tables for query planner (automatic)
- Monitor index usage and remove unused indexes
- Review slow query log weekly

---

## Related Specifications

- **API Endpoints**: `specs/api/rest-endpoints.md`
- **Task CRUD**: `specs/features/task-crud.md`
- **Authentication**: `specs/features/authentication.md`
