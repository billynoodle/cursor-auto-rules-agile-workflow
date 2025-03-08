import '@jest/globals';
import { QuestionService } from '../../../server/src/services/QuestionService';
import { Question } from '../../../server/src/models/Question';
import { QuestionType } from '../../../server/src/models/QuestionType';
import { AssessmentCategory } from '../../../server/src/models/AssessmentCategory';
import { DisciplineType } from '../../../server/src/models/DisciplineType';
import { PracticeSize } from '../../../server/src/models/PracticeSize';
import { Country } from '../../../server/src/models/Country';
import { complianceQuestions } from '../../../server/src/data/questions/compliance';
import { regulatoryComplianceQuestions } from '../../../server/src/data/questions/compliance/regulatory-compliance';

describe('QuestionService - Compliance Questions', () => {
  let questionService: QuestionService;

  beforeEach(() => {
    questionService = new QuestionService();
    questionService.addQuestions(complianceQuestions);
  });

  describe('Compliance Questions Loading', () => {
    it('should load all compliance questions correctly', () => {
      const questions = questionService.getQuestionsByCategory(AssessmentCategory.COMPLIANCE);
      
      expect(questions.length).toBeGreaterThan(0);
      expect(questions).toEqual(expect.arrayContaining(complianceQuestions));
    });

    it('should include regulatory compliance questions', () => {
      const questions = questionService.getQuestionsByCategory(AssessmentCategory.COMPLIANCE);
      
      // Check that all regulatory compliance questions are included
      regulatoryComplianceQuestions.forEach(regQuestion => {
        const found = questions.find(q => q.id === regQuestion.id);
        expect(found).toBeDefined();
        expect(found?.text).toEqual(regQuestion.text);
      });
    });
  });

  describe('Regulatory Compliance Questions', () => {
    it('should retrieve privacy training question by id', () => {
      const question = questionService.getQuestionById('comp-risk-006');
      
      expect(question).toBeDefined();
      expect(question?.id).toBe('comp-risk-006');
      expect(question?.text).toContain('privacy policies and procedures');
      expect(question?.type).toBe(QuestionType.MULTIPLE_CHOICE);
    });

    it('should retrieve workplace safety question by id', () => {
      const question = questionService.getQuestionById('comp-risk-007');
      
      expect(question).toBeDefined();
      expect(question?.id).toBe('comp-risk-007');
      expect(question?.text).toContain('workplace health and safety plan');
      expect(question?.type).toBe(QuestionType.MULTIPLE_CHOICE);
    });

    it('should retrieve CPD question by id', () => {
      const question = questionService.getQuestionById('comp-risk-008');
      
      expect(question).toBeDefined();
      expect(question?.id).toBe('comp-risk-008');
      expect(question?.text).toContain('continuing professional development');
      expect(question?.type).toBe(QuestionType.NUMERIC);
    });
  });

  describe('Question Filtering', () => {
    it('should filter compliance questions by practice size', () => {
      const questions = questionService.getFilteredQuestions(
        undefined,
        undefined,
        PracticeSize.SMALL,
        AssessmentCategory.COMPLIANCE
      );
      
      expect(questions.length).toBeGreaterThan(0);
      
      // All regulatory compliance questions should be applicable to small practices
      regulatoryComplianceQuestions.forEach(regQuestion => {
        const found = questions.find(q => q.id === regQuestion.id);
        expect(found).toBeDefined();
      });
    });

    it('should filter compliance questions by discipline', () => {
      const questions = questionService.getFilteredQuestions(
        undefined,
        DisciplineType.PHYSIOTHERAPY,
        undefined,
        AssessmentCategory.COMPLIANCE
      );
      
      expect(questions.length).toBeGreaterThan(0);
      
      // All regulatory compliance questions should be applicable to physiotherapy
      regulatoryComplianceQuestions.forEach(regQuestion => {
        const found = questions.find(q => q.id === regQuestion.id);
        expect(found).toBeDefined();
      });
    });
  });

  describe('Country-Specific Content', () => {
    it('should return Australia-specific content for compliance questions', () => {
      // Test for question with country-specific content
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

// Additional tests to improve coverage
describe('QuestionService - Core Functionality', () => {
  let questionService: QuestionService;

  beforeEach(() => {
    questionService = new QuestionService();
  });

  describe('Question Creation and Validation', () => {
    it('should create a valid question', () => {
      const validQuestion: Question = {
        id: 'test-001',
        moduleId: 'module-1',
        text: 'Is this a valid question?',
        type: QuestionType.MULTIPLE_CHOICE,
        category: AssessmentCategory.COMPLIANCE,
        options: [
          { value: 'opt1', text: 'Yes', score: 10 },
          { value: 'opt2', text: 'No', score: 0 }
        ],
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY, DisciplineType.OCCUPATIONAL_THERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM],
        weight: 5,
        universalQuestion: false
      };

      const createdQuestion = questionService.createQuestion(validQuestion);
      expect(createdQuestion).toEqual(validQuestion);
      
      const retrievedQuestion = questionService.getQuestionById('test-001');
      expect(retrievedQuestion).toEqual(validQuestion);
    });

    it('should throw error for question without required fields', () => {
      const invalidQuestion = {
        // Missing id, moduleId
        text: 'Invalid question',
        type: QuestionType.TEXT,
        category: AssessmentCategory.COMPLIANCE,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL],
        weight: 5,
        universalQuestion: false
      } as unknown as Question;

      expect(() => {
        questionService.createQuestion(invalidQuestion);
      }).toThrow('Question must have id, text, and moduleId');
    });

    it('should throw error for invalid question type', () => {
      const invalidQuestion = {
        id: 'test-002',
        moduleId: 'module-1',
        text: 'Question with invalid type',
        type: 'INVALID_TYPE' as QuestionType,
        category: AssessmentCategory.COMPLIANCE,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL],
        weight: 5,
        universalQuestion: false
      } as unknown as Question;

      expect(() => {
        questionService.createQuestion(invalidQuestion);
      }).toThrow('Question must have a valid type');
    });

    it('should throw error for invalid question category', () => {
      const invalidQuestion = {
        id: 'test-003',
        moduleId: 'module-1',
        text: 'Question with invalid category',
        type: QuestionType.TEXT,
        category: 'INVALID_CATEGORY' as AssessmentCategory,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL],
        weight: 5,
        universalQuestion: false
      } as unknown as Question;

      expect(() => {
        questionService.createQuestion(invalidQuestion);
      }).toThrow('Question must have a valid category');
    });

    it('should throw error for question without applicable disciplines', () => {
      const invalidQuestion = {
        id: 'test-004',
        moduleId: 'module-1',
        text: 'Question without disciplines',
        type: QuestionType.TEXT,
        category: AssessmentCategory.COMPLIANCE,
        applicableDisciplines: [],
        applicablePracticeSizes: [PracticeSize.SMALL],
        weight: 5,
        universalQuestion: false
      } as unknown as Question;

      expect(() => {
        questionService.createQuestion(invalidQuestion);
      }).toThrow('Question must have at least one applicable discipline');
    });

    it('should throw error for question without applicable practice sizes', () => {
      const invalidQuestion = {
        id: 'test-005',
        moduleId: 'module-1',
        text: 'Question without practice sizes',
        type: QuestionType.TEXT,
        category: AssessmentCategory.COMPLIANCE,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [],
        weight: 5,
        universalQuestion: false
      } as unknown as Question;

      expect(() => {
        questionService.createQuestion(invalidQuestion);
      }).toThrow('Question must have at least one applicable practice size');
    });

    it('should throw error for multiple choice question without options', () => {
      const invalidQuestion = {
        id: 'test-006',
        moduleId: 'module-1',
        text: 'Multiple choice question without options',
        type: QuestionType.MULTIPLE_CHOICE,
        category: AssessmentCategory.COMPLIANCE,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL],
        weight: 5,
        universalQuestion: false
      } as unknown as Question;

      expect(() => {
        questionService.createQuestion(invalidQuestion);
      }).toThrow('Multiple choice questions must have at least two options');
    });

    it('should throw error for numeric question without min/max score', () => {
      const invalidQuestion = {
        id: 'test-007',
        moduleId: 'module-1',
        text: 'Numeric question without min/max',
        type: QuestionType.NUMERIC,
        category: AssessmentCategory.COMPLIANCE,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL],
        weight: 5,
        universalQuestion: false
      } as unknown as Question;

      expect(() => {
        questionService.createQuestion(invalidQuestion);
      }).toThrow('Numeric questions must have minScore and maxScore defined');
    });

    it('should throw error for numeric question with invalid min/max range', () => {
      const invalidQuestion = {
        id: 'test-008',
        moduleId: 'module-1',
        text: 'Numeric question with invalid range',
        type: QuestionType.NUMERIC,
        category: AssessmentCategory.COMPLIANCE,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL],
        weight: 5,
        minScore: 10,
        maxScore: 5,
        universalQuestion: false
      } as unknown as Question;

      expect(() => {
        questionService.createQuestion(invalidQuestion);
      }).toThrow('Numeric question minScore must be less than maxScore');
    });

    it('should throw error for question with invalid weight', () => {
      const invalidQuestion = {
        id: 'test-009',
        moduleId: 'module-1',
        text: 'Question with invalid weight',
        type: QuestionType.TEXT,
        category: AssessmentCategory.COMPLIANCE,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL],
        weight: 15, // Invalid: should be 1-10
        universalQuestion: false
      } as unknown as Question;

      expect(() => {
        questionService.createQuestion(invalidQuestion);
      }).toThrow('Question weight must be between 1 and 10');
    });
  });

  describe('Question Retrieval Methods', () => {
    beforeEach(() => {
      // Add some test questions for retrieval tests
      const testQuestions: Question[] = [
        {
          id: 'q1',
          moduleId: 'module-1',
          text: 'Module 1 Question',
          type: QuestionType.MULTIPLE_CHOICE,
          category: AssessmentCategory.COMPLIANCE,
          options: [{ value: 'o1', text: 'Yes', score: 10 }, { value: 'o2', text: 'No', score: 0 }],
          applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
          applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM],
          weight: 5,
          universalQuestion: false
        },
        {
          id: 'q2',
          moduleId: 'module-2',
          text: 'Module 2 Question',
          type: QuestionType.TEXT,
          category: AssessmentCategory.TECHNOLOGY,
          applicableDisciplines: [DisciplineType.OCCUPATIONAL_THERAPY, DisciplineType.PHYSIOTHERAPY],
          applicablePracticeSizes: [PracticeSize.SMALL],
          weight: 3,
          universalQuestion: false
        },
        {
          id: 'q3',
          moduleId: 'module-1',
          text: 'Universal Question',
          type: QuestionType.NUMERIC,
          category: AssessmentCategory.TECHNOLOGY,
          applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
          applicablePracticeSizes: [PracticeSize.LARGE],
          weight: 7,
          minScore: 1,
          maxScore: 10,
          universalQuestion: true
        },
        {
          id: 'q4',
          moduleId: 'module-3',
          text: 'Discipline Specific Question',
          type: QuestionType.MULTIPLE_CHOICE,
          category: AssessmentCategory.STAFFING,
          options: [{ value: 'o1', text: 'Yes', score: 10 }, { value: 'o2', text: 'No', score: 0 }],
          applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
          applicablePracticeSizes: [PracticeSize.MEDIUM],
          weight: 6,
          universalQuestion: false,
          disciplineSpecific: {
            [DisciplineType.PHYSIOTHERAPY]: {
              text: 'Physio specific version',
              helpText: 'Physio specific help'
            }
          }
        }
      ];
      
      questionService.addQuestions(testQuestions);
    });

    it('should retrieve questions by module', () => {
      const module1Questions = questionService.getQuestionsByModule('module-1');
      expect(module1Questions.length).toBe(2);
      expect(module1Questions[0].id).toBe('q1');
      expect(module1Questions[1].id).toBe('q3');
    });

    it('should retrieve questions by type', () => {
      const numericQuestions = questionService.getQuestionsByType(QuestionType.NUMERIC);
      expect(numericQuestions.length).toBe(1);
      expect(numericQuestions[0].id).toBe('q3');
    });

    it('should retrieve questions by practice size', () => {
      const smallPracticeQuestions = questionService.getQuestionsByPracticeSize(PracticeSize.SMALL);
      expect(smallPracticeQuestions.length).toBe(2);
    });

    it('should retrieve discipline-specific questions', () => {
      const question = questionService.getQuestionById('q4');
      expect(question).toBeDefined();
      
      if (question) {
        const physioVersion = questionService.getDisciplineSpecificQuestion(
          question,
          DisciplineType.PHYSIOTHERAPY
        );
        
        expect(physioVersion.text).toBe('Physio specific version');
        expect(physioVersion.helpText).toBe('Physio specific help');
      }
    });
    
    it('should retrieve questions by discipline including universal', () => {
      const physioQuestions = questionService.getQuestionsByDiscipline(DisciplineType.PHYSIOTHERAPY);
      expect(physioQuestions.length).toBe(4); // All questions apply to physiotherapy
      
      const otQuestions = questionService.getQuestionsByDiscipline(DisciplineType.OCCUPATIONAL_THERAPY);
      expect(otQuestions.length).toBe(2); // q2 applies to OT and q3 is universal
    });
  });
}); 