import { Question, AssessmentCategory, QuestionType, ModuleStatus, QuestionModule, QuestionOption, Answer, ModuleCategory } from '@client/types/assessment';
import { Assessment, AssessmentAnswer, DatabaseSchema, AssessmentStatus } from '@client/types/database';
import { v4 as uuidv4 } from 'uuid';
import { DisciplineType } from '@client/types/discipline';
import { PracticeSize } from '@client/types/practice';
import { generateQuestionId as clientGenerateQuestionId, QUESTION_ID_PREFIX as clientQuestionIdPrefix } from '@client/utils/assessment';

export interface GeneratorOptions {
  moduleCount?: number;
  questionsPerModule?: number;
  optionsPerQuestion?: number;
  category?: AssessmentCategory;
  moduleCategory?: ModuleCategory;
  simulateNetworkError?: boolean;
  simulateTimeout?: boolean;
  status?: AssessmentStatus;
  progress?: number;
  completedModules?: string[];
}

export const QUESTION_ID_SEPARATOR = '-';
export const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';
export const TEST_ASSESSMENT_ID = '00000000-0000-0000-0000-000000000002';

// Export our own versions to avoid conflicts
export const generateQuestionId = clientGenerateQuestionId;
export const QUESTION_ID_PREFIX = clientQuestionIdPrefix;

export const generateMockQuestion = (moduleId: string, index: number): Question => ({
  id: generateQuestionId(moduleId, index),
  text: `Question ${index} for module ${moduleId}`,
  moduleId,
  type: [QuestionType.TEXT, QuestionType.NUMBER, QuestionType.MULTIPLE_CHOICE][index % 3],
  required: true,
  weight: 1,
  dependencies: [],
  category: AssessmentCategory.FINANCIAL,
  applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
  applicablePracticeSizes: [PracticeSize.SMALL],
  universalQuestion: false,
  helpText: `Help text for question ${index}`
});

export const generateMockQuestions = (params: Partial<GeneratorOptions> = {}, moduleId: string): Question[] => {
  const { questionsPerModule = 3 } = params;
  return Array.from({ length: questionsPerModule }, (_, i) => ({
    id: generateQuestionId(moduleId, i + 1),
    text: `Question ${i + 1} for module ${moduleId}`,
    moduleId,
    type: [QuestionType.TEXT, QuestionType.NUMBER, QuestionType.MULTIPLE_CHOICE][i % 3],
    required: true,
    weight: 1,
    dependencies: [],
    category: AssessmentCategory.FINANCIAL,
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    applicablePracticeSizes: [PracticeSize.SMALL],
    universalQuestion: false,
    helpText: `Help text for question ${i + 1}`,
    options: [QuestionType.MULTIPLE_CHOICE].includes([QuestionType.TEXT, QuestionType.NUMBER, QuestionType.MULTIPLE_CHOICE][i % 3]) 
      ? [
          { id: `opt1-q${i}`, text: 'Option 1', value: 'value-1', score: 5 },
          { id: `opt2-q${i}`, text: 'Option 2', value: 'value-2', score: 10 }
        ]
      : undefined
  }));
};

export const generateMockModule = (params: Partial<GeneratorOptions> = {}, index: number = 0): QuestionModule => {
  const moduleId = `module${index + 1}`;
  const moduleCategory = params.moduleCategory || 'operations' as ModuleCategory;
  
  return {
    id: moduleId,
    title: `Module ${index + 1}`,
    description: `Description for module ${index + 1}`,
    categories: [AssessmentCategory.OPERATIONS],
    questions: generateMockQuestions(params, moduleId),
    weight: 1,
    metadata: {
      category: moduleCategory
    },
    estimatedTimeMinutes: 30,
    status: ModuleStatus.NOT_STARTED,
    progress: 0,
    completedQuestions: 0,
    totalQuestions: params.questionsPerModule || 3,
    dependencies: []
  };
};

export const generateMockModules = (options: GeneratorOptions = {}): QuestionModule[] => {
  const { moduleCount = 3 } = options;
  return Array.from({ length: moduleCount }, (_, i) => generateMockModule(options, i));
};

export const generateMockAssessment = (options: GeneratorOptions = {}): Assessment => {
  const {
    status = 'draft' as AssessmentStatus,
    progress = 0,
    completedModules = []
  } = options;

  const assessmentId = uuidv4();
  const userId = uuidv4();
  const timestamp = new Date().toISOString();

  return {
    id: assessmentId,
    user_id: userId,
    current_module_id: 'module1',
    current_question_id: 'qmodule1-1',
    progress,
    completed_modules: completedModules,
    is_complete: status === 'completed',
    status,
    created_at: timestamp,
    updated_at: timestamp,
    metadata: {
      version: '1.0.0',
      lastSaved: timestamp
    }
  };
};

export const generateMockAnswer = (questionId: string, value: any): AssessmentAnswer => ({
  id: uuidv4(),
  assessment_id: uuidv4(),
  question_id: questionId,
  answer: { value },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  metadata: {
    version: '1.0.0',
    validatedAt: new Date().toISOString()
  }
});

export const generateMockAnswers = (modules: QuestionModule[]): Record<string, Answer> => {
  const answers: Record<string, Answer> = {};
  
  modules.forEach(module => {
    module.questions.forEach((question, index) => {
      answers[`q${module.id}-${index + 1}`] = {
        value: Math.floor(Math.random() * 100),
        metadata: {
          rawScore: Math.floor(Math.random() * 100),
          weightedScore: Math.floor(Math.random() * 100),
          maxPossible: 100
        }
      };
    });
  });

  return answers;
};

export const generateFullMockData = (options: GeneratorOptions = {}) => {
  const modules = generateMockModules(options);
  const assessment = generateMockAssessment(options);
  const answers = generateMockAnswers(modules);

  return {
    modules,
    assessment,
    answers
  };
};

export class MockDataFactory {
  static createQuestion(params: Partial<Question> = {}): Question {
    const id = params.id || `test-question-${Math.random().toString(36).substring(7)}`;
    const text = params.text || `Test question ${id}`;
    const moduleId = params.moduleId || 'test-module-1';
    const type = params.type || QuestionType.MULTIPLE_CHOICE;
    const required = params.required ?? true;
    const weight = params.weight || 5;
    const dependencies = params.dependencies || [];
    const applicableDisciplines = params.applicableDisciplines || [DisciplineType.PHYSIOTHERAPY];
    const applicablePracticeSizes = params.applicablePracticeSizes || [PracticeSize.SMALL];
    const category = params.category || AssessmentCategory.FINANCIAL;
    const helpText = params.helpText || `Help text for ${text}`;
    const universalQuestion = params.universalQuestion ?? false;

    const baseQuestion: Question = {
      id,
      text,
      moduleId,
      type,
      required,
      weight,
      dependencies,
      applicableDisciplines,
      applicablePracticeSizes,
      category,
      helpText,
      universalQuestion,
      options: type === QuestionType.MULTIPLE_CHOICE ? this.createQuestionOptions() : undefined
    };

    return {
      ...baseQuestion,
      ...params
    };
  }

  static createQuestionOptions(): QuestionOption[] {
    return [
      { id: 'opt1', value: 'excellent', score: 5, text: '>90% of AR under 30 days, <2% over 90 days' },
      { id: 'opt2', value: 'good', score: 4, text: '>80% of AR under 30 days, <5% over 90 days' },
      { id: 'opt3', value: 'average', score: 3, text: '>70% of AR under 30 days, <10% over 90 days' },
      { id: 'opt4', value: 'concerning', score: 1, text: '<70% of AR under 30 days, 10-20% over 90 days' },
      { id: 'opt5', value: 'critical', score: 0, text: '<60% of AR under 30 days, >20% over 90 days or don\'t track' }
    ];
  }
} 