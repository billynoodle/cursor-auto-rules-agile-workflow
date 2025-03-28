import { AssessmentError } from '@client/services/assessment/AssessmentError';

describe('AssessmentError', () => {
  it('should create an error with message and code', () => {
    const error = new AssessmentError('Test error', 'TEST_ERROR');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.name).toBe('AssessmentError');
  });

  it('should store original error when provided', () => {
    const originalError = new Error('Original error');
    const error = new AssessmentError('Test error', 'TEST_ERROR', originalError);
    expect(error.originalError).toBe(originalError);
  });

  it('should be instanceof Error', () => {
    const error = new AssessmentError('Test error', 'TEST_ERROR');
    expect(error).toBeInstanceOf(Error);
  });
}); 