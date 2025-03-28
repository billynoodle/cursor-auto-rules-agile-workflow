import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScoreVisualization } from '@client/components/assessment/ScoreVisualization';

describe('ScoreVisualization Component', () => {
  const mockScoreData = {
    overall: {
      score: 75,
      maxScore: 100,
      label: 'Overall Practice Score'
    },
    categories: [
      { id: 'ops', name: 'Operations', score: 85, maxScore: 100 },
      { id: 'staff', name: 'Staff Management', score: 65, maxScore: 100 },
      { id: 'quality', name: 'Quality Control', score: 90, maxScore: 100 },
      { id: 'finance', name: 'Financial Health', score: 70, maxScore: 100 }
    ],
    recommendations: [
      { category: 'staff', text: 'Consider implementing structured staff training programs' },
      { category: 'finance', text: 'Review billing efficiency and payment collection processes' }
    ]
  };

  describe('Dashboard Display', () => {
    beforeEach(() => {
      render(<ScoreVisualization scoreData={mockScoreData} />);
    });

    it('should display overall score prominently', () => {
      const overallScore = screen.getByRole('meter', { name: /overall practice score/i });
      expect(overallScore).toHaveAttribute('aria-valuenow', '75');
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should show all category scores', () => {
      mockScoreData.categories.forEach(category => {
        const categoryScore = screen.getByRole('meter', { name: new RegExp(category.name, 'i') });
        expect(categoryScore).toHaveAttribute('aria-valuenow', category.score.toString());
      });
    });

    it('should display score distribution chart', () => {
      const chart = screen.getByRole('img', { name: /score distribution chart/i });
      expect(chart).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('should show detailed information on category click', () => {
      render(<ScoreVisualization scoreData={mockScoreData} />);
      const staffCategory = screen.getByText('Staff Management');
      
      fireEvent.click(staffCategory);
      
      expect(screen.getByText(/structured staff training/i)).toBeInTheDocument();
    });

    it('should allow switching between chart types', () => {
      render(<ScoreVisualization scoreData={mockScoreData} />);
      const chartToggle = screen.getByRole('button', { name: /change chart type/i });
      
      fireEvent.click(chartToggle);
      
      expect(screen.getByRole('img', { name: /radar chart/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<ScoreVisualization scoreData={mockScoreData} />);
    });

    it('should have proper ARIA labels for score meters', () => {
      const meters = screen.getAllByRole('meter');
      meters.forEach(meter => {
        expect(meter).toHaveAttribute('aria-valuemin', '0');
        expect(meter).toHaveAttribute('aria-valuemax', '100');
      });
    });

    it('should be keyboard navigable', () => {
      const categories = screen.getAllByRole('button', { name: /view .* details/i });
      categories[0].focus();
      expect(document.activeElement).toBe(categories[0]);
      
      fireEvent.keyDown(categories[0], { key: 'ArrowRight' });
      expect(document.activeElement).toBe(categories[1]);
    });

    it('should provide screen reader descriptions for charts', () => {
      const chart = screen.getByRole('img', { name: /score distribution chart/i });
      expect(chart).toHaveAttribute('aria-description');
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for mobile screens', () => {
      const { container } = render(<ScoreVisualization scoreData={mockScoreData} />);
      const dashboard = container.firstChild;
      expect(dashboard).toHaveClass('score-dashboard');
    });

    it('should stack charts vertically on narrow screens', () => {
      render(<ScoreVisualization scoreData={mockScoreData} />);
      const charts = screen.getAllByRole('img', { name: /chart/i });
      charts.forEach(chart => {
        expect(chart).toHaveClass('responsive-chart');
      });
    });
  });

  describe('Recommendations', () => {
    it('should display relevant recommendations', () => {
      render(<ScoreVisualization scoreData={mockScoreData} />);
      const staffCategory = screen.getByText('Staff Management');
      fireEvent.click(staffCategory);
      
      mockScoreData.recommendations.forEach(rec => {
        if (rec.category === 'staff') {
          expect(screen.getByText(rec.text)).toBeInTheDocument();
        }
      });
    });

    it('should highlight categories with recommendations', () => {
      render(<ScoreVisualization scoreData={mockScoreData} />);
      const staffCategory = screen.getByText('Staff Management');
      expect(staffCategory.closest('div')).toHaveClass('needs-attention');
    });
  });
}); 