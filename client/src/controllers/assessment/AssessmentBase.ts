import { AssessmentState } from '../../types/assessment';
import { AssessmentContext, IAssessmentBase } from './types';

export abstract class AssessmentBase implements IAssessmentBase {
  protected context: AssessmentContext;

  constructor(context: AssessmentContext) {
    this.context = context;
  }

  public getAssessmentId(): string | undefined {
    return this.context.assessmentId;
  }

  public getState(): AssessmentState {
    return { ...this.context.state };
  }

  public async ensureInitialized(): Promise<void> {
    if (!this.context.assessmentId) {
      throw new Error('Assessment not initialized');
    }
  }

  protected notifySubscribers(): void {
    this.context.subscribers.forEach(subscriber => subscriber(this.context.state));
  }
} 