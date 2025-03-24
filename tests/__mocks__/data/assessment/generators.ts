import { QuestionModule, Answer, Question, ModuleCategory } from '../../../../client/src/types/assessment';
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
  type: ['text', 'numeric', 'boolean'][index % 3] as 'text' | 'numeric' | 'boolean',
  moduleId,
  weight: 1
});

export const generateMockModule = (index: number, questionCount: number): QuestionModule => ({
  id: `module${index}`,
  title: `Module ${index}`,
  description: `Description for module ${index}`,
  category: 'operations' as ModuleCategory,
  questions: Array.from({ length: questionCount }, (_, i) => generateMockQuestion(`module${index}`, i + 1))
});

export const generateMockModules = (options: GeneratorOptions = {}): QuestionModule[] => {
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

export const generateMockAnswers = (modules: QuestionModule[]): Record<string, Answer> => {
  const answers: Record<string, Answer> = {};
  
  modules.forEach(module => {
    module.questions.forEach(question => {
      let value: any;
      switch (question.type) {
        case 'text':
          value = `Answer for ${question.id}`;
          break;
        case 'numeric':
          value = Math.floor(Math.random() * 100);
          break;
        case 'boolean':
          value = Math.random() > 0.5;
          break;
      }
      answers[question.id] = { value };
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