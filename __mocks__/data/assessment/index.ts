import { QuestionModule, Answer } from '@client/types/assessment';
import { Assessment, AssessmentAnswer, DatabaseSchema } from '@client/types/database';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  generateMockModules,
  generateMockAssessment,
  generateMockAnswers,
  generateFullMockData,
  GeneratorOptions
} from './generators';

export const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';
export const TEST_ASSESSMENT_ID = '00000000-0000-0000-0000-000000000002';

export interface MockOptions {
  simulateNetworkError?: boolean;
  simulateTimeout?: boolean;
  simulateConflict?: boolean;
}

// Export generators
export {
  generateMockModules,
  generateMockAssessment,
  generateMockAnswers,
  generateFullMockData
};
export type { GeneratorOptions };

// Use generators for default mock data
export const mockModules = generateMockModules();
export const mockAssessment = generateMockAssessment();
export const mockAnswers = generateMockAnswers(mockModules);

export const createMockAnswer = (value: any): Answer => ({ value });

export const createMockAssessment = (overrides: Partial<Assessment> = {}): Assessment => ({
  id: TEST_ASSESSMENT_ID,
  user_id: TEST_USER_ID,
  current_module_id: 'module1',
  current_question_id: 'q1',
  progress: 0,
  completed_modules: [],
  is_complete: false,
  status: 'draft',
  metadata: { source: 'test' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockAnswerData = (overrides: Partial<AssessmentAnswer> = {}): AssessmentAnswer => ({
  id: '456',
  assessment_id: TEST_ASSESSMENT_ID,
  question_id: 'q1',
  answer: { value: 'Test answer' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockSupabaseClient = (mockResponse?: any): SupabaseClient<DatabaseSchema> => {
  const defaultResponse = mockResponse || {
    data: createMockAssessment(),
    error: null
  };

  const mockMethods = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(defaultResponse),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    containedBy: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis()
  };

  const mockClient = {
    from: jest.fn().mockReturnValue(mockMethods)
  } as unknown as SupabaseClient<DatabaseSchema>;

  return mockClient;
};

export const mockAssessmentData = {
  modules: mockModules,
  assessment: createMockAssessment(),
  answers: {
    q1: createMockAnswer('test answer 1'),
    q2: createMockAnswer(42),
    q3: createMockAnswer(true)
  }
};

export const mockErrorScenarios = {
  networkError: {
    error: {
      message: 'Network error',
      code: 'NETWORK_ERROR'
    }
  },
  conflict: {
    error: {
      message: 'Conflict error',
      code: 'CONFLICT'
    }
  }
}; 