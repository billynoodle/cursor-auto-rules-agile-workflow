import { TooltipFeedback, UsabilityMetrics, isTooltipFeedback, isUsabilityMetrics } from '../types/tooltip.types';

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
  private feedbackHistory: TooltipFeedback[] = [];
  private feedbackAnalytics = {
    averageClarityRating: 0,
    totalFeedback: 0,
    feedbackByQuestion: new Map<string, TooltipFeedback[]>()
  };
  private metricsResults: { [questionId: string]: UsabilityMetrics[] } = {};
  
  /**
   * Submit feedback from a user testing session
   * @param feedback Feedback data from user
   */
  submitFeedback(feedback: TooltipFeedback): void {
    if (!isTooltipFeedback(feedback)) {
      throw new Error('Invalid feedback format');
    }
    this.feedbackHistory.push(feedback);
    this.updateAnalytics(feedback);
  }
  
  private updateAnalytics(feedback: TooltipFeedback): void {
    // Update total feedback count
    this.feedbackAnalytics.totalFeedback++;

    // Update average clarity rating
    const totalRatings = this.feedbackHistory.reduce((sum, item) => sum + item.clarityRating, 0);
    this.feedbackAnalytics.averageClarityRating = totalRatings / this.feedbackAnalytics.totalFeedback;

    // Update feedback by question
    const questionFeedback = this.feedbackAnalytics.feedbackByQuestion.get(feedback.questionId) || [];
    questionFeedback.push(feedback);
    this.feedbackAnalytics.feedbackByQuestion.set(feedback.questionId, questionFeedback);
  }
  
  /**
   * Submit usability metrics from a user testing session
   */
  submitMetrics(questionId: string, metrics: UsabilityMetrics): void {
    if (!isUsabilityMetrics(metrics)) {
      throw new Error('Invalid metrics format');
    }
    
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
  getFeedbackByQuestion(questionId: string): TooltipFeedback[] {
    return this.feedbackAnalytics.feedbackByQuestion.get(questionId) || [];
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
    const feedback = this.getFeedbackByQuestion(questionId);
    const metrics = this.getMetricsByQuestionId(questionId);
    
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
      if (item.difficultTerms) {
        item.difficultTerms.forEach(term => {
          if (!aggregated.commonDifficultTerms[term]) {
            aggregated.commonDifficultTerms[term] = 0;
          }
          aggregated.commonDifficultTerms[term]++;
        });
      }
    });
    
    return aggregated;
  }
  
  /**
   * Get all feedback results
   * @returns All feedback results
   */
  getFeedbackHistory(): TooltipFeedback[] {
    return [...this.feedbackHistory];
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
      feedback: this.feedbackHistory,
      metrics: this.metricsResults,
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
  }
  
  /**
   * Clear all testing data
   */
  clearTestingData(): void {
    this.feedbackHistory = [];
    this.metricsResults = {};
    this.feedbackAnalytics = {
      averageClarityRating: 0,
      totalFeedback: 0,
      feedbackByQuestion: new Map<string, TooltipFeedback[]>()
    };
  }

  getAverageClarityRating(): number {
    return this.feedbackAnalytics.averageClarityRating;
  }

  getTotalFeedbackCount(): number {
    return this.feedbackAnalytics.totalFeedback;
  }
}

// Create and export singleton instance
const tooltipUserTestingService = new TooltipUserTestingService();
export default tooltipUserTestingService; 