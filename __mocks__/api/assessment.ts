import { createMockAssessment, createMockAnswerData, mockModules } from '../data/assessment';

export const mockAssessmentAPI = {
  getAssessment: jest.fn().mockImplementation(async (id: string) => {
    return {
      status: 200,
      json: async () => createMockAssessment({ id }),
      ok: true
    };
  }),

  createAssessment: jest.fn().mockImplementation(async () => {
    return {
      status: 201,
      json: async () => createMockAssessment(),
      ok: true
    };
  }),

  updateAssessment: jest.fn().mockImplementation(async (id: string, data: any) => {
    return {
      status: 200,
      json: async () => createMockAssessment({ id, ...data }),
      ok: true
    };
  }),

  saveAnswer: jest.fn().mockImplementation(async (assessmentId: string, questionId: string, answer: any) => {
    return {
      status: 200,
      json: async () => createMockAnswerData({
        assessment_id: assessmentId,
        question_id: questionId,
        answer
      }),
      ok: true
    };
  }),

  getModules: jest.fn().mockImplementation(async () => {
    return {
      status: 200,
      json: async () => mockModules,
      ok: true
    };
  }),

  // Error scenarios
  simulateError: (status = 500, message = 'Internal Server Error') => {
    return {
      status,
      json: async () => ({ error: message }),
      ok: false
    };
  }
}; 