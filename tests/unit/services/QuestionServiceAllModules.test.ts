import '@jest/globals';
import { QuestionService } from '../../../server/src/services/QuestionService';
import { Question } from '../../../server/src/models/Question';
import { QuestionType } from '../../../server/src/models/QuestionType';
import { AssessmentCategory } from '../../../server/src/models/AssessmentCategory';
import { DisciplineType } from '../../../server/src/models/DisciplineType';
import { PracticeSize } from '../../../server/src/models/PracticeSize';
import { Country } from '../../../server/src/models/Country';
import { loadAllQuestions } from '../../../server/src/data/questions';

// Import individual module question sets for specific testing
import * as financial from '../../../server/src/data/questions/financial';
import * as operations from '../../../server/src/data/questions/operations';
import * as patientCare from '../../../server/src/data/questions/patient-care';
import * as technology from '../../../server/src/data/questions/technology';
import * as staffing from '../../../server/src/data/questions/staffing';
import * as marketing from '../../../server/src/data/questions/marketing';
import * as compliance from '../../../server/src/data/questions/compliance';
import * as facilities from '../../../server/src/data/questions/facilities';
import * as geography from '../../../server/src/data/questions/geography';
import * as automation from '../../../server/src/data/questions/automation';

describe('QuestionService - All Modules', () => {
  let questionService: QuestionService;
  let allQuestions: Question[];

  beforeEach(() => {
    questionService = new QuestionService();
    allQuestions = loadAllQuestions();
    questionService.addQuestions(allQuestions);
  });

  describe('Loading All Questions', () => {
    it('should load all questions correctly', () => {
      const loadedQuestions = questionService.getAllQuestions();
      
      expect(loadedQuestions.length).toEqual(allQuestions.length);
      expect(loadedQuestions).toEqual(expect.arrayContaining(allQuestions));
    });
  });

  describe('Financial Module Questions', () => {
    it('should retrieve financial questions by category', () => {
      const questions = questionService.getQuestionsByCategory(AssessmentCategory.FINANCIAL);
      
      // Check that all financial questions are included
      const financialQuestions = Object.values(financial)
        .filter(Array.isArray)
        .flat()
        .filter(q => q && q.id);
      
      expect(questions.length).toEqual(financialQuestions.length);
      
      // Verify some specific financial questions
      expect(questions.some(q => q.id.startsWith('fin-cash-'))).toBeTruthy();
      expect(questions.some(q => q.id.startsWith('fin-exp-'))).toBeTruthy();
      expect(questions.some(q => q.id.startsWith('fin-rev-'))).toBeTruthy();
      expect(questions.some(q => q.id.startsWith('fin-price-'))).toBeTruthy();
    });

    it('should retrieve cash flow planning questions', () => {
      const cashFlowQuestions = questionService.getFilteredQuestions()
        .filter(q => q.id.startsWith('fin-cash-'));
      
      expect(cashFlowQuestions.length).toBeGreaterThan(0);
      
      // Check one specific cash flow question
      const cashFlowQuestion = questionService.getQuestionById('fin-cash-001');
      expect(cashFlowQuestion).toBeDefined();
      expect(cashFlowQuestion?.text).toContain('accounts receivable');
    });
  });

  describe('Operations Module Questions', () => {
    it('should retrieve operations questions by category', () => {
      const questions = questionService.getQuestionsByCategory(AssessmentCategory.OPERATIONS);
      
      // Verify some specific operations questions
      expect(questions.some(q => q.id.startsWith('ops-sched-'))).toBeTruthy();
      expect(questions.some(q => q.id.startsWith('ops-flow-'))).toBeTruthy();
    });

    it('should retrieve scheduling questions', () => {
      const schedulingQuestions = questionService.getFilteredQuestions()
        .filter(q => q.id.startsWith('ops-sched-'));
      
      expect(schedulingQuestions.length).toBeGreaterThan(0);
      
      // Check one specific scheduling question
      const schedulingQuestion = questionService.getQuestionById('ops-sched-001');
      expect(schedulingQuestion).toBeDefined();
      expect(schedulingQuestion?.text).toContain('cancellation');
    });
  });

  describe('Staffing Module Questions', () => {
    it('should retrieve staffing questions by category', () => {
      const questions = questionService.getQuestionsByCategory(AssessmentCategory.STAFFING);
      
      // Verify some specific staffing questions
      expect(questions.some(q => q.id.startsWith('staff-rec-'))).toBeTruthy();
      expect(questions.some(q => q.id.startsWith('staff-dev-'))).toBeTruthy();
      expect(questions.some(q => q.id.startsWith('staff-perf-'))).toBeTruthy();
    });

    it('should retrieve professional development questions', () => {
      const devQuestions = questionService.getFilteredQuestions()
        .filter(q => q.id.startsWith('staff-dev-'));
      
      expect(devQuestions.length).toBeGreaterThan(0);
      
      // Check one specific professional development question
      const devQuestion = questionService.getQuestionById('staff-dev-001');
      expect(devQuestion).toBeDefined();
      expect(devQuestion?.text).toContain('continuing education');
    });
  });

  describe('Technology Module Questions', () => {
    it('should retrieve technology questions by category', () => {
      const questions = questionService.getQuestionsByCategory(AssessmentCategory.TECHNOLOGY);
      
      // Verify some specific technology questions
      expect(questions.some(q => q.id.startsWith('tech-sec-'))).toBeTruthy();
      expect(questions.some(q => q.id.startsWith('tech-dig-'))).toBeTruthy();
    });

    it('should retrieve data security questions', () => {
      const securityQuestions = questionService.getFilteredQuestions()
        .filter(q => q.id.startsWith('tech-sec-'));
      
      expect(securityQuestions.length).toBeGreaterThan(0);
      
      // Check one specific security question
      const securityQuestion = questionService.getQuestionById('tech-sec-001');
      expect(securityQuestion).toBeDefined();
      expect(securityQuestion?.text).toContain('security risk assessment');
    });
  });

  describe('Patient Care Module Questions', () => {
    it('should retrieve patient care questions by category', () => {
      const questions = questionService.getQuestionsByCategory(AssessmentCategory.PATIENTS);
      
      // Verify some specific patient care questions
      expect(questions.some(q => q.id.startsWith('pat-out-'))).toBeTruthy();
      expect(questions.some(q => q.id.startsWith('pat-path-'))).toBeTruthy();
      expect(questions.some(q => q.id.startsWith('pat-exp-'))).toBeTruthy();
    });

    it('should retrieve outcomes tracking questions', () => {
      const outcomeQuestions = questionService.getFilteredQuestions()
        .filter(q => q.id.startsWith('pat-out-'));
      
      expect(outcomeQuestions.length).toBeGreaterThan(0);
      
      // Check one specific outcome question
      const outcomeQuestion = questionService.getQuestionById('pat-out-001');
      expect(outcomeQuestion).toBeDefined();
      expect(outcomeQuestion?.text).toContain('outcome measures');
    });
  });

  describe('Filtering Questions Across Multiple Modules', () => {
    it('should filter questions by practice size across modules', () => {
      const smallPracticeQuestions = questionService.getQuestionsByPracticeSize(PracticeSize.SMALL);
      
      // Verify questions from different modules are included
      expect(smallPracticeQuestions.some(q => q.id.startsWith('fin-'))).toBeTruthy();
      expect(smallPracticeQuestions.some(q => q.id.startsWith('tech-'))).toBeTruthy();
      expect(smallPracticeQuestions.some(q => q.id.startsWith('staff-'))).toBeTruthy();
    });

    it('should filter questions by discipline across modules', () => {
      const physioQuestions = questionService.getQuestionsByDiscipline(DisciplineType.PHYSIOTHERAPY);
      
      // Verify that questions from all modules are included
      expect(physioQuestions.some(q => q.id.startsWith('fin-'))).toBeTruthy();
      expect(physioQuestions.some(q => q.id.startsWith('comp-'))).toBeTruthy();
      expect(physioQuestions.some(q => q.id.startsWith('ops-'))).toBeTruthy();
    });

    it('should filter questions by multiple criteria across modules', () => {
      const filteredQuestions = questionService.getFilteredQuestions(
        undefined, // moduleId
        DisciplineType.PHYSIOTHERAPY,
        PracticeSize.SMALL,
        AssessmentCategory.TECHNOLOGY
      );
      
      // All questions should be from Technology category
      expect(filteredQuestions.every(q => q.category === AssessmentCategory.TECHNOLOGY)).toBeTruthy();
      
      // All questions should be applicable to physiotherapy
      expect(filteredQuestions.every(q => 
        q.universalQuestion || q.applicableDisciplines.includes(DisciplineType.PHYSIOTHERAPY)
      )).toBeTruthy();
      
      // All questions should be applicable to small practices
      expect(filteredQuestions.every(q => 
        q.applicablePracticeSizes.includes(PracticeSize.SMALL)
      )).toBeTruthy();
    });
  });

  describe('Question Types Across Modules', () => {
    it('should retrieve multiple choice questions across modules', () => {
      const multipleChoiceQuestions = questionService.getQuestionsByType(QuestionType.MULTIPLE_CHOICE);
      
      // Verify multiple choice questions from different modules
      expect(multipleChoiceQuestions.some(q => q.id.startsWith('fin-'))).toBeTruthy();
      expect(multipleChoiceQuestions.some(q => q.id.startsWith('tech-'))).toBeTruthy();
      expect(multipleChoiceQuestions.some(q => q.id.startsWith('comp-'))).toBeTruthy();
    });

    it('should retrieve numeric questions across modules', () => {
      const numericQuestions = questionService.getQuestionsByType(QuestionType.NUMERIC);
      
      // Verify numeric questions from different modules
      expect(numericQuestions.some(q => q.id.startsWith('fin-'))).toBeTruthy();
      expect(numericQuestions.some(q => q.id.startsWith('staff-'))).toBeTruthy();
      expect(numericQuestions.some(q => q.id.startsWith('ops-'))).toBeTruthy();
    });
  });
}); 