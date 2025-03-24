import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';
import { AssessmentService } from '../../../client/src/services/AssessmentService';
import { AssessmentError } from '../../../client/src/services/AssessmentService';
import { createMockSupabaseClient, mockModules, TEST_USER_ID } from './__mocks__/mockData';
import { setupTestEnvironment } from './__setup__/setup';

describe('AssessmentFlowController Initialization', () => {
  setupTestEnvironment();

  it('should create a new assessment and initialize state', async () => {
    const mockSupabaseClient = createMockSupabaseClient();
    const assessmentService = new AssessmentService(mockSupabaseClient);
    const controller = await AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID);

    expect(controller.getState()).toEqual({
      currentModuleId: 'module1',
      currentQuestionId: 'q1',
      answers: {},
      progress: 0,
      completedModules: [],
      isComplete: false
    });
  });

  it('should handle network errors during assessment creation', async () => {
    const mockSupabaseClient = createMockSupabaseClient({ simulateNetworkError: true });
    const assessmentService = new AssessmentService(mockSupabaseClient);
    
    await expect(
      AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID)
    ).rejects.toThrow(AssessmentError);
    await expect(
      AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID)
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
    const mockSupabaseClient = createMockSupabaseClient({ simulateTimeout: true });
    const assessmentService = new AssessmentService(mockSupabaseClient);
    
    await expect(
      AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID)
    ).rejects.toThrow(AssessmentError);
    await expect(
      AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID)
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

  it('should handle initialization errors', async () => {
    const mockService = new AssessmentService(createMockSupabaseClient());
    const controller = await AssessmentFlowController.create(mockModules, mockService, TEST_USER_ID);
    
    // Force the controller to be uninitialized
    (controller as any).assessmentId = undefined;
    
    // Explicitly verify that nextQuestion throws when not initialized
    await expect(controller.nextQuestion()).rejects.toThrow('Assessment not initialized');
  });
}); 