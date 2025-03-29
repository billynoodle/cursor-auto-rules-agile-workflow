import '@jest/globals';
import { QuestionService } from '@server/services/QuestionService';
import { MockDataFactory } from '../../utils/test-helpers/MockDataFactory';
import { Question } from '@server/models/Question';
import { QuestionType } from '@server/models/QuestionType';
import { AssessmentCategory } from '@server/models/AssessmentCategory';
import { PracticeSize } from '@server/models/PracticeSize';
import { DisciplineType } from '@server/models/DisciplineType';
import { Country } from '@server/models/Country';
import { loadAllQuestions } from '@server/data/questions';

// Import question data sets
import * as financial from '../../../server/src/data/questions/financial';
import * as operations from '../../../server/src/data/questions/operations';
import * as compliance from '../../../server/src/data/questions/compliance';
import { regulatoryComplianceQuestions } from '../../../server/src/data/questions/compliance/regulatory-compliance';

// Import test utilities
import { TestContextBuilder } from '../../utils/test-helpers/TestContextBuilder';

describe('QuestionService', () => {
  let questionService: QuestionService;

  const mockQuestions: Question[] = [
    {
      id: 'q1',
      text: 'Test Question 1',
      moduleId: 'module1',
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        { value: 'A', text: 'Option A', score: 1 },
        { value: 'B', text: 'Option B', score: 2 },
        { value: 'C', text: 'Option C', score: 3 }
      ],
      category: AssessmentCategory.OPERATIONS,
      applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
      applicablePracticeSizes: [PracticeSize.SMALL],
      universalQuestion: false,
      weight: 1
    },
    {
      id: 'q2',
      text: 'Test Question 2',
      moduleId: 'module1',
      type: QuestionType.TEXT,
      category: AssessmentCategory.COMPLIANCE,
      applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
      applicablePracticeSizes: [PracticeSize.MEDIUM],
      universalQuestion: false,
      weight: 1
    },
    {
      id: 'q3',
      text: 'Test Question 3',
      moduleId: 'module2',
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        { value: 'Yes', text: 'Yes', score: 1 },
        { value: 'No', text: 'No', score: 0 }
      ],
      category: AssessmentCategory.COMPLIANCE,
      applicableDisciplines: [DisciplineType.OCCUPATIONAL_THERAPY],
      applicablePracticeSizes: [PracticeSize.LARGE],
      universalQuestion: false,
      weight: 1
    }
  ];

  beforeEach(() => {
    questionService = new QuestionService();
    questionService.addQuestions(mockQuestions);
  });

  describe('Core Question Operations', () => {
    it('should retrieve a question by id', () => {
      const mockQuestion = MockDataFactory.createQuestion();
      questionService.addQuestions([mockQuestion]);

      const result = questionService.getQuestionById(mockQuestion.id);
      expect(result).toEqual(mockQuestion);
    });

    it('should return undefined for non-existent question id', () => {
      const mockQuestion = MockDataFactory.createQuestion();
      questionService.addQuestions([mockQuestion]);

      const result = questionService.getQuestionById('non-existent-id');
      expect(result).toBeUndefined();
    });

    it('should get all questions', () => {
      const questions = questionService.getAllQuestions();
      expect(questions).toHaveLength(mockQuestions.length);
      expect(questions).toEqual(expect.arrayContaining(mockQuestions));
    });
  });

  describe('Module Operations', () => {
    it('should get questions by module', () => {
      const module1Questions = questionService.getQuestionsByModule('module1');
      expect(module1Questions).toHaveLength(2);
      expect(module1Questions.every(q => q.moduleId === 'module1')).toBe(true);
    });

    it('should handle empty module results', () => {
      const emptyModuleQuestions = questionService.getQuestionsByModule('non-existent');
      expect(emptyModuleQuestions).toHaveLength(0);
    });
  });

  describe('Compliance Questions', () => {
    it('should filter compliance questions', () => {
      const complianceQuestions = questionService.getQuestionsByCategory(AssessmentCategory.COMPLIANCE);
      expect(complianceQuestions).toHaveLength(2);
      expect(complianceQuestions.every(q => q.category === AssessmentCategory.COMPLIANCE)).toBe(true);
    });

    it('should handle regulatory compliance questions', () => {
      const regulatoryQuestions = questionService.getQuestionsByCategory(AssessmentCategory.COMPLIANCE);
      expect(regulatoryQuestions).toHaveLength(2);
      expect(regulatoryQuestions.every(q => q.category === AssessmentCategory.COMPLIANCE)).toBe(true);
    });
  });

  describe('Cross-Module Operations', () => {
    it('should filter questions by discipline', () => {
      const physioQuestions = questionService.getQuestionsByDiscipline(DisciplineType.PHYSIOTHERAPY);
      expect(physioQuestions).toHaveLength(2);
      expect(physioQuestions.every(q => q.applicableDisciplines.includes(DisciplineType.PHYSIOTHERAPY))).toBe(true);
    });

    it('should filter questions by practice size', () => {
      const smallPracticeQuestions = questionService.getQuestionsByPracticeSize(PracticeSize.SMALL);
      expect(smallPracticeQuestions).toHaveLength(1);
      expect(smallPracticeQuestions[0].applicablePracticeSizes).toContain(PracticeSize.SMALL);
    });

    it('should filter questions by type', () => {
      const multipleChoiceQuestions = questionService.getQuestionsByType(QuestionType.MULTIPLE_CHOICE);
      expect(multipleChoiceQuestions).toHaveLength(2);
      expect(multipleChoiceQuestions.every(q => q.type === QuestionType.MULTIPLE_CHOICE)).toBe(true);
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
        ...MockDataFactory.createQuestion(),
        type: 'invalid-type' as QuestionType
      };

      expect(() => questionService.createQuestion(invalidQuestion))
        .toThrow('Question must have a valid type');
    });

    it('should validate multiple choice options', () => {
      const invalidQuestion = {
        ...MockDataFactory.createQuestion(),
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
        const validQuestion = MockDataFactory.createQuestion({
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
        const invalidQuestion = MockDataFactory.createQuestion({
          type: 'INVALID_TYPE' as QuestionType
        });

        expect(() => {
          questionService.createQuestion(invalidQuestion);
        }).toThrow('Question must have a valid type');
      });
    });

    describe('Question Retrieval', () => {
      it('should retrieve question by id', () => {
        const validQuestion = MockDataFactory.createQuestion({
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