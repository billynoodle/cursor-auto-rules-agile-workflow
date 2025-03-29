import { Assessment, AssessmentAnswer, AssessmentStatus } from '@client/types/database';
import { PostgrestSingleResponse, PostgrestResponseSuccess } from '@supabase/postgrest-js';

export function generateMockId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function generateTimestamp(): string {
  return new Date().toISOString();
}

export function generateMockAssessment(overrides: Partial<Assessment> = {}): Assessment & { id: string; created_at: string; updated_at: string } {
  return {
    id: generateMockId(),
    user_id: generateMockId(),
    current_module_id: generateMockId(),
    current_question_id: generateMockId(),
    progress: 0,
    completed_modules: [],
    is_complete: false,
    status: 'draft' as AssessmentStatus,
    created_at: generateTimestamp(),
    updated_at: generateTimestamp(),
    ...overrides
  };
}

export function generateMockAnswer(overrides: Partial<AssessmentAnswer> = {}): AssessmentAnswer & { id: string; created_at: string; updated_at: string } {
  const now = new Date().toISOString();
  return {
    id: generateMockId(),
    assessment_id: generateMockId(),
    question_id: generateMockId(),
    answer: { value: 'mock_answer' },
    metadata: { source: 'test' },
    created_at: now,
    updated_at: now,
    ...overrides
  };
}

export function generateMockResponse<T>(data: T, error: any = null): PostgrestSingleResponse<T> {
  const response: PostgrestResponseSuccess<T> = {
    data,
    error,
    count: null,
    status: error ? 400 : 200,
    statusText: error ? 'Error' : 'OK'
  };
  return response;
}

export function generateMockErrorResponse(message: string = 'Database error'): PostgrestSingleResponse<null> {
  return generateMockResponse(null, {
    message,
    code: 'ERROR',
    details: 'Mock error details',
    hint: 'Mock error hint'
  });
}

export function generateMockAssessmentBatch(count: number = 5): Assessment[] {
  return Array.from({ length: count }, () => generateMockAssessment());
}

export function generateMockAnswerBatch(count: number = 5): AssessmentAnswer[] {
  return Array.from({ length: count }, () => generateMockAnswer());
} 