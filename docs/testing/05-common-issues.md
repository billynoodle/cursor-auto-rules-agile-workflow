# Common Testing Issues and Solutions

## Overview

This document outlines common testing issues encountered in our application and their solutions. It serves as a reference for troubleshooting test failures and maintaining test quality.

## Mock Implementation Issues

### 1. Supabase Mock Chain Issues

#### Problem
```typescript
// Error: Property 'setMockData' does not exist on type 'PostgrestQueryBuilder'
const mockChain = {
  select: jest.fn().mockReturnValue({
    setMockData: jest.fn()  // Invalid mock implementation
  })
};
```

#### Solution
```typescript
// Correct implementation
const mockChain = {
  insert: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      single: jest.fn().mockResolvedValue({
        data: mockData,
        error: null
      })
    })
  })
};
(mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
```

### 2. Local Storage Mocking

#### Problem
```typescript
// Error: localStorage is not defined
localStorage.setItem('key', 'value');
```

#### Solution
```typescript
// Import and setup mock
import { localStorageMock } from '../../../mocks/localStorage';

// Setup in beforeEach
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });
});

// Use in tests
it('should store data locally', () => {
  localStorage.setItem('key', 'value');
  expect(localStorage.setItem).toHaveBeenCalledWith('key', 'value');
});
```

## Async Testing Issues

### 1. Unhandled Promise Rejections

#### Problem
```typescript
// Warning: Unhandled Promise Rejection
it('should handle errors', () => {
  service.method().catch(error => {
    expect(error).toBeDefined();
  });
});
```

#### Solution
```typescript
it('should handle errors', async () => {
  await expect(service.method()).rejects.toThrow('Expected error');
});
```

### 2. Race Conditions

#### Problem
```typescript
// Flaky test due to timing
it('should update after delay', () => {
  component.update();
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

#### Solution
```typescript
it('should update after delay', async () => {
  component.update();
  await screen.findByText('Updated');
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

## Component Testing Issues

### 1. Event Handler Testing

#### Problem
```typescript
// Error: Unable to fire event
fireEvent.click(button);
expect(onClickMock).toHaveBeenCalled();
```

#### Solution
```typescript
it('should handle click events', () => {
  const onClickMock = jest.fn();
  render(<Button onClick={onClickMock} />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(onClickMock).toHaveBeenCalledTimes(1);
});
```

### 2. Async Component Updates

#### Problem
```typescript
// Error: Element not found
render(<AsyncComponent />);
expect(screen.getByText('Loaded')).toBeInTheDocument();
```

#### Solution
```typescript
it('should show loaded state', async () => {
  render(<AsyncComponent />);
  
  // Wait for loading state
  expect(screen.getByText('Loading')).toBeInTheDocument();
  
  // Wait for loaded state
  await screen.findByText('Loaded');
  expect(screen.queryByText('Loading')).not.toBeInTheDocument();
});
```

## Service Testing Issues

### 1. Database Connection Mocking

#### Problem
```typescript
// Error: Database connection failed
it('should save data', async () => {
  await service.saveData(data);
});
```

#### Solution
```typescript
it('should save data', async () => {
  // Mock database connection
  const mockChain = {
    insert: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: mockData,
          error: null
        })
      })
    })
  };
  (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);

  // Test service method
  const result = await service.saveData(data);
  expect(result).toEqual(mockData);
});
```

### 2. Error Handling

#### Problem
```typescript
// Inconsistent error handling
it('should handle errors', async () => {
  try {
    await service.method();
  } catch (error) {
    expect(error).toBeDefined();
  }
});
```

#### Solution
```typescript
it('should handle errors', async () => {
  // Mock error response
  const mockError = new Error('Database error');
  (mockSupabase.from as jest.Mock).mockImplementation(() => {
    throw mockError;
  });

  // Test error handling
  await expect(service.method()).rejects.toThrow('Database error');
});
```

## Test Setup Issues

### 1. Mock Reset

#### Problem
```typescript
// Test interference due to shared mocks
describe('Service', () => {
  it('test 1', () => {
    mockFn.mockReturnValue(true);
  });
  
  it('test 2', () => {
    // mockFn still returns true
  });
});
```

#### Solution
```typescript
describe('Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test 1', () => {
    mockFn.mockReturnValue(true);
  });
  
  it('test 2', () => {
    mockFn.mockReturnValue(false);
  });
});
```

### 2. Environment Setup

#### Problem
```typescript
// Environment not properly configured
it('should use environment variables', () => {
  expect(process.env.API_URL).toBeDefined();
});
```

#### Solution
```typescript
describe('Environment Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      API_URL: 'http://test-api'
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should use environment variables', () => {
    expect(process.env.API_URL).toBe('http://test-api');
  });
});
```

## Performance Issues

### 1. Slow Tests

#### Problem
```typescript
// Slow test execution
it('should process data', async () => {
  for (let i = 0; i < 1000; i++) {
    await service.process(data);
  }
});
```

#### Solution
```typescript
it('should process data', async () => {
  // Mock heavy operations
  service.process = jest.fn().mockResolvedValue(result);
  
  // Test with minimal data
  const testData = createTestData(5); // Instead of 1000
  await service.process(testData);
  
  expect(service.process).toHaveBeenCalled();
});
```

### 2. Memory Leaks

#### Problem
```typescript
// Memory leak in tests
describe('Component', () => {
  const listeners = [];
  
  it('should add listeners', () => {
    listeners.push(handler);
  });
});
```

#### Solution
```typescript
describe('Component', () => {
  let listeners = [];
  
  beforeEach(() => {
    listeners = [];
  });

  afterEach(() => {
    listeners.forEach(listener => listener.cleanup());
    listeners = [];
  });

  it('should add listeners', () => {
    listeners.push(handler);
  });
});
```

## Best Practices

### 1. Test Isolation
- Reset mocks between tests
- Clean up side effects
- Use unique test data
- Avoid shared state

### 2. Error Handling
- Test error scenarios
- Use proper assertions
- Handle async errors
- Validate error messages

### 3. Performance
- Mock heavy operations
- Minimize test data
- Clean up resources
- Use efficient queries

### 4. Maintenance
- Keep tests focused
- Document complex setup
- Update test data
- Remove obsolete tests