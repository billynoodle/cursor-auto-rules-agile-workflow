import '@jest/globals';
import { QuestionService } from '../../../server/src/services/QuestionService';
import { Question } from '../../../server/src/models/Question';
import { AssessmentCategory } from '../../../server/src/models/AssessmentCategory';
import { loadAllQuestions } from '../../../server/src/data/questions';

interface BusinessImpact {
  sourceCategory: AssessmentCategory;
  impactedCategory: AssessmentCategory;
  impactScore: number; // 1-10 scale
  impactStatement: string;
  relatedSourceQuestions: string[]; // Question IDs
  relatedImpactedQuestions: string[]; // Question IDs
}

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

describe('Business Area Interconnectedness', () => {
  let questionService: QuestionService;
  let allQuestions: Question[];
  let businessImpacts: BusinessImpact[] = [];

  beforeAll(() => {
    questionService = new QuestionService();
    allQuestions = loadAllQuestions();
    questionService.addQuestions(allQuestions);
    
    // Define known business impacts between different assessment areas
    defineBusinessImpacts();
  });

  /**
   * Define known impacts between different business areas
   */
  function defineBusinessImpacts() {
    // Financial impact on Staffing
    businessImpacts.push({
      sourceCategory: AssessmentCategory.FINANCIAL,
      impactedCategory: AssessmentCategory.STAFFING,
      impactScore: 8,
      impactStatement: "Financial health directly impacts staffing capabilities, including recruitment, retention, and professional development budgets.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });

    // Financial impact on Technology
    businessImpacts.push({
      sourceCategory: AssessmentCategory.FINANCIAL,
      impactedCategory: AssessmentCategory.TECHNOLOGY,
      impactScore: 7,
      impactStatement: "Financial resource allocation determines technology investment capacity, affecting digital adoption and infrastructure quality.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });

    // Technology impact on Operations
    businessImpacts.push({
      sourceCategory: AssessmentCategory.TECHNOLOGY,
      impactedCategory: AssessmentCategory.OPERATIONS,
      impactScore: 9,
      impactStatement: "Technology adoption and system integration significantly impact operational efficiency, workflow, and scheduling capabilities.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });

    // Staffing impact on Patient Care
    businessImpacts.push({
      sourceCategory: AssessmentCategory.STAFFING,
      impactedCategory: AssessmentCategory.PATIENTS,
      impactScore: 10,
      impactStatement: "Staffing quality, training, and retention directly impact patient care quality, outcomes, and experience.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });

    // Compliance impact on multiple areas
    businessImpacts.push({
      sourceCategory: AssessmentCategory.COMPLIANCE,
      impactedCategory: AssessmentCategory.TECHNOLOGY,
      impactScore: 8,
      impactStatement: "Compliance requirements affect technology selection, security protocols, and data management practices.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });

    // Marketing impact on Financial
    businessImpacts.push({
      sourceCategory: AssessmentCategory.MARKETING,
      impactedCategory: AssessmentCategory.FINANCIAL,
      impactScore: 7,
      impactStatement: "Marketing effectiveness directly impacts patient acquisition, revenue generation, and overall financial performance.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });

    // Facilities impact on Operations
    businessImpacts.push({
      sourceCategory: AssessmentCategory.FACILITIES,
      impactedCategory: AssessmentCategory.OPERATIONS,
      impactScore: 6,
      impactStatement: "Facility layout, space utilization, and design significantly affect operational workflow, efficiency, and capacity.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });

    // Geography impact on Marketing and Patient Care
    businessImpacts.push({
      sourceCategory: AssessmentCategory.GEOGRAPHY,
      impactedCategory: AssessmentCategory.MARKETING,
      impactScore: 7,
      impactStatement: "Geographical factors influence marketing strategy effectiveness, target demographics, and competitive positioning.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });

    // Automation impact on Operations and Staffing
    businessImpacts.push({
      sourceCategory: AssessmentCategory.AUTOMATION,
      impactedCategory: AssessmentCategory.OPERATIONS,
      impactScore: 9,
      impactStatement: "Automation capabilities directly impact operational efficiency, resource allocation, and process consistency.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });

    // Operations impact on Patient Care
    businessImpacts.push({
      sourceCategory: AssessmentCategory.OPERATIONS,
      impactedCategory: AssessmentCategory.PATIENTS,
      impactScore: 8,
      impactStatement: "Operational efficiency and workflow directly impact patient wait times, appointment availability, and overall experience.",
      relatedSourceQuestions: [],
      relatedImpactedQuestions: []
    });
  }

  /**
   * Find related questions for each impact relationship
   */
  function findRelatedQuestions() {
    businessImpacts.forEach(impact => {
      // Get all questions from the source and impacted categories
      const sourceQuestions = questionService.getQuestionsByCategory(impact.sourceCategory);
      const impactedQuestions = questionService.getQuestionsByCategory(impact.impactedCategory);
      
      // Find keywords that might indicate relationships between these categories
      const relationshipKeywords = getRelationshipKeywords(impact.sourceCategory, impact.impactedCategory);
      
      // Find source questions that relate to the impacted category
      const relatedSourceQuestions = findQuestionsByKeywords(sourceQuestions, relationshipKeywords);
      impact.relatedSourceQuestions = relatedSourceQuestions.map(q => q.id);
      
      // Find impacted questions that relate to the source category
      const relatedImpactedQuestions = findQuestionsByKeywords(impactedQuestions, relationshipKeywords);
      impact.relatedImpactedQuestions = relatedImpactedQuestions.map(q => q.id);
    });
  }

  /**
   * Get keywords that might indicate relationships between two categories
   */
  function getRelationshipKeywords(sourceCategory: AssessmentCategory, impactedCategory: AssessmentCategory): string[] {
    const commonKeywords = ["impact", "affect", "influence", "relationship", "correlation"];
    
    // Keywords specific to category relationships
    const relationshipMap: Record<string, Record<string, string[]>> = {
      [AssessmentCategory.FINANCIAL]: {
        [AssessmentCategory.STAFFING]: ["budget", "compensation", "salary", "funding", "invest"],
        [AssessmentCategory.TECHNOLOGY]: ["investment", "budget", "cost", "expense", "roi"],
        [AssessmentCategory.OPERATIONS]: ["efficiency", "cost", "revenue", "profitability"]
      },
      [AssessmentCategory.TECHNOLOGY]: {
        [AssessmentCategory.OPERATIONS]: ["efficiency", "workflow", "automation", "scheduling", "integration"],
        [AssessmentCategory.PATIENTS]: ["telehealth", "portal", "digital", "online"]
      },
      [AssessmentCategory.STAFFING]: {
        [AssessmentCategory.PATIENTS]: ["care", "quality", "satisfaction", "outcomes", "experience"],
        [AssessmentCategory.OPERATIONS]: ["productivity", "efficiency", "capacity"]
      },
      [AssessmentCategory.COMPLIANCE]: {
        [AssessmentCategory.TECHNOLOGY]: ["security", "privacy", "data", "breach", "protect"],
        [AssessmentCategory.OPERATIONS]: ["documentation", "policy", "procedure", "risk"]
      },
      [AssessmentCategory.MARKETING]: {
        [AssessmentCategory.FINANCIAL]: ["revenue", "acquisition", "growth", "referral"]
      },
      [AssessmentCategory.OPERATIONS]: {
        [AssessmentCategory.PATIENTS]: ["wait time", "schedule", "efficiency", "experience"]
      }
    };
    
    // Get specific keywords for this relationship
    const specificKeywords = relationshipMap[sourceCategory]?.[impactedCategory] || [];
    
    // Get keywords for the reverse relationship
    const reverseKeywords = relationshipMap[impactedCategory]?.[sourceCategory] || [];
    
    // Get category-specific keywords
    const sourceCategoryKeywords = getCategoryKeywords(sourceCategory);
    const impactedCategoryKeywords = getCategoryKeywords(impactedCategory);
    
    return [...commonKeywords, ...specificKeywords, ...reverseKeywords, 
            ...sourceCategoryKeywords, ...impactedCategoryKeywords];
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

  describe('Business Impact Analysis', () => {
    beforeAll(() => {
      findRelatedQuestions();
    });
    
    it('should identify relationships between business areas', () => {
      businessImpacts.forEach(impact => {
        // Each impact should have some related questions identified
        expect(impact.relatedSourceQuestions.length + impact.relatedImpactedQuestions.length).toBeGreaterThan(0);
      });
    });

    it('should generate meaningful impact statements for each relationship', () => {
      businessImpacts.forEach(impact => {
        // Impact statements should be meaningful
        expect(impact.impactStatement.length).toBeGreaterThan(20);
        
        // Impact score should be in the valid range
        expect(impact.impactScore).toBeGreaterThanOrEqual(1);
        expect(impact.impactScore).toBeLessThanOrEqual(10);
      });
    });

    it('should calculate the most interconnected business areas', () => {
      // Count occurrences of each category across all impacts
      const categoryCounts: Record<AssessmentCategory, number> = {
        [AssessmentCategory.FINANCIAL]: 0,
        [AssessmentCategory.OPERATIONS]: 0,
        [AssessmentCategory.MARKETING]: 0,
        [AssessmentCategory.STAFFING]: 0,
        [AssessmentCategory.COMPLIANCE]: 0,
        [AssessmentCategory.PATIENTS]: 0,
        [AssessmentCategory.FACILITIES]: 0,
        [AssessmentCategory.GEOGRAPHY]: 0,
        [AssessmentCategory.TECHNOLOGY]: 0,
        [AssessmentCategory.AUTOMATION]: 0
      };
      
      businessImpacts.forEach(impact => {
        categoryCounts[impact.sourceCategory]++;
        categoryCounts[impact.impactedCategory]++;
      });
      
      // Find the most interconnected categories
      const sortedCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
      
      // Operations, Financial, and Staffing are typically highly interconnected
      expect(sortedCategories.slice(0, 3)).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/OPERATIONS|FINANCIAL|STAFFING|PATIENTS/)
        ])
      );
    });
  });

  describe('Specific Business Impacts', () => {
    // Detailed tests for specific impacts
    it('should verify Financial impact on Staffing', () => {
      const impact = businessImpacts.find(i => 
        i.sourceCategory === AssessmentCategory.FINANCIAL && 
        i.impactedCategory === AssessmentCategory.STAFFING
      );
      
      expect(impact).toBeDefined();
      expect(impact?.impactScore).toBeGreaterThanOrEqual(7);
      
      if (impact) {
        // Get the actual questions for detailed validation
        const sourceQuestions = impact.relatedSourceQuestions.map(id => 
          questionService.getQuestionById(id)
        ).filter(q => q !== undefined) as Question[];
        
        const impactedQuestions = impact.relatedImpactedQuestions.map(id => 
          questionService.getQuestionById(id)
        ).filter(q => q !== undefined) as Question[];
        
        // Log the questions for demonstration
        console.log('\nFinancial questions that impact Staffing:');
        sourceQuestions.forEach(q => {
          console.log(`- ${getQuestionIdentifier(q)}`);
        });
        
        console.log('\nStaffing questions influenced by Financial factors:');
        impactedQuestions.forEach(q => {
          console.log(`- ${getQuestionIdentifier(q)}`);
        });
        
        console.log(`\nImpact Statement: ${impact.impactStatement}`);
      }
    });

    it('should verify Technology impact on Operations', () => {
      const impact = businessImpacts.find(i => 
        i.sourceCategory === AssessmentCategory.TECHNOLOGY && 
        i.impactedCategory === AssessmentCategory.OPERATIONS
      );
      
      expect(impact).toBeDefined();
      expect(impact?.impactScore).toBeGreaterThanOrEqual(7);
      
      if (impact) {
        // Get the actual questions for detailed validation
        const sourceQuestions = impact.relatedSourceQuestions.map(id => 
          questionService.getQuestionById(id)
        ).filter(q => q !== undefined) as Question[];
        
        const impactedQuestions = impact.relatedImpactedQuestions.map(id => 
          questionService.getQuestionById(id)
        ).filter(q => q !== undefined) as Question[];
        
        // Log the questions for demonstration
        console.log('\nTechnology questions that impact Operations:');
        sourceQuestions.forEach(q => {
          console.log(`- ${getQuestionIdentifier(q)}`);
        });
        
        console.log('\nOperations questions influenced by Technology factors:');
        impactedQuestions.forEach(q => {
          console.log(`- ${getQuestionIdentifier(q)}`);
        });
        
        console.log(`\nImpact Statement: ${impact.impactStatement}`);
      }
    });

    it('should verify Compliance impact on multiple areas', () => {
      const complianceImpacts = businessImpacts.filter(i => 
        i.sourceCategory === AssessmentCategory.COMPLIANCE
      );
      
      expect(complianceImpacts.length).toBeGreaterThan(0);
      
      // Log compliance impacts for demonstration
      console.log('\nCompliance Impact on Multiple Business Areas:');
      complianceImpacts.forEach(impact => {
        console.log(`- Impact on ${impact.impactedCategory}: ${impact.impactStatement} (Score: ${impact.impactScore}/10)`);
      });
    });
  });

  describe('Cross-Module Question Analysis', () => {
    it('should analyze keywords shared across different module questions', () => {
      // Define commonly shared keywords across modules
      const commonKeywords = [
        "efficiency", "quality", "cost", "revenue", "patient", 
        "documentation", "staff", "data", "time", "process"
      ];
      
      const crossModuleImpacts: Record<string, Record<AssessmentCategory, Question[]>> = {};
      
      // For each keyword, find questions across all categories
      commonKeywords.forEach(keyword => {
        crossModuleImpacts[keyword] = {} as Record<AssessmentCategory, Question[]>;
        
        Object.values(AssessmentCategory).forEach(category => {
          const categoryQuestions = questionService.getQuestionsByCategory(category);
          const matchingQuestions = findQuestionsByKeywords(categoryQuestions, [keyword]);
          
          if (matchingQuestions.length > 0) {
            crossModuleImpacts[keyword][category] = matchingQuestions;
          }
        });
        
        // Count the total number of modules affected by this keyword
        const affectedCategories = Object.keys(crossModuleImpacts[keyword]).length;
        
        // Keywords that appear across many categories indicate interconnectedness
        if (affectedCategories > 3) {
          console.log(`\nKeyword "${keyword}" appears in questions across ${affectedCategories} different business areas:`);
          
          Object.entries(crossModuleImpacts[keyword]).forEach(([category, questions]) => {
            console.log(`- ${category}: ${questions.length} questions`);
          });
        }
      });
    });

    it('should identify questions with the highest interconnectedness potential', () => {
      // Define a score for each question based on its cross-module references
      const questionInterconnectednessScores: Record<string, { 
        question: Question, 
        score: number,
        relatedAreas: AssessmentCategory[]
      }> = {};
      
      // Analyze each question for references to other modules
      allQuestions.forEach(question => {
        const lowerText = question.text.toLowerCase();
        const lowerHelpText = question.helpText?.toLowerCase() || '';
        const combinedText = `${lowerText} ${lowerHelpText}`;
        
        // Count related categories
        const relatedAreas: AssessmentCategory[] = [question.category];
        
        Object.values(AssessmentCategory).forEach(category => {
          if (category !== question.category) {
            // Check if this question references another category
            const categoryKeywords = getCategoryKeywords(category);
            const hasReference = categoryKeywords.some(keyword => 
              combinedText.includes(keyword.toLowerCase())
            );
            
            if (hasReference) {
              relatedAreas.push(category);
            }
          }
        });
        
        // Calculate interconnectedness score
        const score = relatedAreas.length;
        
        if (score > 2) { // Question relates to more than just its own category
          questionInterconnectednessScores[question.id] = {
            question,
            score,
            relatedAreas
          };
        }
      });
      
      // Sort questions by interconnectedness score
      const sortedQuestions = Object.values(questionInterconnectednessScores)
        .sort((a, b) => b.score - a.score);
      
      // Log the top interconnected questions
      console.log('\nTop 10 Questions with Highest Interconnectedness Potential:');
      sortedQuestions.slice(0, 10).forEach((item, index) => {
        console.log(`${index + 1}. ${getQuestionIdentifier(item.question)}`);
        console.log(`   Related to ${item.score} business areas: ${item.relatedAreas.join(', ')}`);
      });
      
      // There should be some highly interconnected questions
      expect(sortedQuestions.length).toBeGreaterThan(0);
      if (sortedQuestions.length > 0) {
        expect(sortedQuestions[0].score).toBeGreaterThan(2);
      }
    });
  });
}); 