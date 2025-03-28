# Assessment Test Fixtures

This directory contains standardized test fixtures for assessment-related tests. The fixtures are generated using the `MockDataFactory` to ensure consistency and type safety.

## Available Fixtures

### Test Modules
Pre-configured assessment modules with predictable data:
- `financial-module`: Financial assessment with numeric and multiple-choice questions
- `operations-module`: Operations assessment with text and boolean questions

### Test Assessments
Different assessment states for testing various scenarios:
- `empty`: New assessment with no answers
- `inProgress`: Partially completed assessment (50% progress)
- `completed`: Fully completed assessment (100% progress)

### Test Answers
Answer sets corresponding to different assessment states:
- `empty`: No answers
- `inProgress`: Answers for the first module
- `completed`: Complete set of answers for all questions

### Test Scenarios
Combined fixtures for common test scenarios:
- `emptyAssessment`: New assessment setup
- `inProgressAssessment`: Partially completed assessment
- `completedAssessment`: Fully completed assessment

### Test Score Interpretations
Score ranges and interpretations for different question types:
- `testScoreInterpretations`: Question-specific score interpretations
- `commonScoreRanges`: Reusable score range definitions

## Usage

```typescript
import { testModules, testAssessments, testAnswers, testScenarios } from '../__fixtures__/assessment';

describe('AssessmentService', () => {
  it('should handle empty assessment', () => {
    const { modules, assessment, answers } = testScenarios.emptyAssessment;
    // Test implementation
  });

  it('should calculate progress', () => {
    const { assessment, answers } = testScenarios.inProgressAssessment;
    // Test implementation
  });
});
```

## Extending Fixtures

When adding new fixtures:
1. Use the `MockDataFactory` to generate data
2. Add meaningful IDs and descriptions
3. Document the new fixtures in this README
4. Ensure type safety with TypeScript

## Best Practices

1. **Use Scenarios**: Prefer using `testScenarios` for complete test setups
2. **Type Safety**: Always import types from the source
3. **Predictable Data**: Use consistent values for easier assertions
4. **Documentation**: Add JSDoc comments for complex fixtures

## Integration with Test Utilities

These fixtures are designed to work with:
- `TestContextBuilder`: For creating test contexts
- `MockDataFactory`: For generating additional test data
- Test hooks: For setup/teardown 