import { createMockAnswer } from './__mocks__/mockData';
import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';
import { createTestContext, setupTestEnvironment } from './__setup__/setup';

describe('AssessmentFlowController Progress', () => {
  setupTestEnvironment();

  it('should calculate progress correctly', async () => {
    const { controller } = await createTestContext();
    
    // Initially no progress
    expect(controller.getState().progress).toBe(0);

    // Answer first question
    await controller.saveAnswer({
      questionId: 'q1',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });
    
    // Progress should be 33% (1 out of 3 questions)
    expect(controller.getState().progress).toBe(33);

    // Answer second question
    await controller.saveAnswer({
      questionId: 'q2',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });

    // Progress should be 66% (2 out of 3 questions)
    expect(controller.getState().progress).toBe(66);

    // Answer last question
    await controller.saveAnswer({
      questionId: 'q3',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });

    // Progress should be 100%
    expect(controller.getState().progress).toBe(100);
    expect(controller.getState().isComplete).toBe(true);
  });

  it('should update progress when answers are modified', async () => {
    const { controller } = await createTestContext();
    
    // Answer first question
    await controller.saveAnswer({
      questionId: 'q1',
      value: createMockAnswer('initial'),
      timestamp: new Date().toISOString()
    });
    
    const initialProgress = controller.getState().progress;

    // Modify the answer
    await controller.saveAnswer({
      questionId: 'q1',
      value: createMockAnswer('modified'),
      timestamp: new Date().toISOString()
    });

    // Progress should remain the same
    expect(controller.getState().progress).toBe(initialProgress);
  });

  it('should mark module as completed when all questions are answered', async () => {
    const { controller } = await createTestContext();
    
    // Answer all questions in first module
    await controller.saveAnswer({
      questionId: 'q1',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });

    await controller.saveAnswer({
      questionId: 'q2',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });

    // First module should be marked as completed
    expect(controller.getState().completedModules).toContain('module1');
  });

  it('should handle progress calculation with skipped questions', async () => {
    const { controller } = await createTestContext();
    
    // Skip first question, answer second
    await controller.nextQuestion();
    await controller.saveAnswer({
      questionId: 'q2',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });

    // Progress should be 33% (1 out of 3 questions)
    expect(controller.getState().progress).toBe(33);

    // Go back and answer first question
    await controller.previousQuestion();
    await controller.saveAnswer({
      questionId: 'q1',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });

    // Progress should be 66% (2 out of 3 questions)
    expect(controller.getState().progress).toBe(66);
  });
}); 