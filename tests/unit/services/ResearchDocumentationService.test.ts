import { ResearchDocumentationService } from '@server/services/ResearchDocumentationService';
import { AssessmentCategory } from '@server/models/AssessmentCategory';
import { DisciplineType } from '@server/models/DisciplineType';

describe('ResearchDocumentationService', () => {
  let documentationService: ResearchDocumentationService;

  beforeEach(() => {
    documentationService = new ResearchDocumentationService();
  });

  describe('addResearchFinding', () => {
    it('should add a valid research finding', () => {
      const finding = {
        id: 'finding-001',
        title: 'Common financial challenges for small physiotherapy practices',
        category: AssessmentCategory.FINANCIAL,
        relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
        source: 'Industry Survey 2023',
        findings: 'Small physiotherapy practices often struggle with cash flow management and resource allocation.',
        impactAreas: ['Budgeting', 'Staffing', 'Resource Management'],
        implications: 'Assessment questions should address cash flow tracking and resource allocation strategies.',
        dateAdded: new Date(),
      };

      const result = documentationService.addResearchFinding(finding);
      
      expect(result).toEqual(finding);
      expect(documentationService.getAllFindings()).toContain(finding);
    });

    it('should validate required fields', () => {
      const invalidFinding = {
        id: 'finding-002',
        title: '',
        category: AssessmentCategory.FINANCIAL,
        relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
        source: '',
        findings: 'Incomplete finding',
        impactAreas: [],
        implications: '',
        dateAdded: new Date(),
      };

      expect(() => {
        documentationService.addResearchFinding(invalidFinding);
      }).toThrow('Research finding must have title, source, and implications');
    });

    it('should validate category', () => {
      const invalidFinding = {
        id: 'finding-003',
        title: 'Invalid category finding',
        category: 'INVALID_CATEGORY' as AssessmentCategory,
        relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
        source: 'Test',
        findings: 'Test finding',
        impactAreas: ['Test'],
        implications: 'Test implications',
        dateAdded: new Date(),
      };

      expect(() => {
        documentationService.addResearchFinding(invalidFinding);
      }).toThrow('Research finding must have a valid category');
    });

    it('should validate relevant disciplines', () => {
      const invalidFinding = {
        id: 'finding-004',
        title: 'No disciplines finding',
        category: AssessmentCategory.FINANCIAL,
        relevantDisciplines: [],
        source: 'Test',
        findings: 'Test finding',
        impactAreas: ['Test'],
        implications: 'Test implications',
        dateAdded: new Date(),
      };

      expect(() => {
        documentationService.addResearchFinding(invalidFinding);
      }).toThrow('Research finding must have at least one relevant discipline');
    });
  });

  describe('getResearchFindingsByCategory', () => {
    beforeEach(() => {
      // Add some test data
      documentationService.addResearchFinding({
        id: 'finding-001',
        title: 'Financial finding',
        category: AssessmentCategory.FINANCIAL,
        relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
        source: 'Source 1',
        findings: 'Test financial finding',
        impactAreas: ['Test'],
        implications: 'Test implications',
        dateAdded: new Date(),
      });
      
      documentationService.addResearchFinding({
        id: 'finding-002',
        title: 'Operations finding',
        category: AssessmentCategory.OPERATIONS,
        relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
        source: 'Source 2',
        findings: 'Test operations finding',
        impactAreas: ['Test'],
        implications: 'Test implications',
        dateAdded: new Date(),
      });
    });

    it('should return findings with matching category', () => {
      const result = documentationService.getResearchFindingsByCategory(AssessmentCategory.FINANCIAL);
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Financial finding');
    });
    
    it('should return empty array if no findings with category exist', () => {
      const result = documentationService.getResearchFindingsByCategory(AssessmentCategory.MARKETING);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getResearchFindingsByDiscipline', () => {
    beforeEach(() => {
      // Add some test data with different disciplines
      documentationService.addResearchFinding({
        id: 'finding-001',
        title: 'Physiotherapy finding',
        category: AssessmentCategory.FINANCIAL,
        relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
        source: 'Source 1',
        findings: 'Test physio finding',
        impactAreas: ['Test'],
        implications: 'Test implications',
        dateAdded: new Date(),
      });
      
      documentationService.addResearchFinding({
        id: 'finding-002',
        title: 'Multi-discipline finding',
        category: AssessmentCategory.OPERATIONS,
        relevantDisciplines: [
          DisciplineType.PHYSIOTHERAPY,
          DisciplineType.OCCUPATIONAL_THERAPY
        ],
        source: 'Source 2',
        findings: 'Test multi-discipline finding',
        impactAreas: ['Test'],
        implications: 'Test implications',
        dateAdded: new Date(),
      });
    });

    it('should return findings relevant to the discipline', () => {
      const result = documentationService.getResearchFindingsByDiscipline(DisciplineType.PHYSIOTHERAPY);
      
      expect(result).toHaveLength(2);
    });
    
    it('should return correct findings for a different discipline', () => {
      const result = documentationService.getResearchFindingsByDiscipline(DisciplineType.OCCUPATIONAL_THERAPY);
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Multi-discipline finding');
    });
    
    it('should return empty array if no findings for discipline exist', () => {
      const result = documentationService.getResearchFindingsByDiscipline(DisciplineType.PSYCHOLOGY);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('generateResearchSummary', () => {
    beforeEach(() => {
      // Add a variety of findings across categories
      documentationService.addResearchFinding({
        id: 'finding-001',
        title: 'Financial challenges',
        category: AssessmentCategory.FINANCIAL,
        relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
        source: 'Source 1',
        findings: 'Financial challenges for physio practices include cash flow and billing.',
        impactAreas: ['Cash Flow', 'Billing'],
        implications: 'Financial questions should focus on these areas.',
        dateAdded: new Date(),
      });
      
      documentationService.addResearchFinding({
        id: 'finding-002',
        title: 'Operations efficiency',
        category: AssessmentCategory.OPERATIONS,
        relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
        source: 'Source 2',
        findings: 'Scheduling and workflow are key operational challenges.',
        impactAreas: ['Scheduling', 'Workflow'],
        implications: 'Operations questions should address these challenges.',
        dateAdded: new Date(),
      });
    });

    it('should generate a comprehensive summary document', () => {
      const summary = documentationService.generateResearchSummary(DisciplineType.PHYSIOTHERAPY);
      
      expect(summary).toHaveProperty('byCategory');
      expect(summary.byCategory).toHaveProperty(AssessmentCategory.FINANCIAL);
      expect(summary.byCategory).toHaveProperty(AssessmentCategory.OPERATIONS);
      
      expect(summary.keyFindings.length).toBeGreaterThan(0);
      expect(summary.assessmentImplications.length).toBeGreaterThan(0);
    });
    
    it('should include category coverage statistics', () => {
      const summary = documentationService.generateResearchSummary(DisciplineType.PHYSIOTHERAPY);
      
      expect(summary).toHaveProperty('categoryCoverage');
      expect(summary.categoryCoverage).toHaveProperty('totalCategories');
      expect(summary.categoryCoverage).toHaveProperty('coveredCategories');
      expect(summary.categoryCoverage).toHaveProperty('coveragePercentage');
    });
    
    it('should identify gaps in research', () => {
      const summary = documentationService.generateResearchSummary(DisciplineType.PHYSIOTHERAPY);
      
      expect(summary).toHaveProperty('researchGaps');
      // Since we only added findings for 2 categories out of 10, there should be gaps
      expect(summary.researchGaps.length).toBeGreaterThan(0);
    });
  });

  describe('exportResearchFindings', () => {
    beforeEach(() => {
      // Add some test data
      documentationService.addResearchFinding({
        id: 'finding-001',
        title: 'Test finding for export',
        category: AssessmentCategory.FINANCIAL,
        relevantDisciplines: [DisciplineType.PHYSIOTHERAPY],
        source: 'Test Source',
        findings: 'Test findings content',
        impactAreas: ['Test Area'],
        implications: 'Test implications',
        dateAdded: new Date(),
      });
    });

    it('should export findings to the specified format', () => {
      const exportResult = documentationService.exportResearchFindings('markdown');
      
      expect(exportResult).toContain('# Research Findings');
      expect(exportResult).toContain('Test finding for export');
      expect(exportResult).toContain('Test implications');
    });
    
    it('should filter exports by discipline when specified', () => {
      // Add a finding for a different discipline
      documentationService.addResearchFinding({
        id: 'finding-002',
        title: 'OT finding',
        category: AssessmentCategory.STAFFING,
        relevantDisciplines: [DisciplineType.OCCUPATIONAL_THERAPY],
        source: 'OT Source',
        findings: 'OT findings content',
        impactAreas: ['OT Area'],
        implications: 'OT implications',
        dateAdded: new Date(),
      });
      
      const exportResult = documentationService.exportResearchFindings(
        'markdown', 
        DisciplineType.PHYSIOTHERAPY
      );
      
      expect(exportResult).toContain('Test finding for export');
      expect(exportResult).not.toContain('OT finding');
    });
  });
}); 