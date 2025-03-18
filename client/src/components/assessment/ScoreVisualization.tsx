import React, { useState } from 'react';
import './ScoreVisualization.css';

interface Category {
  id: string;
  name: string;
  score: number;
  maxScore: number;
}

interface Recommendation {
  category: string;
  text: string;
}

interface ScoreData {
  overall: {
    score: number;
    maxScore: number;
    label: string;
  };
  categories: Category[];
  recommendations: Recommendation[];
}

interface ScoreVisualizationProps {
  scoreData: ScoreData;
}

export const ScoreVisualization: React.FC<ScoreVisualizationProps> = ({ scoreData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const toggleChartType = () => {
    setChartType(prev => prev === 'bar' ? 'radar' : 'bar');
  };

  const getCategoryRecommendation = (categoryId: string) => {
    return scoreData.recommendations.find(rec => rec.category === categoryId);
  };

  const generateChartDescription = () => {
    const scores = scoreData.categories.map(cat => `${cat.name}: ${cat.score}%`).join(', ');
    return `Score distribution across categories: ${scores}`;
  };

  return (
    <div className="score-dashboard">
      {/* Overall Score Display */}
      <div className="overall-score">
        <div
          role="meter"
          aria-label={scoreData.overall.label}
          aria-valuenow={scoreData.overall.score}
          aria-valuemin={0}
          aria-valuemax={100}
          className="score-meter overall"
        >
          <div 
            className="meter-fill" 
            style={{ width: `${scoreData.overall.score}%` }}
          />
        </div>
        <div className="score-label">
          <h2>{scoreData.overall.label}</h2>
          <span className="score-value">{scoreData.overall.score}%</span>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="chart-controls">
        <button 
          onClick={toggleChartType}
          aria-label="Change chart type"
        >
          Switch to {chartType === 'bar' ? 'Radar' : 'Bar'} Chart
        </button>
      </div>

      {/* Score Distribution Chart */}
      <div className="chart-container">
        <div
          role="img"
          aria-label={`${chartType === 'bar' ? 'Score distribution' : 'Radar'} chart`}
          aria-description={generateChartDescription()}
          className={`chart ${chartType} responsive-chart`}
        >
          {/* Chart visualization would be implemented with a charting library */}
          {scoreData.categories.map((category, index) => (
            <div
              key={category.id}
              className="chart-bar"
              style={{
                height: chartType === 'bar' ? `${category.score}%` : 'auto',
                '--category-index': index
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Category Scores */}
      <div className="category-scores">
        {scoreData.categories.map((category, index) => {
          const hasRecommendation = getCategoryRecommendation(category.id);
          return (
            <div
              key={category.id}
              className={`category ${hasRecommendation ? 'needs-attention' : ''}`}
            >
              <button
                onClick={() => handleCategoryClick(category.id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' && index < scoreData.categories.length - 1) {
                    (document.querySelector(`[data-category-index="${index + 1}"]`) as HTMLElement)?.focus();
                  } else if (e.key === 'ArrowLeft' && index > 0) {
                    (document.querySelector(`[data-category-index="${index - 1}"]`) as HTMLElement)?.focus();
                  }
                }}
                aria-label={`View ${category.name} details`}
                data-category-index={index}
              >
                <span className="category-name">{category.name}</span>
                <div
                  role="meter"
                  aria-label={`${category.name} score`}
                  aria-valuenow={category.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="score-meter"
                >
                  <div 
                    className="meter-fill" 
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                <span className="score-value">{category.score}%</span>
              </button>

              {selectedCategory === category.id && hasRecommendation && (
                <div className="recommendation">
                  {hasRecommendation.text}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 