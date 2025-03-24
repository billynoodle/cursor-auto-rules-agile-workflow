import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';
import { AssessmentService, AssessmentError } from '../../../client/src/services/AssessmentService';
import { QuestionModule } from '../../../client/src/types/assessment';
import { 
  createMockSupabaseClient,
  generateMockModules,
  generateFullMockData,
  TEST_USER_ID,
  MockOptions
} from '../../__mocks__/data/assessment';
import { setupTestEnvironment } from './__setup__/setup';

describe('AssessmentFlowController Initialization', () => {
  setupTestEnvironment();
  let testData: ReturnType<typeof generateFullMockData>;
  let assessmentService: AssessmentService;

  beforeEach(() => {
    testData = generateFullMockData({
      moduleCount: 2,
      questionsPerModule: 2
    });
    const supabaseClient = createMockSupabaseClient();
    assessmentService = new AssessmentService(supabaseClient);
  });

  describe('Basic Initialization', () => {
    it('should create a new assessment and initialize state correctly', async () => {
      const { modules } = testData;
      const controller = await AssessmentFlowController.create(modules, assessmentService, TEST_USER_ID);

      expect(controller.getState()).toEqual({
        currentModuleId: modules[0].id,
        currentQuestionId: modules[0].questions[0].id,
        answers: {},
        progress: 0,
        completedModules: [],
        isComplete: false
      });
    });

    it('should initialize with correct module and question IDs', async () => {
      const { modules } = testData;
      const controller = await AssessmentFlowController.create(modules, assessmentService, TEST_USER_ID);
      const state = controller.getState();

      expect(state.currentModuleId).toBe(modules[0].id);
      expect(state.currentQuestionId).toBe(modules[0].questions[0].id);
      expect(Object.keys(state.answers)).toHaveLength(0);
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
      const controller = await AssessmentFlowController.create(modules, assessmentService, TEST_USER_ID);
      
      // Force uninitialized state
      (controller as any).assessmentId = undefined;
      
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