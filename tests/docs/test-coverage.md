# Test Coverage Guidelines

## Overview

This document outlines our test coverage requirements and guidelines across different test types.

## Coverage Targets

### Unit Tests
- **Target**: 80-95% coverage
- **Scope**: Individual functions, components, and services
- **Priority Areas**:
  - Business logic in services
  - UI component rendering and interactions
  - Utility functions
  - Data transformations

### Integration Tests
- **Target**: 90%+ for critical paths
- **Scope**: Service interactions, API endpoints, database operations
- **Priority Areas**:
  - Service-to-service interactions
  - Database operations
  - API endpoint functionality
  - State management flows

### E2E Tests
- **Target**: 100% coverage of critical user journeys
- **Scope**: Complete user flows and business processes
- **Priority Areas**:
  - Assessment completion flow
  - Results viewing and export
  - Profile management
  - Error handling scenarios

## Current Coverage Status

### Unit Tests
```bash
# Run unit test coverage
npm run test:unit -- --coverage
```

Coverage report location: `tests/results/coverage/unit`

### Integration Tests
```bash
# Run integration test coverage
npm run test:integration -- --coverage
```

Coverage report location: `tests/results/coverage/integration`

### E2E Tests
```bash
# Run E2E tests with coverage
npm run test:e2e
```

Coverage report location: `tests-results/` (Playwright report)

## Coverage Requirements by Component Type

### Services
- **Unit Test Coverage**: 90%+
- **Integration Test Coverage**: 95%+
- Required areas:
  - Success paths
  - Error handling
  - Edge cases
  - Data validation

### UI Components
- **Unit Test Coverage**: 85%+
- **E2E Test Coverage**: Critical user interactions
- Required areas:
  - Rendering
  - User interactions
  - State changes
  - Error states

### API Endpoints
- **Integration Test Coverage**: 100%
- Required areas:
  - Request validation
  - Response formats
  - Error handling
  - Authentication/Authorization

### Database Operations
- **Integration Test Coverage**: 95%+
- Required areas:
  - CRUD operations
  - Transactions
  - Constraints
  - Data integrity

## Maintaining Coverage

### Best Practices
1. Write tests before implementing features (TDD)
2. Review coverage reports in PRs
3. Focus on critical business logic
4. Test edge cases and error scenarios
5. Keep tests maintainable and readable

### Coverage Gaps
When coverage falls below targets:
1. Identify uncovered code paths
2. Prioritize critical functionality
3. Create tickets for coverage gaps
4. Document reasons for any exclusions

### Excluded from Coverage
- Generated code
- Test utilities
- External library interfaces
- Configuration files
- Type definitions

## Coverage Reports

### Generating Reports
```bash
# Generate all coverage reports
npm run test:coverage

# View detailed coverage report
npm run test:coverage -- --coverageReporters="html" --coverageDirectory="coverage-report"
```

### Reading Reports
- **Lines**: Percentage of code lines executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of code branches executed
- **Statements**: Percentage of statements executed

### CI/CD Integration
- Coverage reports generated on each PR
- Coverage thresholds enforced
- Reports archived for trend analysis
- Blocking PR merge if coverage decreases significantly

## Tools and Configuration

### Jest Configuration
```typescript
// jest.config.ts coverage settings
{
  collectCoverageFrom: [
    '../src/**/*.{ts,tsx}',
    '!../src/**/*.d.ts',
    '!../src/**/index.{ts,tsx}',
    '!../src/**/*.stories.{ts,tsx}',
  ],
  coverageDirectory: '<rootDir>/results/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
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
      lines: 90,
      statements: 90
    },
    './src/api/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  }
}
```

### Playwright Configuration
```typescript
// playwright.config.ts coverage settings
{
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/e2e-coverage.json' }]
  ],
}
```

## Coverage Review Process

### Pull Request Reviews
1. Check coverage report
2. Review uncovered lines
3. Verify critical paths
4. Ensure test quality
5. Document coverage decisions

### Regular Coverage Audits
1. Monthly coverage review
2. Identify trends
3. Update documentation
4. Adjust thresholds if needed
5. Plan coverage improvements 