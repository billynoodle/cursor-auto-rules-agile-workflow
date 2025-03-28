import { MockDataFactory } from '../../utils/test-helpers/MockDataFactory';
import { QuestionModule, Question, QuestionType, ModuleCategory } from '../../../client/src/types/assessment';
import { Assessment, AssessmentAnswer } from '../../../client/src/types/database';

// Common test modules with predictable data
export const testModules: QuestionModule[] = [
  MockDataFactory.createModule({
    id: 'financial-module',
    title: 'Financial Assessment',
    description: 'Evaluate financial health and metrics',
    category: 'financial',
    questions: [
      MockDataFactory.createQuestion({
        id: 'fin-q1',
        type: 'numeric',
        text: 'What is your annual revenue?',
        moduleId: 'financial-module',
        weight: 2
      }),
      MockDataFactory.createQuestion({
        id: 'fin-q2',
        type: 'multiple_choice',
        text: 'How do you handle financial planning?',
        moduleId: 'financial-module',
        weight: 1
      })
    ]
  }),
  MockDataFactory.createModule({
    id: 'operations-module',
    title: 'Operations Assessment',
    description: 'Evaluate operational efficiency',
    category: 'operations',
    questions: [
      MockDataFactory.createQuestion({
        id: 'ops-q1',
        type: 'text',
        text: 'Describe your patient scheduling process',
        moduleId: 'operations-module',
        weight: 1
      }),
      MockDataFactory.createQuestion({
        id: 'ops-q2',
        type: 'boolean',
        text: 'Do you use electronic health records?',
        moduleId: 'operations-module',
        weight: 1
      })
    ]
  })
];

// Common test assessments
export const testAssessments: Record<string, Assessment> = {
  empty: MockDataFactory.createAssessment({
    id: 'empty-assessment',
    current_module_id: testModules[0].id,
    current_question_id: testModules[0].questions[0].id,
    progress: 0,
    completed_modules: []
  }),
  inProgress: MockDataFactory.createAssessment({
    id: 'in-progress-assessment',
    current_module_id: testModules[1].id,
    current_question_id: testModules[1].questions[0].id,
    progress: 50,
    completed_modules: [testModules[0].id],
    status: 'in_progress'
  }),
  completed: MockDataFactory.createAssessment({
    id: 'completed-assessment',
    current_module_id: testModules[1].id,
    current_question_id: testModules[1].questions[1].id,
    progress: 100,
    completed_modules: testModules.map(m => m.id),
    is_complete: true,
    status: 'completed'
  })
};

// Common test answers
export const testAnswers: Record<string, AssessmentAnswer[]> = {
  empty: [],
  inProgress: [
    MockDataFactory.createAssessmentAnswer({
      assessment_id: testAssessments.inProgress.id,
      question_id: testModules[0].questions[0].id,
      answer: { value: 500000 }
    }),
    MockDataFactory.createAssessmentAnswer({
      assessment_id: testAssessments.inProgress.id,
      question_id: testModules[0].questions[1].id,
      answer: { value: 'value-2' }
    })
  ],
  completed: testModules.flatMap(module =>
    module.questions.map(question =>
      MockDataFactory.createAssessmentAnswer({
        assessment_id: testAssessments.completed.id,
        question_id: question.id,
        answer: {
          value: question.type === 'numeric' ? 750000 :
                 question.type === 'boolean' ? true :
                 question.type === 'multiple_choice' ? 'value-1' :
                 'Sample answer text'
        }
      })
    )
  )
};

// Test scenarios combining different states
export const testScenarios = {
  emptyAssessment: {
    modules: testModules,
    assessment: testAssessments.empty,
    answers: testAnswers.empty
  },
  inProgressAssessment: {
    modules: testModules,
    assessment: testAssessments.inProgress,
    answers: testAnswers.inProgress
  },
  completedAssessment: {
    modules: testModules,
    assessment: testAssessments.completed,
    answers: testAnswers.completed
  }
}; 