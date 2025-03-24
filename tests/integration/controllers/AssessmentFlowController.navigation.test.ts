import { createMockAnswer } from './__mocks__/mockData';
import { createTestContext, setupTestEnvironment } from './__setup__/setup';
import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';
import { AssessmentService } from '../../../client/src/services/AssessmentService';
import { mockAssessmentData, mockErrorScenarios } from './__mocks__/mockData';

describe('AssessmentFlowController Navigation', () => {
  setupTestEnvironment();

  it('should navigate between modules correctly', async () => {
    const { controller } = await createTestContext();
    
    // Save answer for first question
    await controller.saveAnswer({
      questionId: 'q1',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });

    // Move to next question
    await controller.nextQuestion();
    expect(controller.getCurrentQuestion()?.id).toBe('q2');

    // Move to next module
    await controller.nextQuestion();
    expect(controller.getCurrentModule()?.id).toBe('module2');
    expect(controller.getCurrentQuestion()?.id).toBe('q3');

    // Move back to previous module
    await controller.previousQuestion();
    expect(controller.getCurrentModule()?.id).toBe('module1');
    expect(controller.getCurrentQuestion()?.id).toBe('q2');
  });

  it('should handle edge cases in module navigation', async () => {
    const { controller } = await createTestContext();
    
    // Try to go back from first question
    await controller.previousQuestion();
    expect(controller.getCurrentModule()?.id).toBe('module1');
    expect(controller.getCurrentQuestion()?.id).toBe('q1');

    // Navigate to last question
    await controller.nextQuestion(); // q2
    await controller.nextQuestion(); // q3

    // Try to go forward from last question
    await controller.nextQuestion();
    expect(controller.getCurrentModule()?.id).toBe('module2');
    expect(controller.getCurrentQuestion()?.id).toBe('q3');
    expect(controller.getState().isComplete).toBe(true);
  });

  it('should handle invalid navigation attempts', async () => {
    const { controller } = await createTestContext();

    // Try to navigate to non-existent question
    await expect(controller.navigateToQuestion('invalid-id')).rejects.toThrow();

    // Try to navigate to non-existent module
    await expect(controller.navigateToModule('invalid-module')).rejects.toThrow('Module invalid-module not found');
    expect(controller.getCurrentModule()?.id).toBe('module1');
    expect(controller.getCurrentQuestion()?.id).toBe('q1');
  });

  it('should maintain state during navigation', async () => {
    const { controller } = await createTestContext();
    
    // Save answers while navigating
    await controller.saveAnswer({
      questionId: 'q1',
      value: createMockAnswer('answer1'),
      timestamp: new Date().toISOString()
    });

    await controller.nextQuestion();
    await controller.saveAnswer({
      questionId: 'q2',
      value: createMockAnswer('answer2'),
      timestamp: new Date().toISOString()
    });

    // Navigate back and verify answers are preserved
    await controller.previousQuestion();
    const state = controller.getState();
    expect(state.answers['q1']).toEqual(createMockAnswer('answer1'));
    expect(state.answers['q2']).toEqual(createMockAnswer('answer2'));
  });

  it('should handle invalid module navigation', async () => {
    const { controller } = await createTestContext();
    
    // Try to navigate to non-existent module
    await expect(controller.navigateToModule('invalid-module')).rejects.toThrow('Module invalid-module not found');
    expect(controller.getCurrentModule()?.id).toBe('module1');
    expect(controller.getCurrentQuestion()?.id).toBe('q1');

    // Try to navigate to non-existent question
    await expect(controller.navigateToQuestion('invalid-question')).rejects.toThrow('Question invalid-question not found');
    expect(controller.getCurrentModule()?.id).toBe('module1');
    expect(controller.getCurrentQuestion()?.id).toBe('q1');
  });

  it('should handle error recovery during navigation', async () => {
    const { controller, assessmentService } = await createTestContext();
    
    // Save answer for first question
    await controller.saveAnswer({
      questionId: 'q1',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });

    // Mock updateAssessment to fail once
    jest.spyOn(assessmentService, 'updateAssessment').mockRejectedValueOnce(new Error('Failed to update'));

    // Attempt navigation with error
    await expect(controller.nextQuestion()).rejects.toThrow('Failed to update');
    expect(controller.getCurrentModule()?.id).toBe('module1');
    expect(controller.getCurrentQuestion()?.id).toBe('q1');

    // Retry navigation after error
    await controller.nextQuestion();
    expect(controller.getCurrentModule()?.id).toBe('module1');
    expect(controller.getCurrentQuestion()?.id).toBe('q2');
  });

  it('should roll back state on navigation failure', async () => {
    const { controller } = await createTestContext();
    const originalState = controller.getState();
    
    // Mock a failure during state persistence
    jest.spyOn(controller, 'persistState').mockRejectedValueOnce(new Error('Failed to update'));

    // Attempt navigation
    await expect(controller.nextQuestion()).rejects.toThrow('Failed to update');
    
    // Verify state is rolled back
    expect(controller.getState()).toEqual(originalState);
    expect(controller.getCurrentModule()?.id).toBe('module1');
    expect(controller.getCurrentQuestion()?.id).toBe('q1');
  });
});

describe('AssessmentFlowController - Navigation Error Handling', () => {
  let controller: AssessmentFlowController;
  let assessmentService: AssessmentService;

  beforeEach(async () => {
    const context = await createTestContext();
    controller = context.controller;
    assessmentService = context.assessmentService;
  });

  describe('navigateToQuestion error handling', () => {
    it('should roll back state when persistState fails during question navigation', async () => {
      // Setup initial state
      const initialModule = controller.getCurrentModule();
      const initialQuestion = controller.getCurrentQuestion();
      expect(initialModule).toBeDefined();
      expect(initialQuestion).toBeDefined();

      // Mock updateAssessment to fail
      jest.spyOn(assessmentService, 'updateAssessment').mockRejectedValueOnce(new Error('Failed to update'));

      // Try to navigate to a new question
      const nextModule = controller.getModule('module2');
      if (!nextModule) {
        throw new Error('Failed to get next module');
      }
      const targetQuestionId = nextModule.questions[0].id;
      const targetQuestion = controller.getQuestion(targetQuestionId);
      expect(targetQuestion).toBeDefined();
      
      // Attempt navigation should fail
      await expect(controller.navigateToQuestion(targetQuestion!.id))
        .rejects.toThrow('Failed to update');

      // Verify state rolled back
      const currentModule = controller.getCurrentModule();
      const currentQuestion = controller.getCurrentQuestion();
      expect(currentModule).toBeDefined();
      expect(currentQuestion).toBeDefined();
      expect(currentModule!.id).toBe(initialModule!.id);
      expect(currentQuestion!.id).toBe(initialQuestion!.id);
    });

    it('should throw error when navigating to non-existent question', async () => {
      await expect(controller.navigateToQuestion('non-existent-id'))
        .rejects.toThrow('Question non-existent-id not found');
    });
  });

  describe('navigateToModule error handling', () => {
    it('should roll back state when persistState fails during module navigation', async () => {
      // Setup initial state
      const initialModule = controller.getCurrentModule();
      const initialQuestion = controller.getCurrentQuestion();
      expect(initialModule).toBeDefined();
      expect(initialQuestion).toBeDefined();

      // Mock updateAssessment to fail
      jest.spyOn(assessmentService, 'updateAssessment').mockRejectedValueOnce(new Error('Failed to update'));

      // Try to navigate to a new module
      const nextModule = controller.getModule('module2');
      if (!nextModule) {
        throw new Error('Failed to get next module');
      }
      
      // Attempt navigation should fail
      await expect(controller.navigateToModule(nextModule.id))
        .rejects.toThrow('Failed to update');

      // Verify state rolled back
      const currentModule = controller.getCurrentModule();
      const currentQuestion = controller.getCurrentQuestion();
      expect(currentModule).toBeDefined();
      expect(currentQuestion).toBeDefined();
      expect(currentModule!.id).toBe(initialModule!.id);
      expect(currentQuestion!.id).toBe(initialQuestion!.id);
    });

    it('should throw error when navigating to non-existent module', async () => {
      await expect(controller.navigateToModule('non-existent-id'))
        .rejects.toThrow('Module non-existent-id not found');
    });
  });
}); 