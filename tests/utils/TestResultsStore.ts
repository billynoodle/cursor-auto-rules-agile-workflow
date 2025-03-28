/**
 * Test Results Store
 * 
 * This utility handles persistent storage of test results.
 * It supports storing and retrieving test outcomes in a consistent format
 * to enable tracking of test metrics over time.
 */

import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';

/**
 * Interface for test result metadata
 */
export interface TestResultMetadata {
  testId: string;
  timestamp: string;
  testName: string;
  testType: 'unit' | 'integration' | 'e2e';
  status: 'passed' | 'failed' | 'skipped';
  duration?: number;
}

/**
 * TestResultsStore class for managing test results persistence
 */
export class TestResultsStore {
  private baseDir: string;
  private metricsDir: string;
  private testType: string;
  
  /**
   * Create a new test results store
   * 
   * @param testType Type of test (unit, integration, tooltip, etc.)
   */
  constructor(testType: string) {
    this.testType = testType;
    const resultsDir = path.join(process.cwd(), 'tests', 'results');
    this.baseDir = path.join(resultsDir, 'junit', testType);
    this.metricsDir = path.join(resultsDir, 'metrics', 'raw');
    
    // Ensure directories exist
    [this.baseDir, this.metricsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
  
  /**
   * Save a test result to storage
   * 
   * @param id Unique identifier for the test result
   * @param data Test result data to store
   */
  saveResult(id: string, data: any): void {
    const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
    const filename = `${this.testType}-${id}-${timestamp}.json`;
    const metricsFilename = `metrics-${timestamp}.json`;
    const filePath = path.join(this.baseDir, filename);

    // Save detailed test results
    fs.writeFileSync(
      filePath,
      JSON.stringify({ data, timestamp }, null, 2)
    );

    // Update index
    this.updateIndex(id, timestamp, filePath);

    // Save metrics
    const metrics = this.extractMetrics(data);
    fs.writeFileSync(
      path.join(this.metricsDir, metricsFilename),
      JSON.stringify(metrics, null, 2)
    );
  }
  
  /**
   * Retrieve the most recent test result
   * 
   * @param id Unique identifier for the test result
   * @returns Promise resolving to the test result data
   */
  async getResult(id: string): Promise<any> {
    try {
      const indexPath = path.join(this.baseDir, 'index.json');
      
      // Check if index exists
      if (!fs.existsSync(indexPath)) {
        return null;
      }
      
      // Read index
      const indexContent = await fs.promises.readFile(indexPath, 'utf8');
      const index = JSON.parse(indexContent);
      
      // Find the most recent result for this ID
      const testEntries = index.tests.filter((entry: any) => entry.id === id);
      
      if (testEntries.length === 0) {
        return null;
      }
      
      // Sort by timestamp (descending) and get the most recent
      testEntries.sort((a: any, b: any) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      const mostRecent = testEntries[0];
      
      // Read the actual result file
      const resultContent = await fs.promises.readFile(mostRecent.path, 'utf8');
      const result = JSON.parse(resultContent);
      
      return result.data;
    } catch (error) {
      console.error(`Failed to retrieve test result: ${error}`);
      return null;
    }
  }
  
  /**
   * Get historical results for trend analysis
   * 
   * @param id Unique identifier for the test result
   * @param limit Maximum number of historical results to retrieve
   * @returns Promise resolving to an array of historical test results
   */
  async getHistoricalResults(id: string, limit: number = 10): Promise<any[]> {
    try {
      const indexPath = path.join(this.baseDir, 'index.json');
      
      // Check if index exists
      if (!fs.existsSync(indexPath)) {
        return [];
      }
      
      // Read index
      const indexContent = await fs.promises.readFile(indexPath, 'utf8');
      const index = JSON.parse(indexContent);
      
      // Find results for this ID
      const testEntries = index.tests.filter((entry: any) => entry.id === id);
      
      if (testEntries.length === 0) {
        return [];
      }
      
      // Sort by timestamp (descending)
      testEntries.sort((a: any, b: any) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      // Get the most recent N results
      const recentEntries = testEntries.slice(0, limit);
      
      // Read each result file
      const results = await Promise.all(
        recentEntries.map(async (entry: any) => {
          const resultContent = await fs.promises.readFile(entry.path, 'utf8');
          const result = JSON.parse(resultContent);
          return {
            timestamp: entry.timestamp,
            ...result.data
          };
        })
      );
      
      return results;
    } catch (error) {
      console.error(`Failed to retrieve historical results: ${error}`);
      return [];
    }
  }
  
  /**
   * Update the index file with a new test result
   * 
   * @param id Unique identifier for the test result
   * @param timestamp Timestamp of the test run
   * @param filePath Path to the result file
   * @returns Promise resolving to true if successful
   */
  private async updateIndex(id: string, timestamp: string, filePath: string): Promise<boolean> {
    try {
      const indexPath = path.join(this.baseDir, 'index.json');
      let index: { tests: any[] } = { tests: [] };
      
      // Read existing index if it exists
      if (fs.existsSync(indexPath)) {
        const indexContent = await fs.promises.readFile(indexPath, 'utf8');
        index = JSON.parse(indexContent);
      }
      
      // Add new entry
      index.tests.push({
        id,
        timestamp: new Date().toISOString(),
        path: filePath
      });
      
      // Write updated index
      await fs.promises.writeFile(
        indexPath,
        JSON.stringify(index, null, 2),
        'utf8'
      );
      
      return true;
    } catch (error) {
      console.error(`Failed to update index: ${error}`);
      return false;
    }
  }

  /**
   * Extract metrics from test result data
   * 
   * @param data Test result data
   * @returns Metrics object with test statistics
   */
  private extractMetrics(data: any): any {
    return {
      timestamp: new Date().toISOString(),
      testSuite: this.testType,
      status: 'completed',
      results: {
        numTotalTests: data.numTotalTests || 0,
        numPassedTests: data.numPassedTests || 0,
        numFailedTests: data.numFailedTests || 0,
        numPendingTests: data.numPendingTests || 0,
        startTime: data.startTime || new Date().toISOString(),
        endTime: new Date().toISOString()
      },
      coverage: data.coverage || null
    };
  }
} 