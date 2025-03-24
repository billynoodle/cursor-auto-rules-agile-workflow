import { AssessmentError } from '../../../client/src/services/AssessmentService';
import { createMockAnswer } from './__mocks__/mockData';
import { createTestContext, setupTestEnvironment } from './__setup__/setup';
import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';

describe('AssessmentFlowController Error Handling', () => {
  setupTestEnvironment();

  describe('Network Error Recovery', () => {
    it('should handle network errors during state persistence', async () => {
      const { controller, mockSupabaseClient } = await createTestContext();

      // Update mock client to simulate network error
      mockSupabaseClient.from = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockRejectedValue(new Error('Network error'))
              })
            })
          })
        })
      });

      await expect(controller.nextQuestion()).rejects.toThrow(AssessmentError);
      await expect(controller.nextQuestion()).rejects.toMatchObject({
        code: 'UPDATE_ERROR',
        originalError: expect.objectContaining({
          message: expect.stringContaining('Network error')
        })
      });
      expect(controller.getState().currentQuestionId).toBe('q1');
    });

    it('should handle concurrent update conflicts', async () => {
      const { controller, mockSupabaseClient } = await createTestContext();

      // Update mock client to simulate conflict
      mockSupabaseClient.from = jest.fn().mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockRejectedValue(new Error('Conflict: Assessment was updated by another session'))
          })
        })
      });

      const timestamp = new Date().toISOString();
      const answer = { questionId: 'q1', value: createMockAnswer('test'), timestamp };

      await expect(controller.saveAnswer(answer)).rejects.toThrow(AssessmentError);
      await expect(controller.saveAnswer(answer)).rejects.toMatchObject({
        code: 'SAVE_ERROR',
        originalError: new Error('Conflict: Assessment was updated by another session')
      });

      expect(controller.getState().answers).toEqual({});
    });
  });

  describe('State Restoration Error Handling', () => {
    it('should handle errors during state restoration', async () => {
      const { controller, mockSupabaseClient } = await createTestContext();

      // Update mock client to simulate error during state update
      mockSupabaseClient.from = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockRejectedValue(new Error('Failed to update assessment'))
              })
            })
          })
        })
      });

      const newState = {
        currentModuleId: 'module2',
        currentQuestionId: 'q3',
        answers: {},
        progress: 0,
        completedModules: [],
        isComplete: false
      };

      await expect(controller.restoreState(newState)).rejects.toThrow('Failed to update assessment');
      expect(controller.getState().currentModuleId).toBe('module1');
    });
  });

  describe('Initialization Error Handling', () => {
    it('should prevent operations when not initialized', async () => {
      const { controller } = await createTestContext();
      
      // Force uninitialized state
      (controller as any).assessmentId = undefined;

      await expect(controller.nextQuestion()).rejects.toThrow('Assessment not initialized');
      await expect(controller.previousQuestion()).rejects.toThrow('Assessment not initialized');
      await expect(controller.saveAnswer({
        questionId: 'q1',
        value: createMockAnswer('test'),
        timestamp: new Date().toISOString()
      })).rejects.toThrow('Assessment not initialized');
    });
  });
}); 