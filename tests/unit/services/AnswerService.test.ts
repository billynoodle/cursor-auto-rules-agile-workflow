import { jest } from '@jest/globals';
import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema, AssessmentAnswer as DBAssessmentAnswer } from '@client/types/database';
import { createMockSupabaseClient, createMockOfflineService } from '../../utils/test-helpers';
import { AnswerService } from '@client/services/assessment/AnswerService';
import { generateMockAnswer, generateMockResponse, generateMockId } from '@__mocks__/data/generators';
import { OfflineService } from '@client/services/assessment/OfflineService';
import { MockFilterBuilder, MockQueryBuilder } from '@__mocks__/services/supabase/types';
import { AssessmentError } from '@client/services/assessment/AssessmentError';

describe('AnswerService', () => {
  let mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>;
  let mockOfflineService: ReturnType<typeof createMockOfflineService>;
  let answerService: AnswerService;

  beforeEach(() => {
    mockSupabaseClient = createMockSupabaseClient();
    mockOfflineService = createMockOfflineService();
    answerService = new AnswerService(mockSupabaseClient, mockOfflineService);
  });

  describe('saveAnswer', () => {
    it('should save answer when online', async () => {
      mockOfflineService.isOnline.mockReturnValue(true);
      const answer = {
        assessment_id: 'test-assessment',
        question_id: 'test-question',
        answer: { value: 'test' }
      };

      await answerService.saveAnswer(answer);
      expect(mockOfflineService.isOnline).toHaveBeenCalled();
    });

    it('should save answer offline when not online', async () => {
      mockOfflineService.isOnline.mockReturnValue(false);
      const answer = {
        assessment_id: 'test-assessment',
        question_id: 'test-question',
        answer: { value: 'test' }
      };

      await answerService.saveAnswer(answer);
      expect(mockOfflineService.storeOfflineData).toHaveBeenCalled();
    });

    it('should throw error for invalid answer', async () => {
      mockOfflineService.isOnline.mockReturnValue(true);
      const invalidAnswer = {
        assessment_id: 'test-assessment',
        question_id: 'test-question',
        answer: { value: 'test' }
      };

      await expect(answerService.saveAnswer(invalidAnswer))
        .rejects.toThrow('Invalid answer data');
    });

    it('should handle network errors', async () => {
      mockOfflineService.isOnline.mockReturnValue(true);
      const answer = {
        assessment_id: 'test-assessment',
        question_id: 'test-question',
        answer: { value: 'test' }
      };

      const mockClient = createMockSupabaseClient({ simulateNetworkError: true });
      answerService = new AnswerService(mockClient, mockOfflineService);

      await expect(answerService.saveAnswer(answer))
        .rejects.toThrow('Network error');
    });
  });

  describe('getAnswers', () => {
    it('should get answers when online', async () => {
      mockOfflineService.isOnline.mockReturnValue(true);
      await answerService.getAnswers('test-assessment');
      expect(mockOfflineService.isOnline).toHaveBeenCalled();
    });

    it('should get answers from offline storage when not online', async () => {
      mockOfflineService.isOnline.mockReturnValue(false);
      await answerService.getAnswers('test-assessment');
      expect(mockOfflineService.getOfflineData).toHaveBeenCalled();
    });
  });

  describe('updateAnswer', () => {
    it('should update an existing answer when online', async () => {
      const mockAnswer = generateMockAnswer();
      mockOfflineService.isOnline.mockReturnValue(true);
      const queryBuilder = mockSupabaseClient.from('assessment_answers') as unknown as MockQueryBuilder<'assessment_answers'>;
      const filterBuilder = queryBuilder.update(mockAnswer).eq('id', mockAnswer.id) as unknown as MockFilterBuilder<'assessment_answers'>;
      filterBuilder.single().mockResolvedValue(generateMockResponse(mockAnswer));

      const result = await answerService.updateAnswer(mockAnswer.id, mockAnswer);

      expect(queryBuilder.update).toHaveBeenCalledWith(mockAnswer);
      expect(filterBuilder.eq).toHaveBeenCalledWith('id', mockAnswer.id);
      expect(filterBuilder.single).toHaveBeenCalled();
      expect(result).toEqual(mockAnswer);
    });

    it('should throw an error if answer update fails', async () => {
      const mockAnswer = generateMockAnswer();
      const error = new Error('Failed to update answer');
      mockOfflineService.isOnline.mockReturnValue(true);
      const queryBuilder = mockSupabaseClient.from('assessment_answers') as unknown as MockQueryBuilder<'assessment_answers'>;
      const filterBuilder = queryBuilder.update(mockAnswer).eq('id', mockAnswer.id) as unknown as MockFilterBuilder<'assessment_answers'>;
      filterBuilder.single().mockRejectedValue(error);

      await expect(answerService.updateAnswer(mockAnswer.id, mockAnswer)).rejects.toThrow(error);
    });

    it('should store answer offline when offline', async () => {
      const mockAnswer = generateMockAnswer();
      mockOfflineService.isOnline.mockReturnValue(false);
      mockOfflineService.getOfflineData.mockReturnValue(mockAnswer);
      await answerService.updateAnswer(mockAnswer.id, mockAnswer);
      expect(mockOfflineService.storeOfflineData).toHaveBeenCalledWith(`answer_${mockAnswer.id}`, mockAnswer);
    });

    it('should throw AssessmentError when validation fails', async () => {
      const invalidAnswer = {
        assessment_id: 'test-assessment',
        question_id: 'test-question',
        answer: { value: 'test' }
      };
      mockOfflineService.isOnline.mockReturnValue(true);

      await expect(answerService.updateAnswer('1', invalidAnswer))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when offline and validation fails', async () => {
      const invalidAnswer = {
        assessment_id: 'test-assessment',
        question_id: 'test-question',
        answer: { value: 'test' }
      };
      mockOfflineService.isOnline.mockReturnValue(false);

      await expect(answerService.updateAnswer('1', invalidAnswer))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when offline and answer not found', async () => {
      const answer = generateMockAnswer();
      mockOfflineService.isOnline.mockReturnValue(false);
      mockOfflineService.getOfflineData.mockReturnValue(null);

      await expect(answerService.updateAnswer('1', answer))
        .rejects.toThrow(AssessmentError);
    });
  });

  describe('Answer Management', () => {
    const answer = {
      assessment_id: generateMockId(),
      question_id: generateMockId(),
      answer: { value: 'test', type: 'text' },
      metadata: { source: 'test', timestamp: new Date().toISOString() }
    };

    it('should save answer in offline mode', async () => {
      mockOfflineService.isOnline.mockReturnValue(false);
      const offlineId = generateMockId();
      jest.spyOn(Date, 'now').mockReturnValue(parseInt(offlineId));
      await answerService.saveAnswer(answer);
      expect(mockOfflineService.storeOfflineData).toHaveBeenCalledWith(`answer_${offlineId}`, {
        ...answer,
        id: offlineId,
        created_at: new Date(parseInt(offlineId)).toISOString(),
        updated_at: new Date(parseInt(offlineId)).toISOString()
      });
    });

    it('should handle invalid answers', async () => {
      const invalidAnswer = {
        assessment_id: generateMockId(),
        question_id: generateMockId(),
        answer: { value: null, type: 'text' }
      };
      await expect(answerService.saveAnswer(invalidAnswer)).rejects.toThrow();
    });

    it('should save answer in online mode', async () => {
      mockOfflineService.isOnline.mockReturnValue(true);
      const mockResponse = generateMockResponse({
        ...answer,
        id: generateMockId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as DBAssessmentAnswer);

      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue(mockResponse)
      } as any;

      const mockClient = {
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any;

      answerService = new AnswerService(mockClient, mockOfflineService);
      await answerService.saveAnswer(answer);
      expect(mockClient.from).toHaveBeenCalledWith('assessment_answers');
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(answer);
    });

    it('should handle network errors', async () => {
      mockOfflineService.isOnline.mockReturnValue(true);
      const mockQueryBuilder = {
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValue(new Error('Network error'))
      } as any;

      const mockClient = {
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any;

      answerService = new AnswerService(mockClient, mockOfflineService);
      await expect(answerService.saveAnswer(answer)).rejects.toThrow('Failed to save answer');
    });
  });
}); 