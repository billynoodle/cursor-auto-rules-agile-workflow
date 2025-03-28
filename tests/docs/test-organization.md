# Test Organization Guidelines

## Overview

This document outlines the test organization patterns and best practices for the assessment application. It provides guidelines for test isolation, shared contexts, and test utilities.

## Test Structure

### 1. Directory Organization

```
/
__mocks__/             # Global mock implementations
   ├── services/          # Service mocks (e.g. Supabase)
   ├── components/        # Component mocks
   ├── controllers/       # Controller mocks
   ├── data/             # Mock data generators
   ├── utils/            # Mock utilities
   └── api/   
tests/
├── unit/                    # Unit tests
│   ├── services/           # Service tests
│   ├── components/         # Component tests
│   └── controllers/        # Controller tests
├── integration/            # Integration tests
│   ├── services/          # Service integration
│   ├── api/               # API integration
│   └── controllers/       # Controller integration
├── e2e/                   # End-to-end tests
├── utils/                 # Test utilities
│   ├── test-isolation.ts  # Test isolation utilities
│   └── test-context.ts    # Shared test context
└── __fixtures__/         # Test fixtures
           # API mocks
```

### 2. Test Categories

#### Unit Tests
- Test individual units in isolation
- Mock all external dependencies
- Focus on business logic
- High coverage target (80-95%)

#### Integration Tests
- Test component interactions
- Use real implementations for immediate dependencies
- Mock external services
- Coverage target for critical paths (90%+)

#### E2E Tests
- Test complete user flows
- Use real implementations where possible
- Focus on critical user journeys

## Test Isolation

### 1. Using Test Isolation Utilities

```typescript
import { createIsolatedTestContext } from '../utils/test-isolation';

describe('AssessmentService', () => {
  it('should handle offline mode', async () => {
    const { instance: service, mockOfflineService } = await createIsolatedTestContext(
      (client, offline) => new AssessmentService(client, offline),
      { isOnline: false }
    );

    // Test offline behavior
  });
});
```

### 2. Transaction-like State Management

```typescript
import { TestTransaction } from '../utils/test-isolation';

describe('StateManagement', () => {
  const transaction = new TestTransaction();

  it('should restore state on failure', () => {
    const initialState = { /* ... */ };
    transaction.takeSnapshot('initial', initialState);

    // Perform state changes
    
    const restoredState = transaction.restore('initial');
    expect(restoredState).toEqual(initialState);
  });
});
```

## Shared Test Context

### 1. Base Test Context

```typescript
import { BaseTestContext, withTestContext } from '../utils/test-context';

class AssessmentTestContext extends BaseTestContext {
  service: AssessmentService;
  
  constructor() {
    super();
    this.service = new AssessmentService(/* ... */);
  }
}

describe('Assessment Tests', () => {
  const { context } = withTestContext(() => new AssessmentTestContext());

  it('should use shared context', () => {
    const mock = context.createMock('someFunction');
    // Use mock in test
  });
});
```

### 2. Mock Date Management

```typescript
import { mockDate, restoreDate } from '../utils/test-context';

describe('Time-sensitive tests', () => {
  afterEach(() => {
    restoreDate();
  });

  it('should handle specific dates', () => {
    const testDate = mockDate('2024-01-01');
    // Test with mocked date
  });
});
```

## Best Practices

### 1. Test Isolation
- Use `createIsolatedTestContext` for consistent dependency mocking
- Implement proper cleanup in `afterEach` blocks
- Use `TestTransaction` for state management
- Avoid shared state between tests

### 2. Mock Management
- Use the shared test context for mock creation and management
- Document mock behavior and assumptions
- Verify mock calls and interactions
- Clean up mocks after each test

### 3. Test Data
- Use fixtures for consistent test data
- Avoid hardcoding test values
- Document data dependencies
- Clean up test data after tests

### 4. Error Handling
- Test both success and error paths
- Verify error messages and types
- Test boundary conditions
- Document error scenarios

## Example Implementations

### 1. Service Test

```typescript
import { createIsolatedTestContext } from '../utils/test-isolation';
import { AssessmentService } from './AssessmentService';

describe('AssessmentService', () => {
  it('should create assessment', async () => {
    const { instance: service, mockSupabaseClient } = await createIsolatedTestContext(
      (client, offline) => new AssessmentService(client, offline)
    );

    const result = await service.createAssessment({
      // Test data
    });

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
    expect(result).toBeDefined();
  });
});
```

### 2. Controller Test

```typescript
import { BaseTestContext, withTestContext } from '../utils/test-context';

class ControllerTestContext extends BaseTestContext {
  controller: AssessmentController;
  
  constructor() {
    super();
    this.controller = new AssessmentController(/* ... */);
  }
}

describe('AssessmentController', () => {
  const { context } = withTestContext(() => new ControllerTestContext());

  it('should handle state changes', async () => {
    const initialState = { /* ... */ };
    context.snapshot('initial', initialState);

    await context.controller.updateState({ /* ... */ });

    const finalState = context.controller.getState();
    expect(finalState).not.toEqual(initialState);
  });
});
```

## Integration with CI/CD

### 1. Test Environment Setup
- Use environment-specific configurations
- Set up test databases
- Configure test credentials
- Handle cleanup

### 2. Test Execution
- Run unit tests first
- Run integration tests
- Run E2E tests last
- Generate coverage reports

### 3. Test Reporting
- Configure test reporters
- Set up error notifications
- Track test metrics
- Monitor test performance

## Maintenance

### 1. Regular Updates
- Review and update test patterns
- Maintain documentation
- Update dependencies
- Clean up obsolete tests

### 2. Performance Monitoring
- Track test execution time
- Optimize slow tests
- Monitor resource usage
- Document performance requirements

## Troubleshooting

### 1. Common Issues
- Test isolation failures
- Mock implementation problems
- Async test timing
- State management issues

### 2. Solutions
- Use proper test isolation
- Verify mock implementations
- Use async/await correctly
- Implement proper cleanup

## Additional Resources

1. Jest Documentation: [https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)
2. Testing Best Practices: [https://github.com/goldbergyoni/javascript-testing-best-practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
3. Test Isolation Patterns: [https://martinfowler.com/articles/practical-test-pyramid.html](https://martinfowler.com/articles/practical-test-pyramid.html) 