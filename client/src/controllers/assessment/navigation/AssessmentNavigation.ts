import { Question, QuestionModule } from '../../../types/assessment';
import { AssessmentBase } from '../AssessmentBase';
import { IAssessmentNavigation } from '../types';

export class AssessmentNavigation extends AssessmentBase implements IAssessmentNavigation {
  public async nextQuestion(): Promise<void> {
    await this.ensureInitialized();
    const prevState = { ...this.context.state };

    try {
      // Get current module and question
      const currentModule = this.context.modules[this.context.currentModule];
      const questions = currentModule.questions;

      // Update current question/module
      if (this.context.currentQuestion < questions.length - 1) {
        this.context.currentQuestion++;
        this.context.state.currentQuestionId = questions[this.context.currentQuestion].id;
      } else if (this.context.currentModule < this.context.modules.length - 1) {
        this.context.currentModule++;
        this.context.currentQuestion = 0;
        const nextModule = this.context.modules[this.context.currentModule];
        this.context.state.currentModuleId = nextModule.id;
        this.context.state.currentQuestionId = nextModule.questions[0].id;
      } else {
        // At the end of assessment
        this.context.state.isComplete = true;
      }

      // Persist state
      await this.context.assessmentService.updateAssessment(this.context.assessmentId!, {
        current_module_id: this.context.state.currentModuleId,
        current_question_id: this.context.state.currentQuestionId,
        progress: this.context.state.progress,
        completed_modules: this.context.state.completedModules,
        is_complete: this.context.state.isComplete,
        status: this.context.state.isComplete ? 'completed' : 'in_progress'
      });
      this.notifySubscribers();
    } catch (error) {
      // Roll back state on error
      this.context.state = prevState;
      this.context.currentModule = this.context.modules.findIndex(m => m.id === prevState.currentModuleId);
      const currentModule = this.context.modules[this.context.currentModule];
      this.context.currentQuestion = currentModule.questions.findIndex(q => q.id === prevState.currentQuestionId);
      throw error;
    }
  }

  public async previousQuestion(): Promise<void> {
    await this.ensureInitialized();
    const prevState = { ...this.context.state };

    try {
      // Get current module and question
      const currentModule = this.context.modules[this.context.currentModule];

      // Update current question/module
      if (this.context.currentQuestion > 0) {
        this.context.currentQuestion--;
        this.context.state.currentQuestionId = currentModule.questions[this.context.currentQuestion].id;
      } else if (this.context.currentModule > 0) {
        this.context.currentModule--;
        const prevModule = this.context.modules[this.context.currentModule];
        this.context.currentQuestion = prevModule.questions.length - 1;
        this.context.state.currentModuleId = prevModule.id;
        this.context.state.currentQuestionId = prevModule.questions[this.context.currentQuestion].id;
      }

      // Persist state
      await this.context.assessmentService.updateAssessment(this.context.assessmentId!, {
        current_module_id: this.context.state.currentModuleId,
        current_question_id: this.context.state.currentQuestionId,
        progress: this.context.state.progress,
        completed_modules: this.context.state.completedModules,
        is_complete: this.context.state.isComplete,
        status: this.context.state.isComplete ? 'completed' : 'in_progress'
      });
      this.notifySubscribers();
    } catch (error) {
      // Rollback state on error
      this.context.state = prevState;
      this.notifySubscribers();
      throw error;
    }
  }

  public async navigateToQuestion(questionId: string): Promise<void> {
    await this.ensureInitialized();
    
    const question = this.context.questionMap.get(questionId);
    if (!question) {
      throw new Error(`Question ${questionId} not found`);
    }

    const prevState = {
      currentModuleId: this.context.state.currentModuleId,
      currentQuestionId: this.context.state.currentQuestionId
    };

    try {
      // Update state with new question and its module
      this.context.state.currentQuestionId = questionId;
      this.context.state.currentModuleId = question.moduleId;

      // Persist state
      await this.context.assessmentService.updateAssessment(this.context.assessmentId!, {
        current_module_id: this.context.state.currentModuleId,
        current_question_id: this.context.state.currentQuestionId,
        progress: this.context.state.progress,
        completed_modules: this.context.state.completedModules,
        is_complete: this.context.state.isComplete,
        status: this.context.state.isComplete ? 'completed' : 'in_progress'
      });
      this.notifySubscribers();
    } catch (error) {
      // Roll back state on error
      this.context.state.currentModuleId = prevState.currentModuleId;
      this.context.state.currentQuestionId = prevState.currentQuestionId;
      throw error;
    }
  }

  public async navigateToModule(moduleId: string): Promise<void> {
    await this.ensureInitialized();
    
    const module = this.context.moduleMap.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    const prevState = {
      currentModuleId: this.context.state.currentModuleId,
      currentQuestionId: this.context.state.currentQuestionId
    };

    try {
      // Update state with new module and its first question
      this.context.state.currentModuleId = moduleId;
      this.context.state.currentQuestionId = module.questions[0].id;

      // Persist state
      await this.context.assessmentService.updateAssessment(this.context.assessmentId!, {
        current_module_id: this.context.state.currentModuleId,
        current_question_id: this.context.state.currentQuestionId,
        progress: this.context.state.progress,
        completed_modules: this.context.state.completedModules,
        is_complete: this.context.state.isComplete,
        status: this.context.state.isComplete ? 'completed' : 'in_progress'
      });
      this.notifySubscribers();
    } catch (error) {
      // Roll back state on error
      this.context.state.currentModuleId = prevState.currentModuleId;
      this.context.state.currentQuestionId = prevState.currentQuestionId;
      throw error;
    }
  }

  public async nextModule(): Promise<void> {
    if (this.context.currentModule < this.context.modules.length - 1) {
      this.context.currentModule++;
      this.context.currentQuestion = 0;
      const nextModule = this.context.modules[this.context.currentModule];
      this.context.state.currentModuleId = nextModule.id;
      this.context.state.currentQuestionId = nextModule.questions[0].id;
      await this.context.assessmentService.updateAssessment(this.context.assessmentId!, {
        current_module_id: this.context.state.currentModuleId,
        current_question_id: this.context.state.currentQuestionId,
        progress: this.context.state.progress,
        completed_modules: this.context.state.completedModules,
        is_complete: this.context.state.isComplete,
        status: this.context.state.isComplete ? 'completed' : 'in_progress'
      });
      this.notifySubscribers();
    }
  }

  public getCurrentModule(): QuestionModule | undefined {
    return this.context.moduleMap.get(this.context.state.currentModuleId);
  }

  public getCurrentQuestion(): Question | undefined {
    return this.context.questionMap.get(this.context.state.currentQuestionId);
  }

  public getQuestionsForModule(moduleId: string): Question[] {
    const module = this.context.moduleMap.get(moduleId);
    return module?.questions || [];
  }

  public getCurrentModuleQuestions(): Question[] {
    return this.getQuestionsForModule(this.context.state.currentModuleId);
  }
} 