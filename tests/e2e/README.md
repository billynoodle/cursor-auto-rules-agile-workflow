# End-to-End Tests

This directory contains end-to-end tests using Playwright. These tests verify the application works correctly from a user's perspective by automating browser interactions.

## Structure

- `pages/` - Tests organized by page/route
- `fixtures/` - Test data and helper functions
- `flows/` - Complex user journey tests spanning multiple pages

## Running Tests

```bash
# Install Playwright browsers
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run tests with UI mode for debugging
npm run test:e2e:ui

# Run tests in a specific browser
npx playwright test --project=chromium
```

## Writing Tests

### Page Tests
- Place tests in `pages/` directory
- Name files as `[PageName].e2e.test.tsx`
- Focus on isolated page functionality
- Use page object pattern when helpful

### Flow Tests
- Place in `flows/` directory
- Name files as `[FlowName].e2e.test.tsx`
- Test complete user journeys
- Verify integration between pages

### Best Practices

1. Use data-testid attributes for stable selectors
2. Keep tests independent and atomic
3. Clean up test data after each test
4. Use fixtures for test data
5. Add comments explaining complex flows
6. Handle loading states and animations
7. Test error scenarios and edge cases

### Example Test Structure

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('should do something', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });

  test.afterEach(async ({ page }) => {
    // Cleanup
  });
});
```

## Debugging

1. Use `test:e2e:ui` script for visual debugging
2. Add `await page.pause()` in tests
3. Use `--debug` flag for step-by-step execution
4. Check test artifacts in `test-results/` directory

## CI Integration

Tests run automatically in CI:
- Runs against all supported browsers
- Generates HTML report
- Captures screenshots and videos on failure
- Retries failed tests

