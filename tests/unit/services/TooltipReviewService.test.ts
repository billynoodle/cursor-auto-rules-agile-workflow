import { TooltipReviewService } from '../../../server/src/services/ResearchDocumentationService';

describe('TooltipReviewService', () => {
  let tooltipReviewService: TooltipReviewService;

  beforeEach(() => {
    tooltipReviewService = new TooltipReviewService();
  });

  describe('reviewTooltip', () => {
    it('should detect metrics in tooltip text', () => {
      const tooltipWithMetrics = 'Overhead ratio is typically between 45-65% for most practices. Reducing it by 5% can save $10,000 annually for a small practice.';
      const result = tooltipReviewService.reviewTooltip(tooltipWithMetrics);
      
      expect(result.hasMetrics).toBe(true);
    });

    it('should detect examples in tooltip text', () => {
      const tooltipWithExamples = 'Regular staff training is important. For example, weekly 30-minute sessions on specific topics yield better results than monthly all-day training.';
      const result = tooltipReviewService.reviewTooltip(tooltipWithExamples);
      
      expect(result.hasExamples).toBe(true);
    });

    it('should calculate word count correctly', () => {
      const tooltipText = 'This is a five word tooltip.';
      const result = tooltipReviewService.reviewTooltip(tooltipText);
      
      expect(result.wordCount).toBe(5);
    });

    it('should identify tooltips that need improvement', () => {
      const poorTooltip = 'Digital tracking improves outcomes.';
      const result = tooltipReviewService.reviewTooltip(poorTooltip);
      
      expect(result.suggestedImprovements.length).toBeGreaterThan(0);
    });

    it('should not suggest improvements for comprehensive tooltips', () => {
      const goodTooltip = 'Overhead ratio shows what percentage of your income goes to running costs before paying practitioners. For example, if your practice makes $300,000 per year and spends $150,000 on expenses (not counting payments to practitioners), your overhead ratio is 50%. Most successful practices keep this under 45%, while practices struggling with profitability often have overhead over 65%.';
      const result = tooltipReviewService.reviewTooltip(goodTooltip);
      
      expect(result.suggestedImprovements.length).toBe(0);
    });
  });

  describe('enhanceTooltip', () => {
    it('should add metrics to tooltips without metrics', () => {
      const tooltipWithoutMetrics = 'Regular staff training ensures team skills stay current.';
      const enhanced = tooltipReviewService.enhanceTooltip(tooltipWithoutMetrics, 'STAFFING');
      
      expect(enhanced).toContain('%') || expect(enhanced).toContain('$');
    });

    it('should add examples to tooltips without examples', () => {
      const tooltipWithoutExamples = 'Overhead ratio is typically between 45-65% for most practices.';
      const enhanced = tooltipReviewService.enhanceTooltip(tooltipWithoutExamples, 'FINANCIAL');
      
      expect(enhanced).toMatch(/for example|such as|instance|e\.g\.|to illustrate|scenario/i);
    });
  });
}); 