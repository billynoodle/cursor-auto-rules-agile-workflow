import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '@client/types/database';
import { AssessmentService } from '@client/services/AssessmentService';
import { OfflineService } from '@client/services/assessment/OfflineService';
import { AssessmentState, Answer, QuestionType, AssessmentCategory, QuestionModule, ModuleStatus } from '@client/types/assessment';
import { DisciplineType } from '@client/types/discipline';
import { PracticeSize } from '@client/types/practice';
import { generateMockModules, TEST_USER_ID, MockOptions, GeneratorOptions } from '@__mocks__/data/assessment/index';

interface MockSupabaseOptions {
  simulateError?: Error;
  simulateNetworkError?: boolean;
}

export function createMockSupabaseClient(options: MockSupabaseOptions = {}): SupabaseClient<DatabaseSchema> {
  const mockClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    data: null,
    error: null as Error | null
  };

  if (options.simulateError) {
    mockClient.error = options.simulateError;
  }

  if (options.simulateNetworkError) {
    mockClient.from = jest.fn().mockImplementation(() => {
      throw new Error('Network error');
    });
  }

  return mockClient as unknown as SupabaseClient<DatabaseSchema>;
}

export const createMockOfflineService = (): jest.Mocked<OfflineService> => {
  const mockOfflineService = {
    STORAGE_KEY: 'test_storage',
    setupOfflineSync: jest.fn(),
    storeOfflineData: jest.fn(),
    getOfflineData: jest.fn(),
    getAllOfflineData: jest.fn(),
    removeOfflineData: jest.fn(),
    clearOfflineData: jest.fn(),
    syncOfflineData: jest.fn(),
    syncAssessment: jest.fn(),
    syncAnswer: jest.fn(),
    isOnline: jest.fn().mockReturnValue(true)
  };
  return mockOfflineService as unknown as jest.Mocked<OfflineService>;
};

export const createMockAssessmentService = (): jest.Mocked<AssessmentService> => {
  const mockAssessmentService = {
    createAssessment: jest.fn().mockResolvedValue({ id: 'test-assessment-id' }),
    getAssessment: jest.fn().mockResolvedValue({ id: 'test-assessment-id' }),
    updateAssessment: jest.fn().mockResolvedValue({ id: 'test-assessment-id' }),
    deleteAssessment: jest.fn().mockResolvedValue(true),
    saveAnswer: jest.fn().mockResolvedValue({ id: 'test-answer-id' }),
    getAnswers: jest.fn().mockResolvedValue([]),
    updateAnswer: jest.fn().mockResolvedValue({ id: 'test-answer-id' }),
    deleteAnswer: jest.fn().mockResolvedValue(true),
    calculateProgress: jest.fn().mockReturnValue(50),
    validateModule: jest.fn().mockReturnValue(true),
    validateAnswer: jest.fn().mockReturnValue(true),
    handleError: jest.fn()
  };
  return mockAssessmentService as unknown as jest.Mocked<AssessmentService>;
}; 