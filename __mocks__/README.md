# Test Mocks

This directory contains all mock implementations used across tests.

## Directory Structure

```
__mocks__/
├── services/          # Service mocks (e.g., Supabase, Assessment)
├── components/        # Component mocks (e.g., UI components)
├── controllers/       # Controller mocks (e.g., API controllers)
├── data/             # Mock data generators
├── utils/            # Utility mocks
└── api/              # API mocks
```

## Mock Implementation Guidelines

### 1. Service Mocks
- Use Jest's mock functions (`jest.fn()`) for method implementations
- Implement type-safe interfaces matching the real service
- Provide default mock implementations
- Allow customization of mock behavior
- Document mock behavior and assumptions

Example:
```typescript
import { AssessmentService } from '@/services/AssessmentService';

export const createMockAssessmentService = (): jest.Mocked<AssessmentService> => ({
  createAssessment: jest.fn(),
  getAssessment: jest.fn(),
  updateAssessment: jest.fn(),
  // ... other methods
});
```

### 2. Component Mocks
- Mock only necessary component behavior
- Use `jest.mock()` for component modules
- Provide default props and render behavior
- Document prop requirements and side effects

### 3. Controller Mocks
- Mock request/response objects
- Implement middleware behavior
- Handle error scenarios
- Document expected request formats

### 4. Data Generators
- Use factory functions for test data
- Ensure type safety for generated data
- Allow customization of generated data
- Document data constraints and relationships

### 5. Utility Mocks
- Keep mock implementations simple
- Match original function signatures
- Document any deviations from real behavior
- Provide type-safe implementations

### 6. API Mocks
- Mock HTTP responses
- Handle error cases
- Match API response formats
- Document request/response formats

## Best Practices

1. **Type Safety**
   - Use TypeScript for all mock implementations
   - Match original type definitions
   - Document type constraints

2. **Isolation**
   - Keep mocks independent
   - Avoid shared state between mocks
   - Reset mock state between tests

3. **Documentation**
   - Document mock behavior
   - Explain deviations from real implementations
   - Provide usage examples

4. **Maintenance**
   - Keep mocks up to date with real implementations
   - Remove unused mocks
   - Track mock usage

## Usage Examples

### Service Mock
```typescript
import { createMockAssessmentService } from '__mocks__/services/assessment';

describe('AssessmentController', () => {
  const mockService = createMockAssessmentService();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle assessment creation', async () => {
    mockService.createAssessment.mockResolvedValue(/* ... */);
    // Test implementation
  });
});
```

### Data Generator
```typescript
import { createMockAssessment } from '__mocks__/data/assessment';

describe('AssessmentService', () => {
  it('should process assessment', () => {
    const mockAssessment = createMockAssessment({
      status: 'draft',
      progress: 50
    });
    // Test implementation
  });
});
```

## Contributing

1. Follow the established patterns in existing mocks
2. Add comprehensive documentation
3. Include usage examples
4. Update this README when adding new mock categories

