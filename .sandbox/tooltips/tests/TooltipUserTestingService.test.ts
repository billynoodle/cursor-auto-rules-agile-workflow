import tooltipUserTestingService, { AggregatedMetrics } from '@client/services/TooltipUserTestingService';
import { UsabilityMetrics } from '@client/components/tooltips/TooltipUserTesting';

describe('TooltipUserTestingService', () => {
  beforeEach(() => {
    tooltipUserTestingService.clearTestingData();
  });

  describe('feedback management', () => {
    it('should store and retrieve feedback', () => {
      const feedback = {
        questionId: 'q1',
        clarityRating: 5,
        feedback: 'Make it clearer',
        timestamp: new Date().toISOString(),
        difficultTerms: ['term1', 'term2']
      };

      tooltipUserTestingService.submitFeedback(feedback);
      
      const allFeedback = tooltipUserTestingService.getFeedbackHistory();
      expect(allFeedback).toHaveLength(1);
      expect(allFeedback[0]).toMatchObject(feedback);
    });

    it('should store multiple feedback entries', () => {
      const feedback1 = {
        questionId: 'q1',
        clarityRating: 5,
        feedback: 'First feedback',
        timestamp: new Date().toISOString(),
        difficultTerms: ['term1']
      };

      const feedback2 = {
        questionId: 'q2',
        clarityRating: 3,
        feedback: 'Second feedback',
        timestamp: new Date().toISOString(),
        difficultTerms: ['term2']
      };

      tooltipUserTestingService.submitFeedback(feedback1);
      tooltipUserTestingService.submitFeedback(feedback2);
      
      const allFeedback = tooltipUserTestingService.getFeedbackHistory();
      expect(allFeedback).toHaveLength(2);
    });
  });

  describe('metrics management', () => {
    it('should store and retrieve metrics', () => {
      const metrics: UsabilityMetrics = {
        timeToUnderstand: 5,
        clicksToComplete: 3,
        userSatisfaction: 4
      };

      tooltipUserTestingService.submitMetrics('q1', metrics);
      
      const allMetrics = tooltipUserTestingService.getAllMetrics();
      expect(allMetrics['q1']).toHaveLength(1);
      expect(allMetrics['q1'][0]).toEqual(metrics);
    });

    it('should store multiple metrics for the same question', () => {
      const metrics1: UsabilityMetrics = {
        timeToUnderstand: 5,
        clicksToComplete: 2,
        userSatisfaction: 4
      };

      const metrics2: UsabilityMetrics = {
        timeToUnderstand: 10,
        clicksToComplete: 4,
        userSatisfaction: 3
      };

      tooltipUserTestingService.submitMetrics('q1', metrics1);
      tooltipUserTestingService.submitMetrics('q1', metrics2);
      
      const allMetrics = tooltipUserTestingService.getAllMetrics();
      expect(allMetrics['q1']).toHaveLength(2);
    });
  });

  describe('aggregated metrics', () => {
    it('should calculate correct aggregated metrics', () => {
      // Add some test metrics
      tooltipUserTestingService.submitMetrics('q1', {
        timeToUnderstand: 5,
        clicksToComplete: 2,
        userSatisfaction: 4
      });
      
      tooltipUserTestingService.submitMetrics('q1', {
        timeToUnderstand: 10,
        clicksToComplete: 4,
        userSatisfaction: 3
      });

      tooltipUserTestingService.submitFeedback({
        questionId: 'q1',
        clarityRating: 4,
        feedback: 'Good',
        timestamp: new Date().toISOString(),
        difficultTerms: ['term1']
      });

      tooltipUserTestingService.submitFeedback({
        questionId: 'q1',
        clarityRating: 5,
        feedback: 'Clear',
        timestamp: new Date().toISOString(),
        difficultTerms: ['term1', 'term2']
      });

      const aggregated = tooltipUserTestingService.getAggregatedMetrics('q1');
      
      expect(aggregated.averageTimeToUnderstand).toBe(7.5);
      expect(aggregated.averageClicksToComplete).toBe(3);
      expect(aggregated.averageClarity).toBe(4.5);
      expect(aggregated.totalFeedbackCount).toBe(2);
      expect(aggregated.commonDifficultTerms).toEqual({
        term1: 2,
        term2: 1
      });
    });

    it('should handle empty data correctly', () => {
      const aggregated = tooltipUserTestingService.getAggregatedMetrics('q1');
      
      expect(aggregated.averageTimeToUnderstand).toBe(0);
      expect(aggregated.averageClicksToComplete).toBe(0);
      expect(aggregated.averageClarity).toBe(0);
      expect(aggregated.totalFeedbackCount).toBe(0);
      expect(Object.keys(aggregated.commonDifficultTerms).length).toBe(0);
    });
  });

  describe('data management', () => {
    it('should clear all testing data', () => {
      // Add some test data
      tooltipUserTestingService.submitFeedback({
        questionId: 'q1',
        clarityRating: 4,
        feedback: 'Test',
        timestamp: new Date().toISOString(),
        difficultTerms: []
      });

      tooltipUserTestingService.submitMetrics('q1', {
        timeToUnderstand: 5,
        clicksToComplete: 3,
        userSatisfaction: 4
      });

      expect(tooltipUserTestingService.getFeedbackHistory().length).toBe(1);
      expect(Object.keys(tooltipUserTestingService.getAllMetrics()).length).toBe(1);

      tooltipUserTestingService.clearTestingData();

      expect(tooltipUserTestingService.getFeedbackHistory().length).toBe(0);
      expect(Object.keys(tooltipUserTestingService.getAllMetrics()).length).toBe(0);
    });

    it('should export testing data correctly', () => {
      const feedback = {
        questionId: 'q1',
        clarityRating: 4,
        feedback: 'Test feedback',
        timestamp: new Date().toISOString(),
        difficultTerms: ['term1']
      };

      const metrics: UsabilityMetrics = {
        timeToUnderstand: 5,
        clicksToComplete: 3,
        userSatisfaction: 4
      };

      tooltipUserTestingService.submitFeedback(feedback);
      tooltipUserTestingService.submitMetrics('q1', metrics);

      const exportedData = tooltipUserTestingService.exportTestingData();
      const parsed = JSON.parse(exportedData);

      expect(parsed.feedback).toHaveLength(1);
      expect(parsed.metrics).toHaveProperty('q1');
      expect(parsed.exportDate).toBeTruthy();
    });
  });
}); 