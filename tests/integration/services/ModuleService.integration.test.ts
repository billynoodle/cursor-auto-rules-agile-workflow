import { IntegrationTestUtils, setupTestEnvironment } from '../../utils/controller-test-utils';
import { ModuleService } from '@server/services/ModuleService';
import { generateFullMockData } from '@__mocks__/data/assessment';
import { Module } from '@server/models/AssessmentModule';
import { AssessmentCategory } from '@server/models/AssessmentCategory';
import { DisciplineType } from '@server/models/DisciplineType';
import { PracticeSize } from '@server/models/PracticeSize';

describe('ModuleService - Integration', () => {
  setupTestEnvironment();

  let moduleService: ModuleService;
  let testModule: Module;

  beforeEach(() => {
    moduleService = new ModuleService();
    testModule = {
      id: 'test-module-1',
      name: 'Test Module',
      description: 'Test module description',
      category: AssessmentCategory.OPERATIONS,
      order: 1,
      estimatedTimeMinutes: 30,
      weight: 5,
      minScore: 0,
      maxScore: 100,
      applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
      universalModule: false,
      benchmarks: {
        poor: 0,
        belowAverage: 25,
        average: 50,
        good: 75,
        excellent: 90
      },
      applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM]
    };
    moduleService.createModule(testModule);
  });

  describe('Module Management', () => {
    it('should retrieve all modules', () => {
      const modules = moduleService.getAllModules();
      expect(modules).toHaveLength(1);
      expect(modules[0].id).toBe(testModule.id);
    });

    it('should retrieve a specific module', () => {
      const module = moduleService.getModuleById(testModule.id);
      expect(module).toBeDefined();
      expect(module?.id).toBe(testModule.id);
    });

    it('should handle module not found', () => {
      const module = moduleService.getModuleById('non-existent-id');
      expect(module).toBeUndefined();
    });
  });

  describe('Module Filtering', () => {
    it('should filter modules by category', () => {
      const modules = moduleService.getModulesByCategory(AssessmentCategory.OPERATIONS);
      expect(modules).toHaveLength(1);
      expect(modules[0].category).toBe(AssessmentCategory.OPERATIONS);
    });

    it('should filter modules by discipline', () => {
      const modules = moduleService.getModulesByDiscipline(DisciplineType.PHYSIOTHERAPY);
      expect(modules).toHaveLength(1);
      expect(modules[0].applicableDisciplines).toContain(DisciplineType.PHYSIOTHERAPY);
    });

    it('should filter modules by practice size', () => {
      const modules = moduleService.getModulesByPracticeSize(PracticeSize.SMALL);
      expect(modules).toHaveLength(1);
      expect(modules[0].applicablePracticeSizes).toContain(PracticeSize.SMALL);
    });

    it('should handle combined filters', () => {
      const modules = moduleService.getFilteredModules(
        DisciplineType.PHYSIOTHERAPY,
        PracticeSize.SMALL,
        undefined,
        AssessmentCategory.OPERATIONS
      );
      expect(modules).toHaveLength(1);
      expect(modules[0].id).toBe(testModule.id);
    });
  });

  describe('Module Validation', () => {
    it('should validate module structure', () => {
      const module = moduleService.getModuleById(testModule.id);
      expect(module).toBeDefined();
      expect(module).toHaveProperty('id');
      expect(module).toHaveProperty('name');
      expect(module).toHaveProperty('description');
      expect(module).toHaveProperty('category');
      expect(module).toHaveProperty('benchmarks');
    });

    it('should throw error for invalid module', () => {
      const invalidModule = {
        ...testModule,
        id: 'invalid-module',
        applicableDisciplines: [] // Invalid: non-universal module must have disciplines
      };
      expect(() => moduleService.createModule(invalidModule)).toThrow();
    });
  });
}); 