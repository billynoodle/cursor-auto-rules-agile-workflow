import { AssessmentService, AssessmentError } from '../../../client/src/services/AssessmentService';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { Assessment, AssessmentAnswer, DatabaseSchema, AssessmentStatus } from '../../../client/src/types/database';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

// Mock localStorage with proper implementation
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock,
  writable: true 
});

// Mock navigator.onLine
describe('AssessmentService', () => {
  let service: AssessmentService;
  let mockSupabase: jest.Mocked<SupabaseClient>;
  let localStorageMock: jest.Mocked<Storage>;

  const mockAssessment: Assessment = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: '123e4567-e89b-12d3-a456-426614174001',
    current_module_id: 'module-1',
    current_question_id: 'q1',
    progress: 0,
    completed_modules: [],
    is_complete: false,
    status: 'draft',
    created_at: '2025-03-19T04:44:39.621Z',
    updated_at: '2025-03-19T04:44:39.621Z'
  };

  const mockAnswer: AssessmentAnswer = {
    id: '123e4567-e89b-12d3-a456-426614174002',
    assessment_id: mockAssessment.id,
    question_id: 'q1',
    answer: { value: 'test answer' },
    created_at: '2025-03-19T04:44:39.621Z',
    updated_at: '2025-03-19T04:44:39.621Z'
  };

  beforeEach(() => {
    // Reset navigator.onLine mock
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => true
    });

    mockSupabase = {
      from: jest.fn(),
    } as unknown as jest.Mocked<SupabaseClient>;

    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn(),
      key: jest.fn(),
      length: 0
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    service = new AssessmentService(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    // Reset navigator.onLine to true after each test
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => true
    });
  });

  describe('createAssessment', () => {
    it('should create assessment when online', async () => {
      const mockChain = {
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockAssessment, error: null })
          })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      const result = await service.createAssessment(mockAssessment);
      expect(result).toEqual(mockAssessment);
    }, 5000);

    it('should store assessment locally when offline', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      
      const result = await service.createAssessment(mockAssessment);
      expect(result).toEqual(expect.objectContaining({
        user_id: mockAssessment.user_id,
        current_module_id: mockAssessment.current_module_id,
        current_question_id: mockAssessment.current_question_id,
        status: mockAssessment.status
      }));
      expect(localStorageMock.setItem).toHaveBeenCalled();
    }, 5000);

    it('should validate assessment data', async () => {
      const invalidAssessment = { ...mockAssessment, user_id: 'invalid-uuid' };
      try {
        await service.createAssessment(invalidAssessment);
        fail('Expected createAssessment to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AssessmentError);
        const assessmentError = error as AssessmentError;
        expect(assessmentError.code).toBe('VALIDATION_ERROR');
        expect(assessmentError.message).toBe('Invalid assessment data');
      }
    }, 5000);

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error', code: 'DB_ERROR' };
      const mockChain = {
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: mockError })
          })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      try {
        await service.createAssessment(mockAssessment);
        fail('Expected createAssessment to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AssessmentError);
        const assessmentError = error as AssessmentError;
        expect(assessmentError.code).toBe('CREATE_ERROR');
        expect(assessmentError.message).toBe('Failed to create assessment');
      }
    }, 30000);
  });

  describe('getAssessment', () => {
    it('should fetch assessment when online', async () => {
      const mockChain = {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockAssessment, error: null })
            })
          })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      const result = await service.getAssessment(mockAssessment.id);
      expect(result).toEqual(mockAssessment);
    }, 5000);

    it('should return offline data when available', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      localStorageMock.getItem.mockReturnValue(JSON.stringify([[`assessment_${mockAssessment.id}`, mockAssessment]]));
      
      const result = await service.getAssessment(mockAssessment.id);
      expect(result).toEqual(mockAssessment);
    }, 5000);

    it('should throw error when offline and no cached data', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      localStorageMock.getItem.mockReturnValue(null);
      
      try {
        await service.getAssessment(mockAssessment.id);
        fail('Expected getAssessment to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AssessmentError);
        const assessmentError = error as AssessmentError;
        expect(assessmentError.code).toBe('OFFLINE_DATA_NOT_FOUND');
        expect(assessmentError.message).toBe('No offline data available');
      }
    }, 5000);
  });

  describe('updateAssessment', () => {
    it('should update assessment when online', async () => {
      const mockChain = {
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: mockAssessment, error: null })
              })
            })
          })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      const result = await service.updateAssessment(mockAssessment.id, mockAssessment);
      expect(result).toEqual(mockAssessment);
    }, 5000);

    it('should update locally when offline', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      const offlineData = [[`assessment_${mockAssessment.id}`, mockAssessment]];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(offlineData));
      
      const result = await service.updateAssessment(mockAssessment.id, mockAssessment);
      expect(result).toEqual({
        ...mockAssessment,
        updated_at: result.updated_at
      });
      expect(localStorageMock.setItem).toHaveBeenCalled();
    }, 5000);

    it('should validate update data', async () => {
      const invalidUpdate = { ...mockAssessment, user_id: 'invalid-uuid' };
      try {
        await service.updateAssessment(mockAssessment.id, invalidUpdate);
        fail('Expected updateAssessment to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AssessmentError);
        const assessmentError = error as AssessmentError;
        expect(assessmentError.code).toBe('VALIDATION_ERROR');
        expect(assessmentError.message).toBe('Invalid update data');
      }
    }, 5000);
  });

  describe('saveAnswer', () => {
    it('should save answer when online', async () => {
      const mockChain = {
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockAnswer, error: null })
          })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      const result = await service.saveAnswer(mockAnswer);
      expect(result).toEqual(mockAnswer);
    }, 5000);

    it('should store answer locally when offline', async () => {
      Object.defineProperty(navigator, 'onLine', { value: false });
      
      const result = await service.saveAnswer(mockAnswer);
      expect(result).toEqual(expect.objectContaining({
        assessment_id: mockAnswer.assessment_id,
        question_id: mockAnswer.question_id,
        answer: mockAnswer.answer
      }));
      expect(localStorageMock.setItem).toHaveBeenCalled();
    }, 5000);

    it('should validate answer data', async () => {
      const invalidAnswer: Partial<AssessmentAnswer> = {
        ...mockAnswer,
        answer: undefined as any
      };
      try {
        await service.saveAnswer(invalidAnswer as AssessmentAnswer);
        fail('Expected saveAnswer to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AssessmentError);
        const assessmentError = error as AssessmentError;
        expect(assessmentError.code).toBe('VALIDATION_ERROR');
        expect(assessmentError.message).toContain('Invalid answer data');
      }
    }, 5000);
  });

  describe('getAnswers', () => {
    it('should fetch answers for assessment', async () => {
      const mockChain = {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [mockAnswer], error: null })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      const result = await service.getAnswers(mockAssessment.id);
      expect(result).toEqual([mockAnswer]);
    }, 5000);

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error', code: 'DB_ERROR' };
      const mockChain = {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: mockError })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      try {
        await service.getAnswers('123');
        fail('Expected getAnswers to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AssessmentError);
        const assessmentError = error as AssessmentError;
        expect(assessmentError.code).toBe('DB_ERROR');
        expect(assessmentError.message).toBe('Database error');
      }
    }, 10000);
  });

  describe('updateAnswer', () => {
    it('should update answer when online', async () => {
      const mockChain = {
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockAnswer, error: null })
            })
          })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      const result = await service.updateAnswer(mockAnswer.id, mockAnswer);
      expect(result).toEqual(mockAnswer);
    }, 5000);

    it('should validate update data', async () => {
      const invalidAnswer = { ...mockAnswer, answer: undefined as any };
      try {
        await service.updateAnswer(mockAnswer.id, invalidAnswer);
        fail('Expected updateAnswer to throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(AssessmentError);
        const assessmentError = error as AssessmentError;
        expect(assessmentError.code).toBe('UPDATE_ERROR');
        expect(assessmentError.message).toBe('Failed to update answer');
      }
    }, 5000);
  });

  describe('getUserAssessments', () => {
    it('should filter assessments by status', async () => {
      const completedAssessment = { ...mockAssessment, status: 'completed' };
      const mockChain = {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockResolvedValue({ data: [completedAssessment], error: null })
          })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      const result = await service.getUserAssessments('completed');
      expect(result).toEqual([completedAssessment]);
    }, 5000);
  });

  describe('offline sync', () => {
    it('should sync offline data when online', async () => {
      const offlineData = [[`assessment_${mockAssessment.id}`, mockAssessment]];
      Object.defineProperty(navigator, 'onLine', { value: true });
      localStorageMock.getItem.mockReturnValue(JSON.stringify(offlineData));
      
      const mockChain = {
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockAssessment, error: null })
          })
        })
      };
      (mockSupabase.from as jest.Mock).mockReturnValue(mockChain);
      
      await service.checkOnlineStatus();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('assessment_offline_data');
    }, 5000);
  });
}); 