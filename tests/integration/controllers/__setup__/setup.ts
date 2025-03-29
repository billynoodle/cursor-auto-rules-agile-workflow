import { AssessmentFlowController } from '@client/controllers/AssessmentFlowController';
import { AssessmentService } from '@client/services/AssessmentService';
import { SupabaseClient } from '@supabase/supabase-js';
import { 
  createMockSupabaseClient, 
  generateMockModules,
  TEST_USER_ID,
  MockOptions,
  GeneratorOptions 
} from '@__mocks__/data/assessment';
import { DatabaseSchema } from '@client/types/database';

export interface TestContext {
  mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>;
  assessmentService: AssessmentService;
  controller: AssessmentFlowController;
  modules: ReturnType<typeof generateMockModules>;
}

export interface TestContextOptions extends MockOptions {
  moduleOptions?: GeneratorOptions;
}

export const createTestContext = async (options: TestContextOptions = {}): Promise<TestContext> => {
  const { moduleOptions, ...mockOptions } = options;
  const mockSupabaseClient = createMockSupabaseClient(mockOptions);
  const assessmentService = new AssessmentService(mockSupabaseClient);
  const modules = generateMockModules(moduleOptions);
  const controller = await AssessmentFlowController.create(modules, assessmentService, TEST_USER_ID);

  return {
    mockSupabaseClient,
    assessmentService,
    controller,
    modules
  };
};

export const setupTestEnvironment = () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
}; 