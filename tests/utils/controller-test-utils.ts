import { AssessmentFlowController } from '../../client/src/controllers/AssessmentFlowController';
import { AssessmentService } from '../../client/src/services/AssessmentService';
import { SupabaseClient } from '@supabase/supabase-js';
import { 
  createMockSupabaseClient, 
  generateMockModules,
  TEST_USER_ID,
  MockOptions,
  GeneratorOptions 
} from '../../__mocks__/data/assessment';
import { DatabaseSchema } from '../../client/src/types/database';

/**
 * Base test context for controller tests
 */
export interface BaseTestContext {
  mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>;
  assessmentService: AssessmentService;
  controller: AssessmentFlowController;
  modules: ReturnType<typeof generateMockModules>;
}

/**
 * Options for creating a test context
 */
export interface TestContextOptions extends MockOptions {
  moduleOptions?: GeneratorOptions;
  mockBehavior?: 'unit' | 'integration';
}

/**
 * Creates a base test context for controller tests
 * @param options Test context options
 */
export const createBaseTestContext = async (options: TestContextOptions = {}): Promise<BaseTestContext> => {
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

/**
 * Sets up the test environment with common configuration
 */
export const setupTestEnvironment = () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
};

/**
 * Unit test specific context and utilities
 */
export const UnitTestUtils = {
  createTestContext: async (options: TestContextOptions = {}): Promise<BaseTestContext> => {
    // For unit tests, ensure all external dependencies are fully mocked
    const context = await createBaseTestContext({
      ...options,
      mockBehavior: 'unit'
    });
    
    // Additional unit test specific setup
    jest.spyOn(context.assessmentService, 'getState' as keyof AssessmentService).mockReturnValue(Promise.resolve(undefined));
    
    return context;
  }
};

/**
 * Integration test specific context and utilities
 */
export const IntegrationTestUtils = {
  createTestContext: async (options: TestContextOptions = {}): Promise<BaseTestContext> => {
    // For integration tests, allow some real implementations
    const context = await createBaseTestContext({
      ...options,
      mockBehavior: 'integration'
    });
    
    // Additional integration test specific setup
    // Use actual implementations where appropriate
    
    return context;
  }
};