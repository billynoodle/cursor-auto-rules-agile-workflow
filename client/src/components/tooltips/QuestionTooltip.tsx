import React from 'react';
import Tooltip from './Tooltip';

interface QuestionTooltipProps {
  helpText: string;
  children: React.ReactNode;
}

/**
 * Specialized tooltip component for assessment questions
 * 
 * Features:
 * - Automatically detects metrics and examples in the content
 * - Adds appropriate visual indicators
 * - Formats content for readability
 * - Optimized for assessment question help text
 */
const QuestionTooltip: React.FC<QuestionTooltipProps> = ({ helpText, children }) => {
  // Check if the tooltip contains metrics (numbers, percentages, etc.)
  const hasMetrics = /\d+%|\$\d+|\d+\.?\d*\s*(days|months|weeks|years|hours)/.test(helpText);
  
  // Check if the tooltip contains examples
  const hasExamples = /for example|such as|instance|e\.g\.|to illustrate|scenario/.test(helpText);
  
  // Format the help text to enhance readability
  const formattedHelpText = formatHelpText(helpText);
  
  return (
    <Tooltip 
      content={formattedHelpText}
      hasMetrics={hasMetrics}
      hasExamples={hasExamples}
    >
      {children}
    </Tooltip>
  );
};

/**
 * Formats help text to improve readability
 * - Highlights metrics and key numbers
 * - Emphasizes examples
 * - Adds paragraph breaks for better readability
 */
function formatHelpText(text: string): string {
  if (!text) return '';
  
  // Add paragraph breaks for better readability (if not already HTML)
  if (!text.includes('<p>') && !text.includes('<div>')) {
    // Split by sentences and add breaks for longer text
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    if (sentences.length > 2) {
      // Group sentences into paragraphs (roughly 2-3 sentences per paragraph)
      const paragraphs = [];
      for (let i = 0; i < sentences.length; i += 2) {
        const paragraph = sentences.slice(i, i + 2).join(' ');
        paragraphs.push(paragraph);
      }
      
      text = paragraphs.join('<br/><br/>');
    }
  }
  
  // Highlight metrics and numbers
  text = text.replace(
    /(\d+%|\$\d+|\d+\.?\d*\s*(days|months|weeks|years|hours|minutes))/g, 
    '<span class="tooltip-highlight-metric">$1</span>'
  );
  
  // Emphasize examples
  text = text.replace(
    /(for example|such as|instance|e\.g\.|to illustrate|scenario)(.*?)(?=\.|$)/gi,
    '<span class="tooltip-example">$1$2</span>'
  );
  
  return text;
}

export default QuestionTooltip; 