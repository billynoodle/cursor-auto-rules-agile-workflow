import { UnitTestUtils, setupTestEnvironment } from '../../utils/controller-test-utils';
import { AssessmentFlowController } from '@client/controllers/AssessmentFlowController';
import { AssessmentCategory, QuestionType } from '@client/types/assessment';
import { DisciplineType } from '@client/types/discipline';
import { PracticeSize } from '@client/types/practice';

describe('AssessmentFlowController - Navigation', () => {
  setupTestEnvironment();

  it('should navigate to next question', async () => {
    const context = await UnitTestUtils.createTestContext();
    const { controller, modules } = context;

    await controller.nextQuestion();
    expect(controller.getCurrentQuestion()?.id).toBe(modules[0].questions[1].id);
  });

  describe('Basic Navigation', () => {
    it('should navigate between modules correctly', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 3 }
      });

      // Navigate to next module
      await controller.nextModule();
      const currentModule = controller.getCurrentModule();
      const currentQuestion = controller.getCurrentQuestion();
      expect(currentModule?.id).toBe('module2');
      expect(currentQuestion?.id).toBe('qmodule2-1');

      // Navigate to previous module
      await controller.previousQuestion();
      const prevModule = controller.getCurrentModule();
      const prevQuestion = controller.getCurrentQuestion();
      expect(prevModule?.id).toBe('module1');
      expect(prevQuestion?.id).toBe('qmodule1-3');
    });

    it('should handle edge cases in module navigation', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext({
        moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
      });

      // Navigate to last question of last module
      for (let i = 0; i < modules.length * modules[0].questions.length - 1; i++) {
        await controller.nextQuestion();
      }

      // Verify we're at the last question
      expect(controller.getCurrentModule()?.id).toBe('module2');
      expect(controller.getCurrentQuestion()?.id).toBe('qmodule2-2');

      // Mock answers for all questions
      const state = controller.getState();
      const updatedState = {
        ...state,
        answers: {
          'qmodule1-1': { value: 'answer1' },
          'qmodule1-2': { value: 'answer2' },
          'qmodule2-1': { value: 'answer3' },
          'qmodule2-2': { value: 'answer4' }
        },
        completedModules: ['module1', 'module2'],
        isComplete: true
      };
      await controller.restoreState(updatedState);

      // Try to navigate past the last question
      await controller.nextQuestion();
      expect(controller.getCurrentModule()?.id).toBe('module2');
      expect(controller.getCurrentQuestion()?.id).toBe('qmodule2-2');
      expect(controller.getState().isComplete).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid navigation attempts', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext();

      // Try to navigate before first question
      await controller.previousQuestion();
      expect(controller.getCurrentModule()?.id).toBe(modules[0].id);
      expect(controller.getCurrentQuestion()?.id).toBe(modules[0].questions[0].id);
    });
  });

  describe('State Management', () => {
    it('should maintain state during navigation', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext();

      // Save answers and navigate
      const firstAnswer = { value: 'answer1' };
      const secondAnswer = { value: 'answer2' };

      const state = controller.getState();
      const updatedState = {
        ...state,
        answers: {
          [modules[0].questions[0].id]: firstAnswer,
          [modules[0].questions[1].id]: secondAnswer
        }
      };
      await controller.restoreState(updatedState);

      await controller.nextQuestion();
      await controller.previousQuestion();
      const newState = controller.getState();
      expect(newState.answers[modules[0].questions[0].id]).toEqual(firstAnswer);
      expect(newState.answers[modules[0].questions[1].id]).toEqual(secondAnswer);
    });

    it('should handle module completion state', async () => {
      const { controller, modules } = await UnitTestUtils.createTestContext();

      // Complete first module
      const state = controller.getState();
      const updatedState = {
        ...state,
        answers: {
          [modules[0].questions[0].id]: { value: 'answer1' },
          [modules[0].questions[1].id]: { value: 'answer2' }
        },
        completedModules: [modules[0].id]
      };
      await controller.restoreState(updatedState);

      // Verify module completion
      expect(controller.getState().completedModules).toContain(modules[0].id);
      expect(controller.getState().completedModules).not.toContain(modules[1].id);
    });
  });
}); 