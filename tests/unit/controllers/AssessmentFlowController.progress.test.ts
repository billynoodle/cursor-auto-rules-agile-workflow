import { createTestContext, setupTestEnvironment } from './__setup__/setup';
import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';

describe('AssessmentFlowController Progress', () => {
  setupTestEnvironment();

  describe('Progress Calculation', () => {
    it('should calculate progress correctly', async () => {
      const { controller, modules } = await createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });
      
      // Initially no progress
      expect(controller.getState().progress).toBe(0);

      // Answer first question
      await controller.saveAnswer({
        questionId: modules[0].questions[0].id,
        value: { value: 'test' },
        timestamp: new Date().toISOString()
      });
      
      // Progress should be 25% (1 out of 4 questions)
      expect(controller.getState().progress).toBe(25);

      // Answer second question
      await controller.saveAnswer({
        questionId: modules[0].questions[1].id,
        value: { value: 'test' },
        timestamp: new Date().toISOString()
      });

      // Progress should be 50% (2 out of 4 questions)
      expect(controller.getState().progress).toBe(50);

      // Answer third question
      await controller.nextQuestion();
      await controller.saveAnswer({
        questionId: modules[1].questions[0].id,
        value: { value: 'test' },
        timestamp: new Date().toISOString()
      });

      // Progress should be 75% (3 out of 4 questions)
      expect(controller.getState().progress).toBe(75);

      // Answer last question
      await controller.nextQuestion();
      await controller.saveAnswer({
        questionId: modules[1].questions[1].id,
        value: { value: 'test' },
        timestamp: new Date().toISOString()
      });

      // Progress should be 100%
      expect(controller.getState().progress).toBe(100);
      expect(controller.getState().isComplete).toBe(true);
    });

    it('should update progress when answers are modified', async () => {
      const { controller, modules } = await createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });
      
      // Answer first question
      await controller.saveAnswer({
        questionId: modules[0].questions[0].id,
        value: { value: 'initial' },
        timestamp: new Date().toISOString()
      });
      
      const initialProgress = controller.getState().progress;

      // Modify the answer
      await controller.saveAnswer({
        questionId: modules[0].questions[0].id,
        value: { value: 'modified' },
        timestamp: new Date().toISOString()
      });

      // Progress should remain the same
      expect(controller.getState().progress).toBe(initialProgress);
    });
  });

  describe('Module Completion', () => {
    it('should mark module as completed when all questions are answered', async () => {
      const { controller, modules } = await createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });
      
      // Answer all questions in first module
      await controller.saveAnswer({
        questionId: modules[0].questions[0].id,
        value: { value: 'test1' },
        timestamp: new Date().toISOString()
      });

      await controller.nextQuestion();
      await controller.saveAnswer({
        questionId: modules[0].questions[1].id,
        value: { value: 'test2' },
        timestamp: new Date().toISOString()
      });

      // First module should be marked as completed
      expect(controller.getState().completedModules).toContain(modules[0].id);
      expect(controller.getState().completedModules).not.toContain(modules[1].id);
    });

    it('should handle progress calculation with skipped questions', async () => {
      const { controller, modules } = await createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });
      
      // Skip first question, answer second
      await controller.nextQuestion();
      await controller.saveAnswer({
        questionId: modules[0].questions[1].id,
        value: { value: 'test' },
        timestamp: new Date().toISOString()
      });

      // Progress should be 25% (1 out of 4 questions)
      expect(controller.getState().progress).toBe(25);

      // Module should not be marked as completed
      expect(controller.getState().completedModules).not.toContain(modules[0].id);
    });
  });
}); 