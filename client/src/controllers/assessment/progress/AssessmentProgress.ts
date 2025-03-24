import { Answer } from '../../../types/assessment';
import { AssessmentBase } from '../AssessmentBase';
import { IAssessmentProgress } from '../types';

export class AssessmentProgress extends AssessmentBase implements IAssessmentProgress {
  public calculateProgress(): number {
    const totalQuestions = this.context.modules.reduce((total, module) => total + module.questions.length, 0);
    const answeredQuestions = Object.keys(this.context.state.answers).length;

    // Check if all questions in a module are answered
    this.context.modules.forEach(module => {
      const allQuestionsAnswered = module.questions.every(q => this.context.state.answers[q.id]);
      if (allQuestionsAnswered && !this.context.state.completedModules.includes(module.id)) {
        this.context.state.completedModules.push(module.id);
      }
    });

    // If all modules are completed, return 100%
    if (this.context.state.completedModules.length === this.context.modules.length) {
      this.context.state.isComplete = true;
      return 100;
    }

    return Math.floor((answeredQuestions / totalQuestions) * 100);
  }

  public async saveAnswer(answer: { questionId: string; value: Answer; timestamp: string }): Promise<void> {
    await this.ensureInitialized();
    
    // Store the current state before making changes
    const previousState = { ...this.context.state };
    
    try {
      // Validate the question exists
      const question = this.context.questionMap.get(answer.questionId);
      if (!question) {
        throw new Error(`Question ${answer.questionId} not found`);
      }

      // Update local state
      this.context.state = {
        ...this.context.state,
        answers: {
          ...this.context.state.answers,
          [answer.questionId]: answer.value
        }
      };

      // Update progress and check module completion
      this.context.state.progress = this.calculateProgress();

      // Persist to backend
      const answerData = {
        assessment_id: this.context.assessmentId!,
        question_id: answer.questionId,
        answer: answer.value,
        timestamp: answer.timestamp
      };

      await this.context.assessmentService.saveAnswer(answerData);
      
      // Only notify subscribers after successful persistence
      this.notifySubscribers();
    } catch (error) {
      // Rollback state on error
      this.context.state = previousState;
      this.notifySubscribers();
      throw error;
    }
  }

  public isModuleComplete(moduleId: string): boolean {
    const module = this.context.moduleMap.get(moduleId);
    if (!module) return false;
    return module.questions.every(q => this.context.state.answers[q.id]);
  }

  public isAssessmentComplete(): boolean {
    return this.context.state.isComplete;
  }
} 