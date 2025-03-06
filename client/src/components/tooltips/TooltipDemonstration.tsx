import React from 'react';
import EnhancedTooltip from './EnhancedTooltip';
import './TooltipDemonstration.css';

/**
 * Tooltip Demonstration Component
 * 
 * This component showcases different tooltip examples with varying levels of enhancement.
 * It demonstrates how tooltips appear for:
 * - Basic tooltips with minimal information
 * - Tooltips with metrics but no examples
 * - Tooltips with examples but no metrics
 * - Fully enhanced tooltips with metrics, examples, and formatting
 * - Financial category tooltips
 * - Compliance category tooltips
 */
const TooltipDemonstration: React.FC = () => {
  // Sample tooltips with varying levels of enhancement
  const tooltips = {
    basic: "Tracking expenses helps monitor your practice costs.",
    withMetrics: "Tracking expenses helps monitor practice costs. Most successful practices keep overhead under 45% of revenue.",
    withExamples: "Tracking expenses helps monitor costs. For example, separating fixed costs like rent from variable costs like supplies helps identify savings opportunities.",
    enhanced: "Tracking expenses helps monitor practice costs. Most successful practices keep overhead under 45% of revenue. For example, separating fixed costs like rent from variable costs like supplies can help identify savings opportunities of 10-15% in most practices.",
    financial: "Overhead ratio shows what percentage of your income goes to running costs before paying practitioners. To calculate it: Add up all expenses (rent, staff wages, utilities, supplies, etc.) but don't include what you pay to practitioners. Then divide by your total income and multiply by 100. For example, if your practice makes $300,000 per year and spends $150,000 on expenses (not counting payments to practitioners), your overhead ratio is 50%. The lower this number, the more money available for practitioners and profit. Most successful practices keep this under 45%, while practices struggling with profitability often have overhead over 65%.",
    compliance: "A compliance risk assessment is simply a check-up of your practice's ability to follow healthcare rules and regulations. Think of it like a safety inspection for your business. These assessments look for gaps in how you protect patient information, bill insurance correctly, maintain proper documentation, and follow healthcare laws. Rules change frequently, and penalties for breaking them can be severe—often $10,000+ per violation. Having an independent expert do this assessment is best because they bring fresh eyes and specialized knowledge."
  };

  return (
    <div className="tooltip-demo-container">
      <h2>Tooltip Enhancement Demonstration</h2>
      <p>Hover over or click the labels below to see different tooltip styles</p>
      
      <div className="tooltip-demo-section">
        <h3>Basic vs. Enhanced Tooltips</h3>
        <div className="tooltip-demo-row">
          <div className="tooltip-demo-item">
            <span className="tooltip-label">Basic Tooltip</span>
            <EnhancedTooltip helpText={tooltips.basic}>
              <span className="tooltip-trigger">What is expense tracking?</span>
            </EnhancedTooltip>
          </div>
          
          <div className="tooltip-demo-item">
            <span className="tooltip-label">With Metrics</span>
            <EnhancedTooltip helpText={tooltips.withMetrics}>
              <span className="tooltip-trigger">What is expense tracking?</span>
            </EnhancedTooltip>
          </div>
          
          <div className="tooltip-demo-item">
            <span className="tooltip-label">With Examples</span>
            <EnhancedTooltip helpText={tooltips.withExamples}>
              <span className="tooltip-trigger">What is expense tracking?</span>
            </EnhancedTooltip>
          </div>
          
          <div className="tooltip-demo-item">
            <span className="tooltip-label">Fully Enhanced</span>
            <EnhancedTooltip helpText={tooltips.enhanced}>
              <span className="tooltip-trigger">What is expense tracking?</span>
            </EnhancedTooltip>
          </div>
        </div>
      </div>
      
      <div className="tooltip-demo-section">
        <h3>Category-Specific Enhanced Tooltips</h3>
        <div className="tooltip-demo-row">
          <div className="tooltip-demo-item">
            <span className="tooltip-label">Financial Tooltip</span>
            <EnhancedTooltip helpText={tooltips.financial}>
              <span className="tooltip-trigger">What is overhead ratio?</span>
            </EnhancedTooltip>
          </div>
          
          <div className="tooltip-demo-item">
            <span className="tooltip-label">Compliance Tooltip</span>
            <EnhancedTooltip helpText={tooltips.compliance}>
              <span className="tooltip-trigger">What is a compliance risk assessment?</span>
            </EnhancedTooltip>
          </div>
        </div>
      </div>
      
      <div className="tooltip-demo-section">
        <h3>Mobile Viewport Simulation</h3>
        <p>The box below simulates how tooltips appear on mobile devices.</p>
        <div className="mobile-simulation-container">
          <div className="tooltip-demo-item">
            <EnhancedTooltip helpText={tooltips.enhanced}>
              <span className="tooltip-trigger">What is expense tracking?</span>
            </EnhancedTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TooltipDemonstration; 