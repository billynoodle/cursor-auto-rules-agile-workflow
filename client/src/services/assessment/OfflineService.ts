const STORAGE_KEY = 'assessment_offline_data';

type OfflineDataEntry = [string, unknown];
type OfflineData = OfflineDataEntry[];

/**
 * Service for managing offline data storage.
 * Handles storing and retrieving data from localStorage.
 */
export class OfflineService {
  private _isOnline: boolean = true;

  get isOnline(): boolean {
    return this._isOnline;
  }

  set isOnline(value: boolean) {
    this._isOnline = value;
  }

  /**
   * Stores data in localStorage with the given key.
   * @param key The key to store the data under
   * @param data The data to store
   */
  storeOfflineData(key: string, data: unknown): void {
    const existingData = this.getAllOfflineData();
    const newData = [...existingData.filter(([k]) => k !== key), [key, data]];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }

  /**
   * Retrieves data from localStorage by key.
   * @param key The key to retrieve data for
   * @returns The stored data, or undefined if not found
   */
  getOfflineData(key: string): unknown | undefined {
    const allData = this.getAllOfflineData();
    const entry = allData.find(([k]) => k === key);
    return entry ? entry[1] : undefined;
  }

  /**
   * Retrieves all stored offline data.
   * @returns Array of [key, data] pairs
   */
  getAllOfflineData(): OfflineData {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Removes all stored offline data.
   */
  clearOfflineData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Removes data for a specific key.
   * @param key The key to remove data for
   */
  removeOfflineData(key: string): void {
    const existingData = this.getAllOfflineData();
    const newData = existingData.filter(([k]) => k !== key);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }
} 