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
  metadata?: Record<string, any>;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentAnswer {
  id: string;
  assessment_id: string;
  question_id: string;
  answer: Record<string, any>;
  metadata?: Record<string, any>;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  public: {
    Tables: {
      assessments: {
        Row: {
          id: string;
          user_id: string;
          current_module_id: string;
          progress: number;
          completed_modules: string[];
          is_complete: boolean;
          status: 'not_started' | 'in_progress' | 'completed' | 'archived';
          metadata?: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<DatabaseSchema['public']['Tables']['assessments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<DatabaseSchema['public']['Tables']['assessments']['Insert']>;
      };
      answers: {
        Row: {
          id: string;
          assessment_id: string;
          question_id: string;
          answer: Record<string, any>;
          metadata?: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<DatabaseSchema['public']['Tables']['answers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<DatabaseSchema['public']['Tables']['answers']['Insert']>;
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