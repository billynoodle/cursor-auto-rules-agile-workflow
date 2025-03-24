import { AssessmentState } from '../../../types/assessment';
import { AssessmentBase } from '../AssessmentBase';
import { IAssessmentError } from '../types';

export class AssessmentError extends AssessmentBase implements IAssessmentError {
  public handleError(error: Error): void {
    console.error('Assessment error:', error);
    // Additional error handling logic can be added here
    // For example, logging to a service, showing user notifications, etc.
  }

  public rollbackState(prevState: AssessmentState): void {
    this.context.state = prevState;
    this.notifySubscribers();
  }
} 