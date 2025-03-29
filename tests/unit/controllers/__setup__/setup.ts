import { AssessmentService } from '@client/services/AssessmentService';
import { createMockSupabaseClient, TEST_USER_ID, MockOptions } from '@__mocks__/services/supabase/client';
import { generateMockModules, GeneratorOptions } from '@__mocks__/data/assessment/generators';
import { AssessmentFlowController } from '@client/controllers/AssessmentFlowController';

export interface TestContextOptions extends MockOptions {
  moduleOptions?: GeneratorOptions;
  mockBehavior?: 'unit' | 'integration';
}

export interface TestContext {
  mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>;
  assessmentService: AssessmentService;
  controller: AssessmentFlowController;
  modules: ReturnType<typeof generateMockModules>;
}

export const createTestContext = async (options: TestContextOptions = {}): Promise<TestContext> => {
  const { moduleOptions, mockBehavior, ...mockOptions } = options;
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
    localStorage.clear();
    Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
}; 