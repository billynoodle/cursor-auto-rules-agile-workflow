import React, { useState } from 'react';
import './ResultsPresentation.css';

interface CustomVariable {
  name: string;
  value: string;
  benchmark: string;
}

interface Category {
  name: string;
  score: number;
  strengths: string[];
  improvements: string[];
}

interface Recommendation {
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  action: string;
  impact: string;
  timeframe: string;
}

interface Summary {
  overallScore: number;
  assessmentDate: string;
  practiceName: string;
  practiceSize: string;
  country: string;
}

interface ResultsData {
  summary: Summary;
  categories: Category[];
  recommendations: Recommendation[];
  customVariables: CustomVariable[];
}

interface ResultsPresentationProps {
  results: ResultsData;
}

export const ResultsPresentation: React.FC<ResultsPresentationProps> = ({ results }) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  const handleRecommendationClick = (action: string) => {
    setSelectedRecommendation(action === selectedRecommendation ? null : action);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="results-container">
      {/* Summary Section */}
      <section className="summary-section responsive-section" role="region" aria-label="Assessment Summary">
        <h1>Assessment Results</h1>
        <div className="practice-info">
          <h2>{results.summary.practiceName}</h2>
          <p>{results.summary.practiceSize} • {results.summary.country}</p>
          <p>Assessment Date: {formatDate(results.summary.assessmentDate)}</p>
        </div>
        <div className="overall-score">
          <div
            role="meter"
            aria-label="Overall Score"
            aria-valuenow={results.summary.overallScore}
            aria-valuemin={0}
            aria-valuemax={100}
            className="score-meter"
          >
            <div 
              className="meter-fill" 
              style={{ width: `${results.summary.overallScore}%` }}
            />
          </div>
          <span className="score-value">{results.summary.overallScore}%</span>
        </div>
      </section>

      {/* Category Results */}
      <section className="categories-section responsive-section" role="region" aria-label="Category Results">
        <h2>Category Performance</h2>
        <div className="categories-grid">
          {results.categories.map(category => (
            <div key={category.name} className="category-card">
              <div className="category-header">
                <h3>{category.name}</h3>
                <span className="category-score">{category.score}%</span>
              </div>
              <div className="category-details">
                <div className="strengths">
                  <h4>Strengths</h4>
                  <ul>
                    {category.strengths.map(strength => (
                      <li key={strength}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="improvements">
                  <h4>Areas for Improvement</h4>
                  <ul>
                    {category.improvements.map(improvement => (
                      <li key={improvement}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="recommendations-section responsive-section" role="region" aria-label="Recommendations">
        <h2>Recommended Actions</h2>
        <div className="recommendations-list">
          {results.recommendations.map((rec, index) => (
            <div key={rec.action} className={`recommendation-card priority-${rec.priority.toLowerCase()}`}>
              <button
                onClick={() => handleRecommendationClick(rec.action)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' && index < results.recommendations.length - 1) {
                    (document.querySelector(`[data-recommendation-index="${index + 1}"]`) as HTMLElement)?.focus();
                  } else if (e.key === 'ArrowLeft' && index > 0) {
                    (document.querySelector(`[data-recommendation-index="${index - 1}"]`) as HTMLElement)?.focus();
                  }
                }}
                aria-label={`View details for ${rec.action}`}
                data-recommendation-index={index}
                aria-expanded={selectedRecommendation === rec.action}
              >
                <div className="recommendation-header">
                  <h3>{rec.action}</h3>
                  <span className="priority-badge">{rec.priority}</span>
                </div>
                <p className="impact">{rec.impact}</p>
              </button>
              {selectedRecommendation === rec.action && (
                <div className="recommendation-details">
                  <p><strong>Category:</strong> {rec.category}</p>
                  <p><strong>Timeframe:</strong> {rec.timeframe}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Custom Variables */}
      <section className="custom-variables-section responsive-section" role="region" aria-label="Custom Metrics">
        <h2>Practice Metrics</h2>
        <div className="metrics-grid">
          {results.customVariables.map(variable => (
            <div key={variable.name} className="metric-card">
              <h3>{variable.name}</h3>
              <div className="metric-values">
                <div className="current-value">
                  <span className="label">Current</span>
                  <span className="value">{variable.value}</span>
                </div>
                <div className="benchmark">
                  <span className="label">Benchmark</span>
                  <span className="value">{variable.benchmark}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}; 