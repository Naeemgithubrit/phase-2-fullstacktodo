---
id: 001
title: Phase II Constitution Update
stage: constitution
date: 2026-01-11
surface: agent
model: claude-sonnet-4-5
feature: none
branch: master
user: Naeem shah
command: /sp.constitution
labels: ["constitution", "phase-ii", "governance", "principles"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (documentation update)
---

## Prompt

# Spec Constitution — Phase II
Project: Hackathon II – Full-Stack Todo Web Application
Methodology: Spec-Driven Development using Spec-Kit and Claude Code

---

## 1. Constitutional Authority
All specifications are the single source of truth. No implementation behavior or assumption is valid unless it is explicitly defined in a specification file applicable to the current phase. When a conflict exists between code and specifications, the specification always takes precedence.

---

## 2. Phase Enforcement Rule
Claude must operate strictly within Phase II: Full-Stack Web Application. Functionality outside this phase, including chatbot or AI features, must not be introduced. All work must be limited to task CRUD operations, authentication, REST APIs, persistent storage, and multi-user isolation.

---

## 3. Spec-First Rule
Before writing, modifying, or reviewing code, Claude must identify and read all relevant specification files. Every implementation decision must be traceable to a specification. If no applicable specification exists, the specification must be updated before implementation proceeds.

---

## 4. Acceptance Criteria Enforcement
All acceptance criteria defined in feature specifications must be met exactly. Required fields, constraints, and documented behaviors must be enforced strictly. Partial or loosely compliant implementations are considered incorrect.

---

## 5. Authentication Constitution
All application behavior assumes authenticated usage. Every API request must include a valid JWT token. Tokens must be verified using a shared secret, and user identity must be extracted from the token. Requests without valid authentication must return a 401 Unauthorized response.

---

## 6. User Isolation Rule
Strict user isolation must be enforced. A user may only access their own tasks. All database queries must be filtered by the authenticated user identifier. URL parameters must match the authenticated identity, and cross-user access is forbidden.

---

## 7. API Constitution
All APIs must follow RESTful conventions as defined in the API specifications. Endpoints must use documented paths and HTTP methods. Responses must be JSON, and errors must use appropriate HTTP status codes. API behavior must not deviate from the specification.

---

## 8. Frontend Constitution
The frontend must use Next.js with the App Router. Server components are the default, and client components are used only when necessary. All backend communication must go through a centralized API client, and JWT tokens must be attached to every request. Business logic must not be duplicated in the UI.

---

## 9. Backend Constitution
The backend must use FastAPI with SQLModel for database access and Neon PostgreSQL for persistence. All business logic resides in the backend. Request and response validation must be explicit, and the backend must remain stateless and secure.

---

## 10. Database Constitution
All tasks must be associated with a user. Foreign key relationships must be enforced. Indexes must support user-based filtering, and timestamps must be managed consistently. No data may exist without clear ownership.

---

## 11. Security Constitution
Security is mandatory. JWT verification is required on every request, token expiration must be enforced, malformed tokens must be rejected, and the backend must never rely on frontend trust. Security failures block implementation approval.

---

## 12. Monorepo Constitution
The monorepo structure must be respected. Specifications live in the specs directory, frontend code in the frontend directory, backend code in the backend directory, and CLAUDE.md files define layer-specific rules. Boundaries between layers must not be blurred.

---

## 13. Change Control Rule
When behavior changes, specifications must be updated first. Implementation follows specification changes. Undocumented or silent behavior changes are not allowed and must be surfaced immediately.

---

## 14. Quality Gate Rule
Work is not considered complete unless all specifications are satisfied, authentication is enforced everywhere

## Response snapshot

Constitution file at `.specify/memory/constitution.md` was already properly updated with Phase II content. The file contains:

- **Version**: 1.1.0 (MINOR bump from previous version)
- **Ratified**: 2026-01-10
- **Last Amended**: 2026-01-11
- **14 Core Principles**: All Phase II constitutional rules properly defined
- **Governance Section**: Amendment procedure, versioning policy, and compliance review expectations

**Validation Results**:
- ✅ No placeholder tokens remaining
- ✅ All 14 principles complete and properly formatted
- ✅ Sync Impact Report present at top of file
- ✅ Templates reviewed for consistency:
  - plan-template.md: Constitution Check section remains valid
  - spec-template.md: References constitution generically (no updates needed)
  - tasks-template.md: No direct constitution references (no updates needed)

**Constitution Principles Summary**:
1. Constitutional Authority - Specs as single source of truth
2. Phase Enforcement - Strict Phase II boundaries
3. Spec-First Rule - Read specs before implementation
4. Acceptance Criteria Enforcement - Exact compliance required
5. Authentication Constitution - JWT required on all requests
6. User Isolation Rule - Strict user data separation
7. API Constitution - RESTful conventions mandatory
8. Frontend Constitution - Next.js App Router patterns
9. Backend Constitution - FastAPI + SQLModel + Neon PostgreSQL
10. Database Constitution - User ownership and foreign keys
11. Security Constitution - JWT verification mandatory
12. Monorepo Constitution - Respect directory boundaries
13. Change Control Rule - Specs updated before implementation
14. Quality Gate Rule - Complete compliance required

## Outcome

- ✅ Impact: Constitution properly updated with Phase II governance rules; version 1.1.0 established
- 🧪 Tests: N/A (documentation update)
- 📁 Files: .specify/memory/constitution.md (updated)
- 🔁 Next prompts: Begin feature specification work following constitutional principles
- 🧠 Reflection: Constitution provides clear governance framework for Phase II full-stack development with emphasis on authentication, user isolation, and spec-driven methodology

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution was already properly formatted
- Graders run and results (PASS/FAIL): PASS - All validation checks passed
- Prompt variant (if applicable): Standard constitution update workflow
- Next experiment (smallest change to try): Apply constitutional principles to first feature specification
