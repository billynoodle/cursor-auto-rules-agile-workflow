import '@jest/globals';
import { ModuleService } from '@/services/ModuleService';
import { Module } from '@/services/../models/AssessmentModule';
import { AssessmentCategory } from '@/services/../models/AssessmentCategory';
import { DisciplineType } from '@/services/../models/DisciplineType';
import { PracticeSize } from '@/services/../models/PracticeSize';
import { Country } from '@/services/../models/Country';
import { ScorePosition } from '@/services/../models/ScorePosition';
import { SOPType } from '@/services/../models/SOPType';

describe('ModuleService', () => {
  let moduleService: ModuleService;
  let testModule: Module;
  let testModuleWithDisciplineSpecific: Module;
  let testModuleWithCountrySpecific: Module;

  beforeEach(() => {
    moduleService = new ModuleService();
    
    // Create a standard test module
    testModule = {
      id: 'mod-001',
      name: 'Financial Health',
      description: 'Assesses the financial health of the practice',
      category: AssessmentCategory.FINANCIAL,
      order: 1,
      estimatedTimeMinutes: 10,
      weight: 8,
      minScore: 0,
      maxScore: 100,
      applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
      universalModule: false,
      benchmarks: {
        poor: 0,
        belowAverage: 30,
        average: 50,
        good: 70,
        excellent: 90
      },
      applicablePracticeSizes: [
        PracticeSize.SOLO,
        PracticeSize.SMALL,
        PracticeSize.MEDIUM
      ],
      sopRelevance: {
        relevant: true,
        sopTypes: [SOPType.ADMINISTRATIVE, SOPType.COMPLIANCE]
      },
      scoreInterpretation: {
        [ScorePosition.CRITICAL]: {
          description: 'Urgent financial review needed',
          generalRecommendations: ['Review cash flow immediately']
        },
        [ScorePosition.CONCERNING]: {
          description: 'Financial weaknesses identified',
          generalRecommendations: ['Review pricing structure']
        },
        [ScorePosition.STABLE]: {
          description: 'Financially stable operation',
          generalRecommendations: ['Continue monitoring cash flow']
        },
        [ScorePosition.STRONG]: {
          description: 'Strong financial performance',
          generalRecommendations: ['Consider expansion opportunities']
        },
        [ScorePosition.EXCEPTIONAL]: {
          description: 'Exceptional financial health',
          generalRecommendations: ['Implement profit-sharing']
        }
      }
    };
    
    // Module with discipline-specific content
    testModuleWithDisciplineSpecific = {
      ...testModule,
      id: 'mod-002',
      name: 'Staff Management',
      description: 'Assesses staff management practices',
      category: AssessmentCategory.STAFFING,
      disciplineSpecific: {
        [DisciplineType.PHYSIOTHERAPY]: {
          name: 'Physiotherapy Staff Management',
          description: 'Assesses physiotherapy-specific staff management practices',
          weight: 9,
          benchmarks: {
            poor: 0,
            belowAverage: 25,
            average: 50,
            good: 75,
            excellent: 90
          }
        }
      }
    };
    
    // Module with country-specific content
    testModuleWithCountrySpecific = {
      ...testModule,
      id: 'mod-003',
      name: 'Compliance',
      description: 'Assesses regulatory compliance',
      category: AssessmentCategory.COMPLIANCE,
      countrySpecific: {
        [Country.AUSTRALIA]: {
          benchmarks: {
            poor: 0,
            belowAverage: 40,
            average: 60,
            good: 80,
            excellent: 95
          }
        }
      }
    };
  });

  describe('createModule', () => {
    it('should add a valid module to the collection', () => {
      const result = moduleService.createModule(testModule);
      
      expect(result).toEqual(testModule);
      expect(moduleService.getAllModules()).toContain(testModule);
    });
    
    it('should validate required fields', () => {
      const invalidModule = { ...testModule, id: '' };
      
      expect(() => {
        moduleService.createModule(invalidModule);
      }).toThrow('Module must have id, name, and description');
    });
    
    it('should validate category', () => {
      const invalidModule = { 
        ...testModule, 
        category: 'INVALID_CATEGORY' as AssessmentCategory 
      };
      
      expect(() => {
        moduleService.createModule(invalidModule);
      }).toThrow('Module must have a valid category');
    });
    
    it('should validate applicable disciplines', () => {
      const invalidModule = { ...testModule, applicableDisciplines: [] };
      
      expect(() => {
        moduleService.createModule(invalidModule);
      }).toThrow('Module must have at least one applicable discipline');
    });
    
    it('should validate applicable practice sizes', () => {
      const invalidModule = { ...testModule, applicablePracticeSizes: [] };
      
      expect(() => {
        moduleService.createModule(invalidModule);
      }).toThrow('Module must have at least one applicable practice size');
    });
    
    it('should validate benchmarks', () => {
      const invalidModule = { 
        ...testModule, 
        benchmarks: {
          poor: 50,
          belowAverage: 40,
          average: 60,
          good: 80,
          excellent: 95
        } 
      };
      
      expect(() => {
        moduleService.createModule(invalidModule);
      }).toThrow('Module benchmarks must be in ascending order');
    });
  });

  describe('getModuleById', () => {
    it('should return the module with matching id', () => {
      moduleService.createModule(testModule);
      
      const result = moduleService.getModuleById(testModule.id);
      
      expect(result).toEqual(testModule);
    });
    
    it('should return undefined if no module with id exists', () => {
      const result = moduleService.getModuleById('non-existent-id');
      
      expect(result).toBeUndefined();
    });
  });

  describe('getModulesByCategory', () => {
    it('should return modules with matching category', () => {
      moduleService.createModule(testModule);
      moduleService.createModule(testModuleWithDisciplineSpecific);
      
      const result = moduleService.getModulesByCategory(AssessmentCategory.FINANCIAL);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(testModule);
    });
    
    it('should return empty array if no modules with category exist', () => {
      const result = moduleService.getModulesByCategory(AssessmentCategory.MARKETING);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getModulesByDiscipline', () => {
    it('should return modules applicable to the discipline', () => {
      moduleService.createModule(testModule);
      
      const result = moduleService.getModulesByDiscipline(DisciplineType.PHYSIOTHERAPY);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(testModule);
    });
    
    it('should include universal modules', () => {
      const universalModule = { 
        ...testModule, 
        id: 'mod-universal',
        universalModule: true,
        applicableDisciplines: [] 
      };
      
      moduleService.createModule(universalModule);
      
      const result = moduleService.getModulesByDiscipline(DisciplineType.OCCUPATIONAL_THERAPY);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(universalModule);
    });
    
    it('should return empty array if no modules for discipline exist', () => {
      moduleService.createModule(testModule);
      
      const result = moduleService.getModulesByDiscipline(DisciplineType.PSYCHOLOGY);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getModulesByPracticeSize', () => {
    it('should return modules applicable to the practice size', () => {
      moduleService.createModule(testModule);
      
      const result = moduleService.getModulesByPracticeSize(PracticeSize.SOLO);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(testModule);
    });
    
    it('should return empty array if no modules for practice size exist', () => {
      moduleService.createModule(testModule);
      
      const result = moduleService.getModulesByPracticeSize(PracticeSize.ENTERPRISE);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getFilteredModules', () => {
    beforeEach(() => {
      moduleService.createModule(testModule);
      moduleService.createModule(testModuleWithDisciplineSpecific);
      moduleService.createModule(testModuleWithCountrySpecific);
    });
    
    it('should filter modules by discipline', () => {
      const result = moduleService.getFilteredModules(
        DisciplineType.PHYSIOTHERAPY,
        undefined,
        undefined,
        undefined
      );
      
      expect(result).toHaveLength(3);
    });
    
    it('should filter modules by practice size', () => {
      const result = moduleService.getFilteredModules(
        undefined,
        PracticeSize.SMALL,
        undefined,
        undefined
      );
      
      expect(result).toHaveLength(3);
    });
    
    it('should filter modules by category', () => {
      const result = moduleService.getFilteredModules(
        undefined,
        undefined,
        undefined,
        AssessmentCategory.FINANCIAL
      );
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('mod-001');
    });
    
    it('should filter modules by multiple criteria', () => {
      const result = moduleService.getFilteredModules(
        DisciplineType.PHYSIOTHERAPY,
        PracticeSize.SMALL,
        undefined,
        AssessmentCategory.STAFFING
      );
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('mod-002');
    });
    
    it('should return empty array when no modules match filters', () => {
      const result = moduleService.getFilteredModules(
        DisciplineType.PSYCHOLOGY,
        undefined,
        undefined,
        undefined
      );
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getDisciplineSpecificModule', () => {
    it('should return module with discipline-specific content merged', () => {
      const result = moduleService.getDisciplineSpecificModule(
        testModuleWithDisciplineSpecific,
        DisciplineType.PHYSIOTHERAPY
      );
      
      expect(result.name).toBe('Physiotherapy Staff Management');
      expect(result.description).toBe('Assesses physiotherapy-specific staff management practices');
      expect(result.weight).toBe(9);
      expect(result.benchmarks.belowAverage).toBe(25);
    });
    
    it('should return original module when no discipline-specific content exists', () => {
      const result = moduleService.getDisciplineSpecificModule(
        testModule,
        DisciplineType.PHYSIOTHERAPY
      );
      
      expect(result).toEqual(testModule);
    });
  });

  describe('getCountrySpecificModule', () => {
    it('should return module with country-specific content merged', () => {
      const result = moduleService.getCountrySpecificModule(
        testModuleWithCountrySpecific,
        Country.AUSTRALIA
      );
      
      expect(result.name).toBe('Compliance');
      expect(result.benchmarks.belowAverage).toBe(40);
    });
    
    it('should return original module when no country-specific content exists', () => {
      const result = moduleService.getCountrySpecificModule(
        testModule,
        Country.AUSTRALIA
      );
      
      expect(result).toEqual(testModule);
    });
  });
}); 