import { TooltipFeedback } from '../types/assessment.types';
import { UsabilityMetrics } from '../components/tooltips/TooltipUserTesting';

/**
 * Interface for aggregated tooltip testing metrics
 */
export interface AggregatedMetrics {
  averageClarity: number;
  averageTimeToUnderstand: number;
  averageClicksToComplete: number;
  totalFeedbackCount: number;
  commonDifficultTerms: { [term: string]: number };
}

/**
 * Service for managing tooltip user testing feedback and metrics
 */
class TooltipUserTestingService {
  private feedbackResults: TooltipFeedback[] = [];
  private metricsResults: { [questionId: string]: UsabilityMetrics[] } = {};
  
  /**
   * Submit feedback from a user testing session
   * @param feedback Feedback data from user
   * @returns The ID of the submitted feedback
   */
  submitFeedback(feedback: TooltipFeedback): string {
    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store feedback with generated ID
    this.feedbackResults.push({
      ...feedback,
      id: feedbackId
    } as TooltipFeedback & { id: string });
    
    return feedbackId;
  }
  
  /**
   * Submit usability metrics from a user testing session
   * @param questionId The question ID associated with the metrics
   * @param metrics The usability metrics collected
   */
  submitMetrics(questionId: string, metrics: UsabilityMetrics): void {
    if (!this.metricsResults[questionId]) {
      this.metricsResults[questionId] = [];
    }
    
    this.metricsResults[questionId].push(metrics);
  }
  
  /**
   * Get all feedback for a specific question
   * @param questionId The question ID to filter by
   * @returns Array of feedback for the specified question
   */
  getFeedbackByQuestionId(questionId: string): TooltipFeedback[] {
    return this.feedbackResults.filter(feedback => feedback.questionId === questionId);
  }
  
  /**
   * Get all metrics for a specific question
   * @param questionId The question ID to filter by
   * @returns Array of metrics for the specified question
   */
  getMetricsByQuestionId(questionId: string): UsabilityMetrics[] {
    return this.metricsResults[questionId] || [];
  }
  
  /**
   * Get aggregated metrics for a specific question
   * @param questionId The question ID to aggregate metrics for
   * @returns Aggregated metrics for the specified question
   */
  getAggregatedMetrics(questionId: string): AggregatedMetrics {
    const feedback = this.getFeedbackByQuestionId(questionId);
    const metrics = this.getMetricsByQuestionId(questionId);
    
    // Initialize aggregated metrics
    const aggregated: AggregatedMetrics = {
      averageClarity: 0,
      averageTimeToUnderstand: 0,
      averageClicksToComplete: 0,
      totalFeedbackCount: feedback.length,
      commonDifficultTerms: {}
    };
    
    // Calculate averages
    if (feedback.length > 0) {
      aggregated.averageClarity = feedback.reduce((sum, item) => sum + item.clarityRating, 0) / feedback.length;
    }
    
    if (metrics.length > 0) {
      aggregated.averageTimeToUnderstand = metrics.reduce((sum, item) => sum + item.timeToUnderstand, 0) / metrics.length;
      aggregated.averageClicksToComplete = metrics.reduce((sum, item) => sum + item.clicksToComplete, 0) / metrics.length;
    }
    
    // Count difficult terms
    feedback.forEach(item => {
      item.difficultTerms.forEach(term => {
        if (!aggregated.commonDifficultTerms[term]) {
          aggregated.commonDifficultTerms[term] = 0;
        }
        aggregated.commonDifficultTerms[term]++;
      });
    });
    
    return aggregated;
  }
  
  /**
   * Get all feedback results
   * @returns All feedback results
   */
  getAllFeedback(): TooltipFeedback[] {
    return [...this.feedbackResults];
  }
  
  /**
   * Get all metrics results
   * @returns All metrics results
   */
  getAllMetrics(): { [questionId: string]: UsabilityMetrics[] } {
    return {...this.metricsResults};
  }
  
  /**
   * Export testing data as JSON
   * @returns JSON string of all testing data
   */
  exportTestingData(): string {
    const exportData = {
      feedback: this.feedbackResults,
      metrics: this.metricsResults,
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
  }
  
  /**
   * Clear all testing data
   */
  clearTestingData(): void {
    this.feedbackResults = [];
    this.metricsResults = {};
  }
}

// Create and export singleton instance
const tooltipUserTestingService = new TooltipUserTestingService();
export default tooltipUserTestingService; 