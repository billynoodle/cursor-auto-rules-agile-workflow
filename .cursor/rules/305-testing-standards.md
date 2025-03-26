# Testing Standards Rule

IMPLEMENT standardized testing practices to ENSURE comprehensive coverage, maintainability, and reliability across all test types

## Context
- Applied when writing or modifying any type of test
- Used during test planning, implementation, and review
- Essential for maintaining consistent test quality
- Critical for ensuring proper test isolation and coverage
- Applies to unit, integration, and E2E testing

## Requirements

### 1. Test Layer Standards

#### Unit Tests
- MUST test a single unit of code in isolation
- MUST NOT have external dependencies
- MUST be fast and deterministic
- MUST use descriptive test names
- MUST follow AAA pattern (Arrange, Act, Assert)
- MUST mock all dependencies

Example:
```typescript
// GOOD: Clear unit test
describe('calculateAssessmentScore', () => {
  it('should calculate weighted score correctly', () => {
    // Arrange
    const responses = [
      { questionId: 'q1', weight: 2, score: 5 },
      { questionId: 'q2', weight: 1, score: 3 }
    ];

    // Act
    const result = calculateAssessmentScore(responses);

    // Assert
    expect(result).toBe(13); // (2*5 + 1*3)
  });
});

// BAD: Multiple concerns in one test
describe('AssessmentService', () => {
  it('should handle assessment workflow', async () => {
    const service = new AssessmentService();
    await service.saveResponses(data); // Wrong: External dependency
    const score = service.calculateScore();
    await service.generateReport(); // Wrong: Multiple operations
  });
});
```

#### Integration Tests
- MUST test component interactions
- MUST use real implementations for immediate dependencies
- MUST mock external services
- MUST focus on data flow and contracts
- MUST clean up test data
- MUST be isolated from other tests

Example:
```typescript
// GOOD: Clear integration test
describe('AssessmentController with Service', () => {
  let controller: AssessmentController;
  let service: AssessmentService;
  let testDb: TestDatabase;

  beforeEach(async () => {
    testDb = await createTestDatabase();
    service = new AssessmentService(testDb);
    controller = new AssessmentController(service);
  });

  afterEach(async () => {
    await testDb.cleanup();
  });

  it('should save assessment and calculate score', async () => {
    // Arrange
    const responses = createTestResponses();

    // Act
    await controller.submitAssessment(responses);
    const result = await controller.getAssessmentResult();

    // Assert
    expect(result.score).toBeDefined();
    expect(result.recommendations).toBeDefined();
  });
});

// BAD: Testing internal logic in integration test
describe('AssessmentController', () => {
  it('should validate response format', () => { // Wrong: Unit test concern
    const controller = new AssessmentController(mockService);
    expect(controller.isValidResponse(data)).toBe(true);
  });
});
```

#### E2E Tests
- MUST test complete user flows
- MUST use real implementations
- MUST focus on critical paths
- MUST be resilient to UI changes
- MUST use data-testid attributes
- MUST handle async operations properly

Example:
```typescript
// GOOD: Clear E2E test
describe('Assessment Completion Flow', () => {
  beforeEach(async () => {
    await page.goto('/assessment');
    await loginTestUser();
  });

  it('should complete assessment and show results', async () => {
    // Start assessment
    await page.click('[data-testid="start-assessment"]');

    // Answer questions
    for (const question of testQuestions) {
      await page.fill(
        `[data-testid="question-${question.id}"]`, 
        question.answer
      );
      await page.click('[data-testid="next-question"]');
    }

    // Submit and verify
    await page.click('[data-testid="submit-assessment"]');
    await expect(page).toHaveURL('/results');
    await expect(
      page.locator('[data-testid="assessment-score"]')
    ).toBeVisible();
  });
});
```

### 2. Test Organization Standards

#### 2.1 File Structure
- MUST follow standard naming conventions:
  - Unit tests: `*.test.ts`
  - Integration tests: `*.integration.test.ts`
  - E2E tests: `*.e2e.test.ts`
  - Test utilities: `*.util.ts`
  - Mocks: `*.mock.ts`
  - Fixtures: `*.fixture.ts`

#### 2.2 Test Grouping
- MUST use descriptive describe blocks
- MUST group related tests together
- MUST use proper nesting levels
- MUST maintain test independence

Example:
```typescript
// GOOD: Clear test organization
describe('AssessmentService', () => {
  describe('score calculation', () => {
    it('should handle empty responses');
    it('should calculate weighted scores');
    it('should handle invalid responses');
  });

  describe('response validation', () => {
    it('should validate required fields');
    it('should validate score ranges');
    it('should handle invalid formats');
  });
});
```

### 3. Test Data Standards

#### 3.1 Fixtures
- MUST use typed fixtures
- MUST be deterministic
- MUST be minimal
- MUST be maintainable
- MUST be stored in `__fixtures__`

Example:
```typescript
// GOOD: Clear fixture definition
export const testAssessment: Assessment = {
  id: 'test-assessment-1',
  practiceId: 'test-practice-1',
  responses: [
    {
      questionId: 'q1',
      value: 5,
      weight: 2
    }
  ]
};
```

#### 3.2 Mocks
- MUST be type-safe
- MUST be minimal
- MUST be stored in `__mocks__`
- MUST match real implementations
- MUST be well-documented

Example:
```typescript
// GOOD: Clear mock implementation
export const mockAssessmentService = {
  calculateScore: jest.fn().mockReturnValue(85),
  saveResponses: jest.fn().mockResolvedValue(true),
  getResults: jest.fn().mockResolvedValue({
    score: 85,
    recommendations: []
  })
};
```

### 4. Test Quality Standards

#### 4.1 Coverage Requirements
- Core Business Logic: 95%+
- UI Components: 80%+
- API Endpoints: 90%+
- Critical Paths: 100%

#### 4.2 Performance Standards
- Unit Tests: < 100ms each
- Integration Tests: < 1s each
- E2E Tests: < 5s each

#### 4.3 Reliability Standards
- MUST be deterministic
- MUST handle async operations
- MUST clean up resources
- MUST be repeatable

### 5. Test Documentation Standards

#### 5.1 Test Description
- MUST be clear and concise
- MUST describe expected behavior
- MUST include edge cases
- MUST document assumptions

Example:
```typescript
// GOOD: Clear test documentation
/**
 * Tests the assessment score calculation logic
 * Assumptions:
 * - All responses are valid
 * - Weights are between 1-5
 * - Scores are between 0-100
 */
describe('calculateAssessmentScore', () => {
  // ... tests
});
```

#### 5.2 Test Maintenance
- MUST update tests with code changes
- MUST remove obsolete tests
- MUST maintain test documentation
- MUST review test coverage regularly

## Critical Notes
- NEVER skip test documentation
- ALWAYS follow AAA pattern
- NEVER mix test responsibilities
- ALWAYS clean up test data
- NEVER use non-deterministic values
- ALWAYS handle async operations properly
- NEVER skip error cases
- ALWAYS include positive and negative tests 