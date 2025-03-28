# Test Dependency Analysis

## Overlapping Tests Identified

### 1. Controller Tests
#### AssessmentFlowController
- **Navigation vs Progress Tests Overlap**
  - Both test files contain module completion state verification
  - Both handle state management during navigation
  - Recommendation: Extract shared setup and state verification to common utilities

### 2. Service Tests
#### Question Service Layer
- **Redundant Test Coverage**
  - `QuestionService.test.ts` and `QuestionServiceAllModules.test.ts` have overlapping module loading tests
  - `QuestionInterconnectedness.test.ts` duplicates some validation logic from `QuestionService.test.ts`
  - Recommendation: Consolidate into a single test suite with clear boundaries

#### Assessment Services
- **Shared Logic**
  - `AssessmentService.test.ts` and `AssessmentDataService.test.ts` share similar data setup
  - `AnswerService.test.ts` contains validation logic also present in `AssessmentValidation.test.ts`
  - Recommendation: Create shared test fixtures and utilities

## Duplicate Fixtures

### 1. Mock Data
- Multiple occurrences of similar mock data across:
  - Assessment module fixtures
  - Question templates
  - User response data
- Recommendation: Centralize in `__fixtures__/assessment/` directory

### 2. Test Setup
- Common setup patterns found in:
  - Controller test initialization
  - Service mocking
  - Database fixtures
- Recommendation: Create shared setup utilities

## Shared Setup Code

### 1. Controller Tests
```typescript
// Common setup pattern found in multiple files
const createTestContext = async (options) => {
  const modules = createTestModules(options);
  const controller = new AssessmentFlowController(modules);
  return { controller, modules };
};
```
- Recommendation: Move to shared test utility

### 2. Service Tests
```typescript
// Repeated service initialization
const setupTestService = async (config) => {
  const mockDb = createMockDatabase();
  const service = new SomeService(mockDb, config);
  return { service, mockDb };
};
```
- Recommendation: Create generic service setup utility

## Consolidation Recommendations

### 1. Test Files to Merge
1. `QuestionService.test.ts` + `QuestionServiceAllModules.test.ts`
   - Create: `QuestionService.comprehensive.test.ts`
   - Separate by test categories: basic operations, module operations, validation

2. `AssessmentValidation.test.ts` + `AnswerService.test.ts`
   - Create: `AssessmentValidation.comprehensive.test.ts`
   - Split into: input validation, business rules, error cases

### 2. Shared Utilities to Create
1. `TestContextBuilder`
   - Purpose: Standardize test context creation
   - Location: `tests/utils/test-helpers/TestContextBuilder.ts`

2. `MockDataFactory`
   - Purpose: Centralize mock data creation
   - Location: `tests/utils/mock-helpers/MockDataFactory.ts`

### 3. Files to Archive
1. `QuestionServiceAllModules.test.ts` (after merge)
2. `AssessmentValidation.test.ts` (after merge)

## Action Items

1. Create Shared Utilities
   - [ ] Implement `TestContextBuilder`
   - [ ] Implement `MockDataFactory`
   - [ ] Create centralized fixtures

2. Merge Redundant Tests
   - [ ] Question service tests
   - [ ] Validation tests
   - [ ] Update imports in dependent files

3. Update Test Organization
   - [ ] Move shared setup code to utilities
   - [ ] Update test patterns to use new utilities
   - [ ] Remove duplicate fixtures

4. Documentation
   - [ ] Update test documentation with new patterns
   - [ ] Document shared utilities
   - [ ] Create examples of proper test organization

## Next Steps
Once all action items above are completed:
1. Mark Task 2 (Dependency Analysis) as complete in test-refactoring-plan.md ✅
2. Move on to Task 4 (Utility Migration) in test-refactoring-plan.md
3. Use the insights from this analysis to guide the implementation of remaining tasks 