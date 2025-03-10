import React, { useState } from 'react';
import TooltipUserTesting from './TooltipUserTesting';
import { TooltipFeedback } from '../../types/assessment.types';
import { UsabilityMetrics } from './TooltipUserTesting';
import tooltipUserTestingService from '../../services/TooltipUserTestingService';

/**
 * Demo component for testing tooltips
 * Shows how to use the TooltipUserTesting component and handle its data
 */
const TooltipTestingDemo: React.FC = () => {
  const [feedbackHistory, setFeedbackHistory] = useState<TooltipFeedback[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<UsabilityMetrics[]>([]);

  const handleFeedbackSubmit = (feedback: TooltipFeedback) => {
    tooltipUserTestingService.submitFeedback(feedback);
    setFeedbackHistory([...feedbackHistory, feedback]);
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
    <div className="tooltip-testing-demo">
      <h2>Tooltip Testing Demo</h2>
      
      <div className="demo-section">
        <h3>Test this tooltip:</h3>
        <TooltipUserTesting
          questionId="demo-question"
          tooltipText="This is a sample tooltip that explains a complex concept in simple terms. It should be clear and helpful to users."
          onFeedbackSubmit={handleFeedbackSubmit}
          onMetricsCollected={handleMetricsCollected}
        />
      </div>

      {(feedbackHistory.length > 0 || metricsHistory.length > 0) && (
        <div className="testing-history">
          <h3>Testing History</h3>
          
          {feedbackHistory.length > 0 && (
            <div className="feedback-history">
              <h4>Feedback Submissions</h4>
              <ul>
                {feedbackHistory.map((feedback, index) => (
                  <li key={index}>
                    <strong>Clarity Rating:</strong> {feedback.clarityRating}/5
                    <br />
                    <strong>Feedback:</strong> {feedback.feedbackText}
                    {feedback.difficultTerms.length > 0 && (
                      <>
                        <br />
                        <strong>Difficult Terms:</strong> {feedback.difficultTerms.join(', ')}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

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