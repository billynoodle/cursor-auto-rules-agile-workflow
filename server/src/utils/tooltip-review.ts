import { Question } from '../models/Question';
import { AssessmentCategory } from '../models/AssessmentCategory';
import fs from 'fs';
import path from 'path';

// Define criteria for tooltip quality
interface TooltipQualityCriteria {
  hasPlainLanguage: boolean;
  hasQuantifiableMetrics: boolean;
  hasJargonExplanation: boolean;
  hasContextualExamples: boolean;
  hasBusinessRelevance: boolean;
  wordCount: number;
  readabilityScore: number; // Flesch-Kincaid or similar
}

// Analyze a tooltip for readability and improvement opportunities
export function analyzeTooltip(helpText: string): TooltipQualityCriteria {
  if (!helpText) {
    return {
      hasPlainLanguage: false,
      hasQuantifiableMetrics: false,
      hasJargonExplanation: false,
      hasContextualExamples: false,
      hasBusinessRelevance: false,
      wordCount: 0,
      readabilityScore: 0
    };
  }

  // Split into words and count
  const words = helpText.split(/\s+/);
  const wordCount = words.length;

  // Check for quantifiable metrics (numbers and percentages)
  const hasQuantifiableMetrics = /\d+%|\$\d+|\d+\.?\d*\s*(days|months|weeks|years|hours)/.test(helpText);

  // Check for jargon explanation (typically follows technical terms with explanations)
  const hasJargonExplanation = /"[^"]*"\s*(\(|means|refers to|is defined as)|(i\.e\.|e\.g\.)/.test(helpText);

  // Check for examples
  const hasContextualExamples = /for example|such as|instance|e\.g\.|to illustrate|scenario/.test(helpText);

  // Check for business relevance statements
  const hasBusinessRelevance = /impact|affect|improve|increase|decrease|benefit|cost|save|revenue|profit|efficiency/.test(helpText);

  // Simple readability approximation (can be replaced with more sophisticated algorithm)
  // This is a very simple approximation - words per sentence and average word length
  const sentences = helpText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const averageWordsPerSentence = sentences.length > 0 ? wordCount / sentences.length : 0;
  const averageWordLength = words.length > 0 ? 
    words.reduce((sum, word) => sum + word.length, 0) / words.length : 0;
  
  // Simple readability score (lower is more readable)
  // Approximating Flesch-Kincaid Grade Level
  const readabilityScore = 0.39 * averageWordsPerSentence + 11.8 * averageWordLength - 15.59;
  
  // Check for plain language (fewer long words, shorter sentences)
  const hasPlainLanguage = readabilityScore < 10; // Grade level < 10 is more accessible

  return {
    hasPlainLanguage,
    hasQuantifiableMetrics,
    hasJargonExplanation,
    hasContextualExamples,
    hasBusinessRelevance,
    wordCount,
    readabilityScore
  };
}

// Generate a report of tooltips that need improvement
export function generateTooltipReviewReport(questions: Question[]): { 
  summary: {
    totalTooltips: number;
    missingTooltips: number;
    tooltipsNeedingImprovement: number;
    averageReadabilityScore: number;
  };
  categorySummary: Record<AssessmentCategory, {
    total: number;
    needsImprovement: number;
    averageScore: number;
  }>;
  questionsNeedingImprovement: Array<{
    id: string;
    category: AssessmentCategory;
    text: string;
    currentHelpText: string;
    analysisResults: TooltipQualityCriteria;
    improvementSuggestions: string[];
  }>;
} {
  // Initialize result structure
  const result = {
    summary: {
      totalTooltips: questions.length,
      missingTooltips: 0,
      tooltipsNeedingImprovement: 0,
      averageReadabilityScore: 0
    },
    categorySummary: {} as Record<AssessmentCategory, {
      total: number;
      needsImprovement: number;
      averageScore: number;
    }>,
    questionsNeedingImprovement: [] as Array<{
      id: string;
      category: AssessmentCategory;
      text: string;
      currentHelpText: string;
      analysisResults: TooltipQualityCriteria;
      improvementSuggestions: string[];
    }>
  };

  // Initialize category summary
  Object.values(AssessmentCategory).forEach(category => {
    result.categorySummary[category] = {
      total: 0,
      needsImprovement: 0,
      averageScore: 0
    };
  });

  // Analyze each question's tooltip
  let totalReadabilityScore = 0;
  let tooltipsWithScores = 0;

  questions.forEach(question => {
    const helpText = question.helpText || '';
    const category = question.category;
    
    // Update category counts
    result.categorySummary[category].total++;
    
    // Check if tooltip is missing
    if (!helpText) {
      result.summary.missingTooltips++;
      result.categorySummary[category].needsImprovement++;
      
      result.questionsNeedingImprovement.push({
        id: question.id,
        category: question.category,
        text: question.text,
        currentHelpText: '',
        analysisResults: analyzeTooltip(''),
        improvementSuggestions: ['Add a complete tooltip explanation']
      });
      return;
    }
    
    // Analyze the tooltip
    const analysis = analyzeTooltip(helpText);
    
    // Update readability scores
    if (analysis.readabilityScore > 0) {
      totalReadabilityScore += analysis.readabilityScore;
      tooltipsWithScores++;
    }
    
    // Determine if tooltip needs improvement
    const needsImprovement = !analysis.hasPlainLanguage || 
                            !analysis.hasQuantifiableMetrics || 
                            !analysis.hasJargonExplanation ||
                            !analysis.hasContextualExamples ||
                            !analysis.hasBusinessRelevance ||
                            analysis.wordCount < 50;
    
    if (needsImprovement) {
      result.summary.tooltipsNeedingImprovement++;
      result.categorySummary[category].needsImprovement++;
      
      // Generate improvement suggestions
      const suggestions: string[] = [];
      
      if (!analysis.hasPlainLanguage) {
        suggestions.push('Simplify language and reduce sentence complexity');
      }
      
      if (!analysis.hasQuantifiableMetrics) {
        suggestions.push('Add specific metrics or quantifiable information (percentages, timeframes, dollar amounts)');
      }
      
      if (!analysis.hasJargonExplanation) {
        suggestions.push('Explain technical terms and industry jargon in plain language');
      }
      
      if (!analysis.hasContextualExamples) {
        suggestions.push('Include practical examples that illustrate the concept');
      }
      
      if (!analysis.hasBusinessRelevance) {
        suggestions.push('Explain how this impacts business outcomes or practice performance');
      }
      
      if (analysis.wordCount < 50) {
        suggestions.push('Expand explanation with more comprehensive context');
      }
      
      result.questionsNeedingImprovement.push({
        id: question.id,
        category: question.category,
        text: question.text,
        currentHelpText: helpText,
        analysisResults: analysis,
        improvementSuggestions: suggestions
      });
    }
  });
  
  // Calculate average readability score
  result.summary.averageReadabilityScore = tooltipsWithScores > 0 ? 
    totalReadabilityScore / tooltipsWithScores : 0;
  
  // Calculate average scores for categories
  Object.values(AssessmentCategory).forEach(category => {
    const categoryQuestions = questions.filter(q => q.category === category && q.helpText);
    if (categoryQuestions.length > 0) {
      const categoryScore = categoryQuestions.reduce((sum, q) => {
        const analysis = analyzeTooltip(q.helpText || '');
        return sum + analysis.readabilityScore;
      }, 0);
      result.categorySummary[category].averageScore = categoryScore / categoryQuestions.length;
    }
  });
  
  return result;
}

// Export the report to a file
export function exportTooltipReportToFile(report: ReturnType<typeof generateTooltipReviewReport>, filePath: string): void {
  const content = `# Tooltip Readability Review Report
  
## Summary
- Total Questions: ${report.summary.totalTooltips}
- Missing Tooltips: ${report.summary.missingTooltips}
- Tooltips Needing Improvement: ${report.summary.tooltipsNeedingImprovement}
- Average Readability Score: ${report.summary.averageReadabilityScore.toFixed(2)} (Lower is better, target < 10)

## Category Summary
${Object.entries(report.categorySummary).map(([category, stats]) => `
### ${category}
- Total Questions: ${stats.total}
- Needs Improvement: ${stats.needsImprovement}
- Average Readability Score: ${stats.averageScore.toFixed(2)}
`).join('')}

## Questions Needing Improvement
${report.questionsNeedingImprovement.map(q => `
### ${q.id}: ${q.category}
**Question:** ${q.text}

**Current Help Text:** 
${q.currentHelpText || 'MISSING'}

**Analysis Results:**
- Plain Language: ${q.analysisResults.hasPlainLanguage ? '✅' : '❌'}
- Quantifiable Metrics: ${q.analysisResults.hasQuantifiableMetrics ? '✅' : '❌'}
- Jargon Explanation: ${q.analysisResults.hasJargonExplanation ? '✅' : '❌'}
- Contextual Examples: ${q.analysisResults.hasContextualExamples ? '✅' : '❌'}
- Business Relevance: ${q.analysisResults.hasBusinessRelevance ? '✅' : '❌'}
- Word Count: ${q.analysisResults.wordCount} (Target: 50+)
- Readability Score: ${q.analysisResults.readabilityScore.toFixed(2)} (Target: < 10)

**Improvement Suggestions:**
${q.improvementSuggestions.map(s => `- ${s}`).join('\n')}
`).join('\n')}
`;

  fs.writeFileSync(filePath, content);
}

// Example usage function
export async function runTooltipReview(questionsService: any, outputPath: string): Promise<void> {
  const questions = questionsService.getAllQuestions();
  const report = generateTooltipReviewReport(questions);
  exportTooltipReportToFile(report, outputPath);
  
  console.log(`Tooltip review report generated at ${outputPath}`);
  console.log(`Summary: ${report.summary.tooltipsNeedingImprovement} out of ${report.summary.totalTooltips} tooltips need improvement`);
} 