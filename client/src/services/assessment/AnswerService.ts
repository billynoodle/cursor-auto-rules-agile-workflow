import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '../../types/database';
import { AssessmentError } from './AssessmentError';
import { AssessmentAnswer, validateAnswer } from './AssessmentValidation';
import { OfflineService } from './OfflineService';

/**
 * Service for managing assessment answers.
 * Handles saving, updating, and retrieving answers, with offline support.
 */
export class AnswerService {
  private readonly tableName = 'answers';

  constructor(
    private readonly supabase: SupabaseClient<DatabaseSchema>,
    private readonly offlineService: OfflineService
  ) {}

  /**
   * Saves a new answer
   * @param answer The answer data to save
   * @returns The saved answer
   * @throws {AssessmentError} If validation fails or database error occurs
   */
  async saveAnswer(answer: Partial<AssessmentAnswer>): Promise<AssessmentAnswer> {
    validateAnswer(answer);

    if (this.offlineService.isOnline) {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(answer)
        .single();

      if (error) {
        throw new AssessmentError('Failed to save answer', 'DB_ERROR', error);
      }

      if (!data) {
        throw new AssessmentError('No data returned after saving answer', 'DB_ERROR');
      }

      return data;
    } else {
      const offlineKey = `answer_${Date.now()}`;
      await this.offlineService.storeOfflineData(offlineKey, answer);
      return answer as AssessmentAnswer;
    }
  }

  /**
   * Updates an existing answer
   * @param id The answer ID
   * @param updateData The data to update
   * @returns The updated answer
   * @throws {AssessmentError} If validation fails or database error occurs
   */
  async updateAnswer(id: string, updateData: Partial<AssessmentAnswer>): Promise<AssessmentAnswer> {
    if (this.offlineService.isOnline) {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .single();

      if (error) {
        throw new AssessmentError('Failed to update answer', 'DB_ERROR', error);
      }

      if (!data) {
        throw new AssessmentError('No data returned after updating answer', 'DB_ERROR');
      }

      return data;
    } else {
      const existingData = await this.offlineService.getOfflineData(`answer_${id}`);
      if (!existingData) {
        throw new AssessmentError('Answer not found in offline storage', 'NOT_FOUND');
      }

      const updatedData = { ...existingData, ...updateData };
      await this.offlineService.storeOfflineData(`answer_${id}`, updatedData);
      return updatedData as AssessmentAnswer;
    }
  }
} 