import { ModuleCategory, QuestionModule, Question as ClientQuestion, QuestionOption } from '../../../client/src/types/assessment';
import { Assessment, AssessmentAnswer } from '../../../client/src/types/database';
import { Question as ServerQuestion } from '../../../server/src/models/Question';
import { QuestionType } from '../../../server/src/models/QuestionType';
import { AssessmentCategory } from '../../../server/src/models/AssessmentCategory';
import { DisciplineType } from '../../../server/src/models/DisciplineType';
import { PracticeSize } from '../../../server/src/models/PracticeSize';

export class MockDataFactory {
  private static questionTypes = [
    QuestionType.TEXT,
    QuestionType.MULTIPLE_CHOICE,
    QuestionType.NUMERIC,
    QuestionType.LIKERT_SCALE
  ];

  private static categories: ModuleCategory[] = ['financial', 'operations', 'marketing', 'staffing', 'compliance'];
  
  private static disciplines = [
    DisciplineType.PHYSIOTHERAPY,
    DisciplineType.OCCUPATIONAL_THERAPY,
    DisciplineType.SPEECH_PATHOLOGY
  ];
  
  private static practiceSizes = [
    PracticeSize.SMALL,
    PracticeSize.MEDIUM,
    PracticeSize.LARGE
  ];

  static createServerQuestion(params: Partial<ServerQuestion> = {}): ServerQuestion {
    const id = params.id || `question-${Math.random().toString(36).substring(7)}`;
    const type = params.type || this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];
    
    const question: ServerQuestion = {
      id,
      type,
      text: params.text || `Test Question ${id}`,
      moduleId: params.moduleId || 'test-module',
      category: params.category || AssessmentCategory.COMPLIANCE,
      weight: params.weight || 1,
      applicableDisciplines: params.applicableDisciplines || [DisciplineType.PHYSIOTHERAPY],
      universalQuestion: params.universalQuestion ?? false,
      applicablePracticeSizes: params.applicablePracticeSizes || [PracticeSize.SMALL],
      options: type === QuestionType.MULTIPLE_CHOICE ? this.createQuestionOptions() : undefined,
      minScore: type === QuestionType.NUMERIC ? (params.minScore ?? 0) : undefined,
      maxScore: type === QuestionType.NUMERIC ? (params.maxScore ?? 100) : undefined
    };

    return question;
  }

  static createClientQuestion(params: Partial<ClientQuestion> = {}): ClientQuestion {
    const id = params.id || `question-${Math.random().toString(36).substring(7)}`;
    const serverType = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];
    const clientType = serverType.toLowerCase() as ClientQuestion['type'];
    
    const question: ClientQuestion = {
      id,
      type: params.type || clientType,
      text: params.text || `Test Question ${id}`,
      moduleId: params.moduleId || 'test-module',
      weight: params.weight || 1,
      options: serverType === QuestionType.MULTIPLE_CHOICE ? this.createQuestionOptions() : undefined
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

  static createModule(params: Partial<QuestionModule> = {}): QuestionModule {
    const id = params.id || `module-${Math.random().toString(36).substring(7)}`;
    const questionCount = params.questions?.length || 3;
    
    const module: QuestionModule = {
      id,
      title: params.title || `Test Module ${id}`,
      description: params.description || `Description for module ${id}`,
      category: params.category || this.categories[Math.floor(Math.random() * this.categories.length)],
      questions: params.questions || Array.from({ length: questionCount }, () => 
        this.createClientQuestion({ moduleId: id }))
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

  static createBulkModules(count: number, params: Partial<QuestionModule> = {}): QuestionModule[] {
    return Array.from({ length: count }, (_, i) => 
      this.createModule({
        ...params,
        id: params.id ? `${params.id}-${i}` : undefined
      })
    );
  }

  static createBulkClientQuestions(count: number, params: Partial<ClientQuestion> = {}): ClientQuestion[] {
    return Array.from({ length: count }, (_, i) => 
      this.createClientQuestion({
        ...params,
        id: params.id ? `${params.id}-${i}` : undefined
      })
    );
  }

  static createBulkServerQuestions(count: number, params: Partial<ServerQuestion> = {}): ServerQuestion[] {
    return Array.from({ length: count }, (_, i) => 
      this.createServerQuestion({
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