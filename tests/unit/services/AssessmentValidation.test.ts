import { AssessmentValidation } from '../../../client/src/services/assessment/AssessmentValidation';
import { AssessmentError } from '../../../client/src/services/assessment/AssessmentError';
import { AssessmentStatus } from '../../../client/src/types/assessment';
import { createMockSupabaseClient } from '../../utils/test-helpers';

describe('AssessmentValidation', () => {
  let service: AssessmentValidation;

  beforeEach(() => {
    service = new AssessmentValidation(createMockSupabaseClient());
  });

  describe('createAssessment', () => {
    it('should validate assessment data', async () => {
      const validAssessment = {
        id: '00000000-0000-0000-0000-000000000001',
        user_id: '00000000-0000-0000-0000-000000000002',
        status: 'draft' as AssessmentStatus,
        current_module_id: 'module1',
        current_question_id: 'q1',
        completed_modules: [],
        progress: 0,
        is_complete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await expect(service.createAssessment(validAssessment)).resolves.toBeDefined();
    });

    it('should reject invalid assessment data', async () => {
      const invalidAssessment = {
        id: '00000000-0000-0000-0000-000000000001',
        status: 'invalid' as AssessmentStatus,
        progress: -1
      };

      await expect(service.createAssessment(invalidAssessment)).rejects.toThrow(AssessmentError);
    });
  });

  describe('saveAnswer', () => {
    it('should validate answer data', async () => {
      const validAnswer = {
        assessment_id: '00000000-0000-0000-0000-000000000001',
        question_id: 'q1',
        answer: { value: 'test', score: 1 }
      };

      await expect(service.saveAnswer(validAnswer)).resolves.toBeDefined();
    });

    it('should reject invalid answer data', async () => {
      const invalidAnswer = {
        assessment_id: '00000000-0000-0000-0000-000000000001',
        question_id: 'q1',
        answer: undefined
      };

      await expect(service.saveAnswer(invalidAnswer)).rejects.toThrow(AssessmentError);
    });
  });
}); 