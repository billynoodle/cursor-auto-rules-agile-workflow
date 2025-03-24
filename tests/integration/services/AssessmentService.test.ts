import { AssessmentService } from '../../../client/src/services/AssessmentService';
import { AssessmentError } from '../../../client/src/services/AssessmentService';
import { createMockSupabaseClient, mockAssessmentData, mockErrorScenarios, TEST_USER_ID, TEST_ASSESSMENT_ID } from '../controllers/__mocks__/mockData';
import { Assessment, AssessmentAnswer } from '../../../client/src/types/database';

describe('AssessmentService', () => {
  let service: AssessmentService;
  const assessmentData: Omit<Assessment, 'id' | 'created_at' | 'updated_at'> = {
    user_id: TEST_USER_ID,
    current_module_id: 'module1',
    current_question_id: 'q1',
    progress: 0,
    completed_modules: [],
    is_complete: false,
    status: 'draft',
    metadata: { source: 'test' }
  };

  const answerData: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'> = {
    assessment_id: TEST_ASSESSMENT_ID,
    question_id: 'q1',
    answer: { value: 'Test answer' },
    metadata: { source: 'test' }
  };

  beforeEach(() => {
    localStorage.clear();
    // Reset online status
    Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
  });

  describe('createAssessment', () => {
    it('should create an assessment successfully', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { ...assessmentData, id: TEST_ASSESSMENT_ID, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              error: null
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      const result = await service.createAssessment(assessmentData);
      expect(result).toBeDefined();
      expect(result.user_id).toBe(TEST_USER_ID);
      expect(result.metadata).toEqual({ source: 'test' });
    });

    it('should handle validation errors', async () => {
      service = new AssessmentService(createMockSupabaseClient());
      const invalidData = {
        ...assessmentData,
        status: 'invalid_status' as any
      };
      await expect(service.createAssessment(invalidData))
        .rejects
        .toThrow('Invalid assessment data');
    });

    it('should handle database errors', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      await expect(service.createAssessment(assessmentData))
        .rejects
        .toThrow(AssessmentError);
    });

    it('should handle offline mode', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      const result = await service.createAssessment(assessmentData);
      expect(result).toBeDefined();
      expect(localStorage.getItem('assessment_offline_data')).toBeDefined();
    });
  });

  describe('getAssessment', () => {
    it('should get an assessment successfully', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { ...assessmentData, id: TEST_ASSESSMENT_ID, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
                error: null
              })
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      const result = await service.getAssessment(TEST_ASSESSMENT_ID);
      expect(result).toBeDefined();
      expect(result.user_id).toBe(TEST_USER_ID);
      expect(result.metadata).toEqual({ source: 'test' });
    });

    it('should handle not found errors', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: null })
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      await expect(service.getAssessment('non-existent-id'))
        .rejects
        .toThrow('Assessment not found');
    });

    it('should handle database errors', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      await expect(service.getAssessment(TEST_ASSESSMENT_ID))
        .rejects
        .toThrow(AssessmentError);
    });

    it('should handle offline mode with data', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      localStorage.setItem('assessment_offline_data', JSON.stringify([[`assessment_${TEST_ASSESSMENT_ID}`, assessmentData]]));
      const result = await service.getAssessment(TEST_ASSESSMENT_ID);
      expect(result).toBeDefined();
    });

    it('should handle offline mode without data', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      await expect(service.getAssessment(TEST_ASSESSMENT_ID))
        .rejects
        .toThrow('No offline data available');
    });
  });

  describe('updateAssessment', () => {
    it('should update an assessment successfully', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: {
                    ...assessmentData,
                    id: TEST_ASSESSMENT_ID,
                    progress: 33,
                    metadata: { source: 'updated' },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  },
                  error: null
                })
              })
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      const result = await service.updateAssessment(TEST_ASSESSMENT_ID, {
        ...assessmentData,
        progress: 33,
        metadata: { source: 'updated' }
      });
      expect(result).toBeDefined();
      expect(result.progress).toBe(33);
      expect(result.metadata).toEqual({ source: 'updated' });
    });

    it('should handle validation errors on update', async () => {
      service = new AssessmentService(createMockSupabaseClient());
      const invalidData = {
        ...assessmentData,
        status: 'invalid_status' as any
      };
      await expect(service.updateAssessment(TEST_ASSESSMENT_ID, invalidData))
        .rejects
        .toThrow('Invalid update data');
    });

    it('should handle database errors', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      await expect(service.updateAssessment(TEST_ASSESSMENT_ID, assessmentData))
        .rejects
        .toThrow(AssessmentError);
    });

    it('should handle conflict errors', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.conflict));
      await expect(service.updateAssessment(TEST_ASSESSMENT_ID, assessmentData))
        .rejects
        .toThrow('Assessment was updated by another session');
    });

    it('should handle offline mode with existing assessment', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      // Store assessment in offline store first
      localStorage.setItem('assessment_offline_data', JSON.stringify([[`assessment_${TEST_ASSESSMENT_ID}`, assessmentData]]));
      const result = await service.updateAssessment(TEST_ASSESSMENT_ID, {
        ...assessmentData,
        progress: 50
      });
      expect(result).toBeDefined();
      expect(result.progress).toBe(50);
    });

    it('should handle offline mode without existing assessment', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      await expect(service.updateAssessment(TEST_ASSESSMENT_ID, assessmentData))
        .rejects
        .toThrow('Assessment not found in offline store');
    });
  });

  describe('answer management', () => {
    it('should save an answer successfully', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                ...answerData,
                id: '456',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              error: null
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      const result = await service.saveAnswer(answerData);
      expect(result).toBeDefined();
      expect(result.question_id).toBe('q1');
      expect(result.answer).toEqual({ value: 'Test answer' });
    });

    it('should handle validation errors for answers', async () => {
      service = new AssessmentService(createMockSupabaseClient());
      const invalidData = {
        ...answerData,
        question_id: undefined as any
      };
      await expect(service.saveAnswer(invalidData))
        .rejects
        .toThrow('Invalid answer data');
    });

    it('should handle conflict errors for answers', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Conflict', code: 'CONFLICT' }
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      await expect(service.saveAnswer(answerData))
        .rejects
        .toThrow('Failed to save answer due to conflict');
    });

    it('should handle missing data after save', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: null
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      await expect(service.saveAnswer(answerData))
        .rejects
        .toThrow('No answer data returned after save');
    });

    it('should handle offline answer storage', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      const result = await service.saveAnswer(answerData);
      expect(result).toBeDefined();
      const offlineData = localStorage.getItem('assessment_offline_data');
      expect(offlineData).toContain('answer_');
    });

    it('should get answers successfully', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [
              {
                ...answerData,
                id: '456',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ],
            error: null
          })
        })
      });
      service = new AssessmentService(mockClient);
      const result = await service.getAnswers(TEST_ASSESSMENT_ID);
      expect(result).toHaveLength(1);
      expect(result[0].question_id).toBe('q1');
    });

    it('should handle database errors when getting answers', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error', code: 'DB_ERROR' }
          })
        })
      });
      service = new AssessmentService(mockClient);
      await expect(service.getAnswers(TEST_ASSESSMENT_ID))
        .rejects
        .toThrow('Database error');
    });

    it('should handle offline mode when getting answers', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      localStorage.setItem('assessment_offline_data', JSON.stringify([
        [`answer_${TEST_ASSESSMENT_ID}_1`, answerData]
      ]));
      const result = await service.getAnswers(TEST_ASSESSMENT_ID);
      expect(result).toHaveLength(1);
      expect(result[0].question_id).toBe('q1');
    });

    it('should handle offline mode with no answers', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      const result = await service.getAnswers(TEST_ASSESSMENT_ID);
      expect(result).toEqual([]);
    });

    it('should update an answer successfully', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  ...answerData,
                  id: '456',
                  answer: { value: 'Updated answer' },
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                },
                error: null
              })
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      const result = await service.updateAnswer('456', {
        answer: { value: 'Updated answer' }
      });
      expect(result).toBeDefined();
      expect(result.answer).toEqual({ value: 'Updated answer' });
    });

    it('should handle validation errors when updating answers', async () => {
      service = new AssessmentService(createMockSupabaseClient());
      const invalidUpdate = {
        question_id: undefined as any
      };
      await expect(service.updateAnswer('456', invalidUpdate))
        .rejects
        .toThrow('Invalid answer data');
    });

    it('should handle database errors when updating answers', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error', code: 'DB_ERROR' }
              })
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      await expect(service.updateAnswer('456', { answer: { value: 'test' } }))
        .rejects
        .toThrow('Failed to update answer in database');
    });

    it('should handle missing data after update', async () => {
      const mockClient = createMockSupabaseClient();
      mockClient.from = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: null
              })
            })
          })
        })
      });
      service = new AssessmentService(mockClient);
      await expect(service.updateAnswer('456', { answer: { value: 'test' } }))
        .rejects
        .toThrow('No answer data returned after update');
    });

    it('should handle offline mode when updating answers', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      localStorage.setItem('assessment_offline_data', JSON.stringify([
        [`answer_456`, answerData]
      ]));
      const result = await service.updateAnswer('456', {
        answer: { value: 'Updated offline' }
      });
      expect(result).toBeDefined();
      expect(result.answer).toEqual({ value: 'Updated offline' });
    });

    it('should handle offline mode with no data when updating answers', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      await expect(service.updateAnswer('456', { answer: { value: 'test' } }))
        .rejects
        .toThrow('No offline data available');
    });

    it('should handle offline mode with missing answer when updating', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      localStorage.setItem('assessment_offline_data', JSON.stringify([
        [`answer_different_id`, answerData]
      ]));
      await expect(service.updateAnswer('456', { answer: { value: 'test' } }))
        .rejects
        .toThrow('Answer not found in offline store');
    });
  });

  describe('offline sync', () => {
    it('should sync offline data when coming online', async () => {
      service = new AssessmentService(createMockSupabaseClient());
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      localStorage.setItem('assessment_offline_data', JSON.stringify([
        [`assessment_${TEST_ASSESSMENT_ID}`, assessmentData],
        [`answer_${TEST_ASSESSMENT_ID}`, answerData]
      ]));

      Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
      await service.checkOnlineStatus();
      expect(localStorage.getItem('assessment_offline_data')).toBeNull();
    });

    it('should handle sync errors', async () => {
      service = new AssessmentService(createMockSupabaseClient(mockErrorScenarios.networkError));
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      localStorage.setItem('assessment_offline_data', JSON.stringify([
        [`assessment_${TEST_ASSESSMENT_ID}`, assessmentData]
      ]));

      Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
      await expect(service.checkOnlineStatus())
        .rejects
        .toThrow(AssessmentError);
      expect(localStorage.getItem('assessment_offline_data')).toBeDefined();
    });

    it('should handle empty offline data', async () => {
      service = new AssessmentService(createMockSupabaseClient());
      Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
      await service.checkOnlineStatus();
      expect(localStorage.getItem('assessment_offline_data')).toBeNull();
    });
  });

  describe('event listeners', () => {
    it('should set up offline sync listeners', () => {
      service = new AssessmentService(createMockSupabaseClient());
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      service.setupOfflineSync();
      expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    });
  });
});