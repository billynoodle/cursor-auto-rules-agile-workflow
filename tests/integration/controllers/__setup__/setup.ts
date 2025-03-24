import { AssessmentService } from '../../../../client/src/services/assessment/AssessmentService';
import { AssessmentFlowController } from '../../../../client/src/controllers/AssessmentFlowController';
import { SupabaseClient } from '@supabase/supabase-js';
import { createMockSupabaseClient, mockModules, TEST_USER_ID } from '../../../__mocks__/data/assessment';
import { DatabaseSchema } from '../../../../client/src/types/database';

export interface TestContext {
  mockSupabaseClient: jest.Mocked<SupabaseClient<DatabaseSchema>>;
  assessmentService: AssessmentService;
  controller: AssessmentFlowController;
}

export const createTestContext = async (options = {}): Promise<TestContext> => {
  const mockSupabaseClient = createMockSupabaseClient(options);
  const assessmentService = new AssessmentService(mockSupabaseClient);
  const controller = await AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID);

  return {
    mockSupabaseClient,
    assessmentService,
    controller
  };
};

export const setupTestEnvironment = () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
}; 