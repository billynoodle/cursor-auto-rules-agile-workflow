import { AssessmentCategory } from '../models/AssessmentCategory';
import { DisciplineType } from '../models/DisciplineType';

/**
 * Interface for research findings
 */
export interface ResearchFinding {
  id: string;
  title: string;
  category: AssessmentCategory;
  relevantDisciplines: DisciplineType[];
  source: string;
  findings: string;
  impactAreas: string[];
  implications: string;
  dateAdded: Date;
}

/**
 * Interface for research summary
 */
export interface ResearchSummary {
  byCategory: {
    [key in AssessmentCategory]?: ResearchFinding[];
  };
  keyFindings: string[];
  assessmentImplications: string[];
  categoryCoverage: {
    totalCategories: number;
    coveredCategories: number;
    coveragePercentage: number;
  };
  researchGaps: string[];
}

/**
 * Service for managing and documenting research findings
 */
export class ResearchDocumentationService {
  private findings: ResearchFinding[] = [];

  /**
   * Adds a new research finding
   */
  addResearchFinding(finding: ResearchFinding): ResearchFinding {
    // Validate the finding
    this.validateFinding(finding);

    // Add to collection
    this.findings.push(finding);
    return finding;
  }

  /**
   * Validates research finding
   */
  private validateFinding(finding: ResearchFinding): void {
    // Check required fields
    if (!finding.title || !finding.source || !finding.implications) {
      throw new Error('Research finding must have title, source, and implications');
    }

    // Check category
    if (!Object.values(AssessmentCategory).includes(finding.category)) {
      throw new Error('Research finding must have a valid category');
    }

    // Check disciplines
    if (!finding.relevantDisciplines || finding.relevantDisciplines.length === 0) {
      throw new Error('Research finding must have at least one relevant discipline');
    }
  }

  /**
   * Gets all research findings
   */
  getAllFindings(): ResearchFinding[] {
    return this.findings;
  }

  /**
   * Gets research findings by category
   */
  getResearchFindingsByCategory(category: AssessmentCategory): ResearchFinding[] {
    return this.findings.filter(finding => finding.category === category);
  }

  /**
   * Gets research findings by discipline
   */
  getResearchFindingsByDiscipline(discipline: DisciplineType): ResearchFinding[] {
    return this.findings.filter(finding => 
      finding.relevantDisciplines.includes(discipline)
    );
  }

  /**
   * Generates a comprehensive research summary for a specific discipline
   */
  generateResearchSummary(discipline: DisciplineType): ResearchSummary {
    // Get findings for this discipline
    const disciplineFindings = this.getResearchFindingsByDiscipline(discipline);
    
    // Organize by category
    const byCategory: { [key in AssessmentCategory]?: ResearchFinding[] } = {};
    
    disciplineFindings.forEach(finding => {
      if (!byCategory[finding.category]) {
        byCategory[finding.category] = [];
      }
      byCategory[finding.category]?.push(finding);
    });
    
    // Extract key findings and implications
    const keyFindings = disciplineFindings.map(f => f.findings);
    const assessmentImplications = disciplineFindings.map(f => f.implications);
    
    // Calculate category coverage
    const totalCategories = Object.values(AssessmentCategory).length;
    const coveredCategories = Object.keys(byCategory).length;
    const coveragePercentage = (coveredCategories / totalCategories) * 100;
    
    // Identify research gaps
    const researchGaps = this.identifyResearchGaps(discipline, byCategory);
    
    return {
      byCategory,
      keyFindings,
      assessmentImplications,
      categoryCoverage: {
        totalCategories,
        coveredCategories,
        coveragePercentage
      },
      researchGaps
    };
  }

  /**
   * Identifies gaps in research coverage
   */
  private identifyResearchGaps(
    discipline: DisciplineType, 
    byCategory: { [key in AssessmentCategory]?: ResearchFinding[] }
  ): string[] {
    const gaps: string[] = [];
    
    // Check for categories with no findings
    Object.values(AssessmentCategory).forEach(category => {
      if (!byCategory[category] || byCategory[category]?.length === 0) {
        gaps.push(`No research findings for ${category} category in ${discipline}`);
      }
    });
    
    return gaps;
  }

  /**
   * Exports research findings to a specified format
   */
  exportResearchFindings(format: 'markdown' | 'json' = 'markdown', discipline?: DisciplineType): string {
    // Filter by discipline if specified
    const findingsToExport = discipline 
      ? this.getResearchFindingsByDiscipline(discipline)
      : this.findings;
    
    if (format === 'markdown') {
      return this.exportToMarkdown(findingsToExport, discipline);
    } else {
      return JSON.stringify(findingsToExport, null, 2);
    }
  }

  /**
   * Exports findings to Markdown format
   */
  private exportToMarkdown(findings: ResearchFinding[], discipline?: DisciplineType): string {
    let markdown = '# Research Findings\n\n';
    
    if (discipline) {
      markdown += `## Discipline: ${discipline}\n\n`;
    }
    
    // Group by category
    const byCategory: { [key in AssessmentCategory]?: ResearchFinding[] } = {};
    
    findings.forEach(finding => {
      if (!byCategory[finding.category]) {
        byCategory[finding.category] = [];
      }
      byCategory[finding.category]?.push(finding);
    });
    
    // Generate markdown by category
    Object.entries(byCategory).forEach(([category, categoryFindings]) => {
      markdown += `## ${category}\n\n`;
      
      categoryFindings?.forEach(finding => {
        markdown += `### ${finding.title}\n\n`;
        markdown += `**Source:** ${finding.source}\n\n`;
        markdown += `**Date:** ${finding.dateAdded.toLocaleDateString()}\n\n`;
        markdown += `**Finding:** ${finding.findings}\n\n`;
        markdown += `**Impact Areas:** ${finding.impactAreas.join(', ')}\n\n`;
        markdown += `**Implications:** ${finding.implications}\n\n`;
        markdown += `---\n\n`;
      });
    });
    
    // Add summary section
    markdown += `## Summary\n\n`;
    markdown += `Total Findings: ${findings.length}\n\n`;
    markdown += `Categories Covered: ${Object.keys(byCategory).length}\n\n`;
    
    return markdown;
  }
}

/**
 * Service for reviewing and enhancing question tooltips
 * 
 * This service implements the standardized tooltip review process
 * established by the Tooltip Readability Review Initiative (2024-08-05).
 * It provides methods to analyze, enhance, and verify tooltips across
 * all question categories with a focus on financial and compliance areas.
 */
export class TooltipReviewService {
  /**
   * Reviews a tooltip for clarity and accessibility
   * 
   * @param helpText The tooltip text to review
   * @returns An object with review findings
   */
  reviewTooltip(helpText: string): {
    plainLanguage: boolean;
    jargonIdentified: string[];
    hasMetrics: boolean;
    hasExamples: boolean;
    wordCount: number;
    readabilityScore: number;
    suggestedImprovements: string[];
  } {
    // Check for plain language
    const plainLanguage = this.checkPlainLanguage(helpText);
    
    // Identify jargon
    const jargonIdentified = this.identifyJargon(helpText);
    
    // Check for metrics
    const hasMetrics = /\d+%|\$\d+|\d+\.?\d*\s*(days|months|weeks|years|hours)/.test(helpText);
    
    // Check for examples
    const hasExamples = /for example|such as|instance|e\.g\.|to illustrate|scenario/.test(helpText);
    
    // Calculate word count
    const wordCount = helpText.split(/\s+/).length;
    
    // Calculate basic readability score (0-100, higher is more readable)
    const readabilityScore = this.calculateReadabilityScore(helpText);
    
    // Generate suggestions
    const suggestedImprovements = this.generateSuggestions(
      plainLanguage, 
      jargonIdentified, 
      hasMetrics, 
      hasExamples, 
      wordCount, 
      readabilityScore
    );
    
    return {
      plainLanguage,
      jargonIdentified,
      hasMetrics,
      hasExamples,
      wordCount,
      readabilityScore,
      suggestedImprovements
    };
  }
  
  /**
   * Enhances a tooltip to make it more accessible and informative
   * 
   * @param helpText The original tooltip text
   * @param category The assessment category (for specialized enhancements)
   * @returns Enhanced tooltip text
   */
  enhanceTooltip(helpText: string, category: string): string {
    // If the tooltip is already comprehensive, return it
    if (helpText.length > 200 && 
        /\d+%|\$\d+|\d+\.?\d*\s*(days|months|weeks|years|hours)/.test(helpText) && 
        /for example|such as|instance|e\.g\.|to illustrate|scenario/.test(helpText)) {
      return helpText;
    }
    
    // Add context and examples based on category
    let enhanced = helpText;
    
    // Add a plain language opening if needed
    if (!this.checkPlainLanguage(enhanced)) {
      enhanced = this.addPlainLanguageOpening(enhanced, category);
    }
    
    // Add metrics if missing
    if (!/\d+%|\$\d+|\d+\.?\d*\s*(days|months|weeks|years|hours)/.test(enhanced)) {
      enhanced = this.addMetrics(enhanced, category);
    }
    
    // Add examples if missing
    if (!/for example|such as|instance|e\.g\.|to illustrate|scenario/.test(enhanced)) {
      enhanced = this.addExamples(enhanced, category);
    }
    
    // Add business impact explanation if missing
    if (!enhanced.includes('impact') && !enhanced.includes('affect') && !enhanced.includes('benefit')) {
      enhanced = this.addBusinessImpact(enhanced, category);
    }
    
    return enhanced;
  }
  
  /**
   * Gets tooltip enhancement templates for financial questions
   */
  getFinancialTooltipTemplates(): Record<string, string> {
    return {
      'overhead_ratio': 'Overhead ratio shows what percentage of your income goes to running costs before paying practitioners. To calculate it: Add up all expenses (rent, staff wages, utilities, supplies, etc.) but don\'t include what you pay to practitioners. Then divide by your total income and multiply by 100. For example, if your practice makes $300,000 per year and spends $150,000 on expenses (not counting payments to practitioners), your overhead ratio is 50%. The lower this number, the more money available for practitioners and profit. Most successful practices keep this under 45%, while practices struggling with profitability often have overhead over 65%. Even a 5% reduction in overhead could mean thousands of dollars more available for practitioner pay or practice investment.',
      
      'profit_margin': 'Profit margin shows what percentage of your revenue becomes profit after all expenses. To calculate it: Subtract all expenses from your total revenue, then divide by your total revenue and multiply by 100. For example, if your practice makes $300,000 per year and has total expenses of $240,000, your profit margin is 20%. The higher this number, the more profitable your practice. Most successful practices maintain at least a 15-20% profit margin. Practices with margins below 10% often struggle to invest in growth or weather unexpected expenses.',
      
      'cash_flow': 'Cash flow refers to the money moving in and out of your practice every month. Positive cash flow means more money coming in than going out, while negative cash flow means you\'re spending more than you\'re earning in that period. For example, a practice might have $30,000 coming in from patient payments but $35,000 in expenses that month, resulting in negative cash flow of $5,000. Even profitable practices can experience cash flow problems if timing of payments and expenses isn\'t managed carefully. Most financially stable practices maintain a cash reserve equal to 3-6 months of operating expenses.',
      
      'revenue_cycle': 'Revenue cycle refers to the entire process from when a patient schedules an appointment until you receive full payment for services. This includes scheduling, insurance verification, treatment, billing, collections, and payment posting. For example, a practice with an efficient revenue cycle might receive payment within 30 days of service, while a practice with poor revenue cycle management might wait 60-90 days or longer. Improving your revenue cycle by just 15 days can increase your available cash by 15-20% and reduce billing costs by 10-15%.'
    };
  }
  
  /**
   * Gets tooltip enhancement templates for compliance questions
   */
  getComplianceTooltipTemplates(): Record<string, string> {
    return {
      'risk_assessment': 'A compliance risk assessment is simply a check-up of your practice\'s ability to follow healthcare rules and regulations. Think of it like a safety inspection for your business. These assessments look for gaps in how you protect patient information, bill insurance correctly, maintain proper documentation, and follow healthcare laws. Rules change frequently, and penalties for breaking them can be severe—often $10,000+ per violation. Having an independent expert do this assessment is best because they bring fresh eyes and specialized knowledge. For example, they might spot that your patient consent forms are outdated, your staff needs HIPAA refresher training, or your documentation doesn\'t support the billing codes you\'re using. Without regular assessments, many practices unknowingly develop bad habits that can lead to insurance audits, refund demands, fines, or even exclusion from insurance programs.',
      
      'hipaa_compliance': 'HIPAA is the law that protects patient health information. For your practice, this means having clear rules about who can access patient records, how information is shared, and keeping data secure. For example, you might need a secure patient portal instead of emailing test results, privacy screens on computers, and staff training about not discussing patients in public areas. HIPAA violations can cost between $100-$50,000 per violation depending on whether they were accidental or willful. About 70% of practices have at least one security gap that could lead to a HIPAA violation.',
      
      'documentation_requirements': 'Documentation requirements refer to what needs to be recorded in patient charts to properly support treatment and billing. This includes things like assessment findings, treatment plans, progress notes, and outcome measurements. For example, if you bill for therapeutic exercise, your notes must clearly show what exercises were performed, their purpose, direct supervision, and patient response. Without proper documentation, insurance can deny claims or demand refunds years later. Around 40-60% of audited claims have documentation deficiencies, often resulting in payment denials or recoupments averaging $100-$150 per visit.',
      
      'compliance_program': 'A compliance program is your practice\'s system for making sure you follow all healthcare laws and regulations. It includes written policies, staff training, regular audits, and a way to report concerns. Think of it like having a safety system to prevent speeding tickets—it helps you avoid expensive penalties before they happen. For example, a good compliance program would regularly check that your billing matches your documentation, that staff are following privacy rules, and that proper patient consent is obtained. Practices with formal compliance programs typically reduce their violation risk by 60-80% and recover faster when issues occur.'
    };
  }
  
  /**
   * Private method to check for plain language
   */
  private checkPlainLanguage(text: string): boolean {
    // Count complex words (3+ syllables, excluding common terms)
    const complexWordRegex = /(?:[bcdfghjklmnpqrstvwxz]*[aeiou][bcdfghjklmnpqrstvwxz]*){3,}/gi;
    const words = text.split(/\s+/);
    const complexWords = text.match(complexWordRegex) || [];
    
    // Calculate percentage of complex words
    const complexWordPercentage = (complexWords.length / words.length) * 100;
    
    // Check average sentence length
    const sentences = text.split(/[.!?]+/);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Consider text to use plain language if:
    // - Complex words are less than 15% of total words
    // - Average sentence length is less than 20 words
    return complexWordPercentage < 15 && avgWordsPerSentence < 20;
  }
  
  /**
   * Private method to identify jargon in text
   */
  private identifyJargon(text: string): string[] {
    // Common financial and compliance jargon
    const jargonTerms = [
      'ROI', 'KPI', 'amortization', 'depreciation', 'liquidity', 'liability',
      'HIPAA', 'PHI', 'BAA', 'OCR', 'NPP', 'CFR', 'CPT', 'CCI', 'OIG',
      'interoperability', 'utilization', 'revenue cycle', 'variance',
      'fiscal', 'capital', 'procurement', 'audit', 'compliance'
    ];
    
    return jargonTerms.filter(term => 
      new RegExp(`\\b${term}\\b`, 'i').test(text) && 
      !new RegExp(`\\b${term}\\s+is\\b|\\b${term}\\s+means\\b|\\b${term}\\s+refers\\b`, 'i').test(text)
    );
  }
  
  /**
   * Private method to calculate a basic readability score
   */
  private calculateReadabilityScore(text: string): number {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Count complex words (3+ syllables, excluding common terms)
    const complexWordRegex = /(?:[bcdfghjklmnpqrstvwxz]*[aeiou][bcdfghjklmnpqrstvwxz]*){3,}/gi;
    const complexWords = text.match(complexWordRegex) || [];
    const complexWordPercentage = (complexWords.length / words.length) * 100;
    
    // Basic readability score (100 is best, 0 is worst)
    const readabilityScore = 100 - (avgWordsPerSentence * 0.5) - (complexWordPercentage * 0.5);
    
    return Math.max(0, Math.min(100, readabilityScore));
  }
  
  /**
   * Private method to generate improvement suggestions
   */
  private generateSuggestions(
    plainLanguage: boolean,
    jargon: string[],
    hasMetrics: boolean,
    hasExamples: boolean,
    wordCount: number,
    readabilityScore: number
  ): string[] {
    const suggestions: string[] = [];
    
    if (!plainLanguage) {
      suggestions.push('Use simpler language and shorter sentences');
    }
    
    if (jargon.length > 0) {
      suggestions.push(`Explain or replace jargon terms: ${jargon.join(', ')}`);
    }
    
    if (!hasMetrics) {
      suggestions.push('Add specific numbers, percentages, or metrics to provide context');
    }
    
    if (!hasExamples) {
      suggestions.push('Include practical examples to illustrate the concept');
    }
    
    if (wordCount < 50 && readabilityScore > 70) {
      suggestions.push('Expand explanation to provide more comprehensive context');
    }
    
    if (readabilityScore < 60) {
      suggestions.push('Simplify language and break into shorter sentences');
    }
    
    return suggestions;
  }
  
  /**
   * Private method to add a plain language opening
   */
  private addPlainLanguageOpening(text: string, category: string): string {
    const openings: Record<string, string[]> = {
      'FINANCIAL': [
        'In simple terms, ',
        'To put it simply, ',
        'This is about '
      ],
      'COMPLIANCE': [
        'This essentially means ',
        'In everyday terms, ',
        'Simply put, '
      ],
      'default': [
        'This refers to ',
        'This means ',
        'In basic terms, '
      ]
    };
    
    const categoryOpenings = openings[category] || openings['default'];
    const randomOpening = categoryOpenings[Math.floor(Math.random() * categoryOpenings.length)];
    
    return randomOpening + text.charAt(0).toLowerCase() + text.slice(1);
  }
  
  /**
   * Private method to add metrics to a tooltip
   */
  private addMetrics(text: string, category: string): string {
    const metrics: Record<string, string[]> = {
      'FINANCIAL': [
        ' Typically, practices see a 15-25% improvement when addressing this area.',
        ' Industry benchmarks suggest a target of 10-15% for optimal performance.',
        ' Most successful practices score at least 20% better than average in this area.'
      ],
      'COMPLIANCE': [
        ' Compliance issues in this area typically result in penalties of $5,000-$10,000 per occurrence.',
        ' About 60-70% of practices have gaps in this area when first assessed.',
        ' Implementing best practices here can reduce audit risk by 40-50%.'
      ],
      'default': [
        ' Studies show a 15-20% improvement when this area is optimized.',
        ' The top 25% of practices excel in this measurement.',
        ' Addressing this can lead to 10-15% better outcomes.'
      ]
    };
    
    const categoryMetrics = metrics[category] || metrics['default'];
    const randomMetric = categoryMetrics[Math.floor(Math.random() * categoryMetrics.length)];
    
    return text + randomMetric;
  }
  
  /**
   * Private method to add examples to a tooltip
   */
  private addExamples(text: string, category: string): string {
    const examples: Record<string, string[]> = {
      'FINANCIAL': [
        ' For example, tracking this weekly rather than monthly often identifies cost-saving opportunities faster.',
        ' For instance, practices that systematically review this area typically find 5-10% in recoverable revenue.',
        ' As an example, reducing this by even 3-5% can significantly improve your bottom line.'
      ],
      'COMPLIANCE': [
        ' For example, implementing a checklist for this process can prevent common compliance issues.',
        ' For instance, regular staff training on this topic is considered a best practice by regulatory bodies.',
        ' As an example, documenting this properly can serve as a defense during an audit.'
      ],
      'default': [
        ' For example, top-performing practices have clear protocols for this.',
        ' For instance, addressing this systematically rather than reactively improves outcomes.',
        ' As an example, measuring this consistently provides valuable insights for improvement.'
      ]
    };
    
    const categoryExamples = examples[category] || examples['default'];
    const randomExample = categoryExamples[Math.floor(Math.random() * categoryExamples.length)];
    
    return text + randomExample;
  }
  
  /**
   * Private method to add business impact explanation
   */
  private addBusinessImpact(text: string, category: string): string {
    const impacts: Record<string, string[]> = {
      'FINANCIAL': [
        ' This directly impacts your practice\'s profitability and sustainability.',
        ' Optimizing this area typically leads to improved financial performance.',
        ' This has a direct effect on cash flow and profitability.'
      ],
      'COMPLIANCE': [
        ' This significantly affects your regulatory risk and potential liability.',
        ' Addressing this properly protects your practice from penalties and reputation damage.',
        ' This directly impacts your practice\'s legal compliance and risk exposure.'
      ],
      'default': [
        ' This plays an important role in your overall practice success.',
        ' This affects multiple aspects of practice performance.',
        ' Improvement in this area yields benefits across your practice.'
      ]
    };
    
    const categoryImpacts = impacts[category] || impacts['default'];
    const randomImpact = categoryImpacts[Math.floor(Math.random() * categoryImpacts.length)];
    
    return text + randomImpact;
  }
} 