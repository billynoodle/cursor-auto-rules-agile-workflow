import { UnitTestUtils, setupTestEnvironment } from '../../utils/controller-test-utils';
import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';

describe('AssessmentFlowController - Navigation', () => {
  setupTestEnvironment();

  it('should navigate to next question', async () => {
    const { controller } = await UnitTestUtils.createTestContext();
    // Test implementation
  });

  describe('Basic Navigation', () => {
    it('should navigate between modules correctly', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });
      
      // Save answer for first question
      await controller.saveAnswer({
        questionId: modules[0].questions[0].id,
        value: { value: 'test' },
        timestamp: new Date().toISOString()
      });

      // Move to next question
      await controller.nextQuestion();
      expect(controller.getCurrentQuestion()?.id).toBe(modules[0].questions[1].id);

      // Move to next module
      await controller.nextQuestion();
      expect(controller.getCurrentModule()?.id).toBe(modules[1].id);
      expect(controller.getCurrentQuestion()?.id).toBe(modules[1].questions[0].id);

      // Move back to previous module
      await controller.previousQuestion();
      expect(controller.getCurrentModule()?.id).toBe(modules[0].id);
      expect(controller.getCurrentQuestion()?.id).toBe(modules[0].questions[1].id);
    });

    it('should handle edge cases in module navigation', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });
      
      // Try to go back from first question
      await controller.previousQuestion();
      expect(controller.getCurrentModule()?.id).toBe(modules[0].id);
      expect(controller.getCurrentQuestion()?.id).toBe(modules[0].questions[0].id);

      // Navigate to last question
      await controller.nextQuestion(); // Second question
      await controller.nextQuestion(); // First question of second module
      await controller.nextQuestion(); // Last question

      // Try to go forward from last question
      await controller.nextQuestion();
      expect(controller.getCurrentModule()?.id).toBe(modules[1].id);
      expect(controller.getCurrentQuestion()?.id).toBe(modules[1].questions[1].id);
      expect(controller.getState().isComplete).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid navigation attempts', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });

      // Try to navigate to non-existent question
      await expect(controller.navigateToQuestion('invalid-id')).rejects.toThrow('Question invalid-id not found');

      // Try to navigate to non-existent module
      await expect(controller.navigateToModule('invalid-module')).rejects.toThrow('Module invalid-module not found');
      expect(controller.getCurrentModule()?.id).toBe(modules[0].id);
      expect(controller.getCurrentQuestion()?.id).toBe(modules[0].questions[0].id);
    });
  });

  describe('State Management', () => {
    it('should maintain state during navigation', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });
      
      // Save answers while navigating
      const firstAnswer = { value: 'answer1' };
      const secondAnswer = { value: 'answer2' };

      await controller.saveAnswer({
        questionId: modules[0].questions[0].id,
        value: firstAnswer,
        timestamp: new Date().toISOString()
      });

      await controller.nextQuestion();
      await controller.saveAnswer({
        questionId: modules[0].questions[1].id,
        value: secondAnswer,
        timestamp: new Date().toISOString()
      });

      // Navigate back and verify answers are preserved
      await controller.previousQuestion();
      const state = controller.getState();
      expect(state.answers[modules[0].questions[0].id]).toEqual(firstAnswer);
      expect(state.answers[modules[0].questions[1].id]).toEqual(secondAnswer);
    });

    it('should handle module completion state', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });

      // Complete first module
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

      // Verify module completion
      expect(controller.getState().completedModules).toContain(modules[0].id);
      expect(controller.getState().completedModules).not.toContain(modules[1].id);
    });
  });
}); 