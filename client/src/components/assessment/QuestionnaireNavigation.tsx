import React from 'react';
import { AssessmentCategory, Module } from '@client/types/assessment.types';
import './QuestionnaireNavigation.css';

interface QuestionnaireNavigationProps {
  modules: Module[];
  currentModule: string;
  currentCategory: AssessmentCategory;
  onModuleSelect: (moduleId: string) => void;
  onCategorySelect: (category: AssessmentCategory) => void;
}

export const QuestionnaireNavigation: React.FC<QuestionnaireNavigationProps> = ({
  modules,
  currentModule,
  currentCategory,
  onModuleSelect,
  onCategorySelect
}) => {
  const categories = Object.values(AssessmentCategory) as AssessmentCategory[];

  return (
    <nav className="questionnaire-navigation">
      <div className="module-navigation">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => onModuleSelect(module.id)}
            className={currentModule === module.id ? 'active' : ''}
          >
            {module.name}
          </button>
        ))}
      </div>
      <div className="category-navigation">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={currentCategory === category ? 'active' : ''}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
}; 