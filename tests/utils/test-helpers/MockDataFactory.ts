import { 
  QuestionType as ClientQuestionType,
  AssessmentCategory as ClientAssessmentCategory,
  PracticeSize as ClientPracticeSize,
  ModuleStatus,
  Question as ClientQuestion,
  Module,
  QuestionOption
} from '../../../client/src/types/assessment.types';
import { Assessment, AssessmentAnswer } from '../../../client/src/types/database';
import { 
  Question as ServerQuestion,
  QuestionType as ServerQuestionType,
  AssessmentCategory as ServerAssessmentCategory,
  DisciplineType,
  PracticeSize as ServerPracticeSize
} from '@server/models';

export class MockDataFactory {
  private static questionTypes = [
    ServerQuestionType.TEXT,
    ServerQuestionType.MULTIPLE_CHOICE,
    ServerQuestionType.NUMERIC,
    ServerQuestionType.LIKERT_SCALE
  ];

  private static categories = [
    ServerAssessmentCategory.FINANCIAL,
    ServerAssessmentCategory.OPERATIONS,
    ServerAssessmentCategory.MARKETING,
    ServerAssessmentCategory.STAFFING,
    ServerAssessmentCategory.COMPLIANCE
  ];

  private static disciplines = [
    DisciplineType.PHYSIOTHERAPY,
    DisciplineType.OCCUPATIONAL_THERAPY,
    DisciplineType.SPEECH_PATHOLOGY
  ];

  private static practiceSizes = [
    ServerPracticeSize.SMALL,
    ServerPracticeSize.MEDIUM,
    ServerPracticeSize.LARGE
  ];

  static createQuestion(params: Partial<ServerQuestion> = {}): ServerQuestion {
    const id = params.id || `question-${Math.random().toString(36).substring(7)}`;
    const type = params.type || ServerQuestionType.MULTIPLE_CHOICE;
    const text = params.text || `Test Question ${id}`;
    const moduleId = params.moduleId || 'test-module';
    const category = params.category || ServerAssessmentCategory.FINANCIAL;
    const applicableDisciplines = params.applicableDisciplines || [DisciplineType.PHYSIOTHERAPY];
    const applicablePracticeSizes = params.applicablePracticeSizes || [ServerPracticeSize.SMALL];
    const weight = params.weight || 1;
    
    const question: ServerQuestion = {
      id,
      type,
      text,
      moduleId,
      category,
      applicableDisciplines,
      universalQuestion: params.universalQuestion ?? false,
      options: type === ServerQuestionType.MULTIPLE_CHOICE ? this.createQuestionOptions() : undefined,
      weight,
      applicablePracticeSizes,
      minScore: type === ServerQuestionType.NUMERIC ? (params.minScore ?? 0) : undefined,
      maxScore: type === ServerQuestionType.NUMERIC ? (params.maxScore ?? 100) : undefined,
      ...params
    };

    // Ensure multiple choice questions have options
    if (type === ServerQuestionType.MULTIPLE_CHOICE && !question.options) {
      question.options = this.createQuestionOptions();
    }

    return question;
  }

  static createClientQuestion(params: Partial<ClientQuestion> = {}): ClientQuestion {
    const id = params.id || `question-${Math.random().toString(36).substring(7)}`;
    const type = params.type || ClientQuestionType.MULTIPLE_CHOICE;
    
    const question: ClientQuestion = {
      id,
      type,
      text: params.text || `Test Question ${id}`,
      description: params.description,
      category: params.category || ClientAssessmentCategory.FINANCIAL,
      moduleId: params.moduleId || 'test-module',
      applicableDisciplines: params.applicableDisciplines || [DisciplineType.PHYSIOTHERAPY],
      universalQuestion: params.universalQuestion ?? false,
      applicablePracticeSizes: params.applicablePracticeSizes || [ClientPracticeSize.SMALL],
      options: type === ClientQuestionType.MULTIPLE_CHOICE ? this.createQuestionOptions() : undefined,
      required: params.required ?? true,
      weight: params.weight || 1,
      dependencies: params.dependencies || [],
      minScore: params.minScore,
      maxScore: params.maxScore,
      helpText: params.helpText,
      benchmarkReference: params.benchmarkReference,
      impactAreas: params.impactAreas,
      metadata: params.metadata
    };

    return question;
  }

  static createQuestionOptions(count: number = 4): QuestionOption[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `option-${i}`,
      value: `value-${i}`,
      score: i,
      text: `Option ${i + 1}`
    }));
  }

  static createModule(params: Partial<Module> = {}): Module {
    const id = params.id || `module-${Math.random().toString(36).substring(7)}`;
    
    const module: Module = {
      id,
      title: params.title || `Test Module ${id}`,
      name: params.name || `Test Module ${id}`,
      description: params.description || `Description for module ${id}`,
      categories: params.categories || [ClientAssessmentCategory.FINANCIAL],
      questions: params.questions || [],
      weight: params.weight || 1,
      estimatedTimeMinutes: params.estimatedTimeMinutes || 30,
      status: params.status || ModuleStatus.NOT_STARTED,
      progress: params.progress || 0,
      prerequisites: params.prerequisites || [],
      completedQuestions: params.completedQuestions || 0,
      totalQuestions: params.totalQuestions || 10,
      dependencies: params.dependencies || [],
      metadata: params.metadata
    };

    return module;
  }

  static createAssessment(params: Partial<Assessment> = {}): Assessment {
    const id = params.id || `assessment-${Math.random().toString(36).substring(7)}`;
    const moduleId = params.current_module_id || 'test-module';
    
    return {
      id,
      user_id: params.user_id || 'test-user',
      current_module_id: moduleId,
      current_question_id: params.current_question_id || 'test-question',
      progress: params.progress || 0,
      completed_modules: params.completed_modules || [],
      is_complete: params.is_complete || false,
      status: params.status || 'draft',
      created_at: params.created_at || new Date().toISOString(),
      updated_at: params.updated_at || new Date().toISOString()
    };
  }

  static createAssessmentAnswer(params: Partial<AssessmentAnswer> = {}): AssessmentAnswer {
    return {
      id: params.id || `answer-${Math.random().toString(36).substring(7)}`,
      assessment_id: params.assessment_id || 'test-assessment',
      question_id: params.question_id || 'test-question',
      answer: params.answer || { value: 'test answer' },
      created_at: params.created_at || new Date().toISOString(),
      updated_at: params.updated_at || new Date().toISOString()
    };
  }

  static createBulkModules(count: number, params: Partial<Module> = {}): Module[] {
    return Array.from({ length: count }, (_, i) => 
      this.createModule({
        ...params,
        id: params.id ? `${params.id}-${i}` : undefined
      })
    );
  }

  static createBulkQuestions(count: number, params: Partial<ServerQuestion> = {}): ServerQuestion[] {
    return Array.from({ length: count }, (_, i) => 
      this.createQuestion({
        ...params,
        id: params.id ? `${params.id}-${i}` : undefined
      })
    );
  }

  static createBulkAnswers(count: number, params: Partial<AssessmentAnswer> = {}): AssessmentAnswer[] {
    return Array.from({ length: count }, (_, i) => 
      this.createAssessmentAnswer({
        ...params,
        id: params.id ? `${params.id}-${i}` : undefined
      })
    );
  }
} 