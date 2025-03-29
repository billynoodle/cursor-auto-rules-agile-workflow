export interface UsabilityMetrics {
  timeToUnderstand: number;
  clicksToComplete: number;
  userSatisfaction: number;
}

export interface TooltipFeedback {
  questionId: string;
  clarityRating: number;
  feedback: string;
  timestamp: string;
  difficultTerms?: string[];
}

export function isTooltipFeedback(obj: any): obj is TooltipFeedback {
  return (
    typeof obj === 'object' &&
    typeof obj.questionId === 'string' &&
    typeof obj.clarityRating === 'number' &&
    typeof obj.feedback === 'string' &&
    typeof obj.timestamp === 'string' &&
    (obj.difficultTerms === undefined || Array.isArray(obj.difficultTerms))
  );
}

export function isUsabilityMetrics(obj: any): obj is UsabilityMetrics {
  return (
    typeof obj === 'object' &&
    typeof obj.timeToUnderstand === 'number' &&
    typeof obj.clicksToComplete === 'number' &&
    typeof obj.userSatisfaction === 'number'
  );
} 