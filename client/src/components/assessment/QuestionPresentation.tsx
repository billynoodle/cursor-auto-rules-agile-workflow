import React, { useState } from 'react';
import './QuestionPresentation.css';

interface QuestionOption {
  id: string;
  text: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  description?: string;
  tooltip?: string;
  required?: boolean;
  options?: QuestionOption[];
}

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

  const handleExpand = () => {
    if (showProgressiveDisclosure) {
      setIsExpanded(true);
    }
  };

  const canProceed = !question.required || selectedOption !== undefined;

  return (
    <div className="question-presentation" role="group" aria-label={question.text}>
      <div className="question-header">
        <h2 className="question-text">
          {question.text}
          {question.required && (
            <span className="required-indicator" aria-label="required" data-testid="required-indicator">
              *
            </span>
          )}
          {question.tooltip && (
            <button
              className="tooltip-trigger"
              data-testid="tooltip-trigger"
              aria-describedby={`tooltip-${question.id}`}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
            >
              ℹ️
            </button>
          )}
        </h2>
        {question.tooltip && (
          <div
            id={`tooltip-${question.id}`}
            role="tooltip"
            className={`tooltip ${showTooltip ? 'visible' : ''}`}
          >
            {question.tooltip}
          </div>
        )}
      </div>

      {showProgressiveDisclosure && !isExpanded ? (
        <button className="expand-trigger" onClick={handleExpand} data-testid="expand-trigger">
          Show more details
        </button>
      ) : (
        <>
          {question.description && <p className="question-description">{question.description}</p>}
          <div className="options-container" role="radiogroup" aria-label={`Options for ${question.text}`}>
            {question.options?.map((option) => (
              <div key={option.id} className="option">
                <input
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
            ))}
          </div>
        </>
      )}

      <div className="navigation-buttons">
        {!isFirst && (
          <button type="button" className="nav-button previous" onClick={onPrevious}>
            Previous
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            className="nav-button next"
            onClick={onNext}
            disabled={!canProceed}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionPresentation; 