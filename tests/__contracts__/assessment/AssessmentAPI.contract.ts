import { testAssessment, testQuestions } from '../../__fixtures__/assessments/testAssessment';

/**
 * Assessment API Contract Tests
 * Defines the expected behavior and response formats for assessment endpoints
 */

describe('Assessment API Contract', () => {
  const baseUrl = '/api/v1/assessments';

  describe('GET /assessments', () => {
    it('should return a list of assessments with required fields', async () => {
      const response = await fetch(`${baseUrl}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);

      if (data.length > 0) {
        const assessment = data[0];
        expect(assessment).toHaveProperty('id');
        expect(assessment).toHaveProperty('practiceId');
        expect(assessment).toHaveProperty('name');
        expect(assessment).toHaveProperty('status');
        expect(assessment).toHaveProperty('createdAt');
        expect(assessment).toHaveProperty('updatedAt');
      }
    });
  });

  describe('POST /assessments', () => {
    it('should create a new assessment with valid data', async () => {
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          practiceId: testAssessment.practiceId,
          name: testAssessment.name
        })
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.practiceId).toBe(testAssessment.practiceId);
      expect(data.name).toBe(testAssessment.name);
      expect(data.status).toBe('draft');
    });

    it('should return 400 for invalid assessment data', async () => {
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Missing required fields
        })
      });

      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('errors');
    });
  });

  describe('GET /assessments/:id', () => {
    it('should return a single assessment with all required fields', async () => {
      const response = await fetch(`${baseUrl}/${testAssessment.id}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(testAssessment.id);
      expect(data.practiceId).toBe(testAssessment.practiceId);
      expect(data.name).toBe(testAssessment.name);
      expect(data.status).toMatch(/^(draft|in_progress|completed)$/);
      expect(data).toHaveProperty('responses');
      expect(Array.isArray(data.responses)).toBe(true);
    });

    it('should return 404 for non-existent assessment', async () => {
      const response = await fetch(`${baseUrl}/non-existent-id`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /assessments/:id/responses', () => {
    it('should update assessment responses', async () => {
      const response = await fetch(`${baseUrl}/${testAssessment.id}/responses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          responses: testAssessment.responses
        })
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.id).toBe(testAssessment.id);
      expect(data.responses).toHaveLength(testAssessment.responses.length);
      expect(data.status).toBe('in_progress');
    });

    it('should validate response data', async () => {
      const response = await fetch(`${baseUrl}/${testAssessment.id}/responses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          responses: [
            {
              questionId: 'invalid-id',
              value: 'invalid-value'
            }
          ]
        })
      });

      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('errors');
    });
  });

  describe('GET /assessments/:id/questions', () => {
    it('should return applicable questions for the assessment', async () => {
      const response = await fetch(`${baseUrl}/${testAssessment.id}/questions`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      
      if (data.length > 0) {
        const question = data[0];
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('category');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('type');
        expect(question).toHaveProperty('weight');
        expect(question).toHaveProperty('applicableDisciplines');
        expect(question).toHaveProperty('applicablePracticeSizes');
      }
    });
  });

  describe('POST /assessments/:id/complete', () => {
    it('should mark assessment as complete and calculate final scores', async () => {
      const response = await fetch(`${baseUrl}/${testAssessment.id}/complete`, {
        method: 'POST'
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe('completed');
      expect(data).toHaveProperty('finalScore');
      expect(data).toHaveProperty('categoryScores');
      expect(data.categoryScores).toHaveProperty('FINANCIAL');
      expect(data.categoryScores).toHaveProperty('OPERATIONS');
    });

    it('should prevent completion of incomplete assessments', async () => {
      const incompleteAssessment = {
        ...testAssessment,
        responses: []
      };

      const response = await fetch(`${baseUrl}/${incompleteAssessment.id}/complete`, {
        method: 'POST'
      });

      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error).toHaveProperty('message');
      expect(error.message).toContain('incomplete');
    });
  });
}); 