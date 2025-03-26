import { Module, Score, Question, AssessmentCategory, QuestionType, ModuleStatus } from '../../../../client/src/types/assessment.types';
import { Assessment, AssessmentAnswer, DatabaseSchema, AssessmentStatus } from '../../../../client/src/types/database';
import { v4 as uuidv4 } from 'uuid';

export interface GeneratorOptions {
  moduleCount?: number;
  questionsPerModule?: number;
  completedModules?: string[];
  currentProgress?: number;
  status?: AssessmentStatus;
}

export const generateMockQuestion = (moduleId: string, index: number): Question => ({
  id: `q${moduleId}-${index}`,
  text: `Question ${index} for module ${moduleId}`,
  type: [QuestionType.TEXT, QuestionType.NUMERIC, QuestionType.MULTIPLE_CHOICE][index % 3],
  required: true,
  weight: 1,
  dependencies: []
});

export const generateMockModule = (index: number, questionCount: number): Module => {
  const questions = Array.from({ length: questionCount }, (_, i) => generateMockQuestion(`module${index}`, i + 1));
  
  return {
    id: `module${index}`,
    name: `Module ${index}`,
    description: `Description for module ${index}`,
    categories: [AssessmentCategory.OPERATIONS],
    status: ModuleStatus.AVAILABLE,
    progress: 0,
    prerequisites: [],
    completedQuestions: 0,
    totalQuestions: questionCount,
    estimatedTimeMinutes: 15
  };
};

export const generateMockModules = (options: GeneratorOptions = {}): Module[] => {
  const { moduleCount = 3, questionsPerModule = 3 } = options;
  return Array.from({ length: moduleCount }, (_, i) => generateMockModule(i + 1, questionsPerModule));
};

export const generateMockAssessment = (options: GeneratorOptions = {}): Assessment => {
  const {
    completedModules = [],
    currentProgress = 0,
    status = 'draft'
  } = options;

  const assessmentId = uuidv4();
  const userId = uuidv4();
  const timestamp = new Date().toISOString();

  return {
    id: assessmentId,
    user_id: userId,
    current_module_id: 'module1',
    current_question_id: 'q1',
    progress: currentProgress,
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

export const generateMockAnswers = (modules: Module[]): Record<string, Score> => {
  const answers: Record<string, Score> = {};
  
  modules.forEach(module => {
    // Since questions are generated separately, we'll just create scores for the total questions
    for (let i = 0; i < module.totalQuestions; i++) {
      const questionId = `q${module.id}-${i + 1}`;
      answers[questionId] = {
        questionId,
        rawScore: Math.floor(Math.random() * 100),
        weightedScore: Math.floor(Math.random() * 100),
        maxPossible: 100
      };
    }
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