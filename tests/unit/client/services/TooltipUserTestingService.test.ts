import tooltipUserTestingService, { AggregatedMetrics } from '@client/services/TooltipUserTestingService';
import { TooltipFeedback } from '@client/types/assessment.types';
import { UsabilityMetrics } from '@client/components/tooltips/TooltipUserTesting';

describe('TooltipUserTestingService', () => {
  // Clear all data before each test
  beforeEach(() => {
    tooltipUserTestingService.clearTestingData();
  });
  
  describe('submitFeedback', () => {
    it('should store feedback correctly', () => {
      const feedback: TooltipFeedback = {
        questionId: 'q1',
        tooltipId: 't1',
        clarityRating: 4,
        difficultTerms: ['term1', 'term2'],
        additionalFeedback: 'This is good',
        timestamp: new Date().toISOString()
      };
      
      tooltipUserTestingService.submitFeedback(feedback);
      
      const allFeedback = tooltipUserTestingService.getAllFeedback();
      expect(allFeedback.length).toBe(1);
      expect(allFeedback[0]).toEqual(feedback);
    });
    
    it('should handle multiple feedback submissions', () => {
      const feedback1: TooltipFeedback = {
        questionId: 'q1',
        tooltipId: 't1',
        clarityRating: 4,
        difficultTerms: ['term1'],
        additionalFeedback: 'Good',
        timestamp: new Date().toISOString()
      };
      
      const feedback2: TooltipFeedback = {
        questionId: 'q2',
        tooltipId: 't2',
        clarityRating: 3,
        difficultTerms: ['term2'],
        additionalFeedback: 'Okay',
        timestamp: new Date().toISOString()
      };
      
      tooltipUserTestingService.submitFeedback(feedback1);
      tooltipUserTestingService.submitFeedback(feedback2);
      
      const allFeedback = tooltipUserTestingService.getAllFeedback();
      expect(allFeedback.length).toBe(2);
      expect(allFeedback).toContainEqual(feedback1);
      expect(allFeedback).toContainEqual(feedback2);
    });
  });
  
  describe('submitMetrics', () => {
    it('should store metrics correctly', () => {
      const metrics: UsabilityMetrics = {
        questionId: 'q1',
        tooltipId: 't1',
        timeToUnderstand: 5,
        clickCount: 2,
        userSatisfaction: 4,
        isMobileView: false,
        timestamp: new Date().toISOString()
      };
      
      tooltipUserTestingService.submitMetrics(metrics);
      
      const allMetrics = tooltipUserTestingService.getAllMetrics();
      expect(allMetrics.length).toBe(1);
      expect(allMetrics[0]).toEqual(metrics);
    });
    
    it('should handle multiple metrics submissions', () => {
      const metrics1: UsabilityMetrics = {
        questionId: 'q1',
        tooltipId: 't1',
        timeToUnderstand: 5,
        clickCount: 2,
        userSatisfaction: 4,
        isMobileView: false,
        timestamp: new Date().toISOString()
      };
      
      const metrics2: UsabilityMetrics = {
        questionId: 'q2',
        tooltipId: 't2',
        timeToUnderstand: 8,
        clickCount: 3,
        userSatisfaction: 3,
        isMobileView: true,
        timestamp: new Date().toISOString()
      };
      
      tooltipUserTestingService.submitMetrics(metrics1);
      tooltipUserTestingService.submitMetrics(metrics2);
      
      const allMetrics = tooltipUserTestingService.getAllMetrics();
      expect(allMetrics.length).toBe(2);
      expect(allMetrics).toContainEqual(metrics1);
      expect(allMetrics).toContainEqual(metrics2);
    });
  });
  
  describe('getAggregatedMetrics', () => {
    it('should calculate aggregated metrics correctly', () => {
      // Add some test metrics
      tooltipUserTestingService.submitMetrics({
        questionId: 'q1',
        tooltipId: 't1',
        timeToUnderstand: 5,
        clickCount: 2,
        userSatisfaction: 4,
        isMobileView: false,
        timestamp: new Date().toISOString()
      });
      
      tooltipUserTestingService.submitMetrics({
        questionId: 'q1',
        tooltipId: 't1',
        timeToUnderstand: 7,
        clickCount: 3,
        userSatisfaction: 5,
        isMobileView: false,
        timestamp: new Date().toISOString()
      });
      
      tooltipUserTestingService.submitMetrics({
        questionId: 'q2',
        tooltipId: 't2',
        timeToUnderstand: 10,
        clickCount: 4,
        userSatisfaction: 3,
        isMobileView: true,
        timestamp: new Date().toISOString()
      });
      
      const aggregated = tooltipUserTestingService.getAggregatedMetrics();
      
      // Check overall metrics
      expect(aggregated.overall.avgTimeToUnderstand).toBeCloseTo(7.33, 1);
      expect(aggregated.overall.avgClickCount).toBeCloseTo(3, 1);
      expect(aggregated.overall.avgSatisfaction).toBeCloseTo(4, 1);
      expect(aggregated.overall.totalSessions).toBe(3);
      
      // Check metrics by tooltip
      expect(aggregated.byTooltip['t1'].avgTimeToUnderstand).toBeCloseTo(6, 1);
      expect(aggregated.byTooltip['t1'].avgClickCount).toBeCloseTo(2.5, 1);
      expect(aggregated.byTooltip['t1'].avgSatisfaction).toBeCloseTo(4.5, 1);
      expect(aggregated.byTooltip['t1'].totalSessions).toBe(2);
      
      expect(aggregated.byTooltip['t2'].avgTimeToUnderstand).toBe(10);
      expect(aggregated.byTooltip['t2'].avgClickCount).toBe(4);
      expect(aggregated.byTooltip['t2'].avgSatisfaction).toBe(3);
      expect(aggregated.byTooltip['t2'].totalSessions).toBe(1);
      
      // Check metrics by device type
      expect(aggregated.byDeviceType.desktop.avgTimeToUnderstand).toBeCloseTo(6, 1);
      expect(aggregated.byDeviceType.desktop.avgClickCount).toBeCloseTo(2.5, 1);
      expect(aggregated.byDeviceType.desktop.avgSatisfaction).toBeCloseTo(4.5, 1);
      expect(aggregated.byDeviceType.desktop.totalSessions).toBe(2);
      
      expect(aggregated.byDeviceType.mobile.avgTimeToUnderstand).toBe(10);
      expect(aggregated.byDeviceType.mobile.avgClickCount).toBe(4);
      expect(aggregated.byDeviceType.mobile.avgSatisfaction).toBe(3);
      expect(aggregated.byDeviceType.mobile.totalSessions).toBe(1);
    });
    
    it('should handle empty metrics', () => {
      const aggregated = tooltipUserTestingService.getAggregatedMetrics();
      
      expect(aggregated.overall.avgTimeToUnderstand).toBe(0);
      expect(aggregated.overall.avgClickCount).toBe(0);
      expect(aggregated.overall.avgSatisfaction).toBe(0);
      expect(aggregated.overall.totalSessions).toBe(0);
      
      expect(Object.keys(aggregated.byTooltip).length).toBe(0);
      expect(aggregated.byDeviceType.desktop.totalSessions).toBe(0);
      expect(aggregated.byDeviceType.mobile.totalSessions).toBe(0);
    });
  });
  
  describe('clearTestingData', () => {
    it('should clear all testing data', () => {
      // Add some test data
      tooltipUserTestingService.submitFeedback({
        questionId: 'q1',
        tooltipId: 't1',
        clarityRating: 4,
        difficultTerms: ['term1'],
        additionalFeedback: 'Good',
        timestamp: new Date().toISOString()
      });
      
      tooltipUserTestingService.submitMetrics({
        questionId: 'q1',
        tooltipId: 't1',
        timeToUnderstand: 5,
        clickCount: 2,
        userSatisfaction: 4,
        isMobileView: false,
        timestamp: new Date().toISOString()
      });
      
      // Verify data exists
      expect(tooltipUserTestingService.getAllFeedback().length).toBe(1);
      expect(tooltipUserTestingService.getAllMetrics().length).toBe(1);
      
      // Clear data
      tooltipUserTestingService.clearTestingData();
      
      // Verify data is cleared
      expect(tooltipUserTestingService.getAllFeedback().length).toBe(0);
      expect(tooltipUserTestingService.getAllMetrics().length).toBe(0);
    });
  });
  
  describe('exportTestingData', () => {
    it('should export testing data as JSON', () => {
      // Add some test data
      const feedback: TooltipFeedback = {
        questionId: 'q1',
        tooltipId: 't1',
        clarityRating: 4,
        difficultTerms: ['term1'],
        additionalFeedback: 'Good',
        timestamp: new Date().toISOString()
      };
      
      const metrics: UsabilityMetrics = {
        questionId: 'q1',
        tooltipId: 't1',
        timeToUnderstand: 5,
        clickCount: 2,
        userSatisfaction: 4,
        isMobileView: false,
        timestamp: new Date().toISOString()
      };
      
      tooltipUserTestingService.submitFeedback(feedback);
      tooltipUserTestingService.submitMetrics(metrics);
      
      // Export data
      const exportedData = tooltipUserTestingService.exportTestingData();
      const parsedData = JSON.parse(exportedData);
      
      // Verify exported data
      expect(parsedData.feedback).toContainEqual(feedback);
      expect(parsedData.metrics).toContainEqual(metrics);
      expect(parsedData.aggregatedMetrics).toBeDefined();
    });
  });
}); 