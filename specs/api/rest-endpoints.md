# API Specification: REST Endpoints

**Feature Branch**: `001-phase-ii-specs`
**Created**: 2026-01-11
**Status**: Draft
**Phase**: Phase II - Full-Stack Web Application

---

## Overview

This document defines all REST API endpoints for the Todo Full-Stack Web Application. All endpoints require JWT authentication and follow RESTful conventions.

---

## Authentication Requirements

### JWT Token Transmission
- **Header**: `Authorization: Bearer <jwt_token>`
- **Required**: All endpoints require valid JWT token
- **Validation**: Backend validates token signature and expiration on every request
- **User Identity**: User ID extracted from JWT token payload

### Error Responses for Authentication

| Status Code | Scenario | Response Body |
|-------------|----------|---------------|
| 401 Unauthorized | Missing Authorization header | `{"error": "Authentication required"}` |
| 401 Unauthorized | Invalid JWT token signature | `{"error": "Invalid authentication token"}` |
| 401 Unauthorized | Expired JWT token | `{"error": "Token expired, please log in again"}` |
| 403 Forbidden | User ID in URL doesn't match token | `{"error": "Access denied"}` |

---

## Endpoint Definitions

### 1. Get All Tasks for User

**Endpoint**: `GET /api/{user_id}/tasks`

**Description**: Retrieves all tasks belonging to the authenticated user.

**Path Parameters**:
- `user_id` (string, required): User identifier, must match authenticated user ID from JWT

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**: None

**Success Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": "uuid-string",
      "user_id": "user-uuid",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation for Phase II",
      "completed": false,
      "created_at": "2026-01-11T10:30:00Z",
      "updated_at": "2026-01-11T10:30:00Z"
    },
    {
      "id": "uuid-string-2",
      "user_id": "user-uuid",
      "title": "Review pull requests",
      "description": null,
      "completed": true,
      "created_at": "2026-01-10T14:20:00Z",
      "updated_at": "2026-01-11T09:15:00Z"
    }
  ],
  "count": 2
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: `user_id` in URL doesn't match authenticated user
- `500 Internal Server Error`: Database connection failure

**Notes**:
- Tasks returned in reverse chronological order (newest first)
- Empty array returned if user has no tasks
- Description field is `null` when not provided

---

### 2. Create New Task

**Endpoint**: `POST /api/{user_id}/tasks`

**Description**: Creates a new task for the authenticated user.

**Path Parameters**:
- `user_id` (string, required): User identifier, must match authenticated user ID from JWT

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for Phase II"
}
```

**Request Body Schema**:
- `title` (string, required): Task title, 1-200 characters, trimmed
- `description` (string, optional): Task description, 0-1000 characters, can be null or omitted

**Success Response** (201 Created):
```json
{
  "id": "uuid-string",
  "user_id": "user-uuid",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for Phase II",
  "completed": false,
  "created_at": "2026-01-11T10:30:00Z",
  "updated_at": "2026-01-11T10:30:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: `user_id` in URL doesn't match authenticated user
- `422 Unprocessable Entity`: Validation errors

**Validation Error Response** (422):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**Validation Rules**:
- Title must not be empty or whitespace-only
- Title must be 1-200 characters after trimming
- Description must be 0-1000 characters if provided
- Description can be null or omitted

---

### 3. Get Single Task

**Endpoint**: `GET /api/{user_id}/tasks/{id}`

**Description**: Retrieves a specific task by ID for the authenticated user.

**Path Parameters**:
- `user_id` (string, required): User identifier, must match authenticated user ID from JWT
- `id` (string, required): Task identifier (UUID)

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**: None

**Success Response** (200 OK):
```json
{
  "id": "uuid-string",
  "user_id": "user-uuid",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for Phase II",
  "completed": false,
  "created_at": "2026-01-11T10:30:00Z",
  "updated_at": "2026-01-11T10:30:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: `user_id` in URL doesn't match authenticated user OR task belongs to different user
- `404 Not Found`: Task with specified ID doesn't exist

**404 Response**:
```json
{
  "error": "Task not found"
}
```

**403 Response** (task belongs to different user):
```json
{
  "error": "Access denied"
}
```

---

### 4. Update Task

**Endpoint**: `PUT /api/{user_id}/tasks/{id}`

**Description**: Updates an existing task's title and/or description.

**Path Parameters**:
- `user_id` (string, required): User identifier, must match authenticated user ID from JWT
- `id` (string, required): Task identifier (UUID)

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Updated task title",
  "description": "Updated description"
}
```

**Request Body Schema**:
- `title` (string, required): Updated task title, 1-200 characters, trimmed
- `description` (string, optional): Updated task description, 0-1000 characters, can be null

**Success Response** (200 OK):
```json
{
  "id": "uuid-string",
  "user_id": "user-uuid",
  "title": "Updated task title",
  "description": "Updated description",
  "completed": false,
  "created_at": "2026-01-11T10:30:00Z",
  "updated_at": "2026-01-11T11:45:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: `user_id` in URL doesn't match authenticated user OR task belongs to different user
- `404 Not Found`: Task with specified ID doesn't exist
- `422 Unprocessable Entity`: Validation errors

**Validation Error Response** (422):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be 200 characters or less"
    }
  ]
}
```

**Notes**:
- `updated_at` timestamp is automatically updated
- `created_at` timestamp remains unchanged
- Completion status is NOT modified by this endpoint (use PATCH endpoint)

---

### 5. Delete Task

**Endpoint**: `DELETE /api/{user_id}/tasks/{id}`

**Description**: Permanently deletes a task.

**Path Parameters**:
- `user_id` (string, required): User identifier, must match authenticated user ID from JWT
- `id` (string, required): Task identifier (UUID)

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**: None

**Success Response** (204 No Content):
- Empty response body
- Status code 204 indicates successful deletion

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: `user_id` in URL doesn't match authenticated user OR task belongs to different user
- `404 Not Found`: Task with specified ID doesn't exist

**Notes**:
- Deletion is permanent (no soft delete in Phase II)
- No response body on success
- Idempotent: deleting already-deleted task returns 404

---

### 6. Toggle Task Completion

**Endpoint**: `PATCH /api/{user_id}/tasks/{id}/complete`

**Description**: Toggles the completion status of a task.

**Path Parameters**:
- `user_id` (string, required): User identifier, must match authenticated user ID from JWT
- `id` (string, required): Task identifier (UUID)

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "completed": true
}
```

**Request Body Schema**:
- `completed` (boolean, required): New completion status (true or false)

**Success Response** (200 OK):
```json
{
  "id": "uuid-string",
  "user_id": "user-uuid",
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for Phase II",
  "completed": true,
  "created_at": "2026-01-11T10:30:00Z",
  "updated_at": "2026-01-11T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: `user_id` in URL doesn't match authenticated user OR task belongs to different user
- `404 Not Found`: Task with specified ID doesn't exist
- `422 Unprocessable Entity`: Invalid request body (missing or non-boolean `completed` field)

**Validation Error Response** (422):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "completed",
      "message": "Completed must be a boolean value"
    }
  ]
}
```

**Notes**:
- `updated_at` timestamp is automatically updated
- Title and description remain unchanged

---

## Common Response Patterns

### Success Response Structure
All successful responses return JSON with appropriate status codes:
- `200 OK`: Successful GET, PUT, PATCH operations
- `201 Created`: Successful POST operations
- `204 No Content`: Successful DELETE operations

### Error Response Structure
All error responses follow this format:
```json
{
  "error": "Human-readable error message",
  "details": [
    {
      "field": "field_name",
      "message": "Specific validation error"
    }
  ]
}
```

The `details` array is optional and only included for validation errors (422).

---

## Security Enforcement

### User Isolation
1. **JWT Validation**: Every request validates JWT token signature and expiration
2. **User ID Extraction**: User ID extracted from JWT payload
3. **Path Parameter Validation**: `user_id` in URL must match JWT user ID
4. **Resource Ownership**: Backend verifies task belongs to authenticated user
5. **403 Forbidden**: Returned when user attempts to access another user's resources

### Authorization Flow
```
1. Request arrives with Authorization header
2. Backend extracts and validates JWT token
3. Backend extracts user_id from JWT payload
4. Backend compares JWT user_id with URL user_id
5. If mismatch: return 403 Forbidden
6. If match: proceed to resource ownership check
7. Backend queries database filtering by authenticated user_id
8. If resource not found or belongs to different user: return 403/404
9. If authorized: process request
```

---

## Data Types and Formats

### Timestamps
- Format: ISO 8601 with UTC timezone
- Example: `2026-01-11T10:30:00Z`
- Fields: `created_at`, `updated_at`

### UUIDs
- Format: Standard UUID v4
- Example: `550e8400-e29b-41d4-a716-446655440000`
- Fields: `id`, `user_id`

### Strings
- Encoding: UTF-8
- Trimming: Leading/trailing whitespace removed from `title` before validation
- Null handling: `description` can be `null` or omitted

### Booleans
- Values: `true` or `false` (lowercase)
- Field: `completed`

---

## Rate Limiting

Phase II does not implement rate limiting. Future phases may add:
- Per-user request limits
- Rate limit headers in responses
- 429 Too Many Requests status code

---

## CORS Configuration

Frontend and backend are served from different origins in development:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

CORS headers must be configured to allow:
- Origin: Frontend URL
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Headers: Authorization, Content-Type
- Credentials: true (for cookies if used)

---

## API Versioning

Phase II uses URL path versioning:
- Current version: `/api/` (implicit v1)
- Future versions: `/api/v2/`, `/api/v3/`, etc.

No version in path implies v1 for backward compatibility.

---

## Related Specifications

- **Authentication**: `specs/features/authentication.md`
- **Task CRUD**: `specs/features/task-crud.md`
- **Database Schema**: `specs/database/schema.md`
