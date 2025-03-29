import { MockDataFactory } from '../../utils/test-helpers/MockDataFactory';
import { QuestionModule, Question, QuestionType, AssessmentCategory, ModuleCategory } from '@client/types/assessment';
import { Assessment, AssessmentAnswer } from '@client/types/database';
import { DisciplineType } from '@server/models/DisciplineType';
import { PracticeSize } from '@server/models/PracticeSize';

// Common test modules with predictable data
export const mockModules: QuestionModule[] = [
  {
    id: 'financial-module',
    title: 'Financial Assessment',
    description: 'Evaluate financial health and practices',
    categories: [AssessmentCategory.FINANCIAL],
    weight: 1,
    metadata: {
      category: 'financial' as ModuleCategory
    },
    questions: [
      {
        id: 'qmodule1-1',
        text: 'What is your annual revenue?',
        type: QuestionType.NUMBER,
        category: AssessmentCategory.FINANCIAL,
        moduleId: 'financial-module',
        applicableDisciplines: [],
        universalQuestion: true,
        weight: 1,
        applicablePracticeSizes: [],
        required: true,
        dependencies: [],
        helpText: 'Enter your annual revenue in dollars',
        metadata: {
          difficulty: 'medium',
          timeEstimate: 120
        }
      },
      {
        id: 'qmodule1-2',
        text: 'How do you track expenses?',
        type: QuestionType.MULTIPLE_CHOICE,
        category: AssessmentCategory.FINANCIAL,
        moduleId: 'financial-module',
        applicableDisciplines: [],
        universalQuestion: true,
        weight: 1,
        applicablePracticeSizes: [],
        required: true,
        dependencies: [],
        helpText: 'Select your expense tracking method',
        options: [
          { id: 'opt1', text: 'Spreadsheet', value: 'spreadsheet', score: 5 },
          { id: 'opt2', text: 'Accounting Software', value: 'software', score: 10 }
        ],
        metadata: {
          difficulty: 'medium',
          timeEstimate: 120
        }
      }
    ]
  },
  {
    id: 'operations-module',
    title: 'Operations Assessment',
    description: 'Evaluate operational efficiency',
    categories: [AssessmentCategory.OPERATIONS],
    weight: 1,
    metadata: {
      category: 'operations' as ModuleCategory
    },
    questions: [
      {
        id: 'qmodule2-1',
        text: 'How many employees do you have?',
        type: QuestionType.NUMBER,
        category: AssessmentCategory.OPERATIONS,
        moduleId: 'operations-module',
        applicableDisciplines: [],
        universalQuestion: true,
        weight: 1,
        applicablePracticeSizes: [],
        required: true,
        dependencies: [],
        helpText: 'Enter the total number of employees',
        metadata: {
          difficulty: 'medium',
          timeEstimate: 120
        }
      },
      {
        id: 'qmodule2-2',
        text: 'What scheduling system do you use?',
        type: QuestionType.MULTIPLE_CHOICE,
        category: AssessmentCategory.OPERATIONS,
        moduleId: 'operations-module',
        applicableDisciplines: [],
        universalQuestion: true,
        weight: 1,
        applicablePracticeSizes: [],
        required: true,
        dependencies: [],
        helpText: 'Select your scheduling system type',
        options: [
          { id: 'opt1', text: 'Paper Calendar', value: 'paper', score: 5 },
          { id: 'opt2', text: 'Digital Calendar', value: 'digital', score: 10 }
        ],
        metadata: {
          difficulty: 'medium',
          timeEstimate: 120
        }
      }
    ]
  }
];

// Helper to check if a question is numeric
const isNumericQuestion = (type: QuestionType): boolean => type === QuestionType.NUMBER;

// Common test assessments
export const testAssessments: Record<string, Assessment> = {
  empty: {
    id: 'empty-assessment',
    user_id: 'test-user',
    current_module_id: mockModules[0].id,
    current_question_id: mockModules[0].questions[0].id,
    progress: 0,
    completed_modules: [],
    is_complete: false,
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  inProgress: {
    id: 'in-progress-assessment',
    user_id: 'test-user',
    current_module_id: mockModules[1].id,
    current_question_id: mockModules[1].questions[0].id,
    progress: 50,
    completed_modules: [mockModules[0].id],
    is_complete: false,
    status: 'in_progress',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  completed: {
    id: 'completed-assessment',
    user_id: 'test-user',
    current_module_id: mockModules[1].id,
    current_question_id: mockModules[1].questions[1].id,
    progress: 100,
    completed_modules: mockModules.map(m => m.id),
    is_complete: true,
    status: 'completed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

// Common test answers
export const testAnswers: Record<string, AssessmentAnswer[]> = {
  empty: [],
  inProgress: [
    MockDataFactory.createAssessmentAnswer({
      assessment_id: testAssessments.inProgress.id,
      question_id: mockModules[0].questions[0].id,
      answer: { value: 500000 }
    }),
    MockDataFactory.createAssessmentAnswer({
      assessment_id: testAssessments.inProgress.id,
      question_id: mockModules[0].questions[1].id,
      answer: { value: 'value-2' }
    })
  ],
  completed: mockModules.flatMap(module =>
    module.questions.map(question =>
      MockDataFactory.createAssessmentAnswer({
        assessment_id: testAssessments.completed.id,
        question_id: question.id,
        answer: {
          value: question.type === QuestionType.NUMBER ? 750000 :
                 question.type === QuestionType.MULTIPLE_CHOICE ? 'value-1' :
                 question.type === QuestionType.TEXT ? 'Sample answer text' :
                 'Unknown type'
        }
      })
    )
  )
};

// Test scenarios combining different states
export const testScenarios = {
  emptyAssessment: {
    modules: mockModules,
    assessment: testAssessments.empty,
    answers: testAnswers.empty
  },
  inProgressAssessment: {
    modules: mockModules,
    assessment: testAssessments.inProgress,
    answers: testAnswers.inProgress
  },
  completedAssessment: {
    modules: mockModules,
    assessment: testAssessments.completed,
    answers: testAnswers.completed
  }
}; 