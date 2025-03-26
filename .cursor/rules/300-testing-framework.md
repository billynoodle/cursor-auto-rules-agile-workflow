# Testing Framework Rule

IMPLEMENT comprehensive testing with clear boundaries between test types to PREVENT overlap and ENSURE effective coverage

## Context
- Applied when implementing test suites across unit, integration, and end-to-end testing
- Used during initial test creation and test refactoring
- Critical for maintaining non-redundant test coverage
- Important for CI pipeline optimization
- Focused on React component testing with React Testing Library

## Requirements

### 1. Test Layer Boundaries

#### Unit Tests
- MUST test individual units in isolation
- MUST mock all external dependencies
- MUST NOT make real network calls or database operations
- MUST focus on business logic and edge cases
- MUST achieve 80-95% coverage depending on criticality
- MUST be fast and deterministic

#### Integration Tests
- MUST test interactions between components
- MUST use real implementations for immediate dependencies
- MUST mock external services (APIs, databases)
- MUST focus on component contracts
- MUST achieve 90%+ coverage for critical paths
- MUST verify data flow between components

#### E2E Tests
- MUST test complete user flows
- MUST use real implementations where possible
- MUST focus on critical user journeys
- MUST verify business requirements
- MUST be selective and focused on key scenarios

### 2. Directory Structure
```
tests/
├── unit/
│   ├── services/         # Pure business logic
│   ├── components/       # UI components
│   └── controllers/      # UI logic
├── integration/
│   ├── services/        # Service interactions
│   ├── api/            # API contracts
│   └── controllers/     # Controller-service integration
├── e2e/
│   └── flows/          # User journeys
├── __mocks__/          # Mock implementations
├── __fixtures__/       # Test data
└── utils/             # Test utilities
```

### 3. Test Implementation

#### Unit Tests
```typescript
// GOOD: Clear unit test with proper isolation
describe('AssessmentService', () => {
  let service: AssessmentService;
  let mockDb: jest.Mocked<Database>;
  
  beforeEach(() => {
    mockDb = createMockDatabase();
    service = new AssessmentService(mockDb);
  });
  
  it('should calculate assessment score', () => {
    const result = service.calculateScore(mockAssessmentData);
    expect(result).toBe(expectedScore);
  });
});

// BAD: Unit test with external dependencies
describe('AssessmentService', () => {
  it('should save to database', async () => {
    const service = new AssessmentService(realDatabase); // Wrong: using real database
    await service.save(data);
  });
});
```

#### Integration Tests
```typescript
// GOOD: Clear integration test
describe('AssessmentFlow', () => {
  let controller: AssessmentFlowController;
  let service: AssessmentService;
  
  beforeEach(async () => {
    service = new AssessmentService(testDb);
    controller = new AssessmentFlowController(service);
  });
  
  it('should save assessment state', async () => {
    await controller.saveState(mockState);
    const saved = await service.getState();
    expect(saved).toEqual(mockState);
  });
});

// BAD: Integration test testing internal logic
describe('AssessmentFlow', () => {
  it('should validate input format', () => { // Wrong: unit test concern
    const controller = new AssessmentFlowController(mockService);
    expect(controller.validateInput(data)).toBe(true);
  });
});
```

### 4. Test Data Management
- MUST use typed fixtures for test data
- MUST ensure test data isolation
- MUST clean up test data after execution
- MUST use unique identifiers for test data
- MUST store fixtures in `__fixtures__` directory

### 5. Mocking Strategy
- MUST mock external dependencies in unit tests
- MUST use MSW for API mocking in integration tests
- MUST mock browser APIs consistently
- MUST document mock implementations
- MUST store mocks in `__mocks__` directory

### 6. Test Results Management
- MUST use TestResultsStore for result persistence
- MUST follow standardized results structure:
  ```
  tests/results/
  ├── junit/          # Test execution results
  ├── metrics/        # Test metrics data
  └── coverage/       # Coverage reports
  ```
- MUST include required metadata with results
- MUST maintain result indices
- MUST clean up old results periodically

## Critical Notes
- NEVER mix responsibilities across test layers
- ALWAYS mock external dependencies in unit tests
- NEVER test business logic in integration tests
- ALWAYS use appropriate test doubles
- NEVER share state between tests
- ALWAYS clean up test data
- NEVER skip error case testing
- ALWAYS include both positive and negative test cases 