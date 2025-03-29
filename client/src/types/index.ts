// Re-export all types
export * from './assessment';
export * from './discipline';
export * from './practice';

// Re-export database types with prefixes to avoid conflicts
export type {
  AssessmentStatus as DatabaseAssessmentStatus,
  AssessmentAnswer as DatabaseAssessmentAnswer,
  Assessment as DatabaseAssessment,
  DatabaseSchema,
  SupabaseDatabase
} from './database';