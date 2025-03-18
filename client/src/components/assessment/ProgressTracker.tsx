import React from 'react';
import './ProgressTracker.css';

interface Module {
  id: string;
  title: string;
  totalQuestions: number;
  answeredQuestions: number;
}

interface ProgressTrackerProps {
  modules: Module[];
  currentModuleId: string;
  averageTimePerQuestion?: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  modules,
  currentModuleId,
  averageTimePerQuestion = 2
}) => {
  // Calculate overall progress
  const totalQuestions = modules.reduce((sum, mod) => sum + mod.totalQuestions, 0);
  const answeredQuestions = modules.reduce((sum, mod) => sum + mod.answeredQuestions, 0);
  const overallProgress = Math.round((answeredQuestions / totalQuestions) * 100);

  // Calculate remaining time
  const remainingQuestions = totalQuestions - answeredQuestions;
  const estimatedMinutes = remainingQuestions * averageTimePerQuestion;

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const moduleElements = document.querySelectorAll('.module-item');
    if (event.key === 'ArrowRight' && index < modules.length - 1) {
      (moduleElements[index + 1] as HTMLElement)?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      (moduleElements[index - 1] as HTMLElement)?.focus();
    }
  };

  return (
    <div className="progress-tracker">
      <div className="overall-progress">
        <div
          role="progressbar"
          aria-label="overall progress"
          aria-valuenow={overallProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="progress-bar"
        >
          <div 
            className="progress-fill" 
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <span className="progress-text">{overallProgress}% Complete</span>
      </div>

      <div className="time-estimate">
        <span>Estimated time remaining: {estimatedMinutes} minutes</span>
      </div>

      <ul className="module-list">
        {modules.map((module, index) => {
          const progress = Math.round((module.answeredQuestions / module.totalQuestions) * 100);
          const isCompleted = module.answeredQuestions === module.totalQuestions;
          const isCurrent = module.id === currentModuleId;

          return (
            <li
              key={module.id}
              className={`module-item ${isCompleted ? 'completed' : ''} ${
                isCurrent ? 'current-module' : ''
              }`}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <div className="module-header">
                <span className="module-title">{module.title}</span>
                <span className="module-progress">{progress}%</span>
              </div>
              <div className="module-progress-bar">
                <div 
                  className="module-progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}; 