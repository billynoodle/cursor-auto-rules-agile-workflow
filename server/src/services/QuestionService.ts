import { Question } from '../models/Question';
import { QuestionType } from '../models/QuestionType';
import { AssessmentCategory } from '../models/AssessmentCategory';
import { DisciplineType } from '../models/DisciplineType';
import { PracticeSize } from '../models/PracticeSize';
import { Country } from '../models/Country';

/**
 * Service for managing assessment questions
 */
export class QuestionService {
  private questions: Question[] = [];

  /**
   * Creates a new question
   */
  createQuestion(question: Question): Question {
    // Validate question before adding
    this.validateQuestion(question);
    
    // Add question to collection
    this.questions.push(question);
    return question;
  }

  /**
   * Adds multiple questions at once
   */
  addQuestions(questions: Question[]): Question[] {
    questions.forEach(question => this.validateQuestion(question));
    this.questions.push(...questions);
    return questions;
  }

  /**
   * Retrieves all questions
   */
  getAllQuestions(): Question[] {
    return this.questions;
  }

  /**
   * Retrieves a question by ID
   */
  getQuestionById(id: string): Question | undefined {
    return this.questions.find(question => question.id === id);
  }

  /**
   * Retrieves questions by category
   */
  getQuestionsByCategory(category: AssessmentCategory): Question[] {
    return this.questions.filter(question => question.category === category);
  }

  /**
   * Retrieves questions by module ID
   */
  getQuestionsByModule(moduleId: string): Question[] {
    return this.questions.filter(question => question.moduleId === moduleId);
  }

  /**
   * Retrieves questions applicable to a specific discipline
   */
  getQuestionsByDiscipline(discipline: DisciplineType): Question[] {
    return this.questions.filter(question => 
      question.universalQuestion || 
      question.applicableDisciplines.includes(discipline)
    );
  }

  /**
   * Retrieves questions applicable to a specific practice size
   */
  getQuestionsByPracticeSize(practiceSize: PracticeSize): Question[] {
    return this.questions.filter(question => 
      question.applicablePracticeSizes.includes(practiceSize)
    );
  }

  /**
   * Retrieves questions by type
   */
  getQuestionsByType(type: QuestionType): Question[] {
    return this.questions.filter(question => question.type === type);
  }

  /**
   * Retrieves questions filtered by multiple criteria
   */
  getFilteredQuestions(
    moduleId?: string,
    discipline?: DisciplineType,
    practiceSize?: PracticeSize,
    category?: AssessmentCategory,
    questionType?: QuestionType
  ): Question[] {
    return this.questions.filter(question => {
      // Filter by module
      const moduleMatch = !moduleId || question.moduleId === moduleId;
      
      // Filter by discipline
      const disciplineMatch = !discipline || 
        question.universalQuestion || 
        question.applicableDisciplines.includes(discipline);
      
      // Filter by practice size
      const practiceSizeMatch = !practiceSize || 
        question.applicablePracticeSizes.includes(practiceSize);
      
      // Filter by category
      const categoryMatch = !category || question.category === category;
      
      // Filter by question type
      const typeMatch = !questionType || question.type === questionType;
      
      return moduleMatch && disciplineMatch && practiceSizeMatch && categoryMatch && typeMatch;
    });
  }

  /**
   * Gets discipline-specific question details if available
   */
  getDisciplineSpecificQuestion(question: Question, discipline: DisciplineType): Question {
    // If question has discipline-specific details, merge them with the base question
    if (question.disciplineSpecific && question.disciplineSpecific[discipline]) {
      const disciplineSpecific = question.disciplineSpecific[discipline];
      
      return {
        ...question,
        text: disciplineSpecific.text || question.text,
        weight: disciplineSpecific.weight || question.weight,
        options: disciplineSpecific.options || question.options,
        helpText: disciplineSpecific.helpText || question.helpText
      };
    }
    
    // Otherwise return the original question
    return question;
  }

  /**
   * Gets country-specific question details if available
   */
  getCountrySpecificQuestion(question: Question, country: Country): Question {
    // If question has country-specific details, merge them with the base question
    if (question.countrySpecific && question.countrySpecific[country]) {
      const countrySpecific = question.countrySpecific[country];
      
      return {
        ...question,
        text: countrySpecific.text || question.text,
        options: countrySpecific.options || question.options,
        helpText: countrySpecific.helpText || question.helpText
      };
    }
    
    // Otherwise return the original question
    return question;
  }

  /**
   * Validates question data
   */
  private validateQuestion(question: Question): void {
    // Ensure required fields are present
    if (!question.id || !question.text || !question.moduleId) {
      throw new Error('Question must have id, text, and moduleId');
    }
    
    // Ensure question has a valid type
    if (!Object.values(QuestionType).includes(question.type)) {
      throw new Error('Question must have a valid type');
    }
    
    // Ensure question has a valid category
    if (!Object.values(AssessmentCategory).includes(question.category)) {
      throw new Error('Question must have a valid category');
    }
    
    // Ensure question has applicable disciplines
    if (!question.applicableDisciplines || question.applicableDisciplines.length === 0) {
      throw new Error('Question must have at least one applicable discipline');
    }
    
    // Ensure question has applicable practice sizes
    if (!question.applicablePracticeSizes || question.applicablePracticeSizes.length === 0) {
      throw new Error('Question must have at least one applicable practice size');
    }
    
    // Type-specific validations
    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      if (!question.options || question.options.length < 2) {
        throw new Error('Multiple choice questions must have at least two options');
      }
    }
    
    if (question.type === QuestionType.NUMERIC) {
      if (question.minScore === undefined || question.maxScore === undefined) {
        throw new Error('Numeric questions must have minScore and maxScore defined');
      }
      
      if (question.minScore >= question.maxScore) {
        throw new Error('Numeric question minScore must be less than maxScore');
      }
    }
    
    // Weight validation
    if (question.weight < 1 || question.weight > 10) {
      throw new Error('Question weight must be between 1 and 10');
    }
  }
} 