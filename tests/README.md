# Testing Documentation

## Directory Structure

```
tests/
├── e2e/                    # End-to-end tests using Cypress/Playwright
├── integration/            # Integration tests
├── unit/                   # Unit tests
│   ├── client/            # Frontend component tests
│   └── services/          # Service layer tests
├── __contracts__/         # Contract tests/API specifications
├── __fixtures__/          # Test fixtures and mock data
├── __mocks__/            # Mock implementations
├── templates/            # Test templates and shared test patterns
├── utils/               # Testing utilities and helpers
│   ├── customResolver.js
│   ├── testHelpers.ts
│   ├── TestResultsStore.ts
│   └── setup.ts
├── test-results/        # Test execution results and reports
├── scripts/            # Test automation and utility scripts
├── setupTests.ts       # Main test setup and configuration
└── setup.ts           # Basic test environment setup

```

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

## Running Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

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
- Check `test-results/` directory for reports
- Use TestResultsStore for result tracking
- Monitor coverage trends

## Contributing

1. Follow the test patterns in this guide
2. Maintain or exceed coverage requirements
3. Add documentation for new test patterns
4. Update test templates as needed 