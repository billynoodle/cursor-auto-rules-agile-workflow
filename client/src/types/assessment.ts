export type QuestionType = 'multiple_choice' | 'text' | 'numeric' | 'boolean';
export type ModuleCategory = 'financial' | 'operations' | 'marketing' | 'staffing' | 'compliance' | 'patients' | 'facilities' | 'geography' | 'technology' | 'automation';

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  moduleId: string;
  weight: number;
  options?: QuestionOption[];
}

export interface QuestionModule {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  category: ModuleCategory;
}

export type Answer = Record<string, any>;

export interface AssessmentState {
  currentModuleId: string;
  currentQuestionId: string;
  answers: Record<string, Answer>;
  progress: number;
  completedModules: string[];
  isComplete: boolean;
}

export type StateSubscriber = (state: AssessmentState) => void; 