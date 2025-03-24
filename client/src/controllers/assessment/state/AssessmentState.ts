import { AssessmentState as IState, StateSubscriber } from '../../../types/assessment';
import { AssessmentBase } from '../AssessmentBase';
import { IAssessmentState } from '../types';

export class AssessmentState extends AssessmentBase implements IAssessmentState {
  public setState(newState: Partial<IState>): void {
    this.context.state = { ...this.context.state, ...newState };
    this.notifySubscribers();
  }

  public async restoreState(state: IState): Promise<void> {
    const prevState = { ...this.context.state };
    try {
      this.context.state = { ...state };
      await this.persistState();
      this.notifySubscribers();
    } catch (error) {
      // Rollback state on error
      this.context.state = prevState;
      this.notifySubscribers();
      throw error;
    }
  }

  public subscribe(subscriber: StateSubscriber): () => void {
    this.context.subscribers.add(subscriber);
    return () => {
      this.context.subscribers.delete(subscriber);
    };
  }

  public async persistState(): Promise<void> {
    await this.ensureInitialized();

    try {
      await this.context.assessmentService.updateAssessment(this.context.assessmentId!, {
        current_module_id: this.context.state.currentModuleId,
        current_question_id: this.context.state.currentQuestionId,
        progress: this.context.state.progress,
        completed_modules: this.context.state.completedModules,
        is_complete: this.context.state.isComplete,
        status: this.context.state.isComplete ? 'completed' : 'in_progress'
      });
    } catch (error) {
      console.error('Failed to persist state:', error);
      throw error;
    }
  }
} 