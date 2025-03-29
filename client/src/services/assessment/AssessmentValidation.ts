import { SupabaseClient } from '@supabase/supabase-js';
import { AssessmentError } from './AssessmentError';
import { AssessmentStatus } from '../../types/assessment';

export class AssessmentValidation {
  constructor(private supabase: SupabaseClient) {}

  async createAssessment(data: any) {
    if (!data.id || !data.user_id) {
      throw new AssessmentError('Missing required fields', 'VALIDATION_ERROR');
    }

    if (data.status && !Object.values(AssessmentStatus).includes(data.status)) {
      throw new AssessmentError('Invalid status', 'VALIDATION_ERROR');
    }

    if (typeof data.progress !== 'undefined' && (data.progress < 0 || data.progress > 100)) {
      throw new AssessmentError('Progress must be between 0 and 100', 'VALIDATION_ERROR');
    }

    return data;
  }

  async saveAnswer(data: any) {
    if (!data.assessment_id || !data.question_id) {
      throw new AssessmentError('Missing required fields', 'VALIDATION_ERROR');
    }

    if (!data.answer || typeof data.answer !== 'object') {
      throw new AssessmentError('Invalid answer format', 'VALIDATION_ERROR');
    }

    return data;
  }
} 