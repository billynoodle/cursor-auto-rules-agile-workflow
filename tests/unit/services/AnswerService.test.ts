import { jest } from '@jest/globals';
import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '../../../../client/src/types/database';
import { createMockSupabaseClient } from '../../../__mocks__/services/supabase/client';
import { AnswerService } from '../../../../client/src/services/assessment/AnswerService';
import { generateMockAnswer, generateMockResponse } from '../../../__mocks__/data/generators';
import { OfflineService } from '../../../../client/src/services/assessment/OfflineService';
import { createMockOfflineService } from '../../../__mocks__/services/offline';
import { MockFilterBuilder, MockQueryBuilder } from '../../../__mocks__/services/supabase/types';
import { AssessmentError } from '../../../../client/src/services/assessment/AssessmentError';

describe('AnswerService', () => {
  let mockSupabaseClient: jest.Mocked<SupabaseClient<DatabaseSchema>>;
  let mockOfflineService: jest.Mocked<OfflineService>;
  let answerService: AnswerService;

  beforeEach(() => {
    mockSupabaseClient = createMockSupabaseClient();
    mockOfflineService = createMockOfflineService();
    answerService = new AnswerService(mockSupabaseClient, mockOfflineService);
  });

  describe('saveAnswer', () => {
    it('should save a new answer when online', async () => {
      const mockAnswer = generateMockAnswer();
      const mockResponse = generateMockResponse(mockAnswer);
      mockOfflineService.isOnline = true;
      const queryBuilder = mockSupabaseClient.from('answers') as unknown as MockQueryBuilder<'answers'>;
      const filterBuilder = queryBuilder.insert(mockAnswer) as unknown as MockFilterBuilder<'answers'>;
      filterBuilder.single().mockResolvedValue(mockResponse);

      const result = await answerService.saveAnswer(mockAnswer);

      expect(queryBuilder.insert).toHaveBeenCalledWith(mockAnswer);
      expect(filterBuilder.single).toHaveBeenCalled();
      expect(result).toEqual(mockAnswer);
    });

    it('should throw an error if answer creation fails', async () => {
      const mockAnswer = generateMockAnswer();
      const error = new Error('Failed to save answer');
      mockOfflineService.isOnline = true;
      const queryBuilder = mockSupabaseClient.from('answers') as unknown as MockQueryBuilder<'answers'>;
      const filterBuilder = queryBuilder.insert(mockAnswer) as unknown as MockFilterBuilder<'answers'>;
      filterBuilder.single().mockRejectedValue(error);

      await expect(answerService.saveAnswer(mockAnswer)).rejects.toThrow(error);
    });

    it('should store answer offline when offline', async () => {
      const mockAnswer = generateMockAnswer();
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });
      await answerService.saveAnswer(mockAnswer);
      expect(mockOfflineService.storeOfflineData).toHaveBeenCalledWith(expect.stringMatching(/^answer_\d+$/), mockAnswer);
    });

    it('should throw AssessmentError when validation fails', async () => {
      const invalidAnswer = {
        // Missing required fields
      };
      mockOfflineService.isOnline = true;

      await expect(answerService.saveAnswer(invalidAnswer))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when offline and validation fails', async () => {
      const invalidAnswer = {
        // Missing required fields
      };
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });

      await expect(answerService.saveAnswer(invalidAnswer))
        .rejects.toThrow(AssessmentError);
    });
  });

  describe('updateAnswer', () => {
    it('should update an existing answer when online', async () => {
      const mockAnswer = generateMockAnswer();
      const mockResponse = generateMockResponse(mockAnswer);
      mockOfflineService.isOnline = true;
      const queryBuilder = mockSupabaseClient.from('answers') as unknown as MockQueryBuilder<'answers'>;
      const filterBuilder = queryBuilder.update(mockAnswer).eq('id', mockAnswer.id) as unknown as MockFilterBuilder<'answers'>;
      filterBuilder.single().mockResolvedValue(mockResponse);

      const result = await answerService.updateAnswer(mockAnswer.id, mockAnswer);

      expect(queryBuilder.update).toHaveBeenCalledWith(mockAnswer);
      expect(filterBuilder.eq).toHaveBeenCalledWith('id', mockAnswer.id);
      expect(filterBuilder.single).toHaveBeenCalled();
      expect(result).toEqual(mockAnswer);
    });

    it('should throw an error if answer update fails', async () => {
      const mockAnswer = generateMockAnswer();
      const error = new Error('Failed to update answer');
      mockOfflineService.isOnline = true;
      const queryBuilder = mockSupabaseClient.from('answers') as unknown as MockQueryBuilder<'answers'>;
      const filterBuilder = queryBuilder.update(mockAnswer).eq('id', mockAnswer.id) as unknown as MockFilterBuilder<'answers'>;
      filterBuilder.single().mockRejectedValue(error);

      await expect(answerService.updateAnswer(mockAnswer.id, mockAnswer)).rejects.toThrow(error);
    });

    it('should store answer offline when offline', async () => {
      const mockAnswer = generateMockAnswer();
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });
      mockOfflineService.getOfflineData.mockReturnValue(mockAnswer);
      await answerService.updateAnswer(mockAnswer.id, mockAnswer);
      expect(mockOfflineService.storeOfflineData).toHaveBeenCalledWith(`answer_${mockAnswer.id}`, mockAnswer);
    });

    it('should throw AssessmentError when validation fails', async () => {
      const invalidAnswer = {
        // Missing required fields
      };
      mockOfflineService.isOnline = true;

      await expect(answerService.updateAnswer('1', invalidAnswer))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when offline and validation fails', async () => {
      const invalidAnswer = {
        // Missing required fields
      };
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });

      await expect(answerService.updateAnswer('1', invalidAnswer))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when offline and answer not found', async () => {
      const answer = generateMockAnswer();
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });
      mockOfflineService.getOfflineData.mockReturnValue(null);

      await expect(answerService.updateAnswer('1', answer))
        .rejects.toThrow(AssessmentError);
    });
  });
}); 