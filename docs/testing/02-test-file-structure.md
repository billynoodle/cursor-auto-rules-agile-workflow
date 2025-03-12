# Test File Structure

## Basic Structure

Every test file follows a similar pattern:

```typescript
// 1. Imports
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

// 2. Mock Setup (if needed)
jest.mock('./someService', () => ({
  getData: jest.fn()
}));

// 3. Test Suite
describe('MyComponent', () => {
  // 4. Test Cases
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Detailed Breakdown

### 1. Imports Section

```typescript
// Testing utilities
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';  // Adds custom matchers

// Component to test
import MyComponent from './MyComponent';

// Any other dependencies
import { someHelper } from './helpers';
```

- `render`: Creates a virtual DOM for testing
- `screen`: Helps find elements in the virtual DOM
- `fireEvent`: Simulates user interactions
- `@testing-library/jest-dom`: Adds special test checks for DOM elements

### 2. Mock Setup

```typescript
// Mock a service
jest.mock('./api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'test' })
}));

// Mock a hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));

// Mock props
const mockProps = {
  title: 'Test Title',
  onClick: jest.fn()
};
```

Mocks are like stunt doubles in movies - they stand in for real things that might be:
- Too complex to test
- Dependent on external services
- Need to behave in specific ways for testing

### 3. Test Suite Structure

```typescript
describe('MyComponent', () => {
  // Runs before each test
  beforeEach(() => {
    jest.clearAllMocks();  // Reset all mocks
  });

  // Runs after each test
  afterEach(() => {
    cleanup();  // Clean up DOM
  });

  // Grouped tests
  describe('when loading', () => {
    it('shows loading spinner', () => {
      // Test code
    });
  });

  describe('when loaded', () => {
    it('shows content', () => {
      // Test code
    });
  });
});
```

```mermaid
graph TD
    A[describe Block] --> B[beforeEach]
    A --> C[afterEach]
    A --> D[Nested describe]
    A --> E[Individual Tests]
    
    D --> F[it/test Block]
    D --> G[it/test Block]
    
    E --> H[it/test Block]
    E --> I[it/test Block]
```

### 4. Individual Test Structure

```typescript
it('updates count when clicked', () => {
  // 1. Arrange: Set up your test
  render(<Counter initial={0} />);
  
  // 2. Act: Perform the action
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  // 3. Assert: Check the results
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## Common Patterns

### Testing User Interactions

```typescript
it('responds to user input', () => {
  render(<TextInput />);
  
  // Find input element
  const input = screen.getByRole('textbox');
  
  // Simulate typing
  fireEvent.change(input, { target: { value: 'hello' } });
  
  // Check result
  expect(input.value).toBe('hello');
});
```

### Testing Async Operations

```typescript
it('loads data asynchronously', async () => {
  // Mock API response
  const mockData = { items: ['a', 'b', 'c'] };
  fetch.mockResponseOnce(JSON.stringify(mockData));
  
  render(<DataList />);
  
  // Check loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for data
  await screen.findByText('a');
  
  // Check results
  expect(screen.getByText('b')).toBeInTheDocument();
  expect(screen.getByText('c')).toBeInTheDocument();
});
```

### Testing Error States

```typescript
it('handles errors gracefully', async () => {
  // Mock API error
  fetch.mockRejectOnce(new Error('API Error'));
  
  render(<DataList />);
  
  // Wait for error message
  const error = await screen.findByText('Something went wrong');
  expect(error).toBeInTheDocument();
});
```

## Best Practices

1. **Test Naming**
   ```typescript
   // Good
   it('shows error message when API fails')
   
   // Bad
   it('test API error')
   ```

2. **Arrange-Act-Assert Pattern**
   ```typescript
   it('example test', () => {
     // Arrange
     const props = { value: 5 };
     
     // Act
     render(<Component {...props} />);
     
     // Assert
     expect(screen.getByText('5')).toBeInTheDocument();
   });
   ```

3. **Use Data-testid Sparingly**
   ```typescript
   // Component
   <div data-testid="error-message">Error occurred</div>
   
   // Test
   expect(screen.getByTestId('error-message')).toBeInTheDocument();
   ```

4. **Test User Behavior, Not Implementation**
   ```typescript
   // Good
   it('allows user to submit form', () => {
     render(<Form />);
     fireEvent.change(screen.getByLabelText('Name'), {
       target: { value: 'John' }
     });
     fireEvent.click(screen.getByText('Submit'));
     expect(screen.getByText('Success!')).toBeInTheDocument();
   });
   
   // Bad (testing implementation details)
   it('sets state correctly', () => {
     const { result } = renderHook(() => useState(''));
     act(() => {
       result.current[1]('new value');
     });
     expect(result.current[0]).toBe('new value');
   });
   ``` 