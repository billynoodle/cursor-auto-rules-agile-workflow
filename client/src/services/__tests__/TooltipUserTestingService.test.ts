import tooltipUserTestingService, { AggregatedMetrics } from '../TooltipUserTestingService';
import { TooltipFeedback } from '../../types/assessment.types';
import { UsabilityMetrics } from '../../components/tooltips/TooltipUserTesting';

describe('TooltipUserTestingService', () => {
  // Clear all data before each test
  beforeEach(() => {
    tooltipUserTestingService.clearTestingData();
  });
  
  describe('submitFeedback', () => {
    test('should store feedback and return an ID', () => {
      const mockFeedback: TooltipFeedback = {
        questionId: 'q123',
        clarityRating: 4,
        feedbackText: 'Clear and helpful',
        difficultTerms: ['biomechanics']
      };
      
      const feedbackId = tooltipUserTestingService.submitFeedback(mockFeedback);
      
      // ID should be a non-empty string
      expect(feedbackId).toBeTruthy();
      expect(typeof feedbackId).toBe('string');
      
      // Feedback should be stored
      const allFeedback = tooltipUserTestingService.getAllFeedback();
      expect(allFeedback.length).toBe(1);
      expect(allFeedback[0].questionId).toBe('q123');
      expect(allFeedback[0].clarityRating).toBe(4);
    });
    
    test('should handle multiple feedback submissions', () => {
      const feedback1: TooltipFeedback = {
        questionId: 'q123',
        clarityRating: 4,
        feedbackText: 'Clear and helpful',
        difficultTerms: ['biomechanics']
      };
      
      const feedback2: TooltipFeedback = {
        questionId: 'q456',
        clarityRating: 2,
        feedbackText: 'Confusing terminology',
        difficultTerms: ['proprioception', 'myofascial']
      };
      
      tooltipUserTestingService.submitFeedback(feedback1);
      tooltipUserTestingService.submitFeedback(feedback2);
      
      const allFeedback = tooltipUserTestingService.getAllFeedback();
      expect(allFeedback.length).toBe(2);
    });
  });
  
  describe('submitMetrics', () => {
    test('should store metrics for a question', () => {
      const mockMetrics: UsabilityMetrics = {
        timeToUnderstand: 15,
        clicksToComplete: 3,
        userSatisfaction: 4
      };
      
      tooltipUserTestingService.submitMetrics('q123', mockMetrics);
      
      const allMetrics = tooltipUserTestingService.getAllMetrics();
      expect(allMetrics['q123'].length).toBe(1);
      expect(allMetrics['q123'][0].timeToUnderstand).toBe(15);
    });
    
    test('should store multiple metrics for the same question', () => {
      const metrics1: UsabilityMetrics = {
        timeToUnderstand: 15,
        clicksToComplete: 3,
        userSatisfaction: 4
      };
      
      const metrics2: UsabilityMetrics = {
        timeToUnderstand: 8,
        clicksToComplete: 2,
        userSatisfaction: 5
      };
      
      tooltipUserTestingService.submitMetrics('q123', metrics1);
      tooltipUserTestingService.submitMetrics('q123', metrics2);
      
      const questionMetrics = tooltipUserTestingService.getMetricsByQuestionId('q123');
      expect(questionMetrics.length).toBe(2);
    });
  });
  
  describe('getFeedbackByQuestionId', () => {
    test('should return feedback for a specific question', () => {
      const feedback1: TooltipFeedback = {
        questionId: 'q123',
        clarityRating: 4,
        feedbackText: 'Clear and helpful',
        difficultTerms: ['biomechanics']
      };
      
      const feedback2: TooltipFeedback = {
        questionId: 'q123',
        clarityRating: 3,
        feedbackText: 'Mostly clear',
        difficultTerms: ['proprioception']
      };
      
      const feedback3: TooltipFeedback = {
        questionId: 'q456',
        clarityRating: 2,
        feedbackText: 'Confusing',
        difficultTerms: ['myofascial']
      };
      
      tooltipUserTestingService.submitFeedback(feedback1);
      tooltipUserTestingService.submitFeedback(feedback2);
      tooltipUserTestingService.submitFeedback(feedback3);
      
      const q123Feedback = tooltipUserTestingService.getFeedbackByQuestionId('q123');
      expect(q123Feedback.length).toBe(2);
      
      const q456Feedback = tooltipUserTestingService.getFeedbackByQuestionId('q456');
      expect(q456Feedback.length).toBe(1);
      
      const nonExistentFeedback = tooltipUserTestingService.getFeedbackByQuestionId('nonexistent');
      expect(nonExistentFeedback.length).toBe(0);
    });
  });
  
  describe('getMetricsByQuestionId', () => {
    test('should return metrics for a specific question', () => {
      const metrics1: UsabilityMetrics = {
        timeToUnderstand: 15,
        clicksToComplete: 3,
        userSatisfaction: 4
      };
      
      const metrics2: UsabilityMetrics = {
        timeToUnderstand: 20,
        clicksToComplete: 5,
        userSatisfaction: 2
      };
      
      tooltipUserTestingService.submitMetrics('q123', metrics1);
      tooltipUserTestingService.submitMetrics('q456', metrics2);
      
      const q123Metrics = tooltipUserTestingService.getMetricsByQuestionId('q123');
      expect(q123Metrics.length).toBe(1);
      expect(q123Metrics[0].timeToUnderstand).toBe(15);
      
      const nonExistentMetrics = tooltipUserTestingService.getMetricsByQuestionId('nonexistent');
      expect(nonExistentMetrics.length).toBe(0);
    });
  });
  
  describe('getAggregatedMetrics', () => {
    test('should calculate correct aggregated metrics', () => {
      // Add feedback for q123
      tooltipUserTestingService.submitFeedback({
        questionId: 'q123',
        clarityRating: 4,
        feedbackText: 'Clear',
        difficultTerms: ['biomechanics', 'proprioception']
      });
      
      tooltipUserTestingService.submitFeedback({
        questionId: 'q123',
        clarityRating: 2,
        feedbackText: 'Somewhat confusing',
        difficultTerms: ['biomechanics', 'myofascial']
      });
      
      // Add metrics for q123
      tooltipUserTestingService.submitMetrics('q123', {
        timeToUnderstand: 10,
        clicksToComplete: 2,
        userSatisfaction: 4
      });
      
      tooltipUserTestingService.submitMetrics('q123', {
        timeToUnderstand: 20,
        clicksToComplete: 4,
        userSatisfaction: 2
      });
      
      const aggregated = tooltipUserTestingService.getAggregatedMetrics('q123');
      
      // Check averages
      expect(aggregated.averageClarity).toBe(3); // (4+2)/2
      expect(aggregated.averageTimeToUnderstand).toBe(15); // (10+20)/2
      expect(aggregated.averageClicksToComplete).toBe(3); // (2+4)/2
      expect(aggregated.totalFeedbackCount).toBe(2);
      
      // Check difficult terms counting
      expect(aggregated.commonDifficultTerms['biomechanics']).toBe(2);
      expect(aggregated.commonDifficultTerms['proprioception']).toBe(1);
      expect(aggregated.commonDifficultTerms['myofascial']).toBe(1);
    });
    
    test('should handle empty data', () => {
      const aggregated = tooltipUserTestingService.getAggregatedMetrics('nonexistent');
      
      expect(aggregated.averageClarity).toBe(0);
      expect(aggregated.averageTimeToUnderstand).toBe(0);
      expect(aggregated.averageClicksToComplete).toBe(0);
      expect(aggregated.totalFeedbackCount).toBe(0);
      expect(Object.keys(aggregated.commonDifficultTerms).length).toBe(0);
    });
  });
  
  describe('exportTestingData', () => {
    test('should export data as JSON string', () => {
      tooltipUserTestingService.submitFeedback({
        questionId: 'q123',
        clarityRating: 4,
        feedbackText: 'Clear',
        difficultTerms: ['biomechanics']
      });
      
      tooltipUserTestingService.submitMetrics('q123', {
        timeToUnderstand: 10,
        clicksToComplete: 2,
        userSatisfaction: 4
      });
      
      const exportedData = tooltipUserTestingService.exportTestingData();
      expect(typeof exportedData).toBe('string');
      
      // Should be valid JSON
      const parsedData = JSON.parse(exportedData);
      expect(parsedData.feedback.length).toBe(1);
      expect(parsedData.metrics.q123.length).toBe(1);
      expect(parsedData.exportDate).toBeTruthy();
    });
  });
  
  describe('clearTestingData', () => {
    test('should clear all stored data', () => {
      tooltipUserTestingService.submitFeedback({
        questionId: 'q123',
        clarityRating: 4,
        feedbackText: 'Clear',
        difficultTerms: ['biomechanics']
      });
      
      tooltipUserTestingService.submitMetrics('q123', {
        timeToUnderstand: 10,
        clicksToComplete: 2,
        userSatisfaction: 4
      });
      
      // Verify data exists
      expect(tooltipUserTestingService.getAllFeedback().length).toBe(1);
      expect(Object.keys(tooltipUserTestingService.getAllMetrics()).length).toBe(1);
      
      // Clear data
      tooltipUserTestingService.clearTestingData();
      
      // Verify data is cleared
      expect(tooltipUserTestingService.getAllFeedback().length).toBe(0);
      expect(Object.keys(tooltipUserTestingService.getAllMetrics()).length).toBe(0);
    });
  });
}); 