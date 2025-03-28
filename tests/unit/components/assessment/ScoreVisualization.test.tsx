import { render, screen } from '@testing-library/react';
import { ScoreVisualization } from '@client/components/assessment/ScoreVisualization';

const mockScoreData = {
  overall: {
    score: 75,
    maxScore: 100,
    label: 'Overall Score'
  },
  categories: [
    {
      id: 'cat1',
      name: 'Category 1',
      score: 80,
      maxScore: 100
    }
  ],
  recommendations: [
    {
      category: 'cat1',
      text: 'Test recommendation'
    }
  ]
};

describe('ScoreVisualization', () => {
  it('should render score visualization correctly', () => {
    render(<ScoreVisualization scoreData={mockScoreData} />);
    expect(screen.getByText('Overall Score')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });
}); 