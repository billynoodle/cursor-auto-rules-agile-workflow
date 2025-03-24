import { validateAssessment, validateAnswer } from '../../../../client/src/services/assessment/AssessmentValidation';
import { AssessmentError } from '../../../../client/src/services/assessment/AssessmentError';

describe('AssessmentValidation', () => {
  describe('validateAssessment', () => {
    const validAssessment = {
      user_id: 'user123',
      current_module_id: 'module123',
      progress: 50,
      completed_modules: ['module1', 'module2'],
      is_complete: false,
      status: 'in_progress' as const,
      metadata: { key: 'value' }
    };

    it('should validate a correct assessment object', () => {
      expect(() => validateAssessment(validAssessment)).not.toThrow();
    });

    it('should throw AssessmentError for invalid assessment', () => {
      const invalidAssessment = {
        user_id: 'user123',
        current_module_id: 'module123',
        progress: 50,
        completed_modules: ['module1', 'module2'],
        is_complete: 'false' as any,
        status: 'invalid_status' as any,
        metadata: undefined
      };

      expect(() => validateAssessment(invalidAssessment)).toThrow(AssessmentError);
    });
  });

  describe('validateAnswer', () => {
    const validAnswer = {
      assessment_id: 'assessment123',
      question_id: 'question123',
      answer: { selected: 'option1' },
      metadata: { timestamp: Date.now() }
    };

    it('should validate a correct answer object', () => {
      expect(() => validateAnswer(validAnswer)).not.toThrow();
    });

    it('should throw AssessmentError for invalid answer', () => {
      const invalidAnswer = {
        assessment_id: 'assessment123',
        question_id: 'question123',
        answer: { selected: 'option1' },
        metadata: 'invalid_metadata' as any
      };

      expect(() => validateAnswer(invalidAnswer)).toThrow(AssessmentError);
    });
  });
}); 