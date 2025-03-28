import { IntegrationTestUtils, setupTestEnvironment } from '../../utils/controller-test-utils';
import { ResearchDocumentationService, ResearchFinding } from '../../../server/src/services/ResearchDocumentationService';
import { AssessmentCategory } from '../../../server/src/models/AssessmentCategory';
import { DisciplineType } from '../../../server/src/models/DisciplineType';

describe('ResearchDocumentationService - Integration', () => {
  setupTestEnvironment();

  let documentationService: ResearchDocumentationService;
  let testFinding: ResearchFinding;

  beforeEach(() => {
    documentationService = new ResearchDocumentationService();
    testFinding = {
      id: 'test-finding-1',
      title: 'Test Research Finding',
      category: AssessmentCategory.OPERATIONS,
      relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
      source: 'Test Source',
      findings: 'Test findings content',
      impactAreas: ['area1', 'area2'],
      implications: 'Test implications',
      dateAdded: new Date()
    };
  });

  describe('Research Finding Management', () => {
    it('should add and retrieve research findings', () => {
      const finding = documentationService.addResearchFinding(testFinding);
      const findings = documentationService.getAllFindings();

      expect(findings).toHaveLength(1);
      expect(findings[0].id).toBe(testFinding.id);
    });

    it('should get findings by category', () => {
      documentationService.addResearchFinding(testFinding);
      const findings = documentationService.getResearchFindingsByCategory(AssessmentCategory.OPERATIONS);

      expect(findings).toHaveLength(1);
      expect(findings[0].category).toBe(AssessmentCategory.OPERATIONS);
    });

    it('should get findings by discipline', () => {
      documentationService.addResearchFinding(testFinding);
      const findings = documentationService.getResearchFindingsByDiscipline(DisciplineType.PHYSIOTHERAPY);

      expect(findings).toHaveLength(1);
      expect(findings[0].relevantDisciplines).toContain(DisciplineType.PHYSIOTHERAPY);
    });
  });

  describe('Research Summary Generation', () => {
    it('should generate research summary', () => {
      documentationService.addResearchFinding(testFinding);
      const summary = documentationService.generateResearchSummary(DisciplineType.PHYSIOTHERAPY);

      expect(summary.byCategory[AssessmentCategory.OPERATIONS]).toBeDefined();
      expect(summary.keyFindings).toHaveLength(1);
      expect(summary.assessmentImplications).toHaveLength(1);
      expect(summary.categoryCoverage.coveredCategories).toBe(1);
      expect(summary.researchGaps).toBeDefined();
    });

    it('should identify research gaps', () => {
      documentationService.addResearchFinding(testFinding);
      const summary = documentationService.generateResearchSummary(DisciplineType.PHYSIOTHERAPY);

      // Should have gaps for all categories except OPERATIONS
      expect(summary.researchGaps.length).toBeGreaterThan(0);
      expect(summary.researchGaps.some(gap => gap.includes('OPERATIONS'))).toBe(false);
    });
  });

  describe('Research Export', () => {
    it('should export findings to markdown', () => {
      documentationService.addResearchFinding(testFinding);
      const markdown = documentationService.exportResearchFindings('markdown', DisciplineType.PHYSIOTHERAPY);

      expect(markdown).toContain('# Research Findings');
      expect(markdown).toContain(testFinding.title);
      expect(markdown).toContain(testFinding.source);
    });

    it('should export findings to json', () => {
      documentationService.addResearchFinding(testFinding);
      const json = documentationService.exportResearchFindings('json', DisciplineType.PHYSIOTHERAPY);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe(testFinding.id);
    });
  });

  describe('Validation', () => {
    it('should validate research finding structure', () => {
      const invalidFinding = {
        ...testFinding,
        title: '', // Invalid: empty title
      };

      expect(() => documentationService.addResearchFinding(invalidFinding)).toThrow();
    });

    it('should validate disciplines', () => {
      const invalidFinding = {
        ...testFinding,
        relevantDisciplines: [], // Invalid: empty disciplines
      };

      expect(() => documentationService.addResearchFinding(invalidFinding)).toThrow();
    });
  });
}); 