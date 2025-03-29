import React, { useState, useEffect, useRef } from 'react';
import { Question, QuestionOption, QuestionType } from '@/types/assessment.types';
import './QuestionPresentation.css';

interface QuestionPresentationProps {
  question: Question;
  selectedOption?: string;
  onSelect: (optionId: string) => void;
  showProgressiveDisclosure?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

/**
 * Component for presenting assessment questions with progressive disclosure
 * 
 * Features:
 * - Progressive content disclosure
 * - Accessible form controls
 * - Keyboard navigation
 * - Tooltips for additional context
 * - Error handling for edge cases
 * - Screen reader support
 */
export const QuestionPresentation: React.FC<QuestionPresentationProps> = ({
  question,
  selectedOption,
  onSelect,
  showProgressiveDisclosure = true,
  onPrevious,
  onNext,
  isFirst = false,
  isLast = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!showProgressiveDisclosure);
  const [showTooltip, setShowTooltip] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const descriptionId = `question-desc-${question.id}`;

  useEffect(() => {
    if (isExpanded && firstOptionRef.current) {
      firstOptionRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (question.required && !selectedOption) {
      setValidationError('Please select an option');
    } else {
      setValidationError(null);
    }
  }, [question.required, selectedOption]);

  const handleExpand = () => {
    if (showProgressiveDisclosure) {
      setIsExpanded(true);
    }
  };

  const handleNext = () => {
    if (!canProceed) {
      setValidationError('Please select an option');
      return;
    }
    setValidationError(null);
    onNext?.();
  };

  const handleButtonClick = () => {
    if (!canProceed) {
      setValidationError('Please select an option');
    } else {
      handleNext();
    }
  };

  const handleDisabledClick = () => {
    if (!canProceed) {
      setValidationError('Please select an option');
    }
  };

  const canProceed = !question.required || selectedOption !== undefined;

  const getWeightIndicator = (weight: number): string => {
    if (weight > 10000) return 'High Impact';
    if (weight > 1000) return 'Medium Impact';
    return 'Standard Impact';
  };

  const validateQuestionType = (type: QuestionType): boolean => {
    return Object.values(QuestionType).includes(type);
  };

  const hasDependencyError = (dependencies: string[]): boolean => {
    return dependencies.includes('self-reference') || dependencies.some(dep => dep === question.id);
  };

  if (!validateQuestionType(question.type)) {
    return (
      <div className="error-container" role="alert">
        <p>Unsupported question type</p>
      </div>
    );
  }

  if (hasDependencyError(question.dependencies || [])) {
    return (
      <div className="error-container" role="alert">
        <p>Unable to process dependencies</p>
      </div>
    );
  }

  return (
    <div 
      className="question-presentation" 
      role="group" 
      aria-label={question.text}
      aria-describedby={descriptionId}
    >
      <div className="question-header">
        <h2 className="question-text">
          {question.text}
          {question.required && (
            <span 
              className="required-indicator" 
              aria-label="required"
              data-testid="required-indicator"
            >
              *
            </span>
          )}
          <span 
            className="weight-indicator" 
            data-testid="weight-indicator"
          >
            {getWeightIndicator(question.weight)}
          </span>
        </h2>
        {question.helpText && (
          <div 
            id={descriptionId}
            className="help-text" 
            aria-label="Help text"
            data-testid="tooltip-trigger"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="visually-hidden">More information about this question</span>
            <p>{question.helpText}</p>
          </div>
        )}
      </div>

      {showProgressiveDisclosure && !isExpanded ? (
        <button 
          className="expand-trigger" 
          onClick={handleExpand} 
          data-testid="expand-trigger"
          aria-expanded="false"
        >
          Show more details
        </button>
      ) : (
        <>
          {question.helpText && (
            <p className="question-description">{question.helpText}</p>
          )}
          <div 
            className="options-container" 
            role="radiogroup" 
            aria-label={`Options for ${question.text}`}
            aria-required={question.required}
          >
            {(!question.options || question.options.length === 0) ? (
              <p className="no-options-message">No options available</p>
            ) : (
              question.options.map((option: QuestionOption, index: number) => (
                <div key={option.id} className="option">
                  <input
                    ref={index === 0 ? firstOptionRef : null}
                    type="radio"
                    id={option.id}
                    name={question.id}
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => onSelect(option.id)}
                    className="radio-input"
                    aria-checked={selectedOption === option.id}
                  />
                  <label
                    htmlFor={option.id}
                    className={`option-label ${selectedOption === option.id ? 'selected' : ''}`}
                  >
                    {option.text}
                  </label>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {validationError && (
        <div 
          className="error-message" 
          role="alert"
          aria-live="assertive"
        >
          {validationError}
        </div>
      )}

      <div className="navigation-buttons">
        {!isFirst && (
          <button 
            type="button" 
            className="nav-button previous" 
            onClick={onPrevious}
          >
            Previous
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            className="nav-button next"
            onClick={canProceed ? handleButtonClick : handleDisabledClick}
            disabled={!canProceed}
            aria-disabled={!canProceed}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionPresentation; 