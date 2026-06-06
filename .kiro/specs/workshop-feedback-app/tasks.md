# Implementation Plan: Workshop Feedback App

## Overview

Build a single-page Next.js feedback application using a progressive architecture. First implement the core UI components with local state management and validation, then integrate AWS Amplify Gen 2 Data for cloud persistence. The app uses client-side rendering, Tailwind CSS styling, and property-based testing with fast-check.

## Tasks

- [x] 1. Set up project structure, types, and validation logic
  - [x] 1.1 Create shared types and validation utility
    - Create `types/feedback.ts` with `FeedbackInput` and `FeedbackEntry` interfaces
    - Create `lib/validation.ts` with pure `validateFeedback` function
    - Validation rules: name required (1-100 chars, not whitespace-only), rating required (1-5 integer), comment required (1-500 chars, not whitespace-only)
    - Return a `ValidationErrors` object with field-specific messages; empty object means valid
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x]* 1.2 Write property tests for validation (Properties 1, 2, 3)
    - Install `fast-check` as a dev dependency and configure test runner (Vitest recommended)
    - **Property 1: Whitespace-only text fields are rejected**
    - Generator: arbitrary whitespace strings (spaces, tabs, \n, \r combinations)
    - Assertion: `validateFeedback` returns error for whitespace-only name or comment
    - **Property 2: Overlength text fields are rejected**
    - Generator: strings with length [101, 1000] for name; [501, 2000] for comment
    - Assertion: `validateFeedback` returns appropriate length error
    - **Property 3: All invalid fields produce simultaneous errors**
    - Generator: random combinations of invalid field states
    - Assertion: number of errors equals number of invalid fields
    - Minimum 100 iterations per property
    - **Validates: Requirements 2.1, 2.3, 2.4, 2.5**

  - [x]* 1.3 Write unit tests for validation
    - Test valid input returns empty errors object
    - Test each field individually for whitespace-only rejection
    - Test boundary conditions (exactly 100 chars name, exactly 500 chars comment)
    - Test null/undefined rating produces error
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Implement UI components with local state
  - [x] 2.1 Create RatingSelector component
    - Create `components/RatingSelector.tsx` implementing `RatingSelectorProps` interface
    - Render a `<select>` element with options 1-5 and a default empty/placeholder option (no pre-selection)
    - Programmatically associate label via the `id` prop
    - Display error message when `error` prop is provided
    - Style with Tailwind CSS utility classes
    - _Requirements: 1.3, 6.3_

  - [x] 2.2 Create FeedbackForm component
    - Create `components/FeedbackForm.tsx` implementing `FeedbackFormProps` interface
    - Include text input for name (maxLength 100) with label "Name"
    - Include RatingSelector with label "Rating"
    - Include textarea for comment (maxLength 500) with label "Comment"
    - Include submit button labeled "Submit", disabled when `isSubmitting` is true
    - On submit: call `validateFeedback`, display per-field errors if invalid, call `onSubmit` if valid
    - Display all validation messages simultaneously adjacent to their fields
    - Display `submitError` as a banner/toast when present
    - Labels programmatically associated with inputs (htmlFor/id)
    - Style with Tailwind CSS utility classes
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 3.4, 5.3, 6.3_

  - [x] 2.3 Create FeedbackList component
    - Create `components/FeedbackList.tsx` implementing `FeedbackListProps` interface
    - Render list of `FeedbackEntry` items with name, numeric rating (1-5), and comment
    - Visual separation between entries (border or spacing)
    - Display "no feedback" message when entries array is empty and not loading
    - Display loading state when `isLoading` is true
    - Display `loadError` message when present
    - Style with Tailwind CSS utility classes
    - _Requirements: 4.1, 4.2, 4.3, 5.4, 6.3_

  - [x] 2.4 Implement main page with local state management
    - Update `app/page.tsx` as a `"use client"` component
    - Manage `feedbackEntries` state array (local state for Phase 1)
    - Implement `handleSubmit`: validate, create `FeedbackEntry` with generated id and ISO timestamp, prepend to list
    - Clear form on successful submit (handled via FeedbackForm's onSubmit resolving)
    - Render FeedbackForm above FeedbackList in a centered single-column layout
    - Apply `max-w-2xl`, horizontal centering (`mx-auto`), and padding (`px-4` minimum)
    - _Requirements: 1.1, 3.1, 3.2, 3.3, 4.1, 4.4, 6.1, 6.2, 6.3_

  - [x]* 2.5 Write property test for feedback creation (Property 4)
    - **Property 4: Valid feedback creates a matching entry**
    - Generator: valid names (1-100 chars, not all whitespace), valid ratings (1-5), valid comments (1-500 chars, not all whitespace)
    - Assertion: created entry's name, rating, and comment match input exactly
    - Minimum 100 iterations
    - **Validates: Requirements 3.1**

  - [x]* 2.6 Write property test for list ordering (Property 5)
    - **Property 5: Feedback list maintains reverse-chronological order**
    - Generator: arrays of entries with random timestamps
    - Assertion: after sorting, each entry's createdAt >= next entry's createdAt
    - Minimum 100 iterations
    - **Validates: Requirements 3.3, 4.1**

  - [x]* 2.7 Write property test for rendered entries (Property 6)
    - **Property 6: Rendered entries contain all required fields**
    - Generator: random valid FeedbackEntry objects
    - Assertion: rendered output contains the entry's name, numeric rating, and comment text
    - Minimum 100 iterations
    - **Validates: Requirements 4.2**

- [x] 3. Checkpoint - Verify local state implementation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Integrate AWS Amplify Gen 2 Data backend
  - [x] 4.1 Set up Amplify Gen 2 backend with data schema
    - Install AWS Amplify dependencies (`@aws-amplify/backend`, `aws-amplify`)
    - Create `amplify/data/resource.ts` with `Feedback` model schema (name: string required, rating: integer required, comment: string required)
    - Configure `publicApiKey` authorization mode with 30-day expiry
    - Create `amplify/backend.ts` to wire up the data resource
    - _Requirements: 5.1, 5.2_

  - [-] 4.2 Configure Amplify client in the Next.js app
    - Create `lib/amplify-config.ts` (or use `amplify_outputs.json`) for Amplify client configuration
    - Call `Amplify.configure()` at the app level (in page or layout)
    - Generate and import typed client using `generateClient<Schema>()`
    - _Requirements: 5.1, 5.2_

  - [~] 4.3 Replace local state with Amplify Data operations
    - Update `app/page.tsx` to use Amplify Data client for create and list operations
    - On page load: fetch feedback entries via `client.models.Feedback.list()` sorted by createdAt descending
    - On submit: call `client.models.Feedback.create()` with form data
    - Handle save failure: display error message, preserve form data, re-enable submit button
    - Handle load failure: display error message in list area
    - Add new entry to top of list on successful save without page reload
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 4.4 Write unit tests for Amplify integration error handling
    - Test save failure displays error and preserves form data
    - Test load failure displays error message in list area
    - Mock Amplify client for isolated testing
    - _Requirements: 5.3, 5.4_

- [~] 5. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The design uses TypeScript throughout — all implementation uses TypeScript
- Read `node_modules/next/dist/docs/` for latest Next.js conventions before implementing page/layout components
- Phase 1 (tasks 1-3) delivers a fully functional local-state app; Phase 2 (task 4) adds cloud persistence

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["2.4"] },
    { "id": 4, "tasks": ["2.5", "2.6", "2.7"] },
    { "id": 5, "tasks": ["4.1"] },
    { "id": 6, "tasks": ["4.2"] },
    { "id": 7, "tasks": ["4.3"] },
    { "id": 8, "tasks": ["4.4"] }
  ]
}
```
