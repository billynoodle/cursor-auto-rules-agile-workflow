import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '../../utils/cn';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  disabled?: boolean;
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  orientation = 'vertical',
  className,
  disabled = false,
}: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      name={name}
      value={value}
      onValueChange={onChange}
      orientation={orientation}
      className={cn(
        'radix-radio-group',
        orientation === 'horizontal' && 'flex-row',
        className
      )}
      disabled={disabled}
    >
      {options.map((option) => (
        <div
          key={option.value}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/10 transition-colors"
        >
          <RadioGroupPrimitive.Item
            id={option.value}
            value={option.value}
            disabled={option.disabled || disabled}
            className="radix-radio-group-item"
          >
            <RadioGroupPrimitive.Indicator className="radix-radio-group-indicator" />
          </RadioGroupPrimitive.Item>
          <label
            htmlFor={option.value}
            className={cn(
              'flex flex-col cursor-pointer select-none',
              (option.disabled || disabled) && 'cursor-not-allowed opacity-50'
            )}
          >
            <span className="text-base font-medium">{option.label}</span>
            {option.description && (
              <span className="text-sm text-muted">{option.description}</span>
            )}
          </label>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  );
}

export default RadioGroup; 