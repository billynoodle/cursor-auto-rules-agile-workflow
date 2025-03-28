import { AssessmentState } from '../../../client/src/types/assessment';
import { createTestContext, setupTestEnvironment } from './__setup__/setup';
import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';
import { createMockAnswer, createMockAnswerData } from '../../__mocks__/data/assessment';

describe('AssessmentFlowController State Management', () => {
  setupTestEnvironment();

  it('should persist state when moving to next question', async () => {
    const { controller, mockSupabaseClient, modules } = await createTestContext({
      moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
    });

    await controller.nextQuestion();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
    
    const state = controller.getState();
    expect(state.currentModuleId).toBe('module1');
    expect(state.currentQuestionId).toBe('qmodule1-2');
  });

  it('should save and persist answers', async () => {
    const { controller, mockSupabaseClient, modules } = await createTestContext({
      moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
    });

    const timestamp = new Date().toISOString();
    const questionId = modules[0].questions[0].id;
    const answer = createMockAnswerData({
      question_id: questionId,
      answer: { value: 'Test answer' }
    });

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
    const { controller, modules } = await createTestContext({
      moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
    });

    const timestamp = new Date().toISOString();
    const questionId = modules[0].questions[0].id;
    const firstAnswer = createMockAnswerData({
      question_id: questionId,
      answer: { value: 'First answer' }
    });
    const updatedAnswer = createMockAnswerData({
      question_id: questionId,
      answer: { value: 'Updated answer' }
    });

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
    const { controller, mockSupabaseClient, modules } = await createTestContext({
      moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
    });

    const newState: AssessmentState = {
      currentModuleId: 'module2',
      currentQuestionId: modules[1].questions[0].id,
      answers: {
        [modules[0].questions[0].id]: { value: 'answer1' },
        [modules[0].questions[1].id]: { value: 42 }
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
    const { controller, mockSupabaseClient, modules } = await createTestContext({
      moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
    });

    // Verify initial state
    const initialState = controller.getState();
    expect(initialState.currentModuleId).toBe('module1');
    expect(initialState.currentQuestionId).toBe(modules[0].questions[0].id);

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
    expect(rolledBackState.currentQuestionId).toBe(modules[0].questions[0].id);
  });
});

describe('Helper Methods', () => {
  it('should correctly identify if a module is complete', async () => {
    const { controller, modules } = await createTestContext({
      moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
    });
    
    // Initially no modules are complete
    expect(controller.isModuleComplete('module1')).toBe(false);
    
    // Answer all questions in module1
    for (const question of modules[0].questions) {
      await controller.saveAnswer({
        questionId: question.id,
        value: { value: 'test' },
        timestamp: new Date().toISOString()
      });
    }
    
    expect(controller.isModuleComplete('module1')).toBe(true);
  });

  it('should correctly identify if assessment is complete', async () => {
    const { controller, modules } = await createTestContext({
      moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
    });
    
    // Initially assessment is not complete
    expect(controller.isAssessmentComplete()).toBe(false);
    
    // Answer all questions in all modules
    for (const module of modules) {
      for (const question of module.questions) {
        await controller.saveAnswer({
          questionId: question.id,
          value: { value: 'test' },
          timestamp: new Date().toISOString()
        });
      }
    }
    
    expect(controller.isAssessmentComplete()).toBe(true);
  });

  it('should correctly get questions for a module', async () => {
    const { controller, modules } = await createTestContext({
      moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
    });
    
    const module1Questions = controller.getQuestionsForModule('module1');
    expect(module1Questions).toHaveLength(2);
    expect(module1Questions[0].id).toBe(modules[0].questions[0].id);
    expect(module1Questions[1].id).toBe(modules[0].questions[1].id);
    
    const module2Questions = controller.getQuestionsForModule('module2');
    expect(module2Questions).toHaveLength(2);
    expect(module2Questions[0].id).toBe(modules[1].questions[0].id);
    expect(module2Questions[1].id).toBe(modules[1].questions[1].id);
  });

  it('should correctly get current module questions', async () => {
    const { controller, modules } = await createTestContext({
      moduleOptions: { moduleCount: 2, questionsPerModule: 2 }
    });
    
    const currentQuestions = controller.getCurrentModuleQuestions();
    expect(currentQuestions).toHaveLength(2);
    expect(currentQuestions[0].id).toBe(modules[0].questions[0].id);
    expect(currentQuestions[1].id).toBe(modules[0].questions[1].id);
    
    // Move to next module
    await controller.nextModule();
    
    const nextModuleQuestions = controller.getCurrentModuleQuestions();
    expect(nextModuleQuestions).toHaveLength(2);
    expect(nextModuleQuestions[0].id).toBe(modules[1].questions[0].id);
    expect(nextModuleQuestions[1].id).toBe(modules[1].questions[1].id);
  });
}); 