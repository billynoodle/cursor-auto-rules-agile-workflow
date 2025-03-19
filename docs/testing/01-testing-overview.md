# Testing Overview

## Current Status

- Total Test Suites: 16
- Total Tests: 201
- Coverage: >80% across all critical paths
- Test Types:
  - Unit Tests
  - Integration Tests
  - End-to-End Tests

## Test Organization

```
tests/
├── unit/
│   ├── services/
│   │   ├── AssessmentService.test.ts
│   │   ├── ModuleService.test.ts
│   │   └── ...
│   ├── client/
│   │   ├── components/
│   │   │   ├── Question.test.tsx
│   │   │   └── ...
│   │   └── controllers/
│   │       └── AssessmentFlowController.test.tsx
│   └── utils/
│       └── test-utils.tsx
├── integration/
│   ├── api/
│   └── flows/
└── e2e/
    └── scenarios/
```

## Key Components Under Test

### 1. Services
- AssessmentService
  - Assessment creation and management
  - Answer submission and retrieval
  - Offline support
- ModuleService
  - Module management
  - Question organization
  - Progress tracking

### 2. Components
- Question
  - Rendering
  - User interaction
  - State management
- Navigation
  - Flow control
  - Progress tracking
  - State transitions

### 3. Controllers
- AssessmentFlowController
  - Assessment navigation
  - State management
  - Error handling

## Testing Standards

### 1. Mock Implementation
```typescript
// Supabase mock chain
const mockChain = {
  insert: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      single: jest.fn().mockResolvedValue({
        data: mockData,
        error: null
      })
    })
  })
};

// Local storage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
```

### 2. Test Organization
```typescript
describe('Feature', () => {
  describe('Component/Method', () => {
    it('should behave as expected', () => {
      // Test implementation
    });
  });
});
```

### 3. Error Handling
```typescript
it('should handle errors', async () => {
  const mockError = new Error('Test error');
  mockService.method.mockRejectedValue(mockError);
  
  await expect(service.method()).rejects.toThrow('Test error');
});
```

## Test Types

### 1. Unit Tests
- Individual component testing
- Service method verification
- Utility function validation
- Mock external dependencies

### 2. Integration Tests
- Component interaction
- Service integration
- Data flow validation
- Error propagation

### 3. End-to-End Tests
- User journey validation
- Critical path testing
- Full system integration
- Performance verification

## Best Practices

### 1. Test Structure
- Clear test descriptions
- Proper setup and teardown
- Isolated test cases
- Comprehensive assertions

### 2. Mock Usage
- Consistent mock patterns
- Clear mock setup
- Reset between tests
- Document mock behavior

### 3. Error Testing
- Test error scenarios
- Validate error messages
- Check error handling
- Test recovery paths

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run specific test
npm test tests/unit/services/AssessmentService.test.ts

# Run with coverage
npm test -- --coverage
```

### Watch Mode
```bash
# Development mode
npm test -- --watch

# Filter by file
npm test -- --watch --testNamePattern="AssessmentService"
```

## Coverage Requirements

### Minimum Coverage
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

### Critical Areas
- Services: 90%
- Controllers: 90%
- Core Components: 85%

## Test Environment

### Setup
```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { mockSupabase } from './mocks/supabase';
import { localStorageMock } from './mocks/localStorage';

// Global mocks
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase
}));

// Reset mocks
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## Common Patterns

### 1. Component Testing
```typescript
it('should render and handle interaction', () => {
  render(<Component {...props} />);
  
  expect(screen.getByText('Content')).toBeInTheDocument();
  
  fireEvent.click(screen.getByRole('button'));
  expect(props.onAction).toHaveBeenCalled();
});
```

### 2. Service Testing
```typescript
it('should handle service operations', async () => {
  const mockData = { /* test data */ };
  mockService.getData.mockResolvedValue(mockData);
  
  const result = await service.processData();
  expect(result).toEqual(mockData);
});
```

### 3. Error Testing
```typescript
it('should handle errors', async () => {
  const error = new Error('Test error');
  mockService.getData.mockRejectedValue(error);
  
  await expect(service.processData()).rejects.toThrow('Test error');
});
```

## Continuous Integration

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test -- --coverage
```

### Coverage Reports
```bash
# Generate coverage report
npm test -- --coverage

# Generate and view report
npm test -- --coverage && open coverage/lcov-report/index.html
```

## Future Improvements

### 1. Short Term
- Increase test coverage
- Add more E2E tests
- Improve error testing
- Enhance documentation

### 2. Long Term
- Visual regression tests
- Performance testing
- Load testing
- Security testing

## Resources

### Documentation
- Jest: https://jestjs.io/docs
- React Testing Library: https://testing-library.com/docs
- Cypress: https://docs.cypress.io

### Tools
- Jest
- React Testing Library
- Cypress
- Istanbul (Coverage) 