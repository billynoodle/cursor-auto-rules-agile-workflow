import { AssessmentState, QuestionModule } from '../../../types/assessment';
import { AssessmentService } from '../../../services/AssessmentService';
import { AssessmentBase } from '../AssessmentBase';
import { IAssessmentInitialization } from '../types';

export class AssessmentInitialization extends AssessmentBase implements IAssessmentInitialization {
  public async create(
    modules: QuestionModule[], 
    assessmentService: AssessmentService, 
    userId: string, 
    existingAssessmentId?: string
  ): Promise<void> {
    this.context.modules = modules;
    this.context.assessmentService = assessmentService;
    this.context.userId = userId;

    // Initialize maps for quick lookups
    this.context.modules.forEach(module => {
      this.context.moduleMap.set(module.id, module);
      module.questions.forEach(question => {
        this.context.questionMap.set(question.id, question);
      });
    });

    // Initialize state
    this.context.state = {
      currentModuleId: modules[0]?.id || '',
      currentQuestionId: modules[0]?.questions[0]?.id || '',
      answers: {},
      progress: 0,
      completedModules: [],
      isComplete: false
    };

    if (existingAssessmentId) {
      await this.loadAssessment(existingAssessmentId);
    } else {
      await this.createAssessment();
    }
  }

  public async loadAssessment(assessmentId: string): Promise<void> {
    try {
      const assessment = await this.context.assessmentService.getAssessment(assessmentId);
      if (!assessment) throw new Error('Assessment not found');

      const answers = await this.context.assessmentService.getAnswers(assessmentId);
      
      // Convert answers to state format
      const stateAnswers: Record<string, any> = {};
      answers.forEach(answer => {
        stateAnswers[answer.question_id] = answer.answer;
      });

      this.context.state = {
        currentModuleId: assessment.current_module_id,
        currentQuestionId: assessment.current_question_id,
        answers: stateAnswers,
        progress: assessment.progress,
        completedModules: assessment.completed_modules,
        isComplete: assessment.is_complete
      };

      this.context.assessmentId = assessmentId;
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to load assessment:', error);
      throw error;
    }
  }

  public async createAssessment(): Promise<void> {
    try {
      const assessment = await this.context.assessmentService.createAssessment({
        user_id: this.context.userId,
        current_module_id: this.context.state.currentModuleId,
        current_question_id: this.context.state.currentQuestionId,
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft'
      });

      this.context.assessmentId = assessment.id;
    } catch (error) {
      console.error('Failed to create assessment:', error);
      throw error;
    }
  }
} 