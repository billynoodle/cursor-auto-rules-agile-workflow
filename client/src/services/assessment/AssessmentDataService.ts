import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '../../types/database';
import { AssessmentError } from './AssessmentError';
import { Assessment, validateAssessment } from './AssessmentValidation';
import { OfflineService } from './OfflineService';

/**
 * Service for managing assessment data.
 * Handles creating, updating, and retrieving assessments, with offline support.
 */
export class AssessmentDataService {
  private readonly tableName = 'assessments';

  constructor(
    private readonly supabase: SupabaseClient<DatabaseSchema>,
    private readonly offlineService: OfflineService
  ) {}

  /**
   * Creates a new assessment.
   * @param assessment The assessment data to create
   * @returns The created assessment
   * @throws {AssessmentError} If validation fails or database error occurs
   */
  async createAssessment(assessment: Partial<Assessment>): Promise<Assessment> {
    validateAssessment(assessment);

    if (this.offlineService.isOnline) {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(assessment)
        .single();

      if (error) {
        throw new AssessmentError('Failed to create assessment', 'DB_ERROR', error);
      }

      if (!data) {
        throw new AssessmentError('No data returned after creating assessment', 'DB_ERROR');
      }

      return data;
    } else {
      const offlineKey = `assessment_${Date.now()}`;
      await this.offlineService.storeOfflineData(offlineKey, assessment);
      return assessment as Assessment;
    }
  }

  /**
   * Retrieves an assessment by ID.
   * @param id The assessment ID
   * @returns The assessment data
   * @throws {AssessmentError} If database error occurs
   */
  async getAssessment(id: string): Promise<Assessment> {
    if (this.offlineService.isOnline) {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select()
        .eq('id', id)
        .single();

      if (error) {
        throw new AssessmentError('Failed to get assessment', 'DB_ERROR', error);
      }

      if (!data) {
        throw new AssessmentError('Assessment not found', 'NOT_FOUND');
      }

      return data;
    } else {
      const offlineData = await this.offlineService.getOfflineData(`assessment_${id}`);
      if (!offlineData) {
        throw new AssessmentError('Assessment not found in offline storage', 'NOT_FOUND');
      }
      return offlineData as Assessment;
    }
  }

  /**
   * Updates an existing assessment.
   * @param id The assessment ID
   * @param updateData The data to update
   * @returns The updated assessment
   * @throws {AssessmentError} If validation fails or database error occurs
   */
  async updateAssessment(id: string, updateData: Partial<Assessment>): Promise<Assessment> {
    validateAssessment({ ...await this.getAssessment(id), ...updateData });

    if (this.offlineService.isOnline) {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .single();

      if (error) {
        throw new AssessmentError('Failed to update assessment', 'DB_ERROR', error);
      }

      if (!data) {
        throw new AssessmentError('No data returned after updating assessment', 'DB_ERROR');
      }

      return data;
    } else {
      const existingData = await this.offlineService.getOfflineData(`assessment_${id}`);
      if (!existingData) {
        throw new AssessmentError('Assessment not found in offline storage', 'NOT_FOUND');
      }

      const updatedData = { ...existingData, ...updateData };
      await this.offlineService.storeOfflineData(`assessment_${id}`, updatedData);
      return updatedData as Assessment;
    }
  }
} 