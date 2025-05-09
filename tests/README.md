# Testing Documentation

This directory contains all test-related files and configurations for the project.

## Directory Structure

```
tests/
├── __mocks__/           # Centralized mocks directory
│   ├── services/        # Service mocks
│   │   ├── supabase/   # Supabase-related mocks
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   └── offline/    # Offline service mocks
│   │       ├── service.ts
│   │       └── types.ts
│   ├── data/           # Test data mocks
│   │   ├── assessment/
│   │   │   ├── index.ts
│   │   │   ├── answers.ts
│   │   │   └── modules.ts
│   │   └── errors/     # Error scenario mocks
│   │       └── index.ts
│   └── utils/          # Mock utilities
│       └── helpers.ts
├── e2e/              # End-to-end tests
├── integration/      # Integration tests
├── unit/            # Unit tests
├── results/         # Test execution results and reports
│   ├── coverage/    # Code coverage reports
│   ├── metrics/     # Test metrics and statistics
│   │   ├── raw/    # Raw metrics data
│   │   └── reports/ # Aggregated reports
│   └── junit/       # JUnit XML reports
├── scripts/         # Test runner scripts
└── utils/          # Testing utilities
```

## Test Types

### Unit Tests
- Located in `unit/`
- Run with `npm run test:unit`
- Results stored in `results/junit/unit/`
- Coverage reports in `results/coverage/`

### Integration Tests
- Located in `integration/`
- Run with `npm run test:integration`
- Results stored in `results/junit/integration/`
- Coverage reports in `results/coverage/`

### End-to-End Tests
- Located in `e2e/`
- Run with `npm run test:e2e`
- Results stored in `results/junit/e2e/`

### Tooltip Tests
- Located in `integration/tooltip/`
- Run with `npm run test:tooltip`
- Results stored in `results/junit/tooltip/`
- Metrics stored in `results/metrics/`

## Test Results

All test results are stored in the `results/` directory with the following organization:

- `coverage/`: Code coverage reports generated by Jest
  - HTML reports
  - JSON coverage data
  - LCOV reports

- `metrics/`: Test execution metrics and statistics
  - `raw/`: Individual test run metrics
  - `reports/`: Aggregated reports and trends

- `junit/`: JUnit XML reports for CI/CD integration
  - Organized by test type (unit, integration, e2e, tooltip)

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Types
```bash
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e        # Run end-to-end tests
npm run test:tooltip    # Run tooltip tests
```

### Test Reports

After running tests:
1. Check `results/coverage/` for code coverage reports
2. Check `results/metrics/reports/` for test execution metrics
3. Check `results/junit/` for detailed test results by type

## Contributing

When adding new tests:
1. Place them in the appropriate directory based on test type
2. Follow the existing naming conventions
3. Update test runners if needed
4. Ensure results are properly stored in the `results/` directory

## Test Coverage Requirements

### Critical Path Coverage (95%+)
- Authentication flows
- Data persistence operations
- API endpoints
- Core business logic
- Error handling paths

### Standard Coverage (80%+)
- UI components
- Utility functions
- Helper modules
- Non-critical paths

## Test Patterns

### 1. Async Operations
```typescript
describe('Async Operations', () => {
  it('should handle async data fetching', async () => {
    // Setup
    const mockData = { id: 1, name: 'Test' };
    jest.spyOn(api, 'fetchData').mockResolvedValue(mockData);

    // Execute
    const result = await fetchData();

    // Verify
    expect(result).toEqual(mockData);
  });

  it('should handle async errors', async () => {
    // Setup
    const error = new Error('API Error');
    jest.spyOn(api, 'fetchData').mockRejectedValue(error);

    // Execute & Verify
    await expect(fetchData()).rejects.toThrow('API Error');
  });
});
```

### 2. Component Testing
```typescript
describe('Component Tests', () => {
  it('should render and handle user interactions', async () => {
    // Setup
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    // Execute
    await userEvent.click(screen.getByRole('button'));

    // Verify
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 3. API Integration Tests
```typescript
describe('API Integration', () => {
  it('should integrate with external services', async () => {
    // Setup
    const mockResponse = { data: [...] };
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        return res(ctx.json(mockResponse));
      })
    );

    // Execute
    const result = await api.getData();

    // Verify
    expect(result).toEqual(mockResponse);
  });
});
```

## Test Data Management

### 1. Fixtures
- Use typed fixtures for consistent test data
- Store fixtures in `__fixtures__` directory
- Version control fixtures with code

```typescript
// __fixtures__/users.ts
export const mockUsers = {
  valid: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  },
  invalid: {
    id: '2',
    name: '',
    email: 'invalid-email'
  }
};
```

### 2. Test Data Isolation
- Reset database state before tests
- Use unique identifiers for test data
- Clean up created data after tests

```typescript
describe('Database Operations', () => {
  beforeEach(async () => {
    await db.reset();
  });

  afterEach(async () => {
    await db.cleanup();
  });
});
```

## Mocking Strategies

### 1. Module Mocking
```typescript
// __mocks__/external-service.ts
export const externalService = {
  getData: jest.fn(),
  processData: jest.fn()
};

// In tests
jest.mock('external-service');
```

### 2. API Mocking
```typescript
// Setup MSW handlers
const handlers = [
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.json(mockData));
  }),
  rest.post('/api/data', (req, res, ctx) => {
    return res(ctx.status(201));
  })
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 3. Browser API Mocking
```typescript
// setupTests.ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }))
});
```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use clear, descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests focused and atomic

### 2. Component Testing
- Use React Testing Library queries
- Test component behavior, not implementation
- Focus on user interactions
- Test accessibility

### 3. Error Handling
- Test both success and error paths
- Verify error messages and states
- Test boundary conditions
- Validate error recovery

### 4. Performance Testing
- Test response times
- Verify resource cleanup
- Test memory usage
- Monitor test execution time

## Continuous Integration

Tests are automatically run in CI/CD pipelines:
- Unit and integration tests on every PR
- E2E tests on staging deployments
- Coverage reports generated and tracked
- Performance benchmarks monitored

## Debugging Tests

### 1. Interactive Mode
```bash
npm test -- --watch
```

### 2. Debug Output
```typescript
screen.debug();  // Print current DOM state
console.log(prettyDOM(element));  // Print specific element
```

### 3. Test Results
- Check `results/` directory for reports
- Use TestResultsStore for result tracking
- Monitor coverage trends

## Mock Patterns

### Mock Organization
All mocks should be centralized in the `tests/__mocks__` directory following these guidelines:

1. Service Mocks
   - Place service-specific mocks in `__mocks__/services/<service-name>/`
   - Include type definitions in separate files
   - Use index files for clean exports

2. Data Mocks
   - Store test data mocks in `__mocks__/data/<domain>/`
   - Keep related data together (e.g., all assessment-related mocks)
   - Use factory functions for data creation

3. Error Scenarios
   - Centralize error mocks in `__mocks__/data/errors/`
   - Document each error scenario
   - Use consistent error patterns

### Supabase Client Mocking
The Supabase client requires careful mocking due to its chained method pattern. Our implementation provides:

```typescript
const mockSingle = jest.fn<() => Promise<MockResponse<any>>>();
const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
const mockSelect = jest.fn().mockReturnValue({ eq: mockEq, single: mockSingle });
```

#### Known Issues
- TypeScript errors with `mockResolvedValue` on PostgrestFilterBuilder
- Query builder chain type definitions need improvement
- Some methods missing from mock implementation

### Offline Service Mocking
The offline service mock needs to handle:
- Online/offline state
- Data storage and retrieval
- Error conditions

#### Current Challenges
- Type definitions for mock methods
- Proper implementation of Jest mock functions
- Consistent behavior with actual service

## Test Coverage Requirements
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

Current coverage is below these thresholds and needs improvement.

## Running Tests
```bash
npm test -- tests/unit/services/assessment/*.test.ts --coverage
```

## Test Organization
- Unit tests in `tests/unit/`
- Integration tests planned
- Mock implementations in `tests/__mocks__/`

## Best Practices
1. Use TDD approach
2. Mock external dependencies
3. Test error conditions
4. Maintain type safety
5. Document complex mocks
6. Keep mocks in centralized location
7. Use consistent mock patterns
8. Document mock usage

## TODO
- [ ] Fix TypeScript errors in test files
- [ ] Improve mock implementations
- [ ] Add missing test cases
- [ ] Set up integration tests
- [ ] Document mock patterns
- [ ] Implement mock consolidation plan
- [ ] Create mock usage guidelines

## Contributing

1. Follow the test patterns in this guide
2. Maintain or exceed coverage requirements
3. Add documentation for new test patterns
4. Update test templates as needed
5. Place mocks in appropriate directories
6. Keep mock implementations consistent 