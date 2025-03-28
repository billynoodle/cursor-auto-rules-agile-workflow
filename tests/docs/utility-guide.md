# Test Utilities Guide

## Overview
This guide documents the test utilities available in the project and how to use them effectively.

## Directory Structure
```
/                           # Project root
├── __mocks__/             # Global mock implementations
│   ├── services/          # Service mocks (e.g. Supabase)
│   ├── components/        # Component mocks
│   ├── controllers/       # Controller mocks
│   ├── data/             # Mock data generators
│   ├── utils/            # Mock utilities
│   └── api/              # API mocks
├── tests/                 # Test suites
│   ├── unit/
│   │   ├── services/     # Pure business logic
│   │   ├── components/   # UI components
│   │   └── controllers/  # UI logic
│   ├── integration/
│   │   ├── services/     # Service interactions
│   │   ├── api/         # API contracts
│   │   └── controllers/  # Controller-service integration
│   ├── e2e/
│   │   └── flows/       # User journeys
│   ├── __fixtures__/    # Test data
│   └── utils/           # Test utilities
```

## Test Context

### Base Test Context
The `BaseTestContext` interface provides a standard structure for test setup:

```typescript
export interface BaseTestContext {
  mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>;
  assessmentService: AssessmentService;
  controller: AssessmentFlowController;
  modules: ReturnType<typeof generateMockModules>;
}

export interface TestContextOptions extends MockOptions {
  moduleOptions?: GeneratorOptions;
  mockBehavior?: 'unit' | 'integration';
}
```

### Creating Test Context

#### Unit Tests
```typescript
describe('AssessmentService', () => {
  let context: BaseTestContext;
  
  beforeEach(async () => {
    context = await UnitTestUtils.createTestContext({
      moduleOptions: {
        moduleCount: 2,
        questionsPerModule: 2
      }
    });
  });
  
  it('should perform operation', () => {
    const result = context.service.operation();
    expect(result).toBeDefined();
  });
});
```

#### Integration Tests
```typescript
describe('AssessmentFlowController', () => {
  let context: BaseTestContext;
  
  beforeEach(async () => {
    context = await IntegrationTestUtils.createTestContext({
      moduleOptions: {
        moduleCount: 2,
        questionsPerModule: 2
      }
    });
  });
  
  it('should handle complete flow', async () => {
    const { controller, service } = context;
    // Test implementation...
  });
});
```

## Mock Utilities

### Supabase Client Mock
```typescript
import { createMockSupabaseClient } from '../../../__mocks__/services/supabase/client';

const mockClient = createMockSupabaseClient({
  simulateNetworkError: false,
  simulateTimeout: false
});
```

### Mock Data Generators
```typescript
import { generateMockModules, generateFullMockData } from '../../../__mocks__/data/assessment';

const modules = generateMockModules({
  moduleCount: 2,
  questionsPerModule: 2
});

const testData = generateFullMockData({
  moduleCount: 2,
  questionsPerModule: 2
});
```

## Test Environment Setup

### Common Setup
```typescript
import { setupTestEnvironment } from '../utils/test-utils';

describe('Component', () => {
  setupTestEnvironment();
  
  // Tests...
});
```

### Custom Setup
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  // Additional setup...
});

afterEach(() => {
  // Cleanup...
});
```

## Best Practices

### Using Test Context
1. Always use the appropriate test context creator (Unit or Integration)
2. Provide specific options for test requirements
3. Clean up resources in afterEach if needed
4. Use typed mock data generators

### Mock Implementation
1. Use mock options to control behavior
2. Document mock behavior options
3. Keep mocks in sync with real implementations
4. Version control mock implementations

### Test Environment
1. Use setupTestEnvironment for common setup
2. Clear mocks between tests
3. Reset state in afterEach
4. Document environment requirements

## Examples

### Complete Test Setup
```typescript
import { IntegrationTestUtils, setupTestEnvironment } from '../../utils/controller-test-utils';
import { AssessmentService, AssessmentError } from '../../../client/src/services/AssessmentService';
import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';
import { 
  generateFullMockData, 
  createMockSupabaseClient, 
  TEST_USER_ID
} from '../../../__mocks__/data/assessment';

describe('AssessmentFlowController - Initialization', () => {
  setupTestEnvironment();

  let testData: ReturnType<typeof generateFullMockData>;
  let context: BaseTestContext;

  beforeEach(async () => {
    context = await IntegrationTestUtils.createTestContext({
      moduleOptions: {
        moduleCount: 2,
        questionsPerModule: 2
      }
    });
    testData = generateFullMockData({
      moduleCount: 2,
      questionsPerModule: 2
    });
  });

  it('should initialize correctly', async () => {
    const { controller, modules } = context;
    expect(controller.getState().currentModuleId).toBe(modules[0].id);
  });
});
```

## Troubleshooting

### Common Issues
1. Mock not behaving as expected
   - Check mock options
   - Verify mock implementation
   - Review mock documentation

2. Test context setup failing
   - Check required dependencies
   - Verify options
   - Review error messages

3. Test environment issues
   - Clear mocks between tests
   - Reset state properly
   - Check for resource leaks

## Migration Guide

### From Old to New Pattern
1. Update import paths to use root `__mocks__`
2. Replace direct service creation with test context
3. Use typed mock generators
4. Update test environment setup
5. Document changes

## Support
For questions or issues:
1. Check the documentation
2. Review example implementations
3. Contact the test infrastructure team 