# Testing Framework

This project follows a structured testing approach with clear boundaries between test types to ensure effective coverage without overlap.

## Test Directory Structure

```
tests/
├── e2e/                  # End-to-end tests for critical user flows
├── integration/          # Integration tests for module interactions
│   └── tooltip/          # Tooltip integration tests
├── unit/                 # Unit tests for individual components
│   ├── services/         # Server service unit tests
│   └── client/           # Client-side unit tests
│       └── components/   # Client component unit tests
└── utils/                # Test utilities and helpers
```

## Running Tests

All tests are configured to run from the root directory using the following commands:

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Run with coverage report
npm run test:coverage

# Run tooltip-specific tests
npm run test:tooltip
```

## Test Results

Test results are stored in the `test-results` directory, including:

- Coverage reports
- Tooltip test results
- Historical test data

## Test Types

### Unit Tests
- Test individual functions, methods, and components in isolation
- Mock all external dependencies
- Follow naming pattern: `{component}.test.{ext}`
- Target >80% code coverage for core business logic

### Integration Tests
- Test interactions between related modules and services
- Use real implementations for immediate dependencies
- Mock external services (databases, APIs)
- Follow naming pattern: `{feature}Integration.test.{ext}`

### End-to-End Tests
- Test complete user flows and critical business scenarios
- Use real implementations of all components when possible
- Include only critical user journeys
- Follow naming pattern: `{workflow}.e2e.test.{ext}`

## Configuration

The testing framework is configured in the root `jest.config.js` file, which consolidates all test settings to avoid configuration conflicts. 