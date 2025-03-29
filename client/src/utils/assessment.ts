export const QUESTION_ID_PREFIX = 'q';
export const QUESTION_ID_SEPARATOR = '-';

export const generateQuestionId = (moduleId: string, index: number): string => {
  return `q${moduleId}-${index}`;
}; 