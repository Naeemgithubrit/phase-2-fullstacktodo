---
name: database-ownership-enforcement
description: Use this skill when reading or writing data that must belong to a specific authenticated user.
---

# Database Ownership Enforcement

## Instructions
1. Always associate data with a user identifier.
2. Filter all queries by authenticated user.
3. Prevent cross user data access.
4. Enforce foreign key relationships.
5. Validate ownership before update or delete operations.

## Examples
- Fetching only tasks that belong to the logged in user.
- Preventing deletion of another user's task.
- Enforcing user id constraints in database models.
