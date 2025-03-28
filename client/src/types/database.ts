import { SupabaseClient } from '@supabase/supabase-js';

export type AssessmentStatus = 'draft' | 'in_progress' | 'completed' | 'archived';

export interface Assessment {
  id: string;
  user_id: string;
  current_module_id: string;
  current_question_id: string;
  progress: number;
  completed_modules: string[];
  is_complete: boolean;
  status: AssessmentStatus;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AssessmentAnswer {
  id: string;
  assessment_id: string;
  question_id: string;
  answer: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  public: {
    Tables: {
      assessments: {
        Row: Assessment;
        Insert: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Assessment, 'id' | 'created_at'>>;
      };
      assessment_answers: {
        Row: AssessmentAnswer;
        Insert: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AssessmentAnswer, 'id' | 'created_at'>>;
      };
    };
    Functions: {
      soft_delete_assessment: {
        Args: { assessment_id: string };
        Returns: void;
      };
      restore_assessment: {
        Args: { assessment_id: string };
        Returns: void;
      };
    };
    Enums: {
      assessment_status: AssessmentStatus;
    };
  };
}

export type SupabaseDatabase = SupabaseClient & DatabaseSchema; 