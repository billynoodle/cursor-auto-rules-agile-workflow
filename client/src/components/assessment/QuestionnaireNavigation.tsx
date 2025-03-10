import React, { useState } from 'react';
import { Module } from '../../types/assessment.types';
import './QuestionnaireNavigation.css';

interface QuestionnaireNavigationProps {
  modules: Module[];
  currentModuleId: string;
  onModuleChange: (moduleId: string) => void;
  progress: Record<string, number>;
  testShowDescription?: string;
}

function QuestionnaireNavigation({
  modules,
  currentModuleId,
  onModuleChange,
  progress,
  testShowDescription
}: QuestionnaireNavigationProps) {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  return (
    <nav className="questionnaire-nav" data-testid="questionnaire-nav">
      <div className="module-list">
        {modules.map((module) => {
          const isActive = module.id === currentModuleId;
          const moduleProgress = progress[module.id] || 0;

          return (
            <button
              key={module.id}
              className={`module-item ${isActive ? 'active' : ''}`}
              onClick={() => onModuleChange(module.id)}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule(null)}
              tabIndex={0}
            >
              <div className="module-header">
                <span className="module-name">{module.name}</span>
                <span className="estimated-time">{module.estimatedTimeMinutes} min</span>
              </div>
              
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  data-testid={`progress-${module.id}`}
                  style={{ width: `${moduleProgress * 100}%` }}
                />
              </div>

              {(hoveredModule === module.id || testShowDescription === module.id) && (
                <div 
                  className="module-description"
                  data-testid={`module-description-${module.id}`}
                >
                  {module.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export { QuestionnaireNavigation }; 