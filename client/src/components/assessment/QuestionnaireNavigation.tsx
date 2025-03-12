import React from 'react';
import './QuestionnaireNavigation.css';
import { AssessmentCategory, Module } from '../../types/assessment.types';

interface QuestionnaireNavigationProps {
  modules: Module[];
  currentModule: string;
  currentCategory: AssessmentCategory;
  onModuleSelect: (moduleId: string) => void;
  onCategorySelect: (category: AssessmentCategory) => void;
}

/**
 * Navigation component for the assessment questionnaire
 * 
 * Features:
 * - Module navigation
 * - Category navigation within modules
 * - Progress tracking
 * - Mobile-friendly design
 */
export function QuestionnaireNavigation({
  modules,
  currentModule,
  currentCategory,
  onModuleSelect,
  onCategorySelect
}: QuestionnaireNavigationProps): JSX.Element {
  return (
    <nav className="questionnaire-navigation">
      <div className="module-navigation">
        {modules.map((module) => (
          <button
            key={module.id}
            className={`module-button ${module.id === currentModule ? 'active' : ''}`}
            onClick={() => onModuleSelect(module.id)}
            tabIndex={0}
          >
            {module.name}
          </button>
        ))}
      </div>
      
      <div className="category-navigation">
        {Object.values(AssessmentCategory).map((category) => (
          <button
            key={category}
            className={`category-button ${category === currentCategory ? 'active' : ''}`}
            onClick={() => onCategorySelect(category)}
            tabIndex={0}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default QuestionnaireNavigation; 