# Running Tests

## Overview

This document provides instructions for running tests in our application. It covers different test types, configurations, and common scenarios.

## Test Commands

### Running All Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Running Specific Tests

```bash
# Run specific test file
npm test tests/unit/services/AssessmentService.test.ts

# Run specific test suite
npm test -t "AssessmentService"

# Run tests matching pattern
npm test -- --testNamePattern="should create assessment"
```

### Running Test Types

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/services/': {
      branches: 90,
      functions: 90,
      lines: 90
    }
  }
};
```

### Environment Setup

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { mockSupabase } from './mocks/supabase';
import { localStorageMock } from './mocks/localStorage';

// Setup global mocks
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase
}));

// Setup localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Test Environments

### Development

```bash
# Run tests in development
npm test -- --env=development

# Watch mode with development config
npm test -- --env=development --watch
```

### CI/CD

```bash
# Run tests in CI
npm test -- --env=ci --ci

# Generate coverage report
npm test -- --env=ci --coverage --coverageReporters=text-lcov
```

## Coverage Reports

### Generating Reports

```bash
# Generate coverage report
npm test -- --coverage

# Generate specific format
npm test -- --coverage --coverageReporters=html

# Generate and open report
npm test -- --coverage && open coverage/lcov-report/index.html
```

### Coverage Requirements

```javascript
// Coverage thresholds
{
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/services/': {
      branches: 90,
      functions: 90,
      lines: 90
    }
  }
}
```

## Debugging Tests

### Using Debug Mode

```bash
# Run tests in debug mode
npm test -- --debug

# Debug specific test
npm test tests/unit/services/AssessmentService.test.ts --debug
```

### Using Console Output

```typescript
// Add console output in tests
it('should debug test', () => {
  console.log('Debug info:', result);
  expect(result).toBeDefined();
});

// Run with verbose output
npm test -- --verbose
```

## Common Scenarios

### 1. Running Failed Tests

```bash
# Rerun only failed tests
npm test -- --onlyFailures

# Run failed tests with watch
npm test -- --onlyFailures --watch
```

### 2. Updating Snapshots

```bash
# Update all snapshots
npm test -- -u

# Update specific snapshot
npm test ComponentName -u
```

### 3. Performance Testing

```bash
# Run with timer
npm test -- --verbose

# Profile test performance
npm test -- --detectOpenHandles
```

## Best Practices

### 1. Test Organization

```bash
# Run tests by directory
npm test tests/unit/services

# Run related tests
npm test -- --findRelatedTests path/to/changed/file.ts
```

### 2. Test Filtering

```bash
# Run tests matching description
npm test -- -t "should handle errors"

# Skip specific tests
npm test -- --testPathIgnorePatterns="integration"
```

### 3. Performance

```bash
# Run tests in parallel
npm test -- --maxWorkers=4

# Run without cache
npm test -- --no-cache
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
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
      - uses: coverallsapp/github-action@v2
```

### Test Reports

```bash
# Generate JUnit report
npm test -- --reporters=jest-junit

# Generate HTML report
npm test -- --coverage --coverageReporters=html
```

## Troubleshooting

### 1. Test Failures

```bash
# Run with detailed logs
npm test -- --verbose

# Run single test
npm test -- --testNamePattern="test name" --verbose
```

### 2. Performance Issues

```bash
# Identify slow tests
npm test -- --verbose

# Run without coverage
npm test -- --no-coverage
```

### 3. Memory Issues

```bash
# Run with increased memory
NODE_OPTIONS=--max_old_space_size=4096 npm test

# Run tests serially
npm test -- --runInBand
```

## Additional Resources

### Documentation
- Jest Documentation: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro
- Test Coverage: https://jestjs.io/docs/configuration#collectcoveragefrom-array

### Tools
- Jest CLI: https://jestjs.io/docs/cli
- Coverage Tools: https://istanbul.js.org/
- Test Reporters: https://github.com/jest-community/jest-junit 