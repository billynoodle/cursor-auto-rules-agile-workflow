import { testScenarios } from '../../__fixtures__/assessment';

/**
 * Assessment API Contract Tests
 * Defines the expected behavior and response formats for assessment endpoints
 */

describe('Assessment API Contract', () => {
  const baseUrl = '/api/v1/assessments';
  // Use the in-progress assessment for most tests as it has data
  const { assessment, answers } = testScenarios.inProgressAssessment;

  describe('GET /assessments', () => {
    it('should return a list of assessments with required fields', async () => {
      const response = await fetch(`${baseUrl}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);

      if (data.length > 0) {
        const responseAssessment = data[0];
        expect(responseAssessment).toHaveProperty('id');
        expect(responseAssessment).toHaveProperty('practiceId');
        expect(responseAssessment).toHaveProperty('name');
        expect(responseAssessment).toHaveProperty('status');
        expect(responseAssessment).toHaveProperty('createdAt');
        expect(responseAssessment).toHaveProperty('updatedAt');
      }
    });

    it('should create a new assessment', async () => {
      const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          practiceId: assessment.practiceId,
          name: assessment.name
        })
      });

      const data = await response.json();
      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.practiceId).toBe(assessment.practiceId);
      expect(data.name).toBe(assessment.name);
      expect(data.status).toBe('draft');
    });
  });

  describe('GET /assessments/:id', () => {
    it('should return a single assessment with all required fields', async () => {
      const response = await fetch(`${baseUrl}/${assessment.id}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(assessment.id);
      expect(data.practiceId).toBe(assessment.practiceId);
      expect(data.name).toBe(assessment.name);
      expect(data.status).toMatch(/^(draft|in_progress|completed)$/);
      expect(data).toHaveProperty('responses');
    });
  });

  describe('PUT /assessments/:id/responses', () => {
    it('should update assessment responses', async () => {
      const response = await fetch(`${baseUrl}/${assessment.id}/responses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          responses: answers
        })
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.id).toBe(assessment.id);
      expect(data.responses).toHaveLength(answers.length);
      expect(data.status).toBe('in_progress');
    });

    it('should validate response data', async () => {
      const response = await fetch(`${baseUrl}/${assessment.id}/responses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          responses: [{ invalid: 'data' }]
        })
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /assessments/:id/questions', () => {
    it('should return applicable questions for the assessment', async () => {
      const response = await fetch(`${baseUrl}/${assessment.id}/questions`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      if (data.length > 0) {
        const question = data[0];
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('text');
        expect(question).toHaveProperty('type');
        expect(question).toHaveProperty('category');
      }
    });
  });

  describe('POST /assessments/:id/complete', () => {
    it('should mark assessment as complete and calculate final scores', async () => {
      const response = await fetch(`${baseUrl}/${assessment.id}/complete`, {
        method: 'POST'
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe('completed');
      expect(data).toHaveProperty('finalScore');
      expect(data).toHaveProperty('categoryScores');
    });

    it('should prevent completion of incomplete assessments', async () => {
      const { assessment: emptyAssessment } = testScenarios.emptyAssessment;
      const response = await fetch(`${baseUrl}/${emptyAssessment.id}/complete`, {
        method: 'POST'
      });

      expect(response.status).toBe(400);
    });
  });
});