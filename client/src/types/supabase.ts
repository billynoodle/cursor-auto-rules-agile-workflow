export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      practices: {
        Row: {
          id: string;
          name: string;
          ownerName: string;
          email: string;
          phone: string;
          practiceType: 'PHYSIOTHERAPY' | 'OCCUPATIONAL_THERAPY' | 'SPEECH_PATHOLOGY' | 'DIETETICS' | 'OTHER';
          numberOfPractitioners: number;
          yearsInOperation: number;
          location: {
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
          };
          annualRevenue: number;
          patientVolume: number;
          userId: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          ownerName: string;
          email: string;
          phone: string;
          practiceType: 'PHYSIOTHERAPY' | 'OCCUPATIONAL_THERAPY' | 'SPEECH_PATHOLOGY' | 'DIETETICS' | 'OTHER';
          numberOfPractitioners: number;
          yearsInOperation: number;
          location: {
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
          };
          annualRevenue: number;
          patientVolume: number;
          userId: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          ownerName?: string;
          email?: string;
          phone?: string;
          practiceType?: 'PHYSIOTHERAPY' | 'OCCUPATIONAL_THERAPY' | 'SPEECH_PATHOLOGY' | 'DIETETICS' | 'OTHER';
          numberOfPractitioners?: number;
          yearsInOperation?: number;
          location?: {
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
          };
          annualRevenue?: number;
          patientVolume?: number;
          userId?: string;
          updatedAt?: string;
        };
      };
      assessment_modules: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: 'FINANCIAL' | 'OPERATIONS' | 'MARKETING' | 'STAFFING' | 'COMPLIANCE';
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category: 'FINANCIAL' | 'OPERATIONS' | 'MARKETING' | 'STAFFING' | 'COMPLIANCE';
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: 'FINANCIAL' | 'OPERATIONS' | 'MARKETING' | 'STAFFING' | 'COMPLIANCE';
          updatedAt?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          moduleId: string;
          text: string;
          type: 'MULTIPLE_CHOICE' | 'LIKERT_SCALE' | 'NUMERIC' | 'TEXT';
          options: string[] | null;
          weight: number;
          benchmarkReference: string | null;
          interconnectednessScore: number;
          relatedBusinessAreas: string[];
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          moduleId: string;
          text: string;
          type: 'MULTIPLE_CHOICE' | 'LIKERT_SCALE' | 'NUMERIC' | 'TEXT';
          options?: string[] | null;
          weight: number;
          benchmarkReference?: string | null;
          interconnectednessScore: number;
          relatedBusinessAreas: string[];
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          moduleId?: string;
          text?: string;
          type?: 'MULTIPLE_CHOICE' | 'LIKERT_SCALE' | 'NUMERIC' | 'TEXT';
          options?: string[] | null;
          weight?: number;
          benchmarkReference?: string | null;
          interconnectednessScore?: number;
          relatedBusinessAreas?: string[];
          updatedAt?: string;
        };
      };
      assessment_responses: {
        Row: {
          id: string;
          practiceId: string;
          moduleId: string;
          completedAt: string;
          score: number;
          userId: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          practiceId: string;
          moduleId: string;
          completedAt: string;
          score: number;
          userId: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          practiceId?: string;
          moduleId?: string;
          completedAt?: string;
          score?: number;
          userId?: string;
          updatedAt?: string;
        };
      };
      question_responses: {
        Row: {
          id: string;
          assessmentId: string;
          questionId: string;
          response: Json;
          notes: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          assessmentId: string;
          questionId: string;
          response: Json;
          notes?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          assessmentId?: string;
          questionId?: string;
          response?: Json;
          notes?: string | null;
          updatedAt?: string;
        };
      };
      recommendations: {
        Row: {
          id: string;
          practiceId: string;
          assessmentId: string;
          category: 'FINANCIAL' | 'OPERATIONS' | 'MARKETING' | 'STAFFING' | 'COMPLIANCE';
          title: string;
          description: string;
          impact: 'HIGH' | 'MEDIUM' | 'LOW';
          effort: 'HIGH' | 'MEDIUM' | 'LOW';
          timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM';
          implementationStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          practiceId: string;
          assessmentId: string;
          category: 'FINANCIAL' | 'OPERATIONS' | 'MARKETING' | 'STAFFING' | 'COMPLIANCE';
          title: string;
          description: string;
          impact: 'HIGH' | 'MEDIUM' | 'LOW';
          effort: 'HIGH' | 'MEDIUM' | 'LOW';
          timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM';
          implementationStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          practiceId?: string;
          assessmentId?: string;
          category?: 'FINANCIAL' | 'OPERATIONS' | 'MARKETING' | 'STAFFING' | 'COMPLIANCE';
          title?: string;
          description?: string;
          impact?: 'HIGH' | 'MEDIUM' | 'LOW';
          effort?: 'HIGH' | 'MEDIUM' | 'LOW';
          timeframe?: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM';
          implementationStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
          updatedAt?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
} 