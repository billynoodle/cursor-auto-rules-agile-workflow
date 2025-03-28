import { SupabaseClient } from '@supabase/supabase-js';
import { AssessmentAnswer, DatabaseSchema } from '../../types/database';
import { AssessmentError } from './AssessmentError';
import { OfflineService } from './OfflineService';
import { z } from 'zod';

const answerSchema = z.object({
  id: z.string().uuid().optional(),
  assessment_id: z.string().uuid(),
  question_id: z.string(),
  answer: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export class AnswerService {
  constructor(
    private readonly supabase: SupabaseClient<DatabaseSchema>,
    private readonly offlineService: OfflineService
  ) {}

  public async saveAnswer(data: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'>): Promise<AssessmentAnswer> {
    try {
      // Add timestamps
      const now = new Date().toISOString();
      const answerData = {
        ...data,
        created_at: now,
        updated_at: now
      };

      // Validate input data
      const validatedData = answerSchema.parse(answerData);

      if (this.offlineService.isOnline()) {
        try {
          const { data: result, error } = await this.supabase
            .from('assessment_answers')
            .insert(validatedData)
            .select()
            .single();

          if (error) {
            throw new AssessmentError(
              'Failed to save answer in database',
              'DB_ERROR',
              error
            );
          }

          if (!result) {
            throw new AssessmentError(
              'No answer data returned after creation',
              'CREATE_ERROR'
            );
          }

          return result;
        } catch (dbError) {
          throw new AssessmentError(
            'Failed to save answer',
            'CREATE_ERROR',
            dbError
          );
        }
      } else {
        // Store offline
        const offlineId = `answer_${Date.now()}`;
        const offlineAnswer = {
          ...validatedData,
          id: offlineId
        };
        this.offlineService.storeOfflineData(offlineId, offlineAnswer);
        return offlineAnswer;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AssessmentError(
          'Invalid answer data',
          'VALIDATION_ERROR',
          error
        );
      }
      throw error;
    }
  }

  public async getAnswers(assessmentId: string): Promise<AssessmentAnswer[]> {
    if (this.offlineService.isOnline()) {
      const { data, error } = await this.supabase
        .from('assessment_answers')
        .select('*')
        .eq('assessment_id', assessmentId);

      if (error) {
        throw new AssessmentError(
          'Failed to fetch answers',
          'FETCH_ERROR',
          error
        );
      }

      return data;
    } else {
      // Get offline answers
      const offlineData = this.offlineService.getAllOfflineData();
      return offlineData
        .filter(([key]) => key.startsWith('answer_'))
        .map(([_, data]) => data as AssessmentAnswer)
        .filter(answer => answer.assessment_id === assessmentId);
    }
  }

  public async updateAnswer(
    answerId: string,
    data: Partial<Omit<AssessmentAnswer, 'id' | 'created_at'>>
  ): Promise<AssessmentAnswer> {
    try {
      const now = new Date().toISOString();
      const updateData = {
        ...data,
        updated_at: now
      };

      if (this.offlineService.isOnline()) {
        const { data: result, error } = await this.supabase
          .from('assessment_answers')
          .update(updateData)
          .eq('id', answerId)
          .select()
          .single();

        if (error) {
          throw new AssessmentError(
            'Failed to update answer',
            'UPDATE_ERROR',
            error
          );
        }

        if (!result) {
          throw new AssessmentError(
            'No answer found with the given ID',
            'NOT_FOUND'
          );
        }

        return result;
      } else {
        // Update offline
        const offlineAnswer = this.offlineService.getOfflineData(answerId) as AssessmentAnswer | undefined;
        if (!offlineAnswer) {
          throw new AssessmentError(
            'No answer found with the given ID',
            'NOT_FOUND'
          );
        }

        const updatedAnswer = {
          ...offlineAnswer,
          ...updateData
        };
        this.offlineService.storeOfflineData(answerId, updatedAnswer);
        return updatedAnswer;
      }
    } catch (error) {
      if (error instanceof AssessmentError) {
        throw error;
      }
      throw new AssessmentError(
        'Failed to update answer',
        'UPDATE_ERROR',
        error
      );
    }
  }

  public async deleteAnswer(answerId: string): Promise<void> {
    if (this.offlineService.isOnline()) {
      const { error } = await this.supabase
        .from('assessment_answers')
        .delete()
        .eq('id', answerId);

      if (error) {
        throw new AssessmentError(
          'Failed to delete answer',
          'DELETE_ERROR',
          error
        );
      }
    } else {
      this.offlineService.removeOfflineData(answerId);
    }
  }
} 