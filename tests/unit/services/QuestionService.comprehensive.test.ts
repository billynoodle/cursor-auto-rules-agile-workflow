import '@jest/globals';
import { QuestionService } from '../../../server/src/services/QuestionService';
import { MockDataFactory } from '../../utils/test-helpers/MockDataFactory';
import { Question } from '../../../server/src/models/Question';
import { QuestionType } from '../../../server/src/models/QuestionType';
import { AssessmentCategory } from '../../../server/src/models/AssessmentCategory';
import { DisciplineType } from '../../../server/src/models/DisciplineType';
import { PracticeSize } from '../../../server/src/models/PracticeSize';
import { Country } from '../../../server/src/models/Country';
import { loadAllQuestions } from '../../../server/src/data/questions';

// Import question data sets
import * as financial from '../../../server/src/data/questions/financial';
import * as operations from '../../../server/src/data/questions/operations';
import * as compliance from '../../../server/src/data/questions/compliance';
import { regulatoryComplianceQuestions } from '../../../server/src/data/questions/compliance/regulatory-compliance';

// Import test utilities
import { TestContextBuilder } from '../../utils/test-helpers/TestContextBuilder';

describe('QuestionService', () => {
  let questionService: QuestionService;

  beforeEach(() => {
    questionService = new QuestionService();
  });

  describe('Core Question Operations', () => {
    it('should retrieve a question by id', () => {
      const mockQuestion = MockDataFactory.createServerQuestion();
      questionService.addQuestions([mockQuestion]);

      const result = questionService.getQuestionById(mockQuestion.id);
      expect(result).toEqual(mockQuestion);
    });

    it('should return undefined for non-existent question id', () => {
      const mockQuestion = MockDataFactory.createServerQuestion();
      questionService.addQuestions([mockQuestion]);

      const result = questionService.getQuestionById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should get all questions', () => {
      const mockQuestions = MockDataFactory.createBulkServerQuestions(3);
      questionService.addQuestions(mockQuestions);

      const result = questionService.getAllQuestions();
      expect(result).toEqual(mockQuestions);
    });
  });

  describe('Module Operations', () => {
    it('should get questions by module', () => {
      const moduleId = 'test-module';
      const moduleQuestions = MockDataFactory.createBulkServerQuestions(3, { moduleId });
      const otherQuestions = MockDataFactory.createBulkServerQuestions(2, { moduleId: 'other-module' });
      
      questionService.addQuestions([...moduleQuestions, ...otherQuestions]);

      const result = questionService.getQuestionsByModule(moduleId);
      expect(result).toEqual(moduleQuestions);
    });

    it('should handle empty module results', () => {
      const mockQuestions = MockDataFactory.createBulkServerQuestions(2);
      questionService.addQuestions(mockQuestions);

      const result = questionService.getQuestionsByModule('non-existent-module');
      expect(result).toEqual([]);
    });
  });

  describe('Compliance Questions', () => {
    it('should filter compliance questions', () => {
      const complianceQuestions = MockDataFactory.createBulkServerQuestions(2, {
        category: AssessmentCategory.COMPLIANCE
      });
      const otherQuestions = MockDataFactory.createBulkServerQuestions(2, {
        category: AssessmentCategory.OPERATIONS
      });
      
      questionService.addQuestions([...complianceQuestions, ...otherQuestions]);

      const result = questionService.getQuestionsByCategory(AssessmentCategory.COMPLIANCE);
      expect(result).toEqual(complianceQuestions);
    });

    it('should handle regulatory compliance questions', () => {
      const regulatoryQuestions = MockDataFactory.createBulkServerQuestions(3, {
        category: AssessmentCategory.COMPLIANCE,
        text: 'Regulatory requirement'
      });
      
      questionService.addQuestions(regulatoryQuestions);
      const result = questionService.getQuestionsByCategory(AssessmentCategory.COMPLIANCE);
      expect(result).toEqual(regulatoryQuestions);
    });
  });

  describe('Cross-Module Operations', () => {
    it('should filter questions by discipline', () => {
      const physioQuestions = MockDataFactory.createBulkServerQuestions(2, {
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY]
      });
      const otherQuestions = MockDataFactory.createBulkServerQuestions(2, {
        applicableDisciplines: [DisciplineType.OCCUPATIONAL_THERAPY]
      });
      
      questionService.addQuestions([...physioQuestions, ...otherQuestions]);

      const result = questionService.getQuestionsByDiscipline(DisciplineType.PHYSIOTHERAPY);
      expect(result).toEqual(physioQuestions);
    });

    it('should filter questions by practice size', () => {
      const smallPracticeQuestions = MockDataFactory.createBulkServerQuestions(2, {
        applicablePracticeSizes: [PracticeSize.SMALL]
      });
      const largePracticeQuestions = MockDataFactory.createBulkServerQuestions(2, {
        applicablePracticeSizes: [PracticeSize.LARGE]
      });
      
      questionService.addQuestions([...smallPracticeQuestions, ...largePracticeQuestions]);

      const result = questionService.getQuestionsByPracticeSize(PracticeSize.SMALL);
      expect(result).toEqual(smallPracticeQuestions);
    });

    it('should filter questions by type', () => {
      const multipleChoiceQuestions = MockDataFactory.createBulkServerQuestions(2, {
        type: QuestionType.MULTIPLE_CHOICE
      });
      const numericQuestions = MockDataFactory.createBulkServerQuestions(2, {
        type: QuestionType.NUMERIC
      });
      
      questionService.addQuestions([...multipleChoiceQuestions, ...numericQuestions]);

      const result = questionService.getQuestionsByType(QuestionType.MULTIPLE_CHOICE);
      expect(result).toEqual(multipleChoiceQuestions);
    });
  });

  describe('Question Validation', () => {
    it('should validate required fields in questions', () => {
      const invalidQuestion = { id: 'test' } as Question;
      expect(() => questionService.createQuestion(invalidQuestion))
        .toThrow('Question must have id, text, and moduleId');
    });

    it('should validate question type', () => {
      const invalidQuestion = {
        ...MockDataFactory.createServerQuestion(),
        type: 'invalid-type' as QuestionType
      };

      expect(() => questionService.createQuestion(invalidQuestion))
        .toThrow('Question must have a valid type');
    });

    it('should validate multiple choice options', () => {
      const invalidQuestion = {
        ...MockDataFactory.createServerQuestion(),
        type: QuestionType.MULTIPLE_CHOICE,
        options: []
      };

      expect(() => questionService.createQuestion(invalidQuestion))
        .toThrow('Multiple choice questions must have at least two options');
    });
  });

  describe('Core Functionality', () => {
    describe('Question Creation and Validation', () => {
      it('should create a valid question', () => {
        const validQuestion = MockDataFactory.createServerQuestion({
          id: 'test-001',
          type: QuestionType.MULTIPLE_CHOICE,
          moduleId: 'module-1'
        });

        const createdQuestion = questionService.createQuestion(validQuestion);
        expect(createdQuestion).toEqual(validQuestion);
        
        const retrievedQuestion = questionService.getQuestionById('test-001');
        expect(retrievedQuestion).toEqual(validQuestion);
      });

      it('should throw error for question without required fields', () => {
        const invalidQuestion = {
          text: 'Invalid question',
          type: QuestionType.TEXT
        } as unknown as Question;

        expect(() => {
          questionService.createQuestion(invalidQuestion);
        }).toThrow('Question must have id, text, and moduleId');
      });

      it('should throw error for invalid question type', () => {
        const invalidQuestion = MockDataFactory.createServerQuestion({
          type: 'INVALID_TYPE' as QuestionType
        });

        expect(() => {
          questionService.createQuestion(invalidQuestion);
        }).toThrow('Question must have a valid type');
      });
    });

    describe('Question Retrieval', () => {
      it('should retrieve question by id', () => {
        const validQuestion = MockDataFactory.createServerQuestion({
          id: 'test-001',
          type: QuestionType.MULTIPLE_CHOICE,
          moduleId: 'module-1'
        });
        questionService.addQuestions([validQuestion]);
        const retrieved = questionService.getQuestionById(validQuestion.id);
        expect(retrieved).toEqual(validQuestion);
      });

      it('should return undefined for non-existent question', () => {
        const retrieved = questionService.getQuestionById('non-existent');
        expect(retrieved).toBeUndefined();
      });
    });
  });

  describe('Module Operations', () => {
    beforeEach(() => {
      questionService = new QuestionService();
      const allQuestions = loadAllQuestions();
      questionService.addQuestions(allQuestions);
    });

    describe('Financial Module', () => {
      it('should retrieve financial questions by category', () => {
        const questions = questionService.getQuestionsByCategory(AssessmentCategory.FINANCIAL);
        
        const financialQuestions = Object.values(financial)
          .filter(Array.isArray)
          .flat()
          .filter(q => q && q.id);
        
        expect(questions.length).toEqual(financialQuestions.length);
        expect(questions.some(q => q.id.startsWith('fin-cash-'))).toBeTruthy();
        expect(questions.some(q => q.id.startsWith('fin-exp-'))).toBeTruthy();
      });

      it('should retrieve cash flow planning questions', () => {
        const cashFlowQuestions = questionService.getFilteredQuestions()
          .filter(q => q.id.startsWith('fin-cash-'));
        
        expect(cashFlowQuestions.length).toBeGreaterThan(0);
        expect(cashFlowQuestions[0].text).toContain('accounts receivable');
      });
    });

    describe('Operations Module', () => {
      it('should retrieve operations questions by category', () => {
        const questions = questionService.getQuestionsByCategory(AssessmentCategory.OPERATIONS);
        
        expect(questions.some(q => q.id.startsWith('ops-sched-'))).toBeTruthy();
        expect(questions.some(q => q.id.startsWith('ops-flow-'))).toBeTruthy();
      });

      it('should retrieve scheduling questions', () => {
        const schedulingQuestions = questionService.getFilteredQuestions()
          .filter(q => q.id.startsWith('ops-sched-'));
        
        expect(schedulingQuestions.length).toBeGreaterThan(0);
        expect(schedulingQuestions[0].text).toContain('cancellation');
      });
    });
  });

  describe('Compliance Module', () => {
    beforeEach(() => {
      questionService = new QuestionService();
      questionService.addQuestions(compliance.complianceQuestions);
    });

    it('should load all compliance questions correctly', () => {
      const questions = questionService.getQuestionsByCategory(AssessmentCategory.COMPLIANCE);
      
      expect(questions.length).toBeGreaterThan(0);
      expect(questions).toEqual(expect.arrayContaining(compliance.complianceQuestions));
    });

    it('should include regulatory compliance questions', () => {
      const questions = questionService.getQuestionsByCategory(AssessmentCategory.COMPLIANCE);
      
      regulatoryComplianceQuestions.forEach(regQuestion => {
        const found = questions.find(q => q.id === regQuestion.id);
        expect(found).toBeDefined();
        expect(found?.text).toEqual(regQuestion.text);
      });
    });

    describe('Country-Specific Content', () => {
      it('should return Australia-specific content for compliance questions', () => {
        const baseQuestion = questionService.getQuestionById('comp-risk-006');
        expect(baseQuestion).toBeDefined();
        
        if (baseQuestion) {
          const australiaQuestion = questionService.getCountrySpecificQuestion(
            baseQuestion,
            Country.AUSTRALIA
          );
          
          expect(australiaQuestion.helpText).not.toEqual(baseQuestion.helpText);
          expect(australiaQuestion.helpText).toContain('Privacy Act 1988');
        }
      });
    });
  });

  describe('Cross-Module Operations', () => {
    beforeEach(() => {
      questionService = new QuestionService();
      const allQuestions = loadAllQuestions();
      questionService.addQuestions(allQuestions);
    });

    describe('Filtering', () => {
      it('should filter questions by practice size across modules', () => {
        const smallPracticeQuestions = questionService.getQuestionsByPracticeSize(PracticeSize.SMALL);
        
        expect(smallPracticeQuestions.some(q => q.id.startsWith('fin-'))).toBeTruthy();
        expect(smallPracticeQuestions.some(q => q.id.startsWith('tech-'))).toBeTruthy();
        expect(smallPracticeQuestions.some(q => q.id.startsWith('staff-'))).toBeTruthy();
      });

      it('should filter questions by discipline across modules', () => {
        const physioQuestions = questionService.getQuestionsByDiscipline(DisciplineType.PHYSIOTHERAPY);
        
        expect(physioQuestions.some(q => q.id.startsWith('fin-'))).toBeTruthy();
        expect(physioQuestions.some(q => q.id.startsWith('comp-'))).toBeTruthy();
        expect(physioQuestions.some(q => q.id.startsWith('ops-'))).toBeTruthy();
      });

      it('should filter questions by multiple criteria', () => {
        const filteredQuestions = questionService.getFilteredQuestions(
          undefined,
          DisciplineType.PHYSIOTHERAPY,
          PracticeSize.SMALL,
          AssessmentCategory.TECHNOLOGY
        );
        
        expect(filteredQuestions.every(q => q.category === AssessmentCategory.TECHNOLOGY)).toBeTruthy();
        expect(filteredQuestions.every(q => 
          q.universalQuestion || q.applicableDisciplines.includes(DisciplineType.PHYSIOTHERAPY)
        )).toBeTruthy();
        expect(filteredQuestions.every(q => 
          q.universalQuestion || q.applicablePracticeSizes.includes(PracticeSize.SMALL)
        )).toBeTruthy();
      });
    });
  });
}); 