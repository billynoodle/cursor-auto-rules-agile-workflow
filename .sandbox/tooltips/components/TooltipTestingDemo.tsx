import React, { useState } from 'react';
import TooltipUserTesting from './TooltipUserTesting';
import { TooltipFeedback, UsabilityMetrics } from '../../types';
import tooltipUserTestingService from '../../services/TooltipUserTestingService';

/**
 * Demo component for testing tooltips
 * Shows how to use the TooltipUserTesting component and handle its data
 */
const TooltipTestingDemo: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<TooltipFeedback[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<UsabilityMetrics[]>([]);

  const handleFeedbackSubmit = (feedback: TooltipFeedback) => {
    console.log('Feedback submitted:', feedback);
    setFeedbackHistory([...feedbackHistory, feedback]);
    setShowTooltip(false);
  };

  const handleMetricsCollected = (metrics: UsabilityMetrics) => {
    tooltipUserTestingService.submitMetrics('demo-question', metrics);
    setMetricsHistory([...metricsHistory, metrics]);
  };

  const handleExport = () => {
    const exportData = tooltipUserTestingService.exportTestingData();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tooltip-testing-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tooltip-demo">
      <div className="demo-controls">
        <button onClick={() => setShowTooltip(!showTooltip)}>
          {showTooltip ? 'Hide Tooltip' : 'Show Tooltip'}
        </button>
      </div>

      {showTooltip && (
        <TooltipUserTesting
          questionId="demo-1"
          tooltipText="This is a demo tooltip to test the user feedback functionality."
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}

      {feedbackHistory.length > 0 && (
        <div className="feedback-history">
          <h3>Feedback History</h3>
          {feedbackHistory.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <p><strong>Clarity Rating:</strong> {feedback.clarityRating}/5</p>
              <p><strong>Feedback:</strong> {feedback.feedback}</p>
              <p><strong>Timestamp:</strong> {new Date(feedback.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {(metricsHistory.length > 0) && (
        <div className="testing-history">
          <h3>Testing History</h3>
          
          {metricsHistory.length > 0 && (
            <div className="metrics-history">
              <h4>Usability Metrics</h4>
              <ul>
                {metricsHistory.map((metrics, index) => (
                  <li key={index}>
                    <strong>Time to Understand:</strong> {metrics.timeToUnderstand}s
                    <br />
                    <strong>Clicks to Complete:</strong> {metrics.clicksToComplete}
                    <br />
                    <strong>User Satisfaction:</strong> {metrics.userSatisfaction}/5
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button 
            onClick={handleExport}
            className="export-btn"
          >
            Export Testing Data
          </button>
        </div>
      )}
    </div>
  );
};

export default TooltipTestingDemo; 