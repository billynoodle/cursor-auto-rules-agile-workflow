import React, { useState } from 'react';
import './Tooltip.css';

interface TooltipProps {
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  width?: number;
  hasMetrics?: boolean;
  hasExamples?: boolean;
  children: React.ReactNode;
}

/**
 * Enhanced Tooltip component with support for rich content and accessibility features
 * 
 * Features:
 * - Responsive positioning
 * - Rich text support
 * - Visual indicators for metrics and examples
 * - Mobile-friendly design
 * - Accessibility support
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  width = 300,
  hasMetrics = false,
  hasExamples = false,
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle showing the tooltip
  const showTooltip = () => setIsVisible(true);
  
  // Handle hiding the tooltip
  const hideTooltip = () => {
    setIsVisible(false);
    setIsExpanded(false);
  };
  
  // Toggle expanded view for mobile
  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <div className="tooltip-trigger">
        {children}
        <span className="tooltip-indicator" aria-hidden="true">ⓘ</span>
      </div>
      
      {isVisible && (
        <div 
          className={`tooltip-content ${position} ${isExpanded ? 'expanded' : ''}`}
          style={{ width: isExpanded ? 'auto' : width }}
          role="tooltip"
        >
          <div className="tooltip-header">
            {hasMetrics && <span className="tooltip-badge metrics">Metrics</span>}
            {hasExamples && <span className="tooltip-badge examples">Examples</span>}
            <button 
              className="tooltip-expand-button"
              onClick={toggleExpanded}
              aria-label={isExpanded ? "Collapse tooltip" : "Expand tooltip"}
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
          
          <div className="tooltip-body">
            {content}
          </div>
          
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 