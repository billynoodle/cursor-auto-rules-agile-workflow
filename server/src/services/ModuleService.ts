import { Module } from '../models/AssessmentModule';
import { DisciplineType } from '../models/DisciplineType';
import { PracticeSize } from '../models/PracticeSize';
import { Country } from '../models/Country';
import { AssessmentCategory } from '../models/AssessmentCategory';

/**
 * Service for managing assessment modules
 */
export class ModuleService {
  private modules: Module[] = [];

  /**
   * Creates a new assessment module
   */
  createModule(module: Module): Module {
    // Validate module before adding
    this.validateModule(module);
    
    // Add module to collection
    this.modules.push(module);
    return module;
  }

  /**
   * Retrieves all modules
   */
  getAllModules(): Module[] {
    return this.modules;
  }

  /**
   * Retrieves a module by ID
   */
  getModuleById(id: string): Module | undefined {
    return this.modules.find(module => module.id === id);
  }

  /**
   * Retrieves modules by category
   */
  getModulesByCategory(category: AssessmentCategory): Module[] {
    return this.modules.filter(module => module.category === category);
  }

  /**
   * Retrieves modules applicable to a specific discipline
   */
  getModulesByDiscipline(discipline: DisciplineType): Module[] {
    return this.modules.filter(module => 
      module.universalModule || 
      module.applicableDisciplines.includes(discipline)
    );
  }

  /**
   * Retrieves modules applicable to a specific practice size
   */
  getModulesByPracticeSize(practiceSize: PracticeSize): Module[] {
    return this.modules.filter(module => 
      module.applicablePracticeSizes.includes(practiceSize)
    );
  }

  /**
   * Retrieves modules filtered by multiple criteria
   */
  getFilteredModules(
    discipline?: DisciplineType,
    practiceSize?: PracticeSize,
    country?: Country,
    category?: AssessmentCategory
  ): Module[] {
    return this.modules.filter(module => {
      // Filter by discipline
      const disciplineMatch = !discipline || 
        module.universalModule || 
        module.applicableDisciplines.includes(discipline);
      
      // Filter by practice size
      const practiceSizeMatch = !practiceSize || 
        module.applicablePracticeSizes.includes(practiceSize);
      
      // Filter by category
      const categoryMatch = !category || module.category === category;
      
      return disciplineMatch && practiceSizeMatch && categoryMatch;
    });
  }

  /**
   * Validates module data
   */
  private validateModule(module: Module): void {
    // Ensure required fields are present
    if (!module.id || !module.name || !module.description) {
      throw new Error('Module must have id, name, and description');
    }
    
    // Ensure module has a valid category
    if (!Object.values(AssessmentCategory).includes(module.category)) {
      throw new Error('Module must have a valid category');
    }
    
    // Ensure module has applicable disciplines
    if (!module.applicableDisciplines || module.applicableDisciplines.length === 0) {
      throw new Error('Module must have at least one applicable discipline');
    }
    
    // Ensure module has applicable practice sizes
    if (!module.applicablePracticeSizes || module.applicablePracticeSizes.length === 0) {
      throw new Error('Module must have at least one applicable practice size');
    }
    
    // Ensure benchmarks are valid
    if (!module.benchmarks || 
        module.benchmarks.poor >= module.benchmarks.belowAverage ||
        module.benchmarks.belowAverage >= module.benchmarks.average ||
        module.benchmarks.average >= module.benchmarks.good ||
        module.benchmarks.good >= module.benchmarks.excellent) {
      throw new Error('Module benchmarks must be in ascending order: poor < belowAverage < average < good < excellent');
    }
  }

  /**
   * Gets discipline-specific module details if available
   */
  getDisciplineSpecificModule(module: Module, discipline: DisciplineType): Module {
    // If module has discipline-specific details, merge them with the base module
    if (module.disciplineSpecific && module.disciplineSpecific[discipline]) {
      const disciplineSpecific = module.disciplineSpecific[discipline];
      
      return {
        ...module,
        name: disciplineSpecific.name || module.name,
        description: disciplineSpecific.description || module.description,
        weight: disciplineSpecific.weight || module.weight,
        benchmarks: disciplineSpecific.benchmarks || module.benchmarks
      };
    }
    
    // Otherwise return the original module
    return module;
  }

  /**
   * Gets country-specific module details if available
   */
  getCountrySpecificModule(module: Module, country: Country): Module {
    // If module has country-specific details, merge them with the base module
    if (module.countrySpecific && module.countrySpecific[country]) {
      const countrySpecific = module.countrySpecific[country];
      
      return {
        ...module,
        benchmarks: countrySpecific.benchmarks || module.benchmarks
      };
    }
    
    // Otherwise return the original module
    return module;
  }
} 