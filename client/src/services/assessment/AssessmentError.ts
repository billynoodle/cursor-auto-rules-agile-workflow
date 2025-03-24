/**
 * Custom error class for assessment-related errors.
 * Extends the standard Error class with additional properties for error code and original error.
 */
export class AssessmentError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AssessmentError';
  }
} 