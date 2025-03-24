import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '../../types/database';
import { AssessmentDataService } from './AssessmentDataService';
import { AnswerService } from './AnswerService';
import { OfflineService } from './OfflineService';
import { Assessment, AssessmentAnswer } from './AssessmentValidation';

/**
 * Main service for managing assessments.
 * Orchestrates the data service and answer service.
 */
export class AssessmentService {
  private readonly dataService: AssessmentDataService;
  private readonly answerService: AnswerService;
  private readonly offlineService: OfflineService;

  constructor(supabase: SupabaseClient<DatabaseSchema>) {
    this.offlineService = new OfflineService();
    this.dataService = new AssessmentDataService(supabase, this.offlineService);
    this.answerService = new AnswerService(supabase, this.offlineService);

    this.initializeOfflineSupport();
  }

  /**
   * Creates a new assessment
   * @param assessment The assessment data to create
   * @returns The created assessment
   */
  async createAssessment(assessment: Partial<Assessment>): Promise<Assessment> {
    return this.dataService.createAssessment(assessment);
  }

  /**
   * Retrieves an assessment by ID
   * @param id The assessment ID
   * @returns The assessment data
   */
  async getAssessment(id: string): Promise<Assessment> {
    return this.dataService.getAssessment(id);
  }

  /**
   * Updates an existing assessment
   * @param id The assessment ID
   * @param updateData The data to update
   * @returns The updated assessment
   */
  async updateAssessment(id: string, updateData: Partial<Assessment>): Promise<Assessment> {
    return this.dataService.updateAssessment(id, updateData);
  }

  /**
   * Saves a new answer
   * @param answer The answer data to save
   * @returns The saved answer
   */
  async saveAnswer(answer: Partial<AssessmentAnswer>): Promise<AssessmentAnswer> {
    return this.answerService.saveAnswer(answer);
  }

  /**
   * Updates an existing answer
   * @param id The answer ID
   * @param updateData The data to update
   * @returns The updated answer
   */
  async updateAnswer(id: string, updateData: Partial<AssessmentAnswer>): Promise<AssessmentAnswer> {
    return this.answerService.updateAnswer(id, updateData);
  }

  /**
   * Initializes offline support by setting up event listeners
   */
  private initializeOfflineSupport(): void {
    window.addEventListener('online', () => this.handleOnline());
  }

  /**
   * Handles online event by syncing offline data
   */
  private async handleOnline(): Promise<void> {
    try {
      const offlineData = this.offlineService.getAllOfflineData();
      for (const [key, data] of Object.entries(offlineData)) {
        if (key.startsWith('assessment_')) {
          await this.dataService.createAssessment(data as Partial<Assessment>);
        } else if (key.startsWith('answer_')) {
          await this.answerService.saveAnswer(data as Partial<AssessmentAnswer>);
        }
        this.offlineService.removeOfflineData(key);
      }
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }
} 