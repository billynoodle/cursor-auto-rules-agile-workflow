import React, { useState } from 'react';
import './CustomVariableCreator.css';

interface CustomVariable {
  name: string;
  description: string;
  type: 'number' | 'percentage' | 'text';
  unit?: string;
  benchmark?: string;
  category?: string;
}

interface CustomVariableCreatorProps {
  onSave: (variable: CustomVariable) => void;
  existingCategories: string[];
}

export const CustomVariableCreator: React.FC<CustomVariableCreatorProps> = ({
  onSave,
  existingCategories,
}) => {
  const [variable, setVariable] = useState<CustomVariable>({
    name: '',
    description: '',
    type: 'number',
    unit: '',
    benchmark: '',
    category: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!variable.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!variable.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (variable.type === 'number' && variable.unit?.trim() === '') {
      newErrors.unit = 'Unit is required for numeric variables';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(variable);
      setVariable({
        name: '',
        description: '',
        type: 'number',
        unit: '',
        benchmark: '',
        category: '',
      });
      setShowAdvanced(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setVariable(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="custom-variable-creator">
      <h2>Create Custom Variable</h2>
      <form onSubmit={handleSubmit} className="variable-form">
        <div className="form-group">
          <label htmlFor="name">
            Variable Name
            <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={variable.name}
            onChange={handleChange}
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={!!errors.name}
          />
          {errors.name && <span className="error-message" id="name-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description
            <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={variable.description}
            onChange={handleChange}
            rows={3}
            aria-describedby={errors.description ? 'description-error' : undefined}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <span className="error-message" id="description-error">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="type">
            Variable Type
            <span className="required">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={variable.type}
            onChange={handleChange}
          >
            <option value="number">Number</option>
            <option value="percentage">Percentage</option>
            <option value="text">Text</option>
          </select>
        </div>

        <button
          type="button"
          className="toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>

        {showAdvanced && (
          <div className="advanced-options">
            {(variable.type === 'number' || variable.type === 'percentage') && (
              <div className="form-group">
                <label htmlFor="unit">
                  Unit
                  {variable.type === 'number' && <span className="required">*</span>}
                </label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  value={variable.unit}
                  onChange={handleChange}
                  aria-describedby={errors.unit ? 'unit-error' : undefined}
                  aria-invalid={!!errors.unit}
                />
                {errors.unit && <span className="error-message" id="unit-error">{errors.unit}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="benchmark">Benchmark Value</label>
              <input
                type="text"
                id="benchmark"
                name="benchmark"
                value={variable.benchmark}
                onChange={handleChange}
                placeholder={variable.type === 'percentage' ? '0-100' : 'Enter benchmark value'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={variable.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {existingCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create Variable
          </button>
        </div>
      </form>
    </div>
  );
}; 