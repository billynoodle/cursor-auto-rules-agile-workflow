import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { QuestionnaireNavigation } from '@client/components/assessment/QuestionnaireNavigation';
import { AssessmentCategory, Module } from '@client/types/assessment.types';

describe('QuestionnaireNavigation', () => {
  const mockModules: Module[] = [
    {
      id: 'financial-1',
      name: 'Financial Health',
      category: AssessmentCategory.FINANCIAL,
      description: 'Financial assessment module',
      order: 1,
      estimatedTimeMinutes: 15,
      weight: 8,
      minScore: 0,
      maxScore: 100,
      applicableDisciplines: ['PHYSIOTHERAPY'],
      universalModule: true,
      applicablePracticeSizes: ['SMALL', 'MEDIUM', 'LARGE']
    },
    {
      id: 'operations-1',
      name: 'Operations',
      category: AssessmentCategory.OPERATIONS,
      description: 'Operations assessment module',
      order: 2,
      estimatedTimeMinutes: 20,
      weight: 7,
      minScore: 0,
      maxScore: 100,
      applicableDisciplines: ['PHYSIOTHERAPY'],
      universalModule: true,
      applicablePracticeSizes: ['SMALL', 'MEDIUM', 'LARGE']
    }
  ];

  const defaultProps = {
    modules: mockModules,
    currentModuleId: 'financial-1',
    onModuleChange: jest.fn(),
    progress: {
      'financial-1': 0.5,
      'operations-1': 0
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all module navigation items', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    
    expect(screen.getByText('Financial Health')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
  });

  test('highlights current module', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    
    const currentModule = screen.getByText('Financial Health').closest('button');
    const otherModule = screen.getByText('Operations').closest('button');
    
    expect(currentModule).toHaveClass('active');
    expect(otherModule).not.toHaveClass('active');
  });

  test('shows progress indicators correctly', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    
    const financialProgress = screen.getByTestId('progress-financial-1');
    const operationsProgress = screen.getByTestId('progress-operations-1');
    
    expect(financialProgress).toHaveStyle({ width: '50%' });
    expect(operationsProgress).toHaveStyle({ width: '0%' });
  });

  test('calls onModuleChange when clicking a different module', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Operations'));
    
    expect(defaultProps.onModuleChange).toHaveBeenCalledWith('operations-1');
  });

  test('shows estimated time for each module', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    
    expect(screen.getByText('15 min')).toBeInTheDocument();
    expect(screen.getByText('20 min')).toBeInTheDocument();
  });

  test('displays module descriptions on hover', () => {
    render(<QuestionnaireNavigation {...defaultProps} testShowDescription="financial-1" />);
    
    const description = screen.getByTestId('module-description-financial-1');
    expect(description).toHaveTextContent('Financial assessment module');
  });

  test('handles empty modules array gracefully', () => {
    render(<QuestionnaireNavigation {...defaultProps} modules={[]} />);
    
    expect(screen.getByTestId('questionnaire-nav')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('handles missing progress values', () => {
    render(
      <QuestionnaireNavigation
        {...defaultProps}
        progress={{}}
      />
    );
    
    const financialProgress = screen.getByTestId('progress-financial-1');
    expect(financialProgress).toHaveStyle({ width: '0%' });
  });

  test('maintains tab order for accessibility', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('tabIndex', '0');
    expect(buttons[1]).toHaveAttribute('tabIndex', '0');
  });
}); 