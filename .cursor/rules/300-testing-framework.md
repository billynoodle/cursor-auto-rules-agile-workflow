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
/                           # Project root
├── __mocks__/             # Global mock implementations
│   ├── services/          # Service mocks (e.g. Supabase)
│   ├── components/        # Component mocks
│   ├── controllers/       # Controller mocks
│   ├── data/             # Mock data generators
│   ├── utils/            # Mock utilities
│   └── api/              # API mocks
├── tests/                 # Test suites
│   ├── unit/
│   │   ├── services/     # Pure business logic
│   │   ├── components/   # UI components
│   │   └── controllers/  # UI logic
│   ├── integration/
│   │   ├── services/     # Service interactions
│   │   ├── api/         # API contracts
│   │   └── controllers/  # Controller-service integration
│   ├── e2e/
│   │   └── flows/       # User journeys
│   ├── __fixtures__/    # Test data
│   └── utils/           # Test utilities
```

### 3. Test Implementation

#### Unit Tests
```typescript
// GOOD: Clear unit test with proper isolation using test utilities
describe('AssessmentService', () => {
  let context: BaseTestContext;
  
  beforeEach(async () => {
    context = await UnitTestUtils.createTestContext();
  });
  
  it('should calculate assessment score', () => {
    const result = context.service.calculateScore(mockAssessmentData);
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
// GOOD: Clear integration test using test utilities
describe('AssessmentFlowController - Initialization', () => {
  let context: BaseTestContext;
  
  beforeEach(async () => {
    context = await IntegrationTestUtils.createTestContext({
      moduleOptions: {
        moduleCount: 2,
        questionsPerModule: 2
      }
    });
  });
  
  it('should create a new assessment and initialize state correctly', async () => {
    const { controller, modules } = context;
    expect(controller.getState().currentModuleId).toBe(modules[0].id);
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

### 4. Test Utilities

#### Base Test Context
```typescript
// tests/utils/controller-test-utils.ts
export interface BaseTestContext {
  mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>;
  assessmentService: AssessmentService;
  controller: AssessmentFlowController;
  modules: ReturnType<typeof generateMockModules>;
}

export interface TestContextOptions extends MockOptions {
  moduleOptions?: GeneratorOptions;
  mockBehavior?: 'unit' | 'integration';
}

export const createBaseTestContext = async (
  options: TestContextOptions = {}
): Promise<BaseTestContext> => {
  // Implementation...
};
```

#### Test Environment Setup
```typescript
export const setupTestEnvironment = () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
};
```

### 5. Mock Implementation
- MUST place mocks in root `__mocks__` directory
- MUST follow service/component structure in mocks
- MUST provide typed mock generators
- MUST document mock behavior options
- MUST version control mock implementations
- MUST maintain mock parity with real implementations

Example mock structure:
```
__mocks__/
├── services/
│   └── supabase/
│       ├── client.ts      # Mock Supabase client
│       ├── types.ts       # Mock types
│       └── index.ts       # Mock exports
├── data/
│   └── assessment/
│       ├── generators.ts  # Mock data generators
│       └── types.ts       # Generator types
```

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
- ALWAYS use test utilities for consistent setup
- NEVER test business logic in integration tests
- ALWAYS use appropriate test doubles
- NEVER share state between tests
- ALWAYS clean up test data
- NEVER skip error case testing
- ALWAYS include both positive and negative test cases
- NEVER place mocks inside test directories
- ALWAYS use typed mock generators
- NEVER use real services in unit tests
- ALWAYS document mock behavior options 