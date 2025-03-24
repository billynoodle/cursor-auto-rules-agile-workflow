# Mock Patterns and Usage Guidelines

## Directory Structure

```
tests/__mocks__/
├── services/           # Service-level mocks
│   ├── supabase/      # Supabase client mocks
│   │   ├── client.ts  # Mock client implementation
│   │   ├── types.ts   # Type definitions
│   │   └── index.ts   # Clean exports
│   └── offline/       # Offline service mocks
│       ├── service.ts # Mock service implementation
│       └── index.ts   # Clean exports
├── data/              # Test data mocks
│   └── assessment/    # Assessment-related mocks
│       ├── index.ts   # Main exports
│       ├── answers.ts # Answer data mocks
│       └── modules.ts # Module data mocks
└── utils/             # Mock utilities
    └── helpers.ts     # Common mock helpers

## Usage Guidelines

### 1. Supabase Client Mocking

```typescript
import { createMockSupabaseClient } from '../__mocks__/services/supabase';

const mockClient = createMockSupabaseClient();

// Mock a successful response
mockClient.from('assessments')
  .select()
  .single()
  .mockResolvedValue({
    data: { id: '1', ... },
    error: null
  });

// Mock an error response
mockClient.from('assessments')
  .select()
  .single()
  .mockRejectedValue(new Error('Database error'));
```

### 2. Offline Service Mocking

```typescript
import { createMockOfflineService } from '../__mocks__/services/offline';

const mockOfflineService = createMockOfflineService();

// Set online status
mockOfflineService.isOnline = true;

// Mock data storage
mockOfflineService.storeOfflineData('key', data);

// Mock data retrieval
mockOfflineService.getOfflineData.mockReturnValue(data);
```

### 3. Assessment Data Mocking

```typescript
import { 
  createMockAssessment,
  createMockAnswer,
  mockModules 
} from '../__mocks__/data/assessment';

const assessment = createMockAssessment({
  user_id: 'user123',
  status: 'in_progress'
});

const answer = createMockAnswer({
  value: 'test answer'
});
```

## Best Practices

1. **Use Type Safety**
   - Always use typed mock implementations
   - Leverage TypeScript's type system
   - Keep mock types in sync with real implementations

2. **Mock Structure**
   - Keep mocks close to what they're mocking
   - Use factory functions for data creation
   - Maintain consistent mock patterns

3. **Testing Mocks**
   - Test mock implementations
   - Verify mock behavior
   - Keep mocks simple and focused

4. **Documentation**
   - Document mock usage patterns
   - Keep examples up to date
   - Include common scenarios

5. **Maintenance**
   - Update mocks when implementations change
   - Remove unused mocks
   - Keep mock data realistic

## Common Issues

1. **Type Errors**
   ```typescript
   // Wrong
   mockClient.from('table').select().mockReturnValue(data);

   // Right
   mockClient.from('table').select().single().mockResolvedValue({
     data,
     error: null
   });
   ```

2. **Mock Cleanup**
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

3. **Complex Chains**
   ```typescript
   // Wrong
   mockClient.from('table').select().eq().order();

   // Right
   const query = mockClient.from('table');
   jest.spyOn(query, 'select').mockReturnThis();
   jest.spyOn(query, 'eq').mockReturnThis();
   ```

## Integration Points

- Mock implementations in `tests/__mocks__/`
- Test utilities in `tests/utils/`
- Test setup in `tests/setupTests.ts`
- Test templates in `tests/templates/`

## TODO

- [ ] Add tests for mock implementations
- [ ] Improve type definitions
- [ ] Add more usage examples
- [ ] Document error scenarios
- [ ] Create mock data generators 