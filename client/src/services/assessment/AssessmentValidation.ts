import { z } from 'zod';
import { AssessmentError } from './AssessmentError';

// Define the assessment status enum
const AssessmentStatus = z.enum(['not_started', 'in_progress', 'completed', 'archived']);

// Define the assessment schema
const assessmentSchema = z.object({
  user_id: z.string().min(1),
  current_module_id: z.string().min(1),
  progress: z.number().min(0).max(100),
  completed_modules: z.array(z.string()),
  is_complete: z.boolean(),
  status: AssessmentStatus,
  metadata: z.record(z.any()).optional()
});

// Define the answer schema
const answerSchema = z.object({
  assessment_id: z.string().min(1),
  question_id: z.string().min(1),
  answer: z.record(z.any()),
  metadata: z.record(z.any()).optional()
});

export type Assessment = z.infer<typeof assessmentSchema>;
export type AssessmentAnswer = z.infer<typeof answerSchema>;

/**
 * Validates an assessment object against the schema
 * @param assessment The assessment object to validate
 * @throws {AssessmentError} If validation fails
 */
export function validateAssessment(assessment: Partial<Assessment>): void {
  try {
    assessmentSchema.parse(assessment);
  } catch (error) {
    throw new AssessmentError('Invalid assessment data', 'VALIDATION_ERROR', error);
  }
}

/**
 * Validates an answer object against the schema
 * @param answer The answer object to validate
 * @throws {AssessmentError} If validation fails
 */
export function validateAnswer(answer: Partial<AssessmentAnswer>): void {
  try {
    if (!answer.assessment_id || !answer.question_id) {
      throw new Error('Missing required fields');
    }
    answerSchema.partial().parse(answer);
  } catch (error) {
    throw new AssessmentError('Invalid answer data', 'VALIDATION_ERROR', error);
  }
} 