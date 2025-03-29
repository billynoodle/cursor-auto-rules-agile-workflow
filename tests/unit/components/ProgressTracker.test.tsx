import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressTracker } from '@client/components/assessment/ProgressTracker';

describe('ProgressTracker', () => {
  const mockModules = [
    {
      id: 'module1',
      title: 'Module 1',
      totalQuestions: 5,
      answeredQuestions: 3
    },
    {
      id: 'module2',
      title: 'Module 2',
      totalQuestions: 5,
      answeredQuestions: 2
    }
  ];

  const defaultProps = {
    modules: mockModules,
    currentModuleId: 'module1',
    averageTimePerQuestion: 2
  };

  it('should render progress tracker correctly', () => {
    render(<ProgressTracker {...defaultProps} />);
    expect(screen.getByText('50% Complete')).toBeInTheDocument();
    expect(screen.getByText('Module 1')).toBeInTheDocument();
    expect(screen.getByText('Module 2')).toBeInTheDocument();
  });

  it('should show correct module progress', () => {
    render(<ProgressTracker {...defaultProps} />);
    expect(screen.getByText('60%')).toBeInTheDocument(); // Module 1: 3/5 = 60%
    expect(screen.getByText('40%')).toBeInTheDocument(); // Module 2: 2/5 = 40%
  });

  describe('Progress Display', () => {
    beforeEach(() => {
      render(<ProgressTracker {...defaultProps} />);
    });

    it('should display overall progress percentage', () => {
      const progress = screen.getByRole('progressbar', { name: /overall progress/i });
      expect(progress).toHaveAttribute('aria-valuenow', '50'); // (3+2)/(5+5) = 50%
    });

    it('should show completion status for each module', () => {
      const modules = screen.getAllByRole('listitem');
      expect(modules).toHaveLength(2);
      expect(modules[0]).toHaveTextContent('60%'); // 3/5
      expect(modules[1]).toHaveTextContent('40%'); // 2/5
    });
  });

  describe('Time Estimates', () => {
    it('should display estimated time remaining', () => {
      render(<ProgressTracker {...defaultProps} />);
      const timeEstimate = screen.getByText(/estimated time remaining/i);
      expect(timeEstimate).toHaveTextContent('10 minutes'); // (5+5-3-2)*2 = 10
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<ProgressTracker {...defaultProps} />);
    });

    it('should have proper ARIA labels', () => {
      const progressBar = screen.getByRole('progressbar', { name: /overall progress/i });
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('should be keyboard navigable', () => {
      const modules = screen.getAllByRole('listitem');
      modules[0].focus();
      expect(document.activeElement).toBe(modules[0]);
      fireEvent.keyDown(modules[0], { key: 'ArrowRight' });
      expect(document.activeElement).toBe(modules[1]);
    });
  });

  describe('Module Navigation', () => {
    it('should highlight current module', () => {
      render(<ProgressTracker {...defaultProps} />);
      const currentModule = screen.getByText('Module 1').closest('li');
      expect(currentModule).toHaveClass('current-module');
    });

    it('should indicate completed modules', () => {
      const completedModules = [...mockModules];
      completedModules[0].answeredQuestions = completedModules[0].totalQuestions;
      render(<ProgressTracker {...defaultProps} modules={completedModules} />);
      
      const completedModule = screen.getByText('Module 1').closest('li');
      expect(completedModule).toHaveClass('completed');
    });
  });
}); 