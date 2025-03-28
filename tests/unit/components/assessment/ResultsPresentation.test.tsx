import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ResultsPresentation } from '@client/components/assessment/ResultsPresentation';

const mockResults = {
  summary: {
    overallScore: 85,
    assessmentDate: '2024-03-27',
    practiceName: 'Test Practice',
    practiceSize: 'Medium',
    country: 'United States'
  },
  categories: [
    {
      name: 'Test Category',
      score: 90,
      strengths: ['Strength 1', 'Strength 2'],
      improvements: ['Improvement 1']
    }
  ],
  recommendations: [
    {
      priority: 'High' as const,
      category: 'Test Category',
      action: 'Test Action',
      impact: 'High impact on practice',
      timeframe: '3 months'
    }
  ],
  customVariables: [
    {
      name: 'Test Metric',
      value: '85%',
      benchmark: '80%'
    }
  ]
};

describe('ResultsPresentation', () => {
  it('should render results presentation correctly', () => {
    render(<ResultsPresentation results={mockResults} />);
    expect(screen.getByText('Test Practice')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should show recommendation details when clicked', () => {
    render(<ResultsPresentation results={mockResults} />);
    const recommendationButton = screen.getByText('Test Action');
    fireEvent.click(recommendationButton);
    expect(screen.getByText('Category: Test Category')).toBeInTheDocument();
  });
}); 