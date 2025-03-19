import { SupabaseClient } from '@supabase/supabase-js';
import { Assessment, AssessmentAnswer, AssessmentStatus, DatabaseSchema } from '../types/database';
import { z } from 'zod';

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

  private async syncOfflineData(): Promise<void> {
    const offlineDataStr = localStorage.getItem('assessment_offline_data');
    if (!offlineDataStr) return;

    const offlineDataArray = JSON.parse(offlineDataStr);
    const syncPromises: Promise<void>[] = [];

    for (const [key, data] of offlineDataArray) {
      if (key.startsWith('assessment_')) {
        const { id, ...assessmentData } = data as Assessment;
        syncPromises.push(
          (async () => {
            const { error } = await this.supabase
              .from('assessments')
              .insert(assessmentData)
              .select()
              .single();

            if (error) {
              throw new AssessmentError(
                error.message,
                error.code,
                error
              );
            }
          })()
        );
      } else if (key.startsWith('answer_')) {
        const { id, ...answerData } = data as AssessmentAnswer;
        syncPromises.push(
          (async () => {
            const { error } = await this.supabase
              .from('assessment_answers')
              .insert(answerData)
              .select()
              .single();

            if (error) {
              throw new AssessmentError(
                error.message,
                error.code,
                error
              );
            }
          })()
        );
      }
    }

    try {
      await Promise.all(syncPromises);
      // Clear offline data after successful sync
      localStorage.removeItem('assessment_offline_data');
    } catch (error) {
      throw new AssessmentError(
        'Failed to sync offline data',
        'SYNC_ERROR',
        error
      );
    }
  }

  // Add a method to check online status and trigger sync
  public async checkOnlineStatus(): Promise<void> {
    if (navigator.onLine) {
      await this.syncOfflineData();
    }
  }

  // Add event listeners for online/offline status
  public setupOfflineSync(): void {
    window.addEventListener('online', async () => {
      await this.syncOfflineData();
    });
  }

  private saveToOfflineStore(key: string, data: unknown) {
    const offlineDataStr = localStorage.getItem('assessment_offline_data');
    const offlineData = offlineDataStr ? JSON.parse(offlineDataStr) : [];
    offlineData.push([key, data]);
    localStorage.setItem('assessment_offline_data', JSON.stringify(offlineData));
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

      if (navigator.onLine) {
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
        this.saveToOfflineStore(offlineId, offlineAssessment);
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
      if (error instanceof AssessmentError) {
        throw error;
      }
      throw new AssessmentError(
        'Failed to create assessment',
        'CREATE_ERROR',
        error
      );
    }
  }

  public async getAssessment(id: string): Promise<Assessment> {
    if (navigator.onLine) {
      const { data, error } = await this.supabase
        .from('assessments')
        .select()
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        throw new AssessmentError(
          error.message,
          error.code,
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
      // Check offline store
      const offlineDataStr = localStorage.getItem('assessment_offline_data');
      if (!offlineDataStr) {
        throw new AssessmentError(
          'No offline data available',
          'OFFLINE_DATA_NOT_FOUND'
        );
      }

      const offlineData = JSON.parse(offlineDataStr);
      const assessment = offlineData.find(([key, _]: [string, unknown]) => key === `assessment_${id}`)?.[1] as Assessment | undefined;

      if (!assessment) {
        throw new AssessmentError(
          'Assessment not found in offline store',
          'NOT_FOUND'
        );
      }

      return assessment;
    }
  }

  async updateAssessment(id: string, update: Partial<Omit<Assessment, 'id' | 'created_at' | 'updated_at'>>): Promise<Assessment> {
    try {
      // Validate update data
      if (Object.keys(update).length > 0) {
        assessmentSchema.partial().parse(update);
      }

      if (!navigator.onLine) {
        const offlineDataStr = localStorage.getItem('assessment_offline_data');
        const offlineData = offlineDataStr ? JSON.parse(offlineDataStr) : [];
        const assessmentIndex = offlineData.findIndex(([key, _]: [string, any]) => key === `assessment_${id}`);
        
        if (assessmentIndex === -1) {
          throw new AssessmentError(
            'Assessment not found in offline store',
            'NOT_FOUND'
          );
        }

        const existingData = offlineData[assessmentIndex][1] as Assessment;
        const updatedAssessment = {
          ...existingData,
          ...update,
          updated_at: new Date().toISOString()
        };

        offlineData[assessmentIndex] = [`assessment_${id}`, updatedAssessment];
        localStorage.setItem('assessment_offline_data', JSON.stringify(offlineData));

        return updatedAssessment;
      }

      const { data, error } = await this.supabase
        .from('assessments')
        .update({
          ...update,
          updated_at: new Date().toISOString()
        })
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
      if (error instanceof AssessmentError) throw error;
      throw new AssessmentError('Failed to update assessment', 'UPDATE_ERROR', error);
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

      if (navigator.onLine) {
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
              'No answer data returned after save',
              'SAVE_ERROR'
            );
          }

          return result;
        } catch (dbError) {
          throw new AssessmentError(
            'Failed to save answer',
            'SAVE_ERROR',
            dbError
          );
        }
      } else {
        // Generate a temporary ID for offline storage
        const offlineId = `answer_${Date.now()}`;
        const offlineAnswer = {
          ...validatedData,
          id: offlineId
        };
        this.saveToOfflineStore(offlineId, offlineAnswer);
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
      if (error instanceof AssessmentError) {
        throw error;
      }
      throw new AssessmentError(
        'Failed to save answer',
        'SAVE_ERROR',
        error
      );
    }
  }

  public async getAnswers(assessmentId: string): Promise<AssessmentAnswer[]> {
    if (navigator.onLine) {
      const { data, error } = await this.supabase
        .from('assessment_answers')
        .select()
        .eq('assessment_id', assessmentId);

      if (error) {
        throw new AssessmentError(
          error.message,
          error.code,
          error
        );
      }

      return data || [];
    } else {
      // Check offline store
      const offlineDataStr = localStorage.getItem('assessment_offline_data');
      if (!offlineDataStr) {
        return [];
      }

      const offlineData = JSON.parse(offlineDataStr);
      const answers = offlineData
        .filter(([key, _]: [string, unknown]) => key.startsWith(`answer_${assessmentId}`))
        .map(([_, data]: [string, AssessmentAnswer]) => data);

      return answers;
    }
  }

  public async updateAnswer(id: string, update: Partial<Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'>>): Promise<AssessmentAnswer> {
    try {
      // Validate update data
      if (Object.keys(update).length > 0) {
        answerSchema.partial().parse(update);
      }

      const now = new Date().toISOString();
      const updateData = {
        ...update,
        updated_at: now
      };

      if (navigator.onLine) {
        try {
          const { data: result, error } = await this.supabase
            .from('assessment_answers')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

          if (error) {
            throw new AssessmentError(
              'Failed to update answer in database',
              'DB_ERROR',
              error
            );
          }

          if (!result) {
            throw new AssessmentError(
              'No answer data returned after update',
              'UPDATE_ERROR'
            );
          }

          return result;
        } catch (dbError) {
          throw new AssessmentError(
            'Failed to update answer',
            'UPDATE_ERROR',
            dbError
          );
        }
      } else {
        // Update in offline store
        const offlineDataStr = localStorage.getItem('assessment_offline_data');
        if (!offlineDataStr) {
          throw new AssessmentError(
            'No offline data available',
            'OFFLINE_DATA_NOT_FOUND'
          );
        }

        const offlineDataArray = JSON.parse(offlineDataStr);
        const offlineData = new Map(offlineDataArray);
        const answer = offlineData.get(`answer_${id}`);

        if (!answer) {
          throw new AssessmentError(
            'Answer not found in offline store',
            'NOT_FOUND'
          );
        }

        const updatedAnswer = {
          ...answer,
          ...updateData
        };

        this.saveToOfflineStore(`answer_${id}`, updatedAnswer);
        return updatedAnswer as AssessmentAnswer;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AssessmentError(
          'Invalid answer data',
          'VALIDATION_ERROR',
          error
        );
      }
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
} 