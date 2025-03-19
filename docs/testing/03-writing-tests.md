# Writing Tests

This guide provides detailed instructions and best practices for writing tests in our application.

## Test Types

### Unit Tests
- Test individual components, services, and utilities in isolation
- Mock all external dependencies
- Focus on specific functionality and edge cases
- Located in `/tests/unit/`

### Integration Tests
- Test interactions between multiple components/services
- Use minimal mocking, test real integrations where possible
- Focus on common user flows and data flow between components
- Located in `/tests/integration/`

### End-to-End Tests
- Test complete user flows from start to finish
- Use real backend services when possible
- Focus on critical user journeys
- Located in `/tests/e2e/`

## Writing Service Tests

### Example: Testing AssessmentService

```typescript
import { AssessmentService } from '../../../client/services/AssessmentService';
import { mockSupabase } from '../../../mocks/supabase';

describe('AssessmentService', () => {
  let service: AssessmentService;

  beforeEach(() => {
    service = new AssessmentService(mockSupabase);
    jest.clearAllMocks();
  });

  describe('createAssessment', () => {
    it('should create assessment when online', async () => {
      // Arrange
      const mockAssessment = {
        id: '1',
        title: 'Test Assessment',
        questions: []
      };
      const mockChain = {
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockAssessment, error: null })
          })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);

      // Act
      const result = await service.createAssessment(mockAssessment);

      // Assert
      expect(result).toEqual(mockAssessment);
      expect(mockSupabase.from).toHaveBeenCalledWith('assessments');
    });

    it('should store assessment locally when offline', async () => {
      // Arrange
      const mockAssessment = {
        id: '1',
        title: 'Test Assessment',
        questions: []
      };
      (mockSupabase.from as jest.Mock).mockImplementation(() => {
        throw new Error('Network error');
      });

      // Act
      const result = await service.createAssessment(mockAssessment);

      // Assert
      expect(result).toEqual(mockAssessment);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'offline_assessment_1',
        JSON.stringify(mockAssessment)
      );
    });
  });
});
```

## Writing Component Tests

### Example: Testing Question Component

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Question } from '../../../client/components/Question';

describe('Question Component', () => {
  const mockProps = {
    question: {
      id: '1',
      text: 'Test question?',
      options: ['A', 'B', 'C']
    },
    onAnswer: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render question text and options', () => {
    render(<Question {...mockProps} />);
    
    expect(screen.getByText('Test question?')).toBeInTheDocument();
    mockProps.question.options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('should call onAnswer when option is selected', async () => {
    render(<Question {...mockProps} />);
    
    const optionButton = screen.getByText('A');
    await fireEvent.click(optionButton);
    
    expect(mockProps.onAnswer).toHaveBeenCalledWith('1', 'A');
  });

  it('should show loading state while submitting', async () => {
    render(<Question {...mockProps} />);
    
    const optionButton = screen.getByText('A');
    fireEvent.click(optionButton);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

## Writing Controller Tests

### Example: Testing AssessmentFlowController

```typescript
import { AssessmentFlowController } from '../../../client/controllers/AssessmentFlowController';

describe('AssessmentFlowController', () => {
  let controller: AssessmentFlowController;
  const mockAssessmentService = {
    createAssessment: jest.fn(),
    saveAnswer: jest.fn(),
    getAnswers: jest.fn()
  };

  const mockModules = [
    {
      id: 'module1',
      questions: [
        { id: 'q1', text: 'Question 1' },
        { id: 'q2', text: 'Question 2' }
      ]
    }
  ];

  beforeEach(() => {
    controller = new AssessmentFlowController(mockModules, mockAssessmentService, 'user1');
    jest.clearAllMocks();
  });

  it('should initialize with first question', () => {
    expect(controller.currentQuestionId).toBe('q1');
    expect(controller.currentModuleId).toBe('module1');
  });

  it('should navigate to next question', async () => {
    await controller.nextQuestion();
    expect(controller.currentQuestionId).toBe('q2');
  });

  it('should save answer and update progress', async () => {
    await controller.submitAnswer('q1', 'A');
    
    expect(mockAssessmentService.saveAnswer).toHaveBeenCalledWith({
      questionId: 'q1',
      answer: 'A',
      userId: 'user1'
    });
    expect(controller.progress).toBe(50);
  });
});
```

## Testing Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use clear, descriptive test names that explain the expected behavior
- Follow the AAA pattern (Arrange, Act, Assert)
- Keep tests focused and concise

### 2. Mocking
- Use consistent mock patterns across tests
- Reset mocks between tests using `beforeEach`
- Mock at the appropriate level (unit vs integration)
- Use meaningful mock data that represents real scenarios

### 3. Async Testing
- Always use `async/await` for asynchronous tests
- Test loading states and transitions
- Handle promises and errors properly
- Use `expect().rejects` for testing error cases

### 4. Error Handling
- Test both success and error paths
- Validate error messages and types
- Test boundary conditions and edge cases
- Ensure proper error propagation

### 5. Data Management
- Use meaningful test data
- Clean up test data in `afterEach` hooks
- Avoid test interdependence
- Use factories or helpers for common test data

### 6. Component Testing
- Test user interactions and events
- Verify rendered content and state changes
- Test accessibility features
- Use data-testid for stable selectors

### 7. Service Testing
- Test offline functionality
- Validate data transformations
- Test API error handling
- Mock external dependencies consistently

### 8. Controller Testing
- Test state management
- Verify navigation logic
- Test error handling and recovery
- Validate business logic implementation

## Common Patterns

### Testing Offline Functionality
```typescript
it('should work offline', async () => {
  // Simulate offline state
  (mockSupabase.from as jest.Mock).mockImplementation(() => {
    throw new Error('Network error');
  });

  // Perform action
  const result = await service.method();

  // Verify offline handling
  expect(localStorage.setItem).toHaveBeenCalled();
  expect(result).toBeDefined();
});
```

### Testing Loading States
```typescript
it('should handle loading state', async () => {
  // Setup delayed response
  mockService.getData.mockImplementation(() => new Promise(resolve => {
    setTimeout(() => resolve(data), 100);
  }));

  render(<Component />);
  
  // Verify loading state
  expect(screen.getByTestId('loading')).toBeInTheDocument();
  
  // Wait for completion
  await screen.findByText('Loaded');
  expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
});
```

### Testing Error States
```typescript
it('should handle errors', async () => {
  // Setup error
  const error = new Error('Test error');
  mockService.getData.mockRejectedValue(error);

  render(<Component />);
  
  // Verify error state
  await screen.findByText('Error: Test error');
  expect(screen.getByRole('alert')).toBeInTheDocument();
}); 