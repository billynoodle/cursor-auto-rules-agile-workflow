export interface OfflineService {
  isOnline: boolean;
  storeOfflineData(key: string, data: unknown): void;
  getOfflineData<T>(key: string): T | null;
  checkConnection(): Promise<boolean>;
  clearOfflineData(): void;
  syncOfflineData(): Promise<void>;
} 