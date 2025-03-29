import { AssessmentError } from '@client/services/AssessmentService';
import { createTestContext, setupTestEnvironment } from './__setup__/setup';
import { AssessmentFlowController } from '@client/controllers/AssessmentFlowController';

describe('AssessmentFlowController Error Handling', () => {
  setupTestEnvironment();

  describe('Network Error Recovery', () => {
    it('should handle network errors during state persistence', async () => {
      const { controller, mockSupabaseClient, modules } = await createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });

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
      expect(controller.getState().currentQuestionId).toBe(modules[0].questions[0].id);
    });

    it('should handle concurrent update conflicts', async () => {
      const { controller, mockSupabaseClient, modules } = await createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });

      // Update mock client to simulate conflict
      mockSupabaseClient.from = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockRejectedValue({
              code: 'CONFLICT',
              message: 'Conflict: Answer already exists'
            })
          })
        })
      });

      const timestamp = new Date().toISOString();
      const questionId = modules[0].questions[0].id;
      const answer = { questionId, value: { value: 'test' }, timestamp };

      await expect(controller.saveAnswer(answer)).rejects.toThrow(AssessmentError);
      await expect(controller.saveAnswer(answer)).rejects.toMatchObject({
        code: 'SAVE_ERROR',
        message: 'Failed to save answer'
      });

      expect(controller.getState().answers).toEqual({});
    });
  });

  describe('State Restoration Error Handling', () => {
    it('should handle errors during state restoration', async () => {
      const { controller, mockSupabaseClient, modules } = await createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });

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
        currentQuestionId: modules[1].questions[0].id,
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
      const { controller, modules } = await createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });
      
      // Force uninitialized state
      (controller as any).assessmentId = undefined;

      await expect(controller.nextQuestion()).rejects.toThrow('Assessment not initialized');
      await expect(controller.previousQuestion()).rejects.toThrow('Assessment not initialized');
      await expect(controller.saveAnswer({
        questionId: modules[0].questions[0].id,
        value: { value: 'test' },
        timestamp: new Date().toISOString()
      })).rejects.toThrow('Assessment not initialized');
    });
  });
}); 