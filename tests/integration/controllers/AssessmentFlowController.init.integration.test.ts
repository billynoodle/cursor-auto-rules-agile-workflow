import { IntegrationTestUtils, setupTestEnvironment } from '../../utils/controller-test-utils';
import { AssessmentService, AssessmentError } from '../../../client/src/services/AssessmentService';
import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';
import { 
  generateFullMockData, 
  createMockSupabaseClient, 
  TEST_USER_ID
} from '../../../__mocks__/data/assessment';
import { QuestionModule } from '../../../client/src/types/assessment';

describe('AssessmentFlowController - Initialization', () => {
  setupTestEnvironment();

  let testData: ReturnType<typeof generateFullMockData>;
  let assessmentService: AssessmentService;

  beforeEach(async () => {
    const { assessmentService: service, modules } = await IntegrationTestUtils.createTestContext({
      moduleOptions: {
        moduleCount: 2,
        questionsPerModule: 2
      }
    });
    assessmentService = service;
    testData = generateFullMockData({
      moduleCount: 2,
      questionsPerModule: 2
    });
  });

  describe('Basic Initialization', () => {
    it('should initialize with empty state', async () => {
      const { controller } = await IntegrationTestUtils.createTestContext();
      expect(controller.getCurrentModule()).toBeDefined();
      expect(controller.getCurrentQuestion()).toBeDefined();
    });

    it('should create a new assessment and initialize state correctly', async () => {
      const { controller } = await IntegrationTestUtils.createTestContext();
      const { modules } = testData;

      expect(controller.getCurrentModule()).toBeDefined();
      expect(controller.getCurrentQuestion()).toBeDefined();
      expect(controller.getState().currentModuleId).toBe(modules[0].id);
    });

    it('should handle initialization errors gracefully', async () => {
      const { controller } = await IntegrationTestUtils.createTestContext({
        simulateNetworkError: true
      });

      // Test error handling through state persistence
      await expect(controller.persistState()).rejects.toThrow(AssessmentError);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors during assessment creation', async () => {
      const errorData = generateFullMockData({
        moduleCount: 2,
        questionsPerModule: 2
      });
      const errorClient = createMockSupabaseClient({ simulateNetworkError: true });
      const errorService = new AssessmentService(errorClient);
      
      await expect(
        AssessmentFlowController.create(errorData.modules, errorService, TEST_USER_ID)
      ).rejects.toThrow(AssessmentError);

      await expect(
        AssessmentFlowController.create(errorData.modules, errorService, TEST_USER_ID)
      ).rejects.toMatchObject({
        code: 'CREATE_ERROR',
        originalError: expect.objectContaining({
          code: 'DB_ERROR',
          originalError: expect.objectContaining({
            message: expect.stringContaining('Network error')
          })
        })
      });
    });

    it('should handle timeouts during assessment creation', async () => {
      const timeoutData = generateFullMockData({
        moduleCount: 2,
        questionsPerModule: 2
      });
      const timeoutClient = createMockSupabaseClient({ simulateTimeout: true });
      const timeoutService = new AssessmentService(timeoutClient);
      
      await expect(
        AssessmentFlowController.create(timeoutData.modules, timeoutService, TEST_USER_ID)
      ).rejects.toThrow(AssessmentError);

      await expect(
        AssessmentFlowController.create(timeoutData.modules, timeoutService, TEST_USER_ID)
      ).rejects.toMatchObject({
        code: 'CREATE_ERROR',
        originalError: expect.objectContaining({
          code: 'DB_ERROR',
          originalError: expect.objectContaining({
            message: expect.stringContaining('Timeout')
          })
        })
      });
    });
  });

  describe('State Validation', () => {
    it('should prevent operations when not initialized', async () => {
      const { modules } = testData;
      // Create a new controller but force a failure during initialization
      const controller = await AssessmentFlowController.create(modules, assessmentService, TEST_USER_ID, 'non-existent-id');
      
      await expect(controller.nextQuestion()).rejects.toThrow('Assessment not initialized');
      await expect(controller.previousQuestion()).rejects.toThrow('Assessment not initialized');
      await expect(controller.saveAnswer({
        questionId: 'q1',
        value: { value: 'answer' },
        timestamp: new Date().toISOString()
      })).rejects.toThrow('Assessment not initialized');
    });

    it('should validate module and question structure', async () => {
      const invalidModules: QuestionModule[] = [{
        id: 'invalid',
        title: 'Invalid Module',
        description: 'Invalid module for testing',
        category: 'operations',
        questions: []
      }];
      
      await expect(
        AssessmentFlowController.create(invalidModules, assessmentService, TEST_USER_ID)
      ).rejects.toThrow('Invalid module structure');
    });
  });
}); 