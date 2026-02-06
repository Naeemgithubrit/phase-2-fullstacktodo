# UI Specification: Pages

**Feature Branch**: `001-phase-ii-specs`
**Created**: 2026-01-11
**Status**: Draft
**Phase**: Phase II - Full-Stack Web Application

---

## Overview

This document defines all pages in the Todo Full-Stack Web Application with pixel-level clarity. Pages are built with Next.js App Router, using server components by default and client components only when necessary.

**Design Principles**:
- Desktop-first responsive design with mobile support
- Clean, minimal, professional SaaS-grade appearance
- Consistent layout using AppLayout component
- Clear visual hierarchy
- Accessible and keyboard-navigable

---

## Page Catalog

### 1. Login Page

**Route**: `/login`

**Purpose**: Allow existing users to authenticate and access their tasks.

**Authentication**: Public (unauthenticated users only)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│         [App Logo/Title]            │
│                                     │
│     ┌─────────────────────┐        │
│     │   Login Form        │        │
│     │   - Email input     │        │
│     │   - Password input  │        │
│     │   - Login button    │        │
│     │   - Signup link     │        │
│     └─────────────────────┘        │
│                                     │
└─────────────────────────────────────┘
```

**Component Composition**:
- Page container: Centered, max-w-md, min-h-screen, flex items-center justify-center
- Background: gray-50
- AuthForm component (mode="login")
- App logo/title above form

**Visual Specifications**:
- Page background: bg-gray-50
- Form container: max-w-md (448px), mx-auto, my-auto
- Logo: text-3xl, font-bold, text-blue-600, mb-8, text-center
- Form: White background, rounded-lg, shadow-md, p-8
- Title: "Welcome Back" - text-2xl, font-bold, text-gray-900, mb-6
- Spacing between inputs: space-y-4
- Submit button: w-full, primary variant
- Signup link: "Don't have an account? Sign up" - text-center, text-sm, text-blue-600, mt-4

**States**:
- **Default**: Empty form, ready for input
- **Validation Error**: Field-specific errors displayed below inputs
- **Submitting**: Disabled inputs, loading spinner on button
- **Server Error**: Error banner at top of form (red background)
- **Success**: Redirect to /tasks (no visible state)

**Empty State**: N/A (form is always visible)

**Error States**:
- Invalid credentials: "Invalid email or password" banner
- Network error: "Unable to connect. Please try again." banner
- Email format error: "Please enter a valid email address" below email field
- Empty password: "Password is required" below password field

**Responsive Behavior**:
- Desktop: Form centered, max-width 448px
- Tablet: Same as desktop
- Mobile: Form full-width with padding (px-4), maintains centered layout

**Interactions**:
- Enter key in password field: Submit form
- Click "Sign up" link: Navigate to /signup
- Successful login: Redirect to /tasks

**Example Layout**:
```tsx
<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div className="w-full max-w-md">
    <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">
      TaskFlow
    </h1>
    <AuthForm mode="login" onSubmit={handleLogin} error={error} />
  </div>
</div>
```

---

### 2. Signup Page

**Route**: `/signup`

**Purpose**: Allow new users to create an account.

**Authentication**: Public (unauthenticated users only)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│         [App Logo/Title]            │
│                                     │
│     ┌─────────────────────┐        │
│     │   Signup Form       │        │
│     │   - Email input     │        │
│     │   - Password input  │        │
│     │   - Signup button   │        │
│     │   - Login link      │        │
│     └─────────────────────┘        │
│                                     │
└─────────────────────────────────────┘
```

**Component Composition**:
- Identical structure to Login page
- AuthForm component (mode="signup")
- Different title and link text

**Visual Specifications**:
- Same styling as Login page
- Title: "Create Your Account" - text-2xl, font-bold, text-gray-900, mb-6
- Password helper text: "Minimum 8 characters" - text-xs, text-gray-500, mt-1
- Login link: "Already have an account? Log in" - text-center, text-sm, text-blue-600, mt-4

**States**:
- **Default**: Empty form, ready for input
- **Validation Error**: Field-specific errors displayed
- **Submitting**: Disabled inputs, loading spinner
- **Server Error**: Error banner (e.g., "Email already registered")
- **Success**: Automatic login and redirect to /tasks

**Error States**:
- Email already exists: "Email already registered. Please log in." banner
- Invalid email format: "Please enter a valid email address" below email field
- Password too short: "Password must be at least 8 characters" below password field
- Network error: "Unable to create account. Please try again." banner

**Responsive Behavior**:
- Same as Login page

**Interactions**:
- Enter key in password field: Submit form
- Click "Log in" link: Navigate to /login
- Successful signup: Automatic login, redirect to /tasks

---

### 3. Tasks Dashboard (Main Page)

**Route**: `/tasks`

**Purpose**: Display user's task list with ability to create, view, and manage tasks.

**Authentication**: Protected (requires valid JWT)

**Layout Structure**:
```
┌─────────────────────────────────────────────────────┐
│  Header: [Logo] [User Menu: email | Logout]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  My Tasks              [+ New Task Button]  │  │
│  ├─────────────────────────────────────────────┤  │
│  │  ☐ Task 1 title                    [Edit]  │  │
│  │     Created: Jan 11, 2026          [Delete]│  │
│  ├─────────────────────────────────────────────┤  │
│  │  ☑ Task 2 title (completed)        [Edit]  │  │
│  │     Created: Jan 10, 2026          [Delete]│  │
│  ├─────────────────────────────────────────────┤  │
│  │  ☐ Task 3 title                    [Edit]  │  │
│  │     Created: Jan 9, 2026           [Delete]│  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Component Composition**:
- AppLayout wrapper
- Page header with title and "New Task" button
- TaskList component with tasks array
- Each task rendered as TaskItem component

**Visual Specifications**:
- Page background: bg-gray-50
- Content container: max-w-7xl, mx-auto, px-4, py-8
- Page header: flex, justify-between, items-center, mb-6
- Page title: "My Tasks" - text-3xl, font-bold, text-gray-900
- New Task button: Primary variant, "New Task" text with plus icon
- Task list container: bg-white, rounded-lg, shadow-sm, p-6
- Task items: space-y-2

**States**:
- **Default**: Shows list of tasks
- **Loading**: Shows skeleton loaders (3-5 placeholder items)
- **Empty**: Shows empty state with "Create Task" button
- **Error**: Shows error banner at top

**Empty State**:
```
┌─────────────────────────────────────┐
│                                     │
│         [Clipboard Icon]            │
│                                     │
│    No tasks yet. Create your       │
│         first task!                 │
│                                     │
│      [Create Task Button]           │
│                                     │
└─────────────────────────────────────┘
```

- Icon: Clipboard or checklist icon, gray-400, 64px
- Text: text-lg, text-gray-500, text-center
- Subtext: text-sm, text-gray-400, text-center, mt-2
- Button: Primary variant, centered, mt-6

**Error States**:
- Failed to load tasks: "Unable to load tasks. Please refresh the page." banner
- Failed to toggle completion: Toast notification "Failed to update task"
- Failed to delete: Toast notification "Failed to delete task"

**Responsive Behavior**:
- Desktop: Full layout as shown, max-width 1280px
- Tablet: Same layout, adjusted padding
- Mobile:
  - Stack header elements vertically
  - Full-width buttons
  - Simplified task item layout (stack actions below title)

**Interactions**:
- Click "New Task": Open modal or navigate to /tasks/new
- Click task checkbox: Toggle completion status (optimistic update)
- Click task title: Navigate to /tasks/[id]
- Click edit icon: Navigate to /tasks/[id]/edit
- Click delete icon: Show confirmation modal
- Confirm delete: Delete task, show success toast

**Loading Skeleton**:
- 3-5 placeholder items
- Animated pulse effect
- Gray-200 background
- Same dimensions as real task items

---

### 4. Task Detail Page

**Route**: `/tasks/[id]`

**Purpose**: Display full details of a single task.

**Authentication**: Protected (requires valid JWT, user must own task)

**Layout Structure**:
```
┌─────────────────────────────────────────────────────┐
│  Header: [Logo] [User Menu: email | Logout]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [← Back to Tasks]                                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  ☐ Task Title                               │  │
│  │                                             │  │
│  │  Description:                               │  │
│  │  Lorem ipsum dolor sit amet, consectetur    │  │
│  │  adipiscing elit...                         │  │
│  │                                             │  │
│  │  Created: January 11, 2026 at 10:30 AM     │  │
│  │  Last updated: January 11, 2026 at 2:15 PM │  │
│  │                                             │  │
│  │  [Edit Task] [Delete Task]                 │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Component Composition**:
- AppLayout wrapper
- Back button/link
- Task detail card
- Completion checkbox
- Task title (large)
- Description section (if exists)
- Metadata section (timestamps)
- Action buttons (Edit, Delete)

**Visual Specifications**:
- Content container: max-w-3xl, mx-auto, px-4, py-8
- Back link: text-blue-600, hover:text-blue-800, mb-4, flex items-center, gap-2
- Card: bg-white, rounded-lg, shadow-sm, p-8
- Checkbox: 24px (w-6 h-6), mb-4
- Title: text-3xl, font-bold, text-gray-900, mb-6
- Title (completed): line-through, text-gray-500
- Description label: text-sm, font-medium, text-gray-700, mb-2
- Description text: text-base, text-gray-900, whitespace-pre-wrap, mb-6
- Metadata: text-sm, text-gray-500, space-y-1, mb-6
- Action buttons: flex, gap-3

**States**:
- **Loading**: Skeleton loader for entire card
- **Default**: Shows task details
- **Not Found**: 404 error page
- **Forbidden**: 403 error page (task belongs to another user)
- **Error**: Error banner at top

**Empty State** (no description):
- Description section not displayed
- Only title, checkbox, metadata, and actions shown

**Error States**:
- Task not found: "Task not found" page with back button
- Access denied: "You don't have permission to view this task" page
- Failed to load: "Unable to load task. Please try again." banner

**Responsive Behavior**:
- Desktop: Max-width 768px, centered
- Tablet: Same as desktop
- Mobile: Full-width with padding, stack action buttons vertically

**Interactions**:
- Click back button: Navigate to /tasks
- Click checkbox: Toggle completion status
- Click "Edit Task": Navigate to /tasks/[id]/edit
- Click "Delete Task": Show confirmation modal
- Confirm delete: Delete task, navigate to /tasks with success toast

---

### 5. Task Create/Edit Page

**Route**: `/tasks/new` (create) or `/tasks/[id]/edit` (edit)

**Purpose**: Form for creating new task or editing existing task.

**Authentication**: Protected (requires valid JWT, user must own task for edit)

**Layout Structure**:
```
┌─────────────────────────────────────────────────────┐
│  Header: [Logo] [User Menu: email | Logout]        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [← Back]                                           │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  Create New Task / Edit Task                │  │
│  │                                             │  │
│  │  Title *                                    │  │
│  │  [_________________________________]        │  │
│  │  0/200                                      │  │
│  │                                             │  │
│  │  Description (optional)                     │  │
│  │  [_________________________________]        │  │
│  │  [_________________________________]        │  │
│  │  [_________________________________]        │  │
│  │  0/1000                                     │  │
│  │                                             │  │
│  │              [Cancel] [Save Task]           │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Component Composition**:
- AppLayout wrapper
- Back button/link
- TaskForm component
- Form title (dynamic based on create/edit)
- Input fields with labels and character counters
- Action buttons (Cancel, Save)

**Visual Specifications**:
- Content container: max-w-2xl, mx-auto, px-4, py-8
- Back link: text-blue-600, hover:text-blue-800, mb-4
- Form title: text-2xl, font-bold, text-gray-900, mb-6
- Form card: bg-white, rounded-lg, shadow-sm, p-8
- Input spacing: space-y-6
- Character counters: text-right, text-xs, text-gray-500, mt-1
- Character counter (over limit): text-red-600
- Button row: flex, justify-end, gap-3, mt-8

**States**:
- **Default**: Empty fields (create) or populated fields (edit)
- **Loading** (edit mode): Skeleton loader while fetching task
- **Validation Error**: Red border on invalid field, error message below
- **Submitting**: Disabled inputs, loading spinner on save button
- **Success**: Navigate to task detail page or tasks list

**Empty State**: N/A (form is always visible)

**Error States**:
- Title required: "Title is required" below title field
- Title too long: "Title must be 200 characters or less" below title field
- Description too long: "Description must be 1000 characters or less" below description field
- Save failed: "Unable to save task. Please try again." banner at top
- Task not found (edit mode): 404 error page
- Access denied (edit mode): 403 error page

**Responsive Behavior**:
- Desktop: Max-width 672px, centered
- Tablet: Same as desktop
- Mobile: Full-width with padding, full-width buttons

**Interactions**:
- Click back button: Navigate to previous page (with unsaved changes warning)
- Type in title: Real-time character counting
- Type in description: Real-time character counting
- Click "Cancel": Navigate back (with unsaved changes warning if dirty)
- Click "Save Task": Validate and submit form
- Successful save: Navigate to task detail page with success toast

**Unsaved Changes Warning**:
- Modal: "You have unsaved changes. Are you sure you want to leave?"
- Buttons: "Stay on Page" (secondary), "Leave" (danger)

---

## Common Page Elements

### Header (AppLayout)

**Structure**:
- Fixed top, full width
- White background, border-bottom (gray-200)
- Height: 64px (h-16)
- Content: max-w-7xl, mx-auto, px-4, flex, justify-between, items-center

**Left Side**:
- App logo/title: "TaskFlow" - text-xl, font-bold, text-blue-600
- Clickable, navigates to /tasks

**Right Side**:
- User email: text-sm, text-gray-700
- Logout button: text-sm, text-red-600, hover:text-red-800, ml-4

### Footer (Optional)

Phase II does not include a footer. Future phases may add:
- Copyright notice
- Links to privacy policy, terms of service
- Version information

---

## Navigation Patterns

### Authenticated Navigation
- Logo click: Navigate to /tasks
- Logout: Clear JWT, navigate to /login
- Browser back button: Standard navigation

### Unauthenticated Navigation
- Login page: Link to signup
- Signup page: Link to login
- Attempt to access protected route: Redirect to /login

### Protected Route Handling
- No JWT token: Redirect to /login
- Invalid JWT token: Redirect to /login with "Session expired" message
- Expired JWT token: Redirect to /login with "Session expired" message
- Valid JWT but wrong user: 403 Forbidden page

---

## Loading States

### Page-Level Loading
- Full-page spinner: Centered, blue-600, 32px
- Used during initial page load and authentication checks

### Component-Level Loading
- Skeleton loaders: Gray-200, animated pulse
- Used for task list, task details while fetching data

### Action Loading
- Button spinners: Small spinner replacing button text
- Used during form submission, task operations

---

## Error Pages

### 404 Not Found

**Layout**:
```
┌─────────────────────────────────────┐
│         [404 Icon]                  │
│                                     │
│      Page Not Found                 │
│                                     │
│  The page you're looking for       │
│  doesn't exist.                     │
│                                     │
│    [Back to Tasks]                  │
└─────────────────────────────────────┘
```

- Centered content
- Icon: 404 or broken link icon, gray-400, 64px
- Title: text-3xl, font-bold, text-gray-900
- Message: text-base, text-gray-600, text-center
- Button: Primary variant

### 403 Forbidden

**Layout**:
```
┌─────────────────────────────────────┐
│         [Lock Icon]                 │
│                                     │
│      Access Denied                  │
│                                     │
│  You don't have permission to      │
│  access this resource.              │
│                                     │
│    [Back to Tasks]                  │
└─────────────────────────────────────┘
```

- Similar to 404 but with lock icon and different message

### 500 Server Error

**Layout**:
```
┌─────────────────────────────────────┐
│         [Error Icon]                │
│                                     │
│    Something Went Wrong             │
│                                     │
│  We're experiencing technical      │
│  difficulties. Please try again.    │
│                                     │
│    [Refresh Page]                   │
└─────────────────────────────────────┘
```

---

## Accessibility

### Keyboard Navigation
- Tab order follows visual order
- All interactive elements keyboard accessible
- Focus indicators visible (ring-2, ring-blue-500)
- Escape key closes modals

### Screen Reader Support
- Semantic HTML (header, main, nav, article)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content (toasts)
- Page titles updated on navigation

### Focus Management
- Focus trapped in modals
- Focus returned to trigger on modal close
- Skip to main content link (hidden, visible on focus)

---

## Related Specifications

- **UI Components**: `specs/ui/components.md`
- **Task CRUD**: `specs/features/task-crud.md`
- **Authentication**: `specs/features/authentication.md`
- **API Endpoints**: `specs/api/rest-endpoints.md`
