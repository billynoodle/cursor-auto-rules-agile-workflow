import * as fs from 'fs';
import * as path from 'path';
import { TooltipReviewService } from '../../../server/src/services/ResearchDocumentationService';
import { TestResultsStore } from '../../utils/TestResultsStore';

// Defined test questions for consistent testing
const testQuestions = [
  {
    id: 'fin-exp-001',
    text: 'What is your practice\'s overhead ratio?',
    category: 'FINANCIAL',
    helpText: 'Overhead ratio shows what percentage of your income goes to running costs before paying practitioners. For example, if your practice makes $300,000 per year and spends $150,000 on expenses (not counting payments to practitioners), your overhead ratio is 50%. Most successful practices keep this under 45%.'
  },
  {
    id: 'comp-risk-001',
    category: 'COMPLIANCE',
    text: 'When was your last compliance risk assessment conducted?',
    helpText: 'A compliance risk assessment is simply a check-up of your practice\'s ability to follow healthcare rules and regulations. Think of it like a safety inspection for your business.'
  },
  {
    id: 'tech-dig-001',
    category: 'TECHNOLOGY',
    text: 'Do you use digital tools to track patient outcomes?',
    helpText: 'Digital outcome tracking improves treatment success rates.'
  },
  {
    id: 'staff-train-001',
    category: 'STAFFING',
    text: 'How frequently do staff receive training?',
    helpText: 'Regular staff training ensures team skills stay current.'
  }
];

describe('Tooltip Review Integration', () => {
  const tooltipReviewService = new TooltipReviewService();
  const testResultsStore = new TestResultsStore('tooltip-review');
  let reviewResults: any[] = [];

  beforeAll(async () => {
    // Create test results directory if it doesn't exist
    const testResultsDir = path.join(__dirname, '../../../test-results');
    if (!fs.existsSync(testResultsDir)) {
      fs.mkdirSync(testResultsDir, { recursive: true });
    }
  });

  it('should review all tooltips and identify issues', () => {
    // Review all tooltips
    testQuestions.forEach(question => {
      const review = tooltipReviewService.reviewTooltip(question.helpText);
      
      // Store review results
      reviewResults.push({
        id: question.id,
        category: question.category,
        text: question.text,
        helpText: question.helpText,
        wordCount: review.wordCount,
        readabilityScore: review.readabilityScore,
        hasMetrics: review.hasMetrics,
        hasExamples: review.hasExamples,
        plainLanguage: review.plainLanguage,
        jargon: review.jargonIdentified,
        suggestedImprovements: review.suggestedImprovements
      });
    });
    
    // Verify that all tooltips were reviewed
    expect(reviewResults.length).toBe(testQuestions.length);
    
    // Verify that issues were correctly identified
    const tooltipsNeedingImprovement = reviewResults.filter(r => r.suggestedImprovements.length > 0);
    expect(tooltipsNeedingImprovement.length).toBeGreaterThan(0);
  });

  it('should generate enhancement suggestions for problematic tooltips', () => {
    // Get tooltips that need improvement
    const problematicTooltips = reviewResults.filter(result => 
      result.suggestedImprovements.length > 0
    );
    
    // Generate enhanced tooltips
    problematicTooltips.forEach(result => {
      result.enhancedHelpText = tooltipReviewService.enhanceTooltip(result.helpText, result.category);
      
      // Verify enhancements address the identified issues
      if (!result.hasMetrics) {
        expect(result.enhancedHelpText).toMatch(/\d+%|\$\d+|\d+\.?\d*\s*(days|months|weeks|years|hours)/);
      }
      
      if (!result.hasExamples) {
        expect(result.enhancedHelpText).toMatch(/for example|such as|instance|e\.g\.|to illustrate|scenario/i);
      }
    });
  });

  it('should store test results persistently', async () => {
    // Generate summary statistics
    const totalTooltips = reviewResults.length;
    const tooltipsWithMetrics = reviewResults.filter(r => r.hasMetrics).length;
    const tooltipsWithExamples = reviewResults.filter(r => r.hasExamples).length;
    const tooltipsWithPlainLanguage = reviewResults.filter(r => r.plainLanguage).length;
    const tooltipsWithJargon = reviewResults.filter(r => r.jargon.length > 0).length;
    const tooltipsNeedingImprovement = reviewResults.filter(r => r.suggestedImprovements.length > 0).length;
    
    // Create summary report
    const summaryReport = {
      timestamp: new Date().toISOString(),
      totalTooltips,
      tooltipsWithMetrics,
      tooltipsWithExamples,
      tooltipsWithPlainLanguage,
      tooltipsWithJargon,
      tooltipsNeedingImprovement,
      percentWithMetrics: Math.round(tooltipsWithMetrics/totalTooltips*100),
      percentWithExamples: Math.round(tooltipsWithExamples/totalTooltips*100),
      percentNeedingImprovement: Math.round(tooltipsNeedingImprovement/totalTooltips*100),
      detailedResults: reviewResults
    };
    
    // Save results to persistent storage
    await testResultsStore.saveResult('tooltip-review-results', summaryReport);
    
    // Verify results were saved
    const savedResults = await testResultsStore.getResult('tooltip-review-results');
    expect(savedResults).toBeDefined();
    expect(savedResults.totalTooltips).toBe(totalTooltips);
  });
}); 