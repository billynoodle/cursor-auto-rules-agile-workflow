import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '../../utils/cn';

interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface BaseAccordionProps {
  items: AccordionItem[];
  className?: string;
}

interface SingleAccordionProps extends BaseAccordionProps {
  type: 'single';
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
}

interface MultipleAccordionProps extends BaseAccordionProps {
  type: 'multiple';
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

type AccordionProps = SingleAccordionProps | MultipleAccordionProps;

export function Accordion(props: AccordionProps) {
  const { items, className } = props;
  const rootProps = {
    type: props.type,
    defaultValue: props.defaultValue,
    value: props.value,
    onValueChange: props.onValueChange,
    ...(props.type === 'single' ? { collapsible: props.collapsible } : {}),
    className: cn('radix-accordion-root', className),
  };

  return (
    <AccordionPrimitive.Root
      {...(rootProps as AccordionPrimitive.AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          disabled={item.disabled}
          className="radix-accordion-item"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="radix-accordion-trigger">
              {item.title}
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="radix-accordion-content">
            {item.content}
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}

export default Accordion;
