import { IntegrationTestUtils, setupTestEnvironment } from '../../utils/controller-test-utils';
import { TooltipReviewService } from '../../../server/src/services/ResearchDocumentationService';

describe('TooltipReviewService - Integration', () => {
  setupTestEnvironment();

  let tooltipService: TooltipReviewService;

  beforeEach(() => {
    tooltipService = new TooltipReviewService();
  });

  describe('Tooltip Review', () => {
    it('should review tooltip text', () => {
      const helpText = 'This is a complex technical term that requires explanation.';
      const review = tooltipService.reviewTooltip(helpText);

      expect(review).toHaveProperty('plainLanguage');
      expect(review).toHaveProperty('jargonIdentified');
      expect(review).toHaveProperty('hasMetrics');
      expect(review).toHaveProperty('hasExamples');
      expect(review).toHaveProperty('wordCount');
      expect(review).toHaveProperty('readabilityScore');
      expect(review).toHaveProperty('suggestedImprovements');
    });

    it('should identify jargon in tooltip', () => {
      const helpText = 'The KPI metrics indicate suboptimal ROI performance.';
      const review = tooltipService.reviewTooltip(helpText);

      expect(review.jargonIdentified).toContain('KPI');
      expect(review.jargonIdentified).toContain('ROI');
    });

    it('should calculate readability score', () => {
      const helpText = 'This is a simple and clear explanation.';
      const review = tooltipService.reviewTooltip(helpText);

      expect(review.readabilityScore).toBeGreaterThan(0);
      expect(review.readabilityScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Tooltip Enhancement', () => {
    it('should enhance financial tooltip', () => {
      const helpText = 'Revenue metrics show growth.';
      const enhanced = tooltipService.enhanceTooltip(helpText, 'financial');

      expect(enhanced).toContain(helpText);
      expect(enhanced.length).toBeGreaterThan(helpText.length);
    });

    it('should enhance compliance tooltip', () => {
      const helpText = 'Compliance requirements must be met.';
      const enhanced = tooltipService.enhanceTooltip(helpText, 'compliance');

      expect(enhanced).toContain(helpText);
      expect(enhanced.length).toBeGreaterThan(helpText.length);
    });
  });

  describe('Tooltip Templates', () => {
    it('should provide financial tooltip templates', () => {
      const templates = tooltipService.getFinancialTooltipTemplates();
      expect(Object.keys(templates).length).toBeGreaterThan(0);
    });

    it('should provide compliance tooltip templates', () => {
      const templates = tooltipService.getComplianceTooltipTemplates();
      expect(Object.keys(templates).length).toBeGreaterThan(0);
    });
  });

  describe('Tooltip Analysis', () => {
    it('should suggest improvements for complex text', () => {
      const helpText = 'The implementation of standardized operational procedures necessitates comprehensive documentation.';
      const review = tooltipService.reviewTooltip(helpText);

      expect(review.suggestedImprovements.length).toBeGreaterThan(0);
      expect(review.plainLanguage).toBe(false);
    });

    it('should identify missing metrics', () => {
      const helpText = 'Performance has improved recently.';
      const review = tooltipService.reviewTooltip(helpText);

      expect(review.hasMetrics).toBe(false);
      expect(review.suggestedImprovements).toContain(expect.stringMatching(/metric/i));
    });

    it('should identify missing examples', () => {
      const helpText = 'Follow best practices for documentation.';
      const review = tooltipService.reviewTooltip(helpText);

      expect(review.hasExamples).toBe(false);
      expect(review.suggestedImprovements).toContain(expect.stringMatching(/example/i));
    });
  });
}); 