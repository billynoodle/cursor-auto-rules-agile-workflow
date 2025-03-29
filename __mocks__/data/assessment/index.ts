import { QuestionModule, Answer } from '@client/types/assessment';
import { Assessment, AssessmentAnswer, DatabaseSchema } from '@client/types/database';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  generateMockModules,
  generateMockAssessment,
  generateMockAnswers,
  generateFullMockData,
  GeneratorOptions,
  TEST_USER_ID,
  TEST_ASSESSMENT_ID,
  generateQuestionId,
  QUESTION_ID_PREFIX,
  QUESTION_ID_SEPARATOR
} from './generators';

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
  generateFullMockData,
  TEST_USER_ID,
  TEST_ASSESSMENT_ID,
  generateQuestionId,
  QUESTION_ID_PREFIX,
  QUESTION_ID_SEPARATOR
};
export type { GeneratorOptions };

// Use generators for default mock data
export const mockModules = generateMockModules();
export const mockAssessment = generateMockAssessment();
export const mockAnswers = generateMockAnswers(mockModules);

export const createMockAnswer = (value: any): Answer => ({
  value,
  metadata: {
    rawScore: 10,
    weightedScore: 10,
    maxPossible: 10,
    timestamp: new Date().toISOString()
  }
});

export const createMockAssessment = (overrides: Partial<Assessment> = {}): Assessment => {
  const defaultModuleId = 'module1';
  return {
    id: TEST_ASSESSMENT_ID,
    user_id: TEST_USER_ID,
    current_module_id: defaultModuleId,
    current_question_id: generateQuestionId(defaultModuleId, 1),
    progress: 0,
    completed_modules: [],
    is_complete: false,
    status: 'draft',
    metadata: { source: 'test' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
};

export const createMockAnswerData = (overrides: Partial<AssessmentAnswer> = {}): AssessmentAnswer => ({
  id: '456',
  assessment_id: TEST_ASSESSMENT_ID,
  question_id: 'q1',
  answer: {
    value: 'Test answer',
    metadata: {
      rawScore: 10,
      weightedScore: 10,
      maxPossible: 10,
      timestamp: new Date().toISOString()
    }
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockSupabaseClient = (mockOptions: MockOptions = {}): jest.Mocked<SupabaseClient<DatabaseSchema>> => {
  const mockMethods = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => {
      if (mockOptions.simulateNetworkError) {
        return Promise.resolve(mockErrorScenarios.networkError);
      }
      if (mockOptions.simulateConflict) {
        return Promise.resolve(mockErrorScenarios.conflict);
      }
      return Promise.resolve({
        data: createMockAssessment(),
        error: null
      });
    }),
    insert: jest.fn().mockImplementation((data) => ({
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockImplementation(() => {
        if (mockOptions.simulateNetworkError) {
          return Promise.resolve(mockErrorScenarios.networkError);
        }
        if (mockOptions.simulateConflict) {
          return Promise.resolve(mockErrorScenarios.conflict);
        }
        return Promise.resolve({
          data: {
            ...createMockAssessment(),
            ...data
          },
          error: null
        });
      })
    })),
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
    from: jest.fn().mockReturnValue(mockMethods),
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
      getSession: jest.fn()
    },
    realtime: {
      connect: jest.fn(),
      disconnect: jest.fn(),
      removeAllChannels: jest.fn(),
      removeChannel: jest.fn(),
      getChannels: jest.fn()
    },
    functions: {
      invoke: jest.fn()
    },
    storage: {
      from: jest.fn(),
      listBuckets: jest.fn(),
      getBucket: jest.fn(),
      createBucket: jest.fn(),
      deleteBucket: jest.fn()
    },
    removeAllChannels: jest.fn(),
    removeAllSubscriptions: jest.fn(),
    removeSubscription: jest.fn(),
    getChannels: jest.fn(),
    channel: jest.fn(),
    rpc: jest.fn()
  } as unknown as jest.Mocked<SupabaseClient<DatabaseSchema>>;

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