import { SupabaseClient } from '@supabase/supabase-js';
import { AssessmentService } from '../AssessmentService';
import { Assessment, AssessmentAnswer, DatabaseSchema } from '../../types/database';

// Mock data
const mockAssessment: Assessment = {
  id: '123',
  user_id: 'user123',
  current_module_id: 'module1',
  current_question_id: 'question1',
  progress: 50,
  completed_modules: ['module0'],
  is_complete: false,
  status: 'in_progress',
  created_at: '2024-03-19T00:00:00Z',
  updated_at: '2024-03-19T00:00:00Z'
};

const mockAnswer: AssessmentAnswer = {
  id: 'answer123',
  assessment_id: '123',
  question_id: 'question1',
  answer: { value: 'test answer' },
  created_at: '2024-03-19T00:00:00Z',
  updated_at: '2024-03-19T00:00:00Z'
};

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        is: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: mockAssessment, error: null })),
          eq: jest.fn(() => Promise.resolve({ data: [mockAssessment], error: null }))
        }))
      }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: mockAssessment, error: null }))
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        is: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockAssessment, error: null }))
          }))
        }))
      }))
    }))
  })),
  rpc: jest.fn(() => Promise.resolve({ data: null, error: null }))
} as unknown as jest.Mocked<SupabaseClient<DatabaseSchema>>;

describe('AssessmentService', () => {
  let service: AssessmentService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AssessmentService(mockSupabaseClient);
  });

  describe('createAssessment', () => {
    it('should create a new assessment', async () => {
      const input = {
        user_id: 'user123',
        current_module_id: 'module1',
        current_question_id: 'question1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft' as const
      };

      const result = await service.createAssessment(input);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(result).toEqual(mockAssessment);
    });

    it('should throw error if creation fails', async () => {
      const mockError = new Error('Creation failed');
      mockSupabaseClient.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: mockError }))
          }))
        }))
      })) as any;

      await expect(service.createAssessment({} as any)).rejects.toThrow('Creation failed');
    });
  });

  describe('getAssessment', () => {
    it('should get an assessment by id', async () => {
      const result = await service.getAssessment('123');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(result).toEqual(mockAssessment);
    });

    it('should return null if assessment not found', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: null, error: null }))
            }))
          }))
        }))
      })) as any;

      const result = await service.getAssessment('123');
      expect(result).toBeNull();
    });
  });

  describe('updateAssessment', () => {
    it('should update an assessment', async () => {
      const update = {
        progress: 75,
        is_complete: true
      };

      const result = await service.updateAssessment('123', update);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(result).toEqual(mockAssessment);
    });
  });

  describe('saveAnswer', () => {
    it('should save an answer', async () => {
      const input = {
        assessment_id: '123',
        question_id: 'question1',
        answer: { value: 'test answer' }
      };

      mockSupabaseClient.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockAnswer, error: null }))
          }))
        }))
      })) as any;

      const result = await service.saveAnswer(input);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessment_answers');
      expect(result).toEqual(mockAnswer);
    });
  });

  describe('getAnswers', () => {
    it('should get answers for an assessment', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => Promise.resolve({ data: [mockAnswer], error: null }))
          }))
        }))
      })) as any;

      const result = await service.getAnswers('123');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessment_answers');
      expect(result).toEqual([mockAnswer]);
    });
  });

  describe('soft delete and restore', () => {
    it('should soft delete an assessment', async () => {
      await service.softDeleteAssessment('123');

      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('soft_delete_assessment', {
        assessment_id: '123'
      });
    });

    it('should restore a soft-deleted assessment', async () => {
      await service.restoreAssessment('123');

      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('restore_assessment', {
        assessment_id: '123'
      });
    });
  });

  describe('getUserAssessments', () => {
    it('should get all assessments for a user', async () => {
      const result = await service.getUserAssessments('user123');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(result).toEqual([mockAssessment]);
    });

    it('should filter assessments by status', async () => {
      await service.getUserAssessments('user123', 'in_progress');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
    });
  });
}); 