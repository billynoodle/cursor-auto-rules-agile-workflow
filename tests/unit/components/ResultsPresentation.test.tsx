import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResultsPresentation } from '@client/components/assessment/ResultsPresentation';

describe('ResultsPresentation Component', () => {
  const mockResults = {
    summary: {
      overallScore: 78,
      assessmentDate: '2024-03-18',
      practiceName: 'PhysioHealth Plus',
      practiceSize: 'Medium (5-15 staff)',
      country: 'Australia'
    },
    categories: [
      {
        name: 'Operations',
        score: 85,
        strengths: ['Efficient appointment scheduling', 'Good resource management'],
        improvements: ['Consider implementing automated reminders']
      },
      {
        name: 'Staff Management',
        score: 65,
        strengths: ['Regular team meetings'],
        improvements: ['Develop structured training program', 'Implement performance reviews']
      }
    ],
    recommendations: [
      {
        priority: 'High' as const,
        category: 'Staff Management',
        action: 'Implement quarterly performance reviews',
        impact: 'Improved staff development and retention',
        timeframe: '3 months'
      },
      {
        priority: 'Medium' as const,
        category: 'Operations',
        action: 'Set up automated appointment reminders',
        impact: 'Reduced no-shows by estimated 25%',
        timeframe: '1 month'
      }
    ],
    customVariables: [
      { name: 'Staff Turnover Rate', value: '15%', benchmark: '10%' },
      { name: 'Patient Satisfaction', value: '4.5/5', benchmark: '4.2/5' }
    ]
  };

  describe('Summary Section', () => {
    beforeEach(() => {
      render(<ResultsPresentation results={mockResults} />);
    });

    it('should display practice information', () => {
      expect(screen.getByText('PhysioHealth Plus')).toBeInTheDocument();
      expect(screen.getByText(/Medium \(5-15 staff\)/)).toBeInTheDocument();
      expect(screen.getByText(/Australia/)).toBeInTheDocument();
    });

    it('should show assessment date', () => {
      expect(screen.getByText(/March 18, 2024/)).toBeInTheDocument();
    });

    it('should display overall score prominently', () => {
      const score = screen.getByRole('meter', { name: /overall score/i });
      expect(score).toHaveAttribute('aria-valuenow', '78');
    });
  });

  describe('Category Results', () => {
    beforeEach(() => {
      render(<ResultsPresentation results={mockResults} />);
    });

    it('should display category scores', () => {
      mockResults.categories.forEach(category => {
        expect(screen.getByText(category.name)).toBeInTheDocument();
        expect(screen.getByText(`${category.score}%`)).toBeInTheDocument();
      });
    });

    it('should list strengths and improvements', () => {
      const operations = mockResults.categories[0];
      operations.strengths.forEach(strength => {
        expect(screen.getByText(strength)).toBeInTheDocument();
      });
      operations.improvements.forEach(improvement => {
        expect(screen.getByText(improvement)).toBeInTheDocument();
      });
    });
  });

  describe('Recommendations', () => {
    beforeEach(() => {
      render(<ResultsPresentation results={mockResults} />);
    });

    it('should display prioritized recommendations', () => {
      mockResults.recommendations.forEach(rec => {
        expect(screen.getByText(rec.action)).toBeInTheDocument();
        expect(screen.getByText(rec.impact)).toBeInTheDocument();
      });
    });

    it('should show recommendation details on click', () => {
      const recommendation = mockResults.recommendations[0];
      const actionButton = screen.getByText(recommendation.action);
      
      fireEvent.click(actionButton);
      
      expect(screen.getByText(recommendation.timeframe)).toBeInTheDocument();
      expect(screen.getByText(recommendation.priority)).toBeInTheDocument();
    });
  });

  describe('Custom Variables', () => {
    beforeEach(() => {
      render(<ResultsPresentation results={mockResults} />);
    });

    it('should display custom metrics with benchmarks', () => {
      mockResults.customVariables.forEach(variable => {
        expect(screen.getByText(variable.name)).toBeInTheDocument();
        expect(screen.getByText(variable.value)).toBeInTheDocument();
        expect(screen.getByText(variable.benchmark)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<ResultsPresentation results={mockResults} />);
    });

    it('should have proper headings structure', () => {
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent(/assessment results/i);
    });

    it('should be keyboard navigable', () => {
      const recommendations = screen.getAllByRole('button', { name: /view details/i });
      recommendations[0].focus();
      expect(document.activeElement).toBe(recommendations[0]);
      
      fireEvent.keyDown(recommendations[0], { key: 'ArrowRight' });
      expect(document.activeElement).toBe(recommendations[1]);
    });

    it('should have ARIA labels for interactive elements', () => {
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should adapt layout for mobile screens', () => {
      const { container } = render(<ResultsPresentation results={mockResults} />);
      const resultsContainer = container.firstChild;
      expect(resultsContainer).toHaveClass('results-container');
    });

    it('should stack sections vertically on narrow screens', () => {
      render(<ResultsPresentation results={mockResults} />);
      const sections = screen.getAllByRole('region');
      sections.forEach(section => {
        expect(section).toHaveClass('responsive-section');
      });
    });
  });
}); 