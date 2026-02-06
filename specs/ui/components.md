# UI Specification: Components

**Feature Branch**: `001-phase-ii-specs`
**Created**: 2026-01-11
**Status**: Draft
**Phase**: Phase II - Full-Stack Web Application

---

## Overview

This document defines all reusable UI components for the Todo Full-Stack Web Application. Components are built with React, Next.js App Router, and styled with Tailwind CSS.

**Design Principles**:
- Clean, minimal, professional SaaS-grade appearance
- Consistent spacing using Tailwind's spacing scale
- Accessible contrast ratios (WCAG AA minimum)
- Server components by default, client components only when necessary
- No inline styles (Tailwind classes only)

---

## Component Catalog

### 1. AppLayout

**Purpose**: Main application shell providing consistent layout structure across all authenticated pages.

**Type**: Server Component

**Props**:
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```

**Structure**:
- Header with app logo and user menu
- Main content area
- Optional footer

**Visual Specifications**:
- Header: Fixed top, white background, subtle bottom border (gray-200)
- Header height: 64px (h-16)
- Logo: Left-aligned, 32px height
- User menu: Right-aligned, shows user email and logout button
- Main content: Full width, max-width 1280px (max-w-7xl), centered, padding x-4
- Background: Light gray (bg-gray-50)

**States**:
- Default: Normal display
- No special loading or error states (handled by page components)

**Example Usage**:
```tsx
<AppLayout>
  <TaskList />
</AppLayout>
```

---

### 2. TaskList

**Purpose**: Displays a list of tasks with completion status and actions.

**Type**: Server Component (with client components for interactive elements)

**Props**:
```typescript
interface TaskListProps {
  tasks: Task[];
  userId: string;
}
```

**Structure**:
- Container with tasks array
- Each task rendered as TaskItem component
- Empty state when no tasks exist

**Visual Specifications**:
- Container: White background (bg-white), rounded corners (rounded-lg), shadow (shadow-sm)
- Padding: p-6
- Gap between tasks: space-y-2
- Empty state: Centered text, gray-500 color, py-12

**States**:
- **Default**: Shows list of tasks
- **Empty**: Shows "No tasks yet. Create your first task!" message with icon
- **Loading**: Shows skeleton loaders (3-5 placeholder items)

**Empty State**:
- Icon: Clipboard or checklist icon (gray-400)
- Text: "No tasks yet. Create your first task!"
- Subtext: "Click the 'New Task' button to get started"
- Button: "Create Task" (primary button)

**Example Usage**:
```tsx
<TaskList tasks={tasks} userId={userId} />
```

---

### 3. TaskItem

**Purpose**: Individual task display with completion toggle and action buttons.

**Type**: Client Component (interactive)

**Props**:
```typescript
interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}
```

**Structure**:
- Checkbox for completion toggle (left)
- Task title and metadata (center)
- Action buttons: Edit, Delete (right)

**Visual Specifications**:
- Container: Flex row, items-center, p-4, border (border-gray-200), rounded-md
- Hover: Background gray-50, border-gray-300
- Checkbox: 20px (w-5 h-5), rounded, border-gray-300, checked:bg-blue-600
- Title: Text-base, font-medium, text-gray-900
- Title (completed): Line-through, text-gray-500
- Created date: Text-sm, text-gray-500, mt-1
- Action buttons: Icon buttons, gray-600, hover:gray-900
- Gap between elements: gap-3

**States**:
- **Default**: Normal display
- **Completed**: Title has strikethrough, lighter text color
- **Hover**: Subtle background change, action buttons more visible
- **Loading** (during toggle): Checkbox shows spinner, disabled state

**Interactions**:
- Click checkbox: Toggle completion status
- Click title: Navigate to task detail page
- Click edit icon: Navigate to edit page
- Click delete icon: Show confirmation modal

**Example Usage**:
```tsx
<TaskItem
  task={task}
  onToggleComplete={handleToggle}
  onDelete={handleDelete}
/>
```

---

### 4. TaskForm

**Purpose**: Form for creating or editing tasks.

**Type**: Client Component (form handling)

**Props**:
```typescript
interface TaskFormProps {
  task?: Task; // Undefined for create, provided for edit
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

interface TaskFormData {
  title: string;
  description: string | null;
}
```

**Structure**:
- Title input field (required)
- Description textarea (optional)
- Character counters
- Submit and Cancel buttons

**Visual Specifications**:
- Container: White background, rounded-lg, shadow-sm, p-6
- Input fields: Full width, border-gray-300, rounded-md, p-2
- Labels: Text-sm, font-medium, text-gray-700, mb-1
- Character counter: Text-xs, text-gray-500, text-right, mt-1
- Error messages: Text-sm, text-red-600, mt-1
- Button row: Flex, justify-end, gap-3, mt-6

**States**:
- **Default**: Empty fields (create) or populated fields (edit)
- **Validation Error**: Red border on invalid field, error message below
- **Submitting**: Disabled inputs, loading spinner on submit button
- **Success**: Form cleared (create) or closed (edit)

**Validation**:
- Title: Required, 1-200 characters, trim whitespace
- Description: Optional, 0-1000 characters
- Real-time character counting
- Client-side validation before submission

**Character Counters**:
- Title: "45/200" (gray when valid, red when over limit)
- Description: "250/1000" (gray when valid, red when over limit)

**Example Usage**:
```tsx
<TaskForm
  task={existingTask}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

---

### 5. Button

**Purpose**: Reusable button component with consistent styling.

**Type**: Client Component

**Props**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

**Variants**:

**Primary** (default):
- Background: blue-600
- Text: white
- Hover: blue-700
- Focus: ring-2, ring-blue-500, ring-offset-2

**Secondary**:
- Background: white
- Border: border-gray-300
- Text: gray-700
- Hover: bg-gray-50

**Danger**:
- Background: red-600
- Text: white
- Hover: red-700
- Focus: ring-2, ring-red-500

**Ghost**:
- Background: transparent
- Text: gray-700
- Hover: bg-gray-100

**Sizes**:
- **sm**: px-3, py-1.5, text-sm
- **md**: px-4, py-2, text-base (default)
- **lg**: px-6, py-3, text-lg

**States**:
- **Default**: Normal appearance
- **Hover**: Darker background
- **Focus**: Ring outline
- **Disabled**: Opacity-50, cursor-not-allowed
- **Loading**: Spinner icon, disabled

**Example Usage**:
```tsx
<Button variant="primary" onClick={handleClick}>
  Save Task
</Button>
```

---

### 6. Input

**Purpose**: Reusable text input field with consistent styling.

**Type**: Client Component

**Props**:
```typescript
interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password';
}
```

**Visual Specifications**:
- Label: Text-sm, font-medium, text-gray-700, mb-1
- Input: w-full, border-gray-300, rounded-md, px-3, py-2, text-base
- Input (focus): ring-2, ring-blue-500, border-blue-500
- Input (error): border-red-500, ring-red-500
- Error message: text-sm, text-red-600, mt-1
- Required indicator: Red asterisk after label

**States**:
- **Default**: Normal input
- **Focus**: Blue ring
- **Error**: Red border and ring, error message displayed
- **Disabled**: bg-gray-100, cursor-not-allowed

**Example Usage**:
```tsx
<Input
  label="Task Title"
  value={title}
  onChange={setTitle}
  required
  maxLength={200}
  error={titleError}
/>
```

---

### 7. Textarea

**Purpose**: Reusable multi-line text input with consistent styling.

**Type**: Client Component

**Props**:
```typescript
interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  rows?: number;
  disabled?: boolean;
}
```

**Visual Specifications**:
- Same styling as Input component
- Default rows: 4
- Resize: vertical only (resize-y)
- Min height: 100px

**Example Usage**:
```tsx
<Textarea
  label="Description"
  value={description}
  onChange={setDescription}
  maxLength={1000}
  rows={4}
/>
```

---

### 8. Modal

**Purpose**: Reusable modal dialog for confirmations and forms.

**Type**: Client Component

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

**Visual Specifications**:
- Overlay: Fixed, inset-0, bg-black/50, z-40
- Modal: Fixed, centered, bg-white, rounded-lg, shadow-xl, z-50
- Max width: 500px (max-w-lg)
- Padding: p-6
- Title: text-lg, font-semibold, text-gray-900, mb-4
- Close button: Absolute top-right, gray-400, hover:gray-600

**States**:
- **Open**: Visible with fade-in animation
- **Closed**: Hidden
- **Opening**: Fade-in animation (150ms)
- **Closing**: Fade-out animation (150ms)

**Interactions**:
- Click overlay: Close modal
- Press Escape: Close modal
- Click close button: Close modal

**Example Usage**:
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Delete Task"
  footer={
    <>
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      <Button variant="danger" onClick={handleConfirm}>Delete</Button>
    </>
  }
>
  <p>Are you sure you want to delete this task?</p>
</Modal>
```

---

### 9. AuthForm

**Purpose**: Reusable form for login and signup pages.

**Type**: Client Component

**Props**:
```typescript
interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => Promise<void>;
  error?: string;
}

interface AuthFormData {
  email: string;
  password: string;
}
```

**Structure**:
- Email input field
- Password input field
- Submit button
- Link to alternate mode (login ↔ signup)
- Error message display

**Visual Specifications**:
- Container: max-w-md, mx-auto, bg-white, rounded-lg, shadow-md, p-8
- Title: text-2xl, font-bold, text-gray-900, mb-6, text-center
- Input spacing: space-y-4
- Submit button: w-full, mt-6
- Alternate link: text-center, text-sm, text-blue-600, mt-4
- Error banner: bg-red-50, border-red-200, text-red-800, p-3, rounded-md, mb-4

**States**:
- **Default**: Empty fields
- **Validation Error**: Field-specific errors
- **Submitting**: Disabled inputs, loading spinner
- **Server Error**: Error banner at top

**Validation**:
- Email: Required, valid email format
- Password: Required, minimum 8 characters (signup only)

**Example Usage**:
```tsx
<AuthForm
  mode="login"
  onSubmit={handleLogin}
  error={loginError}
/>
```

---

### 10. LoadingSpinner

**Purpose**: Reusable loading indicator.

**Type**: Server Component

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
}
```

**Visual Specifications**:
- Animated spinning circle
- Sizes: sm (16px), md (24px), lg (32px)
- Colors: blue-600, gray-600, white
- Animation: spin, duration-1000ms, linear, infinite

**Example Usage**:
```tsx
<LoadingSpinner size="md" color="blue" />
```

---

## Styling Guidelines

### Color Palette

**Primary Colors**:
- Blue: blue-600 (primary actions)
- Gray: gray-900 (text), gray-500 (secondary text), gray-200 (borders)
- Red: red-600 (danger actions, errors)
- Green: green-600 (success states)

**Background Colors**:
- Page background: gray-50
- Card background: white
- Hover states: gray-50, gray-100

### Typography

**Font Family**: System font stack (Tailwind default)

**Font Sizes**:
- xs: 0.75rem (12px) - Helper text, counters
- sm: 0.875rem (14px) - Labels, secondary text
- base: 1rem (16px) - Body text, inputs
- lg: 1.125rem (18px) - Subheadings
- xl: 1.25rem (20px) - Headings
- 2xl: 1.5rem (24px) - Page titles

**Font Weights**:
- normal: 400 - Body text
- medium: 500 - Labels, emphasis
- semibold: 600 - Subheadings
- bold: 700 - Headings

### Spacing Scale

Use Tailwind's spacing scale consistently:
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 12: 3rem (48px)

### Border Radius

- sm: 0.125rem (2px) - Small elements
- md: 0.375rem (6px) - Inputs, buttons (default)
- lg: 0.5rem (8px) - Cards, modals

### Shadows

- sm: Subtle shadow for cards
- md: Medium shadow for elevated elements
- lg: Large shadow for modals
- xl: Extra large shadow for prominent modals

---

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order follows visual order
- Focus indicators visible (ring-2)
- Escape key closes modals

### Screen Readers
- Semantic HTML elements (button, input, label)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Alt text for images

### Color Contrast
- Text on background: Minimum 4.5:1 ratio (WCAG AA)
- Large text: Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

### Focus Management
- Focus trapped in modals
- Focus returned to trigger element on modal close
- Skip links for keyboard users

---

## Responsive Design

### Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl)

### Mobile Adaptations
- Stack elements vertically on mobile
- Full-width buttons on mobile
- Larger touch targets (min 44x44px)
- Simplified navigation

### Desktop Optimizations
- Max content width: 1280px
- Multi-column layouts where appropriate
- Hover states for interactive elements

---

## Related Specifications

- **UI Pages**: `specs/ui/pages.md`
- **Task CRUD**: `specs/features/task-crud.md`
- **Authentication**: `specs/features/authentication.md`
