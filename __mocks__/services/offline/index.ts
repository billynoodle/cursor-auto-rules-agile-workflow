import { OfflineService } from '../../../client/src/services/assessment/OfflineService';
import { Assessment, AssessmentAnswer } from '../../../client/src/types/database';
import { createMockAssessment, createMockAnswerData } from '../../data/assessment';

export const createMockOfflineService = (): jest.Mocked<OfflineService> => ({
  saveAssessment: jest.fn().mockImplementation(async (assessment: Assessment) => {
    return { data: assessment, error: null };
  }),
  
  getAssessment: jest.fn().mockImplementation(async (id: string) => {
    return { data: createMockAssessment({ id }), error: null };
  }),
  
  saveAnswer: jest.fn().mockImplementation(async (answer: AssessmentAnswer) => {
    return { data: createMockAnswerData(answer), error: null };
  }),
  
  getAnswers: jest.fn().mockImplementation(async (assessmentId: string) => {
    return { 
      data: [createMockAnswerData({ assessment_id: assessmentId })],
      error: null 
    };
  }),
  
  clearData: jest.fn().mockImplementation(async () => {
    return { data: null, error: null };
  }),
  
  isOnline: jest.fn().mockReturnValue(true),
  
  syncData: jest.fn().mockImplementation(async () => {
    return { data: null, error: null };
  })
}); 