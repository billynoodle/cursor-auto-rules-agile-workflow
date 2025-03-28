import { SupabaseClient } from '@supabase/supabase-js';
import { Assessment, AssessmentAnswer, AssessmentStatus, DatabaseSchema } from '../types/database';
import { z } from 'zod';
import { AssessmentError } from './assessment/AssessmentError';
import { OfflineService } from './assessment/OfflineService';
import { AnswerService } from './assessment/AnswerService';

export { AssessmentError } from './assessment/AssessmentError';

// Validation schemas
const assessmentSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  current_module_id: z.string(),
  current_question_id: z.string(),
  progress: z.number().min(0).max(100),
  completed_modules: z.array(z.string()),
  is_complete: z.boolean(),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

const answerSchema = z.object({
  id: z.string().uuid().optional(),
  assessment_id: z.string().uuid(),
  question_id: z.string(),
  answer: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export class AssessmentService {
  private readonly offlineService: OfflineService;
  private readonly answerService: AnswerService;

  constructor(private readonly supabase: SupabaseClient<DatabaseSchema>) {
    this.offlineService = new OfflineService(supabase);
    this.answerService = new AnswerService(supabase, this.offlineService);
  }

  public async checkOnlineStatus(): Promise<boolean> {
    return this.offlineService.isOnline();
  }

  public setupOfflineSync(): void {
    this.offlineService.setupOfflineSync();
  }

  public async createAssessment(data: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>): Promise<Assessment> {
    try {
      // Add timestamps
      const now = new Date().toISOString();
      const assessmentData = {
        ...data,
        created_at: now,
        updated_at: now
      };

      // Validate input data
      const validatedData = assessmentSchema.parse(assessmentData);

      if (this.offlineService.isOnline()) {
        try {
          const { data: result, error } = await this.supabase
            .from('assessments')
            .insert(validatedData)
            .select()
            .single();

          if (error) {
            throw new AssessmentError(
              'Failed to create assessment in database',
              'DB_ERROR',
              error
            );
          }

          if (!result) {
            throw new AssessmentError(
              'No assessment data returned after creation',
              'CREATE_ERROR'
            );
          }

          return result;
        } catch (dbError) {
          throw new AssessmentError(
            'Failed to create assessment',
            'CREATE_ERROR',
            dbError
          );
        }
      } else {
        // Generate a temporary ID for offline storage
        const offlineId = `assessment_${Date.now()}`;
        const offlineAssessment = {
          ...validatedData,
          id: offlineId
        };
        this.offlineService.storeOfflineData(offlineId, offlineAssessment);
        return offlineAssessment;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AssessmentError(
          'Invalid assessment data',
          'VALIDATION_ERROR',
          error
        );
      }
      throw error;
    }
  }

  public async getAssessment(id: string): Promise<Assessment> {
    if (this.offlineService.isOnline()) {
      const { data, error } = await this.supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new AssessmentError(
          'Failed to fetch assessment',
          'FETCH_ERROR',
          error
        );
      }

      if (!data) {
        throw new AssessmentError(
          'Assessment not found',
          'NOT_FOUND'
        );
      }

      return data;
    } else {
      const offlineData = this.offlineService.getOfflineData(id) as Assessment | undefined;
      if (!offlineData) {
        throw new AssessmentError(
          'Assessment not found',
          'NOT_FOUND'
        );
      }
      return offlineData;
    }
  }

  public async updateAssessment(
    id: string,
    data: Partial<Omit<Assessment, 'id' | 'created_at'>>
  ): Promise<Assessment> {
    try {
      const now = new Date().toISOString();
      const updateData = {
        ...data,
        updated_at: now
      };

      if (this.offlineService.isOnline()) {
        const { data: result, error } = await this.supabase
          .from('assessments')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw new AssessmentError(
            'Failed to update assessment',
            'UPDATE_ERROR',
            error
          );
        }

        if (!result) {
          throw new AssessmentError(
            'Assessment not found',
            'NOT_FOUND'
          );
        }

        return result;
      } else {
        const offlineData = this.offlineService.getOfflineData(id) as Assessment | undefined;
        if (!offlineData) {
          throw new AssessmentError(
            'Assessment not found',
            'NOT_FOUND'
          );
        }

        const updatedAssessment = {
          ...offlineData,
          ...updateData
        };
        this.offlineService.storeOfflineData(id, updatedAssessment);
        return updatedAssessment;
      }
    } catch (error) {
      throw new AssessmentError(
        'Failed to update assessment',
        'UPDATE_ERROR',
        error
      );
    }
  }

  public async deleteAssessment(id: string): Promise<void> {
    if (this.offlineService.isOnline()) {
      const { error } = await this.supabase
        .from('assessments')
        .delete()
        .eq('id', id);

      if (error) {
        throw new AssessmentError(
          'Failed to delete assessment',
          'DELETE_ERROR',
          error
        );
      }
    } else {
      this.offlineService.removeOfflineData(id);
    }
  }

  // Answer-related methods delegated to AnswerService
  public async saveAnswer(data: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'>): Promise<AssessmentAnswer> {
    return this.answerService.saveAnswer(data);
  }

  public async getAnswers(assessmentId: string): Promise<AssessmentAnswer[]> {
    return this.answerService.getAnswers(assessmentId);
  }

  public async updateAnswer(
    answerId: string,
    data: Partial<Omit<AssessmentAnswer, 'id' | 'created_at'>>
  ): Promise<AssessmentAnswer> {
    return this.answerService.updateAnswer(answerId, data);
  }

  public async deleteAnswer(answerId: string): Promise<void> {
    return this.answerService.deleteAnswer(answerId);
  }

  public async getUserAssessments(userId: string, status?: AssessmentStatus): Promise<Assessment[]> {
    try {
      let query = this.supabase
        .from('assessments')
        .select()
        .eq('user_id', userId)
        .is('deleted_at', null);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: result, error } = await query;

      if (error) {
        throw new AssessmentError(
          error.message,
          error.code,
          error
        );
      }

      return result || [];
    } catch (error) {
      if (error instanceof AssessmentError) throw error;
      throw new AssessmentError(
        'Failed to fetch user assessments',
        'FETCH_ERROR',
        error
      );
    }
  }

  // New method for real-time updates
  subscribeToAssessmentUpdates(assessmentId: string, callback: (assessment: Assessment) => void): () => void {
    const subscription = this.supabase
      .channel(`assessment_${assessmentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assessments',
          filter: `id=eq.${assessmentId}`,
        },
        (payload) => {
          callback(payload.new as Assessment);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  private mapAnswerFromDB(data: any): AssessmentAnswer {
    return {
      id: data.id,
      assessment_id: data.assessment_id,
      question_id: data.question_id,
      answer: data.answer,
      metadata: data.metadata,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  private async validateAnswer(data: Partial<AssessmentAnswer>): Promise<void> {
    if (Object.keys(data).length > 0) {
      answerSchema.partial().parse(data);
    }
  }
}

