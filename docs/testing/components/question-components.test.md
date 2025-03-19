# Question Components Test Documentation

## Overview

This document details the test coverage and scenarios for the question-related components in the assessment system.

## Components Covered

1. Question Component (`Question.test.tsx`)
2. QuestionPresentation Component (`QuestionPresentation.test.tsx`)
3. QuestionModule Component (`QuestionModule.test.tsx`)

## Test Scenarios

### Question Component

#### Input Types
- Multiple Choice Questions
  - Renders options correctly
  - Handles option selection
  - Updates selected state
- Numeric Questions
  - Accepts numeric input
  - Validates input type
  - Handles value changes
- Text Questions
  - Renders textarea
  - Handles text input
  - Preserves input value
- Likert Scale Questions
  - Renders scale options (1-5)
  - Labels options correctly (Strongly Disagree to Strongly Agree)
  - Handles scale selection
  - Updates selected state

#### Accessibility
- Associates inputs with labels via aria-labelledby
- Provides appropriate ARIA roles for inputs
- Maintains keyboard navigation

### QuestionPresentation Component

#### Progressive Disclosure
- Initially shows only question text
- Expands content on interaction
- Shows full content when disclosure disabled
- Maintains tooltip functionality in both states

#### Question Display
- Renders question text and description
- Shows required indicator when needed
- Displays tooltip with additional context
- Handles option selection

#### Navigation
- Shows/hides previous button appropriately
- Shows/hides next button appropriately
- Disables next button for unanswered required questions
- Enables next button when required questions answered

#### Accessibility
- Provides ARIA labels for groups and options
- Maintains keyboard navigation
- Implements proper ARIA roles
- Handles focus management

### QuestionModule Component

#### Module Structure
- Renders module title
- Shows module description when provided
- Displays all questions
- Handles module expansion/collapse

#### Progress Tracking
- Calculates completion percentage correctly
- Updates progress bar with ARIA attributes
- Handles partial completion states
- Shows accurate completion for all answers

#### Answer Management
- Handles answer changes for different question types
- Preserves answer state
- Triggers appropriate callbacks
- Validates required answers

## Test Coverage Notes

1. Question Component
   - Full coverage of all question types
   - Comprehensive accessibility testing
   - Edge case handling for each input type

2. QuestionPresentation Component
   - Progressive disclosure behavior fully tested
   - Navigation state management covered
   - Accessibility requirements verified

3. QuestionModule Component
   - Module state management tested
   - Progress calculation verified
   - Answer handling validated
   - Accessibility compliance checked

## Recent Updates

### 2024-03-XX
- Fixed Likert scale tests to use correct radio button labels
- Updated progressive disclosure tests for proper description visibility
- Corrected answer change test to use appropriate question ID
- Enhanced accessibility testing coverage 