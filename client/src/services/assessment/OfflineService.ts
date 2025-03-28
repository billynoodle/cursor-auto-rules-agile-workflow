import { SupabaseClient } from '@supabase/supabase-js';
import { Assessment, AssessmentAnswer, DatabaseSchema } from '../../types/database';
import { AssessmentError } from './AssessmentError';

export class OfflineService {
  private readonly STORAGE_KEY = 'assessment_offline_data';
  private supabase?: SupabaseClient<DatabaseSchema>;

  constructor(supabaseClient?: SupabaseClient<DatabaseSchema>) {
    this.supabase = supabaseClient;
    this.setupOfflineSync();
  }

  public setupOfflineSync(): void {
    window.addEventListener('online', async () => {
      await this.syncOfflineData();
    });
  }

  public storeOfflineData(key: string, data: unknown): void {
    const offlineData = this.getAllOfflineData();
    offlineData.push([key, data]);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(offlineData));
  }

  public getOfflineData(key: string): unknown | undefined {
    const offlineData = this.getAllOfflineData();
    const entry = offlineData.find(([k]) => k === key);
    return entry ? entry[1] : undefined;
  }

  public getAllOfflineData(): Array<[string, unknown]> {
    const offlineDataStr = localStorage.getItem(this.STORAGE_KEY);
    return offlineDataStr ? JSON.parse(offlineDataStr) : [];
  }

  public clearOfflineData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  public removeOfflineData(key: string): void {
    const offlineData = this.getAllOfflineData();
    const filteredData = offlineData.filter(([k]) => k !== key);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredData));
  }

  public async syncOfflineData(): Promise<void> {
    if (!this.supabase) {
      console.warn('Supabase client not provided. Skipping sync.');
      return;
    }

    const offlineData = this.getAllOfflineData();
    if (offlineData.length === 0) return;

    const syncPromises: Promise<void>[] = [];

    for (const [key, data] of offlineData) {
      if (key.startsWith('assessment_')) {
        const { id, ...assessmentData } = data as Assessment;
        syncPromises.push(this.syncAssessment(assessmentData));
      } else if (key.startsWith('answer_')) {
        const { id, ...answerData } = data as AssessmentAnswer;
        syncPromises.push(this.syncAnswer(answerData));
      }
    }

    try {
      await Promise.all(syncPromises);
      this.clearOfflineData();
    } catch (error) {
      throw new AssessmentError(
        'Failed to sync offline data',
        'SYNC_ERROR',
        error
      );
    }
  }

  private async syncAssessment(assessmentData: Omit<Assessment, 'id'>): Promise<void> {
    if (!this.supabase) {
      throw new AssessmentError(
        'Supabase client not provided',
        'SYNC_ERROR'
      );
    }

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
  }

  private async syncAnswer(answerData: Omit<AssessmentAnswer, 'id'>): Promise<void> {
    if (!this.supabase) {
      throw new AssessmentError(
        'Supabase client not provided',
        'SYNC_ERROR'
      );
    }

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
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }
} 