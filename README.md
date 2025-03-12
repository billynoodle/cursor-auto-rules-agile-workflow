# Allied Health Business Assessment Tool

## Testing

### Environment Setup
The project uses Jest and React Testing Library for testing, with proper support for React 18 concurrent features. The test environment is configured in `tests/setupTests.ts`.

### Key Features
- Jest as the primary test runner
- React Testing Library for component testing
- Support for React 18 concurrent features
- Proper initialization of React hooks
- Automated cleanup after tests
- Console logging for debugging

### Running Tests
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

### Test Documentation
Detailed testing documentation can be found in the `docs/testing` directory:
- [Testing Overview](docs/testing/01-testing-overview.md)
- [Test File Structure](docs/testing/02-test-file-structure.md)
- [Writing Tests](docs/testing/03-writing-tests.md)
- [Running Tests](docs/testing/04-running-tests.md)
- [Common Issues](docs/testing/05-common-issues.md)

### Coverage Requirements
- Critical paths: 95%+ coverage
- Standard paths: 80%+ coverage 