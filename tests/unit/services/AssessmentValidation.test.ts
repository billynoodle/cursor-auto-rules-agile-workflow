import { AssessmentService, AssessmentError } from '@client/services/AssessmentService';
import { createMockSupabaseClient } from '@mocks/services/supabase/client';
import { Assessment, AssessmentAnswer } from '@client/types/database';

describe('AssessmentService Validation', () => {
  let service: AssessmentService;

  beforeEach(() => {
    service = new AssessmentService(createMockSupabaseClient());
  });

  describe('Assessment Validation', () => {
    const validAssessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at'> = {
      user_id: 'user123',
      current_module_id: 'module123',
      current_question_id: 'question123',
      progress: 50,
      completed_modules: ['module1', 'module2'],
      is_complete: false,
      status: 'in_progress',
      metadata: { key: 'value' }
    };

    it('should validate a correct assessment object', async () => {
      await expect(service.createAssessment(validAssessment)).resolves.toBeDefined();
    });

    it('should throw AssessmentError for invalid assessment', async () => {
      const invalidAssessment = {
        ...validAssessment,
        is_complete: 'false' as any,
        status: 'invalid_status' as any,
      };

      await expect(service.createAssessment(invalidAssessment)).rejects.toThrow(AssessmentError);
    });
  });

  describe('Answer Validation', () => {
    const validAnswer: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'> = {
      assessment_id: 'assessment123',
      question_id: 'question123',
      answer: { selected: 'option1' },
      metadata: { timestamp: Date.now() }
    };

    it('should validate a correct answer object', async () => {
      await expect(service.saveAnswer(validAnswer)).resolves.toBeDefined();
    });

    it('should throw AssessmentError for invalid answer', async () => {
      const invalidAnswer = {
        ...validAnswer,
        metadata: 'invalid_metadata' as any
      };

      await expect(service.saveAnswer(invalidAnswer)).rejects.toThrow(AssessmentError);
    });
  });
}); 