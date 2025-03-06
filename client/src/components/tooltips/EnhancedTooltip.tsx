import React, { useState } from 'react';
import './EnhancedTooltip.css';

interface EnhancedTooltipProps {
  helpText: string;
  children: React.ReactNode;
  showIcon?: boolean;
  maxWidth?: number;
}

/**
 * Enhanced tooltip component for assessment questions
 * 
 * Features:
 * - Automatically highlights metrics, percentages, and dollar values
 * - Identifies and enhances examples
 * - Formats text for improved readability
 * - Responsive design that works on mobile devices
 * - Accessibility features for all users
 */
const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  helpText,
  children,
  showIcon = true,
  maxWidth = 350
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Format the tooltip content
  const formattedContent = formatTooltipContent(helpText);
  
  // Check if content contains metrics or examples
  const hasMetrics = /\d+%|\$\d+|\d+\.?\d*\s*(days|months|weeks|years|hours)/.test(helpText);
  const hasExamples = /for example|such as|instance|e\.g\.|to illustrate|scenario/.test(helpText);
  
  return (
    <div className="enhanced-tooltip-container">
      <div 
        className="enhanced-tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        aria-describedby="tooltip-content"
      >
        {children}
        {showIcon && (
          <span className="tooltip-icon">
            {hasMetrics && hasExamples ? '📊💡' : hasMetrics ? '📊' : hasExamples ? '💡' : 'ℹ️'}
          </span>
        )}
      </div>
      
      {isVisible && (
        <div 
          className="enhanced-tooltip-content"
          id="tooltip-content"
          role="tooltip"
          style={{ maxWidth: `${maxWidth}px` }}
        >
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        </div>
      )}
    </div>
  );
};

/**
 * Formats tooltip content to highlight metrics, examples, and improve readability
 */
function formatTooltipContent(content: string): string {
  if (!content) return '';
  
  // First, escape any HTML that might be in the content
  let formattedContent = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Add paragraph breaks
  if (!formattedContent.includes('<p>') && !formattedContent.includes('<br>')) {
    // Split by sentences and group into paragraphs
    const sentences = formattedContent.split(/(?<=[.!?])\s+/);
    
    if (sentences.length > 2) {
      formattedContent = sentences
        .reduce((paragraphs, sentence, i) => {
          const paragraphIndex = Math.floor(i / 2);
          
          if (!paragraphs[paragraphIndex]) {
            paragraphs[paragraphIndex] = [];
          }
          
          paragraphs[paragraphIndex].push(sentence);
          return paragraphs;
        }, [] as string[][])
        .map(paragraph => paragraph.join(' '))
        .join('<br><br>');
    }
  }
  
  // Highlight metrics
  formattedContent = formattedContent.replace(
    /(\d+(?:\.\d+)?%|\$\d+(?:,\d+)*(?:\.\d+)?|\d+(?:\.\d+)?\s*(days|months|weeks|years|hours|minutes))/g,
    '<span class="tooltip-metric">$1</span>'
  );
  
  // Highlight examples
  formattedContent = formattedContent.replace(
    /(for example|such as|instance|e\.g\.|to illustrate|scenario)(.*?)(?=\.|<br>|$)/gi,
    '<span class="tooltip-example">$1$2</span>'
  );
  
  // Highlight key concepts and important phrases
  formattedContent = formattedContent.replace(
    /(important|critical|essential|key|significant|vital|crucial)/gi, 
    '<span class="tooltip-key-concept">$1</span>'
  );
  
  return formattedContent;
}

export default EnhancedTooltip; 