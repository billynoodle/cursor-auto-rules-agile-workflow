import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressTracker } from '../../../../client/src/components/assessment/ProgressTracker';

describe('ProgressTracker Component', () => {
  const mockModules = [
    { id: 'mod1', title: 'Basic Info', totalQuestions: 5, answeredQuestions: 3 },
    { id: 'mod2', title: 'Operations', totalQuestions: 8, answeredQuestions: 0 },
    { id: 'mod3', title: 'Staff', totalQuestions: 4, answeredQuestions: 4 }
  ];

  describe('Progress Display', () => {
    beforeEach(() => {
      render(<ProgressTracker modules={mockModules} currentModuleId="mod1" />);
    });

    it('should display overall progress percentage', () => {
      const progress = screen.getByRole('progressbar', { name: /overall progress/i });
      expect(progress).toHaveAttribute('aria-valuenow', '41');  // (3+0+4)/(5+8+4) ≈ 41%
    });

    it('should show completion status for each module', () => {
      const modules = screen.getAllByRole('listitem');
      expect(modules).toHaveLength(3);
      expect(modules[0]).toHaveTextContent('60%');  // 3/5
      expect(modules[1]).toHaveTextContent('0%');   // 0/8
      expect(modules[2]).toHaveTextContent('100%'); // 4/4
    });
  });

  describe('Time Estimates', () => {
    it('should display estimated time remaining', () => {
      render(<ProgressTracker 
        modules={mockModules} 
        currentModuleId="mod1"
        averageTimePerQuestion={2} // minutes
      />);
      
      const timeEstimate = screen.getByText(/estimated time remaining/i);
      expect(timeEstimate).toHaveTextContent('20 minutes'); // (2+8+0)*2 = 20
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<ProgressTracker modules={mockModules} currentModuleId="mod1" />);
    });

    it('should have proper ARIA labels for progress indicators', () => {
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

  describe('Responsive Design', () => {
    it('should adapt to mobile viewport', () => {
      const { container } = render(
        <ProgressTracker modules={mockModules} currentModuleId="mod1" />
      );
      
      const tracker = container.firstChild;
      expect(tracker).toHaveClass('progress-tracker');
      // Note: Actual responsive testing would be done in integration tests
      // This is a placeholder for style-based assertions
    });
  });

  describe('Module Navigation', () => {
    it('should highlight current module', () => {
      render(<ProgressTracker modules={mockModules} currentModuleId="mod1" />);
      const currentModule = screen.getByText('Basic Info').closest('li');
      expect(currentModule).toHaveClass('current-module');
    });

    it('should indicate completed modules', () => {
      render(<ProgressTracker modules={mockModules} currentModuleId="mod1" />);
      const completedModule = screen.getByText('Staff').closest('li');
      expect(completedModule).toHaveClass('completed');
    });
  });
}); 