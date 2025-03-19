import { SupabaseClient } from '@supabase/supabase-js';
import { Assessment, AssessmentAnswer, AssessmentStatus, DatabaseSchema } from '../types/database';
import { z } from 'zod';

// Validation schemas
const assessmentSchema = z.object({
  user_id: z.string().uuid(),
  current_module_id: z.string(),
  current_question_id: z.string(),
  progress: z.number().min(0).max(100),
  completed_modules: z.array(z.string()),
  is_complete: z.boolean(),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']),
  metadata: z.record(z.unknown()).optional(),
});

const answerSchema = z.object({
  assessment_id: z.string().uuid(),
  question_id: z.string(),
  answer: z.record(z.unknown()),
  metadata: z.record(z.unknown()).optional(),
});

export class AssessmentError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AssessmentError';
  }
}

export class AssessmentService {
  private supabase: SupabaseClient<DatabaseSchema>;
  private offlineStore: Map<string, unknown> = new Map();
  private syncQueue: Array<() => Promise<void>> = [];
  private isSyncing = false;

  constructor(supabaseClient: SupabaseClient<DatabaseSchema>) {
    this.supabase = supabaseClient;
    this.initializeOfflineSupport();
  }

  private initializeOfflineSupport() {
    // Load offline data from localStorage
    const offlineData = localStorage.getItem('assessment_offline_data');
    if (offlineData) {
      this.offlineStore = new Map(JSON.parse(offlineData));
    }

    // Set up online/offline listeners
    window.addEventListener('online', () => this.syncOfflineData());
    window.addEventListener('offline', () => {
      console.log('App is offline. Data will be stored locally.');
    });
  }

  private async syncOfflineData() {
    if (this.isSyncing || !navigator.onLine) return;
    
    this.isSyncing = true;
    try {
      while (this.syncQueue.length > 0) {
        const syncOperation = this.syncQueue.shift();
        if (syncOperation) {
          await syncOperation();
        }
      }
      
      // Clear offline store after successful sync
      this.offlineStore.clear();
      localStorage.removeItem('assessment_offline_data');
    } catch (error) {
      console.error('Error syncing offline data:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private saveToOfflineStore(key: string, data: unknown) {
    this.offlineStore.set(key, data);
    localStorage.setItem('assessment_offline_data', JSON.stringify(Array.from(this.offlineStore.entries())));
  }

  async createAssessment(assessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>): Promise<Assessment> {
    try {
      // Validate input
      assessmentSchema.parse(assessment);

      if (!navigator.onLine) {
        const tempId = `temp_${Date.now()}`;
        const offlineAssessment = {
          id: tempId,
          ...assessment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        this.saveToOfflineStore(`assessment_${tempId}`, offlineAssessment);
        this.syncQueue.push(async () => {
          const { data, error } = await this.supabase
            .from('assessments')
            .insert(assessment)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        });
        
        return offlineAssessment as Assessment;
      }

      const { data, error } = await this.supabase
        .from('assessments')
        .insert(assessment)
        .select()
        .single();

      if (error) {
        throw new AssessmentError(
          'Failed to create assessment',
          'CREATE_FAILED',
          error
        );
      }

      return data;
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

  async getAssessment(id: string): Promise<Assessment | null> {
    try {
      // Check offline store first
      const offlineData = this.offlineStore.get(`assessment_${id}`);
      if (offlineData) {
        return offlineData as Assessment;
      }

      if (!navigator.onLine) {
        throw new AssessmentError(
          'Cannot fetch assessment while offline',
          'OFFLINE_ERROR'
        );
      }

      const { data, error } = await this.supabase
        .from('assessments')
        .select()
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new AssessmentError(
          'Failed to fetch assessment',
          'FETCH_FAILED',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof AssessmentError) throw error;
      throw new AssessmentError(
        'Unexpected error fetching assessment',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  async updateAssessment(id: string, update: Partial<Omit<Assessment, 'id' | 'created_at' | 'updated_at'>>): Promise<Assessment> {
    try {
      // Validate update data
      if (Object.keys(update).length > 0) {
        assessmentSchema.partial().parse(update);
      }

      if (!navigator.onLine) {
        const existingData = await this.getAssessment(id);
        if (!existingData) {
          throw new AssessmentError(
            'Assessment not found in offline store',
            'NOT_FOUND'
          );
        }

        const updatedAssessment = {
          ...existingData,
          ...update,
          updated_at: new Date().toISOString(),
        };

        this.saveToOfflineStore(`assessment_${id}`, updatedAssessment);
        this.syncQueue.push(async () => {
          const { data, error } = await this.supabase
            .from('assessments')
            .update(update)
            .eq('id', id)
            .is('deleted_at', null)
            .select()
            .single();

          if (error) throw error;
          return data;
        });

        return updatedAssessment as Assessment;
      }

      const { data, error } = await this.supabase
        .from('assessments')
        .update(update)
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();

      if (error) {
        throw new AssessmentError(
          'Failed to update assessment',
          'UPDATE_FAILED',
          error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AssessmentError(
          'Invalid update data',
          'VALIDATION_ERROR',
          error
        );
      }
      throw error;
    }
  }

  async softDeleteAssessment(id: string): Promise<void> {
    const { error } = await this.supabase
      .rpc('soft_delete_assessment', { assessment_id: id });

    if (error) throw error;
  }

  async restoreAssessment(id: string): Promise<void> {
    const { error } = await this.supabase
      .rpc('restore_assessment', { assessment_id: id });

    if (error) throw error;
  }

  async saveAnswer(answer: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'>): Promise<AssessmentAnswer> {
    try {
      // Validate input
      answerSchema.parse(answer);

      if (!navigator.onLine) {
        const tempId = `temp_${Date.now()}`;
        const offlineAnswer = {
          id: tempId,
          ...answer,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        this.saveToOfflineStore(`answer_${tempId}`, offlineAnswer);
        this.syncQueue.push(async () => {
          const { data, error } = await this.supabase
            .from('assessment_answers')
            .insert(answer)
            .select()
            .single();

          if (error) throw error;
          return data;
        });

        return offlineAnswer as AssessmentAnswer;
      }

      const { data, error } = await this.supabase
        .from('assessment_answers')
        .insert(answer)
        .select()
        .single();

      if (error) {
        throw new AssessmentError(
          'Failed to save answer',
          'SAVE_FAILED',
          error
        );
      }

      return data;
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

  async getAnswers(assessmentId: string): Promise<AssessmentAnswer[]> {
    const { data, error } = await this.supabase
      .from('assessment_answers')
      .select()
      .eq('assessment_id', assessmentId)
      .is('deleted_at', null);

    if (error) throw error;
    return data;
  }

  async updateAnswer(
    assessmentId: string,
    questionId: string,
    update: Partial<Omit<AssessmentAnswer, 'id' | 'assessment_id' | 'question_id' | 'created_at' | 'updated_at'>>
  ): Promise<AssessmentAnswer> {
    const { data, error } = await this.supabase
      .from('assessment_answers')
      .update(update)
      .eq('assessment_id', assessmentId)
      .eq('question_id', questionId)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserAssessments(userId: string, status?: AssessmentStatus): Promise<Assessment[]> {
    let query = this.supabase
      .from('assessments')
      .select()
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
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
} 