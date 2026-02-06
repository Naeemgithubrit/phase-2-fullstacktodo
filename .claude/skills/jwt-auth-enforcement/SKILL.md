---
name: jwt-auth-enforcement
description: Use this skill whenever user authentication and authorization must be enforced using JWT tokens.
---

# JWT Authentication Enforcement

## Instructions
1. Require a valid JWT token on every protected request.
2. Extract user identity from the token.
3. Reject requests with missing or invalid tokens.
4. Enforce token expiration rules.
5. Ensure the authenticated user matches the requested resource.

## Examples
- Blocking access to tasks when no Authorization header is provided.
- Filtering database queries by the user id from the JWT.
- Rejecting requests where the URL user id does not match the token.
