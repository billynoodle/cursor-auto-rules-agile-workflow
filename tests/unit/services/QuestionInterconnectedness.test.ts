import '@jest/globals';
import { QuestionService } from '../../../server/src/services/QuestionService';
import { Question } from '../../../server/src/models/Question';
import { AssessmentCategory } from '../../../server/src/models/AssessmentCategory';
import { loadAllQuestions } from '../../../server/src/data/questions';
import { BusinessImpact, businessImpacts } from '../../../server/src/data/businessImpacts';

/**
 * Helper function to find questions that match specific keywords
 */
function findQuestionsByKeywords(questions: Question[], keywords: string[]): Question[] {
  return questions.filter(question => {
    const lowerText = question.text.toLowerCase();
    const lowerHelpText = question.helpText?.toLowerCase() || '';
    
    return keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase()) || 
      lowerHelpText.includes(keyword.toLowerCase())
    );
  });
}

/**
 * Helper function to find questions by their ID prefixes
 */
function findQuestionsByIdPrefix(questions: Question[], prefix: string): Question[] {
  return questions.filter(question => question.id.startsWith(prefix));
}

/**
 * Get question ID and a snippet of the question text for reporting
 */
function getQuestionIdentifier(question: Question): string {
  const textSnippet = question.text.length > 50 
    ? question.text.substring(0, 50) + '...' 
    : question.text;
  return `${question.id} (${textSnippet})`;
}

/**
 * Get keywords specific to a category
 */
function getCategoryKeywords(category: AssessmentCategory): string[] {
  const categoryKeywords: Record<AssessmentCategory, string[]> = {
    [AssessmentCategory.FINANCIAL]: ["revenue", "expense", "cost", "budget", "profit", "cash", "financial"],
    [AssessmentCategory.STAFFING]: ["staff", "practitioner", "employee", "recruit", "retention", "development"],
    [AssessmentCategory.TECHNOLOGY]: ["technology", "digital", "software", "hardware", "system", "security"],
    [AssessmentCategory.PATIENTS]: ["patient", "care", "outcome", "satisfaction", "experience"],
    [AssessmentCategory.OPERATIONS]: ["operation", "workflow", "efficiency", "schedule", "process"],
    [AssessmentCategory.COMPLIANCE]: ["compliance", "regulation", "legal", "risk", "policy"],
    [AssessmentCategory.MARKETING]: ["marketing", "referral", "advertising", "promotion", "brand"],
    [AssessmentCategory.FACILITIES]: ["facility", "space", "equipment", "layout", "location"],
    [AssessmentCategory.GEOGRAPHY]: ["location", "demographic", "geographic", "area", "distance"],
    [AssessmentCategory.AUTOMATION]: ["automation", "ai", "robotics", "predict", "algorithm"]
  };
  
  return categoryKeywords[category] || [];
}

describe('Business Area Interconnectedness', () => {
  let questionService: QuestionService;
  let allQuestions: Question[];

  beforeAll(() => {
    questionService = new QuestionService();
    allQuestions = loadAllQuestions();
    questionService.addQuestions(allQuestions);
  });

  describe('Business Impact Analysis', () => {
    it('verifies critical business area impacts', () => {
      // Test Financial -> Staffing impact
      const financialToStaffing = businessImpacts.find(i => 
        i.sourceCategory === AssessmentCategory.FINANCIAL && 
        i.impactedCategory === AssessmentCategory.STAFFING
      );
      expect(financialToStaffing).toBeDefined();
      expect(financialToStaffing?.impactScore).toBeGreaterThanOrEqual(7);

      // Test Technology -> Operations impact
      const techToOps = businessImpacts.find(i => 
        i.sourceCategory === AssessmentCategory.TECHNOLOGY && 
        i.impactedCategory === AssessmentCategory.OPERATIONS
      );
      expect(techToOps).toBeDefined();
      expect(techToOps?.impactScore).toBeGreaterThanOrEqual(7);

      // Test Compliance impacts
      const complianceImpacts = businessImpacts.filter(i => 
        i.sourceCategory === AssessmentCategory.COMPLIANCE
      );
      expect(complianceImpacts.length).toBeGreaterThan(0);
      complianceImpacts.forEach(impact => {
        expect(impact.impactScore).toBeGreaterThanOrEqual(6);
      });
    });
  });

  describe('Cross-Module Analysis', () => {
    it('identifies highly interconnected questions', () => {
      const questionScores = new Map<string, number>();
      
      allQuestions.forEach(question => {
        const text = `${question.text} ${question.helpText || ''}`.toLowerCase();
        let score = 0;
        
        Object.values(AssessmentCategory).forEach(category => {
          if (category !== question.category) {
            const categoryTerms = getCategoryTerms(category);
            if (categoryTerms.some(term => text.includes(term.toLowerCase()))) {
              score++;
            }
          }
        });
        
        if (score > 2) {
          questionScores.set(question.id, score);
        }
      });

      // Verify we have some highly interconnected questions
      expect(questionScores.size).toBeGreaterThan(0);
      const maxScore = Math.max(...questionScores.values());
      expect(maxScore).toBeGreaterThan(2);
    });
  });
});

function getCategoryTerms(category: AssessmentCategory): string[] {
  const terms: Record<AssessmentCategory, string[]> = {
    [AssessmentCategory.FINANCIAL]: ['revenue', 'cost', 'budget', 'expense'],
    [AssessmentCategory.STAFFING]: ['staff', 'employee', 'practitioner'],
    [AssessmentCategory.TECHNOLOGY]: ['technology', 'digital', 'system'],
    [AssessmentCategory.OPERATIONS]: ['operation', 'workflow', 'process'],
    [AssessmentCategory.PATIENTS]: ['patient', 'care', 'outcome'],
    [AssessmentCategory.COMPLIANCE]: ['compliance', 'regulation', 'risk'],
    [AssessmentCategory.MARKETING]: ['marketing', 'referral', 'promotion'],
    [AssessmentCategory.FACILITIES]: ['facility', 'space', 'equipment'],
    [AssessmentCategory.GEOGRAPHY]: ['location', 'area', 'demographic'],
    [AssessmentCategory.AUTOMATION]: ['automation', 'ai', 'robotics']
  };
  return terms[category] || [];
} 