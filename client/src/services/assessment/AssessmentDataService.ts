import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '@/types/database.types';
import { Assessment } from '@/types/assessment.types';
import { AssessmentError } from './AssessmentError';

export class AssessmentDataService {
  constructor(private readonly supabase: SupabaseClient<DatabaseSchema>) {}

  async saveAssessmentData(assessment: Assessment): Promise<Assessment> {
    try {
      const { data, error } = await this.supabase
        .from('assessments')
        .insert(assessment)
        .single();

      if (error) {
        throw new AssessmentError('Failed to save assessment data', 'SAVE_ERROR', error);
      }

      return data;
    } catch (error) {
      throw new AssessmentError('Failed to save assessment data', 'SAVE_ERROR', error);
    }
  }

  async getAssessmentData(assessmentId: string): Promise<Assessment> {
    try {
      const { data, error } = await this.supabase
        .from('assessments')
        .select()
        .eq('id', assessmentId)
        .single();

      if (error) {
        throw new AssessmentError('Failed to get assessment data', 'GET_ERROR', error);
      }

      return data;
    } catch (error) {
      throw new AssessmentError('Failed to get assessment data', 'GET_ERROR', error);
    }
  }

  async updateAssessmentData(assessmentId: string, assessment: Partial<Assessment>): Promise<Assessment> {
    try {
      const { data, error } = await this.supabase
        .from('assessments')
        .update(assessment)
        .eq('id', assessmentId)
        .single();

      if (error) {
        throw new AssessmentError('Failed to update assessment data', 'UPDATE_ERROR', error);
      }

      return data;
    } catch (error) {
      throw new AssessmentError('Failed to update assessment data', 'UPDATE_ERROR', error);
    }
  }

  async deleteAssessmentData(assessmentId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('assessments')
        .delete()
        .eq('id', assessmentId);

      if (error) {
        throw new AssessmentError('Failed to delete assessment data', 'DELETE_ERROR', error);
      }
    } catch (error) {
      throw new AssessmentError('Failed to delete assessment data', 'DELETE_ERROR', error);
    }
  }
} 