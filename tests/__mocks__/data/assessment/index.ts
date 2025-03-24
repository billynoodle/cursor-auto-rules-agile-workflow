import { QuestionModule, Answer } from '../../../../client/src/types/assessment';
import { Assessment, AssessmentAnswer, DatabaseSchema } from '../../../../client/src/types/database';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  generateMockModules,
  generateMockAssessment,
  generateMockAnswers,
  generateFullMockData,
  GeneratorOptions
} from './generators';

export const TEST_USER_ID = '123e4567-e89b-12d3-a456-426614174000';
export const TEST_ASSESSMENT_ID = '987fcdeb-51a2-43f8-96cd-426614174000';

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

export const createMockSupabaseClient = (options: MockOptions = {}) => {
  const mockClient = {
    from: jest.fn((table: string) => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            single: jest.fn(async () => {
              if (options.simulateNetworkError) {
                return { data: null, error: new Error('Network error') };
              }
              if (options.simulateTimeout) {
                return { data: null, error: new Error('Timeout') };
              }
              return Promise.resolve({ 
                data: createMockAssessment(),
                error: null 
              });
            })
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(async () => {
            if (options.simulateNetworkError) {
              return { data: null, error: new Error('Network error') };
            }
            if (options.simulateTimeout) {
              return { data: null, error: new Error('Timeout') };
            }
            return Promise.resolve({ 
              data: createMockAssessment(),
              error: null 
            });
          })
        }))
      })),
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(async () => {
            if (options.simulateConflict) {
              return { data: null, error: new Error('Conflict: Assessment was updated by another session') };
            }
            if (options.simulateNetworkError) {
              return { data: null, error: new Error('Network error') };
            }
            if (options.simulateTimeout) {
              return { data: null, error: new Error('Timeout') };
            }
            return Promise.resolve({ 
              data: createMockAnswerData(),
              error: null 
            });
          })
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(async () => {
                if (options.simulateConflict) {
                  return { data: null, error: new Error('Conflict: Assessment was updated by another session') };
                }
                if (options.simulateNetworkError) {
                  return { data: null, error: new Error('Network error') };
                }
                if (options.simulateTimeout) {
                  return { data: null, error: new Error('Timeout') };
                }
                return Promise.resolve({ 
                  data: createMockAssessment({
                    current_module_id: 'module1',
                    current_question_id: 'q2',
                    progress: 33,
                    status: 'in_progress'
                  }),
                  error: null 
                });
              })
            }))
          }))
        }))
      }))
    })),
    rpc: jest.fn(() => Promise.resolve({ data: null, error: null }))
  };

  return mockClient as unknown as jest.Mocked<SupabaseClient<DatabaseSchema>>;
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
  networkError: { simulateNetworkError: true },
  timeout: { simulateTimeout: true },
  conflict: { simulateConflict: true }
}; 