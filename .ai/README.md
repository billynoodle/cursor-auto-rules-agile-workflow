# Allied Health Business Assessment Tool - AI Development Structure

## Directory Overview
```
.ai/
├── prd.md                 # Product Requirements Document
├── arch.md                # Technical Architecture Document
├── test-tracking.md       # Test Coverage and Progress Tracking
├── epics/                 # Epic-level Planning and Tracking
│   ├── README.md         # Epic Overview and Status
│   └── epic-{N}/         # Individual Epic Documentation
│       ├── epic-{N}.md   # Epic Definition
│       └── stories/      # Story Breakdown
│           ├── README.md # Story Overview
│           └── story-{N}/ # Individual Story Implementation
└── sprints/              # Sprint Planning and Tracking
    ├── current.md        # Active Sprint Status
    └── retrospectives/   # Sprint Retrospectives
        ├── template.md   # Retrospective Template
        └── YYYY-MM-DD.md # Daily Retrospectives
```

## File Interoperability

### Core Documentation
- **prd.md**: Defines product requirements and features
  - Referenced by epics for alignment
  - Guides story creation and acceptance criteria
  - Informs sprint planning priorities

- **arch.md**: Technical architecture specifications
  - Guides implementation across all stories
  - Referenced for technical decisions
  - Ensures consistent patterns

- **test-tracking.md**: Test coverage requirements
  - Tracks test implementation across stories
  - Guides test strategy in sprints
  - Ensures quality metrics are met

### Epic Management
- **epics/README.md**: High-level epic tracking
  - Links to individual epic documentation
  - Tracks overall progress
  - Shows dependencies between epics

- **epic-{N}/epic-{N}.md**: Individual epic definition
  - Breaks down business requirements from PRD
  - Maps to architectural components
  - Guides story creation

### Story Management
- **stories/README.md**: Story overview and relationships
  - Shows dependencies between stories
  - Tracks implementation progress
  - Maps to sprint objectives

- **story-{N}/**: Individual story implementation
  - Contains detailed tasks and progress
  - Links to specific PRD requirements
  - Maps to architectural components
  - Tracks test coverage

### Sprint Management
- **current.md**: Active sprint tracking
  - Lists active stories and progress
  - Shows daily updates
  - Tracks blockers and dependencies
  - Updates story status

- **retrospectives/**: Sprint review documentation
  - Daily retrospectives using template
  - Tracks progress and learnings
  - Influences future sprint planning
  - Updates story and epic status

## File Relationships

### Vertical Integration
1. PRD Requirements → Epic Definition → Story Implementation
2. Architecture Patterns → Technical Implementation → Test Coverage
3. Sprint Goals → Daily Progress → Retrospective Learnings

### Horizontal Integration
1. Story Dependencies → Sprint Planning → Implementation Order
2. Technical Decisions → Cross-story Patterns → Reusable Components
3. Test Coverage → Quality Metrics → Sprint Success Criteria

## Update Patterns

### Documentation Updates
1. PRD/Architecture Changes
   - Update relevant epic documentation
   - Reflect in affected stories
   - Note in sprint retrospectives

2. Epic Progress
   - Update epic status in README
   - Reflect in sprint planning
   - Track in retrospectives

3. Story Implementation
   - Update story status
   - Reflect in sprint current.md
   - Document in retrospectives

### Quality Assurance
1. Test Coverage
   - Track in test-tracking.md
   - Update in story documentation
   - Report in retrospectives

2. Technical Debt
   - Document in retrospectives
   - Plan in future sprints
   - Track in epic/story status

## Critical Notes
- Always maintain bidirectional traceability between PRD, epics, and stories
- Update sprint documentation daily
- Keep retrospectives aligned with template
- Ensure test coverage meets requirements
- Document technical decisions in architecture
- Track all dependencies and blockers
- Maintain consistent status updates across all levels 