import React, { useState } from 'react';
import './PracticeSizeSelector.css';

interface PracticeSize {
  id: string;
  name: string;
  range: string;
  description: string;
}

interface PracticeSizeSelectorProps {
  onSelect: (sizeId: string) => void;
  selectedSize?: string;
}

const practiceSizes: PracticeSize[] = [
  {
    id: 'solo',
    name: 'Solo Practice',
    range: '1 practitioner',
    description: 'Individual healthcare provider operating independently',
  },
  {
    id: 'small',
    name: 'Small Practice',
    range: '2-5 practitioners',
    description: 'Small team of healthcare providers working together',
  },
  {
    id: 'medium',
    name: 'Medium Practice',
    range: '6-20 practitioners',
    description: 'Mid-sized healthcare facility with multiple departments',
  },
  {
    id: 'large',
    name: 'Large Practice',
    range: '21-50 practitioners',
    description: 'Large healthcare organization with comprehensive services',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    range: '50+ practitioners',
    description: 'Multi-location healthcare system or hospital network',
  },
];

export const PracticeSizeSelector: React.FC<PracticeSizeSelectorProps> = ({
  onSelect,
  selectedSize,
}) => {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, sizeId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(sizeId);
    }
  };

  return (
    <div className="practice-size-selector" role="radiogroup" aria-label="Practice Size Selection">
      <h2>Select Practice Size</h2>
      <div className="size-options">
        {practiceSizes.map((size) => (
          <div
            key={size.id}
            className={`size-option ${selectedSize === size.id ? 'selected' : ''} ${
              hoveredSize === size.id ? 'hovered' : ''
            }`}
            role="radio"
            aria-checked={selectedSize === size.id}
            tabIndex={0}
            onClick={() => onSelect(size.id)}
            onKeyDown={(e) => handleKeyDown(e, size.id)}
            onMouseEnter={() => setHoveredSize(size.id)}
            onMouseLeave={() => setHoveredSize(null)}
          >
            <div className="size-content">
              <div className="size-header">
                <h3>{size.name}</h3>
                <span className="size-range">{size.range}</span>
              </div>
              <p className="size-description">{size.description}</p>
            </div>
            <div className="size-indicator">
              <div className="radio-circle" />
            </div>
          </div>
        ))}
      </div>
      <div className="size-help">
        <p>
          Select the option that best matches your practice size. This helps us provide more accurate
          benchmarks and recommendations.
        </p>
      </div>
    </div>
  );
}; 