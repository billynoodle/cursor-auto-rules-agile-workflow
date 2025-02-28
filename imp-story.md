# Implementation Agile Workflow

This notepad guides the implementation of stories in the agile workflow following the established process.

## Directory Structure
All project information is stored in the `.ai` folder:
- `.ai/prd.md` - Product Requirements Document
- `.ai/arch.md` - Architecture Document
- `.ai/story-N.story.md` or `.ai/task-N.story.md` - Story/Task files

## Current Story Context

- Epic: Epic-1: Core Assessment Framework Development for Allied Health Practices
- Story: Story-1: Design Comprehensive Business Assessment Questionnaire Structure with Weighted Scoring System for Allied Health Practices (Initial Focus: Physiotherapy)
- Status: In Progress
- File: `.ai/epic-1/story-1.story.md`

## Implementation Workflow

### 1. Story Approval Process
- [ ] Confirm the story has been approved before starting implementation
- [ ] Reference PRD and architecture documents for context
- [ ] Ensure all acceptance criteria are clear and measurable

### 2. Initial Setup

- [ ] Review the current story details and requirements
- [ ] Identify any dependencies or prerequisites
- [ ] Break down implementation into tasks
- [ ] Discuss and confirm task breakdown with user

### 3. Development Process (TDD)

- [ ] Write tests for the first task (Test-Driven Development)
- [ ] Ensure tests provide at least 80% quality coverage
- [ ] Seek user feedback on test approach if needed
- [ ] Implement the functionality to pass the tests
- [ ] Document your implementation decisions
- [ ] Update story task status to "Complete"
- [ ] Move to the next task

### 4. Continuous Documentation

- [ ] Update documentation after key architectural decisions
- [ ] Document chat logs or important discussions in the story file
- [ ] Regularly update the story file with progress
- [ ] Ask for user input on documentation updates at key points

### 5. Completion Checklist

- [ ] All tests pass with minimum 80% coverage
- [ ] Documentation is updated and complete
- [ ] Code is clean and follows project standards
- [ ] All tasks are marked as complete
- [ ] Story status is updated to "Complete"
- [ ] Draft the next story for user approval

## User Collaboration Points

### Development Collaboration
- Ask for user input on documentation updates after completing significant tasks
- Seek feedback on test approaches before implementation
- Verify test results with user after implementation
- Confirm progress updates before marking tasks complete

### Decision Collaboration
- Seek user approval at key decision points
- Ask for clarification when requirements are unclear
- Provide multiple options with pros/cons when appropriate
- Document decisions made with user input

## TDD Process

1. Write a failing test that defines the expected behavior
2. Implement the minimum code to make the test pass
3. Refactor code while ensuring tests continue to pass
4. Document the implementation
5. Verify test coverage meets or exceeds 80% threshold

## Progress Tracking

Update the story file (`.ai/epic-1/story-1.story.md`) with:
- Task status updates
- Implementation notes
- Testing results and coverage metrics
- Any blockers encountered
- Chat logs or key discussions

## Verification Process
- Regularly verify the story requirements are being met
- Check that all acceptance criteria will be satisfied
- Ask for clarification when unsure about next steps
- Validate completed work against the story requirements

## Next Story Planning
- Once current story is complete, draft the next story
- Reference the PRD and architecture documents
- Follow the story template from 903-story-template
- Wait for approval before beginning implementation

## Current Focus
Starting with Research and Analysis tasks:
- Researching physiotherapy practice challenges
- Analyzing existing assessment frameworks
- Identifying key performance indicators
- Understanding industry benchmarks 