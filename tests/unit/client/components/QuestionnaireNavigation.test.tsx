import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { QuestionnaireNavigation } from '@client/components/assessment/QuestionnaireNavigation';
import { AssessmentCategory, Module } from '@client/types';

describe('QuestionnaireNavigation', () => {
  const mockModules: Module[] = [
    {
      id: 'financial-1',
      name: 'Financial Health',
      description: 'Financial assessment module',
      estimatedTimeMinutes: 15,
      category: AssessmentCategory.FINANCIAL
    },
    {
      id: 'operations-1',
      name: 'Operations',
      description: 'Operations assessment module',
      estimatedTimeMinutes: 20,
      category: AssessmentCategory.OPERATIONS
    }
  ];

  const defaultProps = {
    modules: mockModules,
    currentModule: 'financial-1',
    currentCategory: AssessmentCategory.FINANCIAL,
    onModuleSelect: jest.fn(),
    onCategorySelect: jest.fn()
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

  test('calls onModuleSelect when clicking a different module', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Operations'));
    
    expect(defaultProps.onModuleSelect).toHaveBeenCalledWith('operations-1');
  });

  test('calls onCategorySelect when clicking a category', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    
    fireEvent.click(screen.getByText(AssessmentCategory.OPERATIONS));
    
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith(AssessmentCategory.OPERATIONS);
  });

  test('handles empty modules array gracefully', () => {
    render(<QuestionnaireNavigation {...defaultProps} modules={[]} />);
    
    expect(screen.queryByRole('button')).toBeInTheDocument();
  });

  test('maintains tab order for accessibility', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('tabIndex', '0');
    expect(buttons[1]).toHaveAttribute('tabIndex', '0');
  });
}); 