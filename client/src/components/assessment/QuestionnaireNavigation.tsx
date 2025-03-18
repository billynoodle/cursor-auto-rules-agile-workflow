import React, { useState, useEffect } from 'react';
import { AssessmentCategory, Module, ModuleStatus } from '../../types/assessment.types';
import './QuestionnaireNavigation.css';

interface QuestionnaireNavigationProps {
  modules: Module[];
  currentModule: string;
  currentCategory: AssessmentCategory;
  onModuleSelect: (moduleId: string) => void;
  onCategorySelect: (category: AssessmentCategory) => void;
  totalEstimatedTime: number;
  remainingTime: number;
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
export const QuestionnaireNavigation: React.FC<QuestionnaireNavigationProps> = ({
  modules,
  currentModule,
  currentCategory,
  onModuleSelect,
  onCategorySelect,
  totalEstimatedTime,
  remainingTime
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const calculateOverallProgress = () => {
    const totalQuestions = modules.reduce((sum, module) => sum + module.totalQuestions, 0);
    const completedQuestions = modules.reduce((sum, module) => sum + module.completedQuestions, 0);
    return Math.round((completedQuestions / totalQuestions) * 100);
  };

  const handleModuleClick = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    if (module.status === ModuleStatus.LOCKED) return;
    onModuleSelect(moduleId);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, module: Module) => {
    if (module.status === ModuleStatus.LOCKED) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    handleModuleClick(module.id);
    return true;
  };

  const renderModuleItem = (module: Module) => {
    const isLocked = module.status === ModuleStatus.LOCKED;
    const isActive = module.id === currentModule;
    const prerequisiteNames = module.prerequisites
      .map(preId => modules.find(m => m.id === preId)?.name)
      .filter(Boolean)
      .join(', ');

    return (
      <li
        key={module.id}
        data-testid={`module-item-${module.id}`}
        role="listitem"
        aria-label={`${module.name} - ${module.status === ModuleStatus.LOCKED ? 'Locked' : 'Available'}`}
        aria-live="polite"
      >
        <button
          type="button"
          className={`module-button ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
          onClick={() => handleModuleClick(module.id)}
          disabled={isLocked}
          aria-disabled={isLocked ? 'true' : 'false'}
          tabIndex={isLocked ? -1 : 0}
          data-locked={isLocked ? 'true' : 'false'}
          data-testid={`module-button-${module.id}`}
        >
          <div className="module-info">
            <h3>{module.name}</h3>
            <div className="module-meta">
              <span className="time">{module.estimatedTimeMinutes} min</span>
              <span className="progress">{module.progress}%</span>
              <span className="questions">{module.completedQuestions}/{module.totalQuestions} questions</span>
            </div>
            {isLocked && (
              <div className="lock-info">
                <span data-testid="lock-icon" className="lock-icon" aria-hidden="true">🔒</span>
                <span className="prerequisite-text">Requires {prerequisiteNames}</span>
              </div>
            )}
          </div>
        </button>
      </li>
    );
  };

  const renderMobileMenu = () => (
    <div className="mobile-navigation">
      <button
        data-testid="mobile-menu-button"
        className="mobile-menu-button"
        onClick={() => setIsMenuOpen(prevState => !prevState)}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        <span className="menu-icon" aria-hidden="true">☰</span>
        <span className="sr-only">Toggle navigation menu</span>
      </button>
      {isMenuOpen && (
        <div
          id="mobile-menu"
          data-testid="mobile-menu"
          className="mobile-menu"
          aria-expanded={isMenuOpen}
        >
          <ul className="mobile-module-list">
            {modules.map(renderModuleItem)}
          </ul>
        </div>
      )}
    </div>
  );

  const renderDesktopNavigation = () => (
    <>
      <div className="progress-overview">
        <div className="total-progress">
          <span>Total Progress: {calculateOverallProgress()}%</span>
        </div>
        <div className="time-remaining">
          <span>Time Remaining: {remainingTime} min</span>
        </div>
      </div>
      <ul
        className="module-list"
        role="list"
        aria-label="Assessment Modules"
      >
        {modules.map(renderModuleItem)}
      </ul>
    </>
  );

  return (
    <nav className="questionnaire-navigation" role="navigation" aria-label="Assessment Navigation">
      {isMobile ? renderMobileMenu() : renderDesktopNavigation()}
    </nav>
  );
};

export default QuestionnaireNavigation; 