# Requirements Document

## Introduction

A beginner-friendly workshop feedback application built for a 90-minute AWS Amplify workshop. The app allows attendees to submit feedback (name, rating, comment) and view all submitted entries on a single page. Initially the app stores feedback in local state, with AWS Amplify Gen 2 Data integration added later for cloud persistence.

## Glossary

- **Feedback_App**: The Next.js web application that collects and displays workshop feedback
- **Feedback_Form**: The UI component containing input fields for name, rating, and comment, plus a submit button
- **Feedback_Entry**: A single feedback record containing a name, rating, and comment
- **Feedback_List**: The UI component that displays all submitted Feedback_Entry items
- **Rating_Selector**: The input control that allows a user to choose a rating value from 1 to 5
- **Amplify_Data**: The AWS Amplify Gen 2 Data backend used for cloud persistence of Feedback_Entry items

## Requirements

### Requirement 1: Display Feedback Form

**User Story:** As a workshop attendee, I want to see a feedback form on the page, so that I can provide my feedback about the workshop.

#### Acceptance Criteria

1. WHEN the page loads, THE Feedback_App SHALL display a Feedback_Form containing a text input for name (maximum 100 characters), a Rating_Selector for rating, a text area for comment (maximum 500 characters), and a submit button labeled "Submit"
2. THE Feedback_Form SHALL display labels "Name", "Rating", and "Comment" each programmatically associated with its corresponding input field
3. THE Rating_Selector SHALL present options for integer values 1, 2, 3, 4, and 5 with no option pre-selected by default

### Requirement 2: Validate Feedback Input

**User Story:** As a workshop attendee, I want the form to guide me on required fields, so that I submit complete feedback.

#### Acceptance Criteria

1. WHEN a user attempts to submit the Feedback_Form with a name field that is empty or contains only whitespace characters, THE Feedback_Form SHALL prevent submission and display a validation message adjacent to the name field indicating that the name is required
2. WHEN a user attempts to submit the Feedback_Form without selecting a rating, THE Feedback_Form SHALL prevent submission and display a validation message adjacent to the Rating_Selector indicating that a rating selection is required
3. WHEN a user attempts to submit the Feedback_Form with a comment field that is empty or contains only whitespace characters, THE Feedback_Form SHALL prevent submission and display a validation message adjacent to the comment field indicating that a comment is required
4. WHEN a user enters a name exceeding 100 characters or a comment exceeding 500 characters, THE Feedback_Form SHALL prevent submission and display a validation message adjacent to the respective field indicating the maximum allowed length has been exceeded
5. WHEN multiple required fields are invalid at the time of submission, THE Feedback_Form SHALL display validation messages for all invalid fields simultaneously

### Requirement 3: Submit Feedback

**User Story:** As a workshop attendee, I want to submit my feedback, so that it is recorded and visible to others.

#### Acceptance Criteria

1. WHEN a user fills in all required fields and clicks the submit button, THE Feedback_App SHALL create a new Feedback_Entry from the form data
2. WHEN a Feedback_Entry is successfully created, THE Feedback_Form SHALL clear all input fields including resetting the Rating_Selector to no selection
3. WHEN a Feedback_Entry is successfully created, THE Feedback_App SHALL add the new Feedback_Entry to the top of the Feedback_List
4. WHILE a Feedback_Entry is being created, THE Feedback_Form SHALL disable the submit button to prevent duplicate submissions

### Requirement 4: Display Feedback List

**User Story:** As a workshop attendee, I want to see all submitted feedback entries on the page, so that I can read what others thought about the workshop.

#### Acceptance Criteria

1. THE Feedback_App SHALL display a Feedback_List below the Feedback_Form showing all submitted Feedback_Entry items ordered most recent first
2. THE Feedback_List SHALL display the name, rating as a numeric value (1-5), and comment for each Feedback_Entry with visual separation between entries
3. WHEN no Feedback_Entry items exist, THE Feedback_List SHALL display a message indicating that no feedback has been submitted yet
4. WHEN a new Feedback_Entry is submitted, THE Feedback_List SHALL display the new entry without requiring a page reload

### Requirement 5: Persist Feedback with Amplify Data

**User Story:** As a workshop attendee, I want my feedback to be saved to the cloud, so that it persists across page reloads and is visible to all users.

#### Acceptance Criteria

1. WHEN a user submits a Feedback_Entry, THE Amplify_Data SHALL save all Feedback_Entry fields (name, rating, comment) to the cloud database
2. WHEN the Feedback_App loads, THE Amplify_Data SHALL retrieve all stored Feedback_Entry items and display them in the Feedback_List ordered most recent first
3. IF a save operation to Amplify_Data fails, THEN THE Feedback_App SHALL display an error message to the user indicating the feedback was not saved and preserve the form data so the user can retry
4. IF a load operation from Amplify_Data fails, THEN THE Feedback_App SHALL display an error message to the user indicating feedback could not be loaded
5. WHEN a Feedback_Entry is successfully saved to the cloud, THE Feedback_List SHALL display the new entry without requiring a page reload

### Requirement 6: Responsive Layout

**User Story:** As a workshop attendee, I want the app to look good on my laptop screen, so that I can use it comfortably during the workshop.

#### Acceptance Criteria

1. THE Feedback_App SHALL render the Feedback_Form above the Feedback_List in a horizontally centered, single-column layout with a maximum width of 672px (Tailwind `max-w-2xl`)
2. THE Feedback_App SHALL apply horizontal padding of at least 16px on each side so that content does not touch the viewport edges when the viewport is narrower than the maximum width
3. THE Feedback_App SHALL use Tailwind CSS utility classes for all styling
