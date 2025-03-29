import { AssessmentFlowController } from '@client/controllers/assessment/AssessmentFlowController';
import { createMockAssessment, createMockAnswerData } from '../data/assessment';
import { Answer } from '@client/types/assessment';

export const createMockAssessmentFlowController = (): jest.Mocked<AssessmentFlowController> => ({
  initialize: jest.fn().mockImplementation(async () => {
    return { data: createMockAssessment(), error: null };
  }),

  getCurrentState: jest.fn().mockImplementation(() => {
    return {
      moduleId: 'module1',
      questionId: 'q1',
      progress: 0,
      isComplete: false
    };
  }),

  saveAnswer: jest.fn().mockImplementation(async (answer: Answer) => {
    return { data: createMockAnswerData({ answer }), error: null };
  }),

  nextQuestion: jest.fn().mockImplementation(async () => {
    return {
      data: {
        moduleId: 'module1',
        questionId: 'q2',
        progress: 33,
        isComplete: false
      },
      error: null
    };
  }),

  previousQuestion: jest.fn().mockImplementation(async () => {
    return {
      data: {
        moduleId: 'module1',
        questionId: 'q1',
        progress: 0,
        isComplete: false
      },
      error: null
    };
  }),

  getProgress: jest.fn().mockReturnValue({
    currentModule: 1,
    totalModules: 3,
    currentQuestion: 1,
    totalQuestions: 10,
    percentComplete: 10
  }),

  isAnswered: jest.fn().mockReturnValue(false),

  getCurrentAnswer: jest.fn().mockReturnValue(null),

  reset: jest.fn().mockImplementation(async () => {
    return { data: null, error: null };
  })
}); 