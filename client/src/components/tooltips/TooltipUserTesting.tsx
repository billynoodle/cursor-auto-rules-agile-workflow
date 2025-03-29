import React, { useState, useEffect } from 'react';
import { TooltipFeedback, UsabilityMetrics } from '../../types/tooltip.types';
import './TooltipUserTesting.css';

interface TooltipUserTestingProps {
  questionId: string;
  tooltipText: string;
  onFeedbackSubmit?: (feedback: TooltipFeedback) => void;
  onMetricsCollected?: (metrics: UsabilityMetrics) => void;
}

/**
 * Component for testing tooltip readability and gathering user feedback
 * 
 * Features:
 * - Displays tooltip content in a testing environment
 * - Allows users to rate clarity and provide feedback
 * - Supports marking difficult technical terms
 * - Collects usability metrics
 * - Provides mobile view testing
 */
const TooltipUserTesting: React.FC<TooltipUserTestingProps> = ({
  questionId,
  tooltipText,
  onFeedbackSubmit,
  onMetricsCollected
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [clarityRating, setClarityRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [difficultTerms, setDifficultTerms] = useState<string[]>([]);
  const [newTerm, setNewTerm] = useState<string>('');
  const [usabilityMetrics, setUsabilityMetrics] = useState<UsabilityMetrics>({
    timeToUnderstand: 0,
    clicksToComplete: 0,
    userSatisfaction: 0
  });
  const [isMobileView, setIsMobileView] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [clickCount, setClickCount] = useState(0);

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Start timing when tooltip is shown
  useEffect(() => {
    if (showTooltip && startTime === null) {
      setStartTime(Date.now());
    }
  }, [showTooltip, startTime]);

  const handleClick = () => {
    setClickCount(prevCount => prevCount + 1);
    setShowTooltip(!showTooltip);
  };

  const handleAddTerm = () => {
    if (newTerm.trim() !== '' && !difficultTerms.includes(newTerm.trim())) {
      setDifficultTerms([...difficultTerms, newTerm.trim()]);
      setNewTerm('');
    }
  };

  const handleRemoveTerm = (term: string) => {
    setDifficultTerms(difficultTerms.filter(t => t !== term));
  };

  const handleClarityRating = (rating: number) => {
    setClarityRating(rating);
  };

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackText(event.target.value);
  };

  const handleSubmit = () => {
    // Calculate time spent understanding tooltip
    const timeToUnderstand = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    
    const feedback: TooltipFeedback = {
      questionId,
      clarityRating,
      feedback: feedbackText,
      timestamp: new Date().toISOString(),
      difficultTerms: difficultTerms.length > 0 ? difficultTerms : undefined
    };

    const metrics: UsabilityMetrics = {
      timeToUnderstand,
      clicksToComplete: clickCount,
      userSatisfaction: clarityRating
    };

    // Update metrics state
    setUsabilityMetrics(metrics);
    
    // Send data to parent components if callbacks are provided
    if (onFeedbackSubmit) {
      onFeedbackSubmit(feedback);
    }
    
    if (onMetricsCollected) {
      onMetricsCollected(metrics);
    }
    
    // Reset form
    setClarityRating(0);
    setFeedbackText('');
    setDifficultTerms([]);
    setShowTooltip(false);
    setStartTime(null);
    setClickCount(0);
  };

  return (
    <div 
      className={`tooltip-testing-container ${isMobileView ? 'mobile-view' : ''}`}
      data-testid="tooltip-container"
    >
      <div className="testing-header">
        <h3>Tooltip Testing</h3>
        <div className="test-controls">
          <button 
            onClick={handleClick}
            className="show-tooltip-btn"
            aria-label="Toggle tooltip visibility"
          >
            {showTooltip ? 'Hide Tooltip' : 'Show Tooltip'}
          </button>
          <span className="view-indicator">
            {isMobileView ? 'Mobile View' : 'Desktop View'}
          </span>
        </div>
      </div>
      
      {showTooltip && (
        <div className="tooltip-container">
          <div className="tooltip-content" role="tooltip">
            {tooltipText}
          </div>
        </div>
      )}
      
      <div className="feedback-section">
        <h4>Provide Feedback</h4>
        
        <div className="clarity-rating">
          <label htmlFor="clarity">Clarity Rating (1-5):</label>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                className={`rating-btn ${clarityRating === rating ? 'selected' : ''}`}
                onClick={() => handleClarityRating(rating)}
                aria-label={`Rate ${rating} out of 5`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
        
        <div className="feedback-text">
          <label htmlFor="feedback">Additional Feedback:</label>
          <textarea
            id="feedback"
            value={feedbackText}
            onChange={handleFeedbackChange}
            placeholder="Please provide any feedback to improve this tooltip..."
            rows={4}
          />
        </div>
        
        <div className="difficult-terms">
          <label>Difficult Technical Terms:</label>
          <div className="term-input">
            <input
              type="text"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="Enter difficult terms here"
            />
            <button onClick={handleAddTerm}>Add</button>
          </div>
          
          {difficultTerms.length > 0 && (
            <div className="term-list">
              {difficultTerms.map(term => (
                <span key={term} className="term-tag">
                  {term}
                  <button 
                    onClick={() => handleRemoveTerm(term)}
                    className="remove-term"
                    aria-label={`Remove term ${term}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={handleSubmit}
          className="submit-btn"
          disabled={clarityRating === 0}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default TooltipUserTesting; 