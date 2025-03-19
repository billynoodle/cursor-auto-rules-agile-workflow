# Test Data Strategy

## Table of Contents
1. [Overview](#overview)
2. [Test Data Types](#test-data-types)
3. [Data Organization](#data-organization)
4. [Test Data Management](#test-data-management)
5. [Mock Patterns](#mock-patterns)
6. [Test Data Validation](#test-data-validation)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)

## Overview

This document outlines our approach to managing test data across different test types and environments. Our strategy ensures consistent, maintainable, and reliable test data that accurately represents real-world scenarios.

## Test Data Types

### 1. Mock Objects

#### Supabase Client Mocks
```typescript
export const mockSupabase = {
  from: jest.fn(),
  auth: {
    signIn: jest.fn(),
    signOut: jest.fn()
  }
};

// Mock chain example
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
```

#### Local Storage Mocks
```typescript
export const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
```

### 2. Test Fixtures

#### Assessment Fixtures
```typescript
export const mockAssessment = {
  id: '1',
  title: 'Test Assessment',
  moduleId: 'module1',
  questions: [
    {
      id: 'q1',
      text: 'Question 1',
      options: ['A', 'B', 'C']
    },
    {
      id: 'q2',
      text: 'Question 2',
      options: ['X', 'Y', 'Z']
    }
  ]
};
```

#### Answer Fixtures
```typescript
export const mockAnswer = {
  id: '1',
  questionId: 'q1',
  answer: 'A',
  userId: 'user1',
  timestamp: new Date().toISOString()
};
```

### 3. Factory Functions

```typescript
interface AssessmentOptions {
  id?: string;
  title?: string;
  questionCount?: number;
}

export const createMockAssessment = (options: AssessmentOptions = {}) => {
  const {
    id = '1',
    title = 'Test Assessment',
    questionCount = 2
  } = options;

  return {
    id,
    title,
    moduleId: 'module1',
    questions: Array.from({ length: questionCount }, (_, i) => ({
      id: `q${i + 1}`,
      text: `Question ${i + 1}`,
      options: ['A', 'B', 'C']
    }))
  };
};

export const createMockAnswer = (questionId: string, answer: string) => ({
  id: Math.random().toString(36).substr(2, 9),
  questionId,
  answer,
  userId: 'user1',
  timestamp: new Date().toISOString()
});
```

## Data Organization

### Directory Structure
```
tests/
├── __fixtures__/
│   ├── assessments/
│   │   ├── basic.json
│   │   └── complex.json
│   ├── answers/
│   │   └── sample.json
│   └── users/
│       └── test-users.json
├── __mocks__/
│   ├── supabase.ts
│   └── localStorage.ts
└── factories/
    ├── assessment.ts
    └── answer.ts
```

### File Naming Conventions
- Fixtures: `<entity>.<scenario>.json`
- Mocks: `<service>.ts`
- Factories: `<entity>.ts`

## Test Data Management

### 1. Data Isolation

```typescript
describe('AssessmentService', () => {
  let testData: typeof mockAssessment;
  
  beforeEach(() => {
    // Clone data to ensure isolation
    testData = JSON.parse(JSON.stringify(mockAssessment));
  });

  it('should modify data safely', () => {
    testData.title = 'Modified';
    // Original mockAssessment remains unchanged
  });
});
```

### 2. Data Cleanup

```typescript
describe('Integration Test', () => {
  const createdIds: string[] = [];

  afterEach(async () => {
    // Clean up created data
    for (const id of createdIds) {
      await service.delete(id);
    }
    createdIds.length = 0;
  });

  it('should create and track data', async () => {
    const result = await service.create(testData);
    createdIds.push(result.id);
  });
});
```

### 3. Environment-Specific Data

```typescript
const getTestConfig = () => {
  switch (process.env.TEST_ENV) {
    case 'ci':
      return {
        baseUrl: 'http://ci-api',
        testUser: 'ci-user'
      };
    case 'staging':
      return {
        baseUrl: 'http://staging-api',
        testUser: 'staging-user'
      };
    default:
      return {
        baseUrl: 'http://localhost',
        testUser: 'test-user'
      };
  }
};
```

## Mock Patterns

### 1. Service Mocks

```typescript
export class MockAssessmentService implements AssessmentService {
  private assessments: Map<string, Assessment> = new Map();

  async createAssessment(data: Assessment): Promise<Assessment> {
    const id = Math.random().toString(36).substr(2, 9);
    const assessment = { ...data, id };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getAssessment(id: string): Promise<Assessment> {
    const assessment = this.assessments.get(id);
    if (!assessment) {
      throw new Error('Not found');
    }
    return assessment;
  }
}
```

### 2. API Mocks

```typescript
export const mockApi = {
  get: jest.fn().mockImplementation((url) => {
    if (url.includes('/assessments')) {
      return Promise.resolve({ data: mockAssessment });
    }
    return Promise.reject(new Error('Not found'));
  }),
  
  post: jest.fn().mockImplementation((url, data) => {
    if (url.includes('/answers')) {
      return Promise.resolve({ data: { ...mockAnswer, ...data } });
    }
    return Promise.reject(new Error('Invalid request'));
  })
};
```

### 3. Database Mocks

```typescript
export const mockDatabase = {
  assessments: new Map<string, Assessment>(),
  answers: new Map<string, Answer>(),

  async query(table: string, id: string) {
    const storage = this[table];
    return storage.get(id) || null;
  },

  async insert(table: string, data: any) {
    const id = Math.random().toString(36).substr(2, 9);
    const record = { ...data, id };
    this[table].set(id, record);
    return record;
  }
};
```

## Test Data Validation

### 1. Type Checking

```typescript
import { z } from 'zod';

const AssessmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string(),
    options: z.array(z.string())
  }))
});

export const validateTestData = (data: unknown) => {
  return AssessmentSchema.parse(data);
};
```

### 2. Data Consistency

```typescript
describe('Test Data Validation', () => {
  it('should have valid test data', () => {
    const result = validateTestData(mockAssessment);
    expect(result).toBeDefined();
  });

  it('should maintain referential integrity', () => {
    const answer = createMockAnswer('q1', 'A');
    expect(mockAssessment.questions.some(q => q.id === answer.questionId))
      .toBe(true);
  });
});
```

## Best Practices

### 1. Data Creation
- Use factories for complex objects
- Keep test data minimal
- Ensure data consistency
- Version control test data

### 2. Data Usage
- Isolate test data
- Clean up after tests
- Use meaningful values
- Document data requirements

### 3. Maintenance
- Regular data review
- Update with schema changes
- Remove unused data
- Keep documentation current

## Common Patterns

### 1. Testing Different States

```typescript
describe('Assessment States', () => {
  it('should handle new assessment', () => {
    const assessment = createMockAssessment({ questionCount: 0 });
    expect(assessment.questions).toHaveLength(0);
  });

  it('should handle in-progress assessment', () => {
    const assessment = createMockAssessment({ questionCount: 2 });
    const answer = createMockAnswer(assessment.questions[0].id, 'A');
    expect(answer.questionId).toBe(assessment.questions[0].id);
  });
});
```

### 2. Testing Edge Cases

```typescript
describe('Edge Cases', () => {
  it('should handle maximum values', () => {
    const assessment = createMockAssessment({
      questionCount: 100 // Maximum allowed
    });
    expect(assessment.questions).toHaveLength(100);
  });

  it('should handle special characters', () => {
    const assessment = createMockAssessment({
      title: '!@#$%^&*()'
    });
    expect(assessment.title).toBe('!@#$%^&*()');
  });
});
```

### 3. Testing Error Scenarios

```typescript
describe('Error Scenarios', () => {
  it('should handle database errors', async () => {
    const mockError = new Error('Database error');
    mockDatabase.query.mockRejectedValue(mockError);
    
    await expect(service.getAssessment('1'))
      .rejects.toThrow('Database error');
  });

  it('should handle validation errors', () => {
    const invalidData = { ...mockAssessment, questions: null };
    expect(() => validateTestData(invalidData))
      .toThrow();
  });
});
``` 