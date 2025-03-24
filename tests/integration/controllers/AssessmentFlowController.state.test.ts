import { AssessmentState } from '../../../client/src/types/assessment';
import { createMockAnswerData, createMockAnswer } from './__mocks__/mockData';
import { createTestContext, setupTestEnvironment } from './__setup__/setup';
import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';

describe('AssessmentFlowController State Management', () => {
  setupTestEnvironment();

  it('should persist state when moving to next question', async () => {
    const { controller, mockSupabaseClient } = await createTestContext();

    await controller.nextQuestion();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
    
    const state = controller.getState();
    expect(state.currentModuleId).toBe('module1');
    expect(state.currentQuestionId).toBe('q2');
  });

  it('should save and persist answers', async () => {
    const { controller, mockSupabaseClient } = await createTestContext();

    const timestamp = new Date().toISOString();
    const answer = createMockAnswerData();
    await controller.saveAnswer({
      questionId: answer.question_id,
      value: answer.answer,
      timestamp
    });

    const state = controller.getState();
    expect(state.answers[answer.question_id]).toEqual(answer.answer);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessment_answers');
  });

  it('should handle answer updates', async () => {
    const { controller } = await createTestContext();

    const timestamp = new Date().toISOString();
    const firstAnswer = createMockAnswerData({ answer: { value: 'First answer' } });
    const updatedAnswer = createMockAnswerData({ answer: { value: 'Updated answer' } });

    await controller.saveAnswer({
      questionId: firstAnswer.question_id,
      value: firstAnswer.answer,
      timestamp
    });
    await controller.saveAnswer({
      questionId: updatedAnswer.question_id,
      value: updatedAnswer.answer,
      timestamp
    });

    const state = controller.getState();
    expect(state.answers[updatedAnswer.question_id]).toEqual(updatedAnswer.answer);
  });

  it('should restore and persist state', async () => {
    const { controller, mockSupabaseClient } = await createTestContext();

    const newState: AssessmentState = {
      currentModuleId: 'module2',
      currentQuestionId: 'q3',
      answers: {
        'q1': createMockAnswer('answer1'),
        'q2': createMockAnswer(42)
      },
      progress: 66,
      completedModules: ['module1'],
      isComplete: false
    };

    await controller.restoreState(newState);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
    expect(controller.getState()).toEqual(newState);
  });

  it('should roll back state when persistState fails', async () => {
    // Create initial context with successful setup
    const { controller, mockSupabaseClient } = await createTestContext();

    // Verify initial state
    const initialState = controller.getState();
    expect(initialState.currentModuleId).toBe('module1');
    expect(initialState.currentQuestionId).toBe('q1');

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

    // Attempt to move to next question, which should fail during state persistence
    await expect(controller.nextQuestion()).rejects.toThrow('Failed to update assessment');

    // Verify state rolled back
    const rolledBackState = controller.getState();
    expect(rolledBackState.currentModuleId).toBe('module1');
    expect(rolledBackState.currentQuestionId).toBe('q1');
  });
});

describe('Helper Methods', () => {
  it('should correctly identify if a module is complete', async () => {
    const { controller } = await createTestContext();
    
    // Initially no modules are complete
    expect(controller.isModuleComplete('module1')).toBe(false);
    
    // Answer all questions in module1
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
    
    expect(controller.isModuleComplete('module1')).toBe(true);
  });

  it('should correctly identify if assessment is complete', async () => {
    const { controller } = await createTestContext();
    
    // Initially assessment is not complete
    expect(controller.isAssessmentComplete()).toBe(false);
    
    // Answer all questions
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
    
    await controller.saveAnswer({
      questionId: 'q3',
      value: createMockAnswer('test'),
      timestamp: new Date().toISOString()
    });
    
    expect(controller.isAssessmentComplete()).toBe(true);
  });

  it('should correctly get questions for a module', async () => {
    const { controller } = await createTestContext();
    
    const module1Questions = controller.getQuestionsForModule('module1');
    expect(module1Questions).toHaveLength(2);
    expect(module1Questions[0].id).toBe('q1');
    expect(module1Questions[1].id).toBe('q2');
    
    const module2Questions = controller.getQuestionsForModule('module2');
    expect(module2Questions).toHaveLength(1);
    expect(module2Questions[0].id).toBe('q3');
  });

  it('should correctly get current module questions', async () => {
    const { controller } = await createTestContext();
    
    const currentQuestions = controller.getCurrentModuleQuestions();
    expect(currentQuestions).toHaveLength(2);
    expect(currentQuestions[0].id).toBe('q1');
    expect(currentQuestions[1].id).toBe('q2');
    
    // Move to next module
    await controller.nextModule();
    
    const nextModuleQuestions = controller.getCurrentModuleQuestions();
    expect(nextModuleQuestions).toHaveLength(1);
    expect(nextModuleQuestions[0].id).toBe('q3');
  });
}); 