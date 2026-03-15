import React, { useState, useEffect } from 'react';
import { ECRFField } from '@/types/visit';

interface DynamicECRFFormProps {
  fields: ECRFField[];
  initialData?: Record<string, any>;
  onDataChange?: (data: Record<string, any>) => void;
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
  readOnly?: boolean;
}

interface FieldError {
  field: string;
  message: string;
}

export const DynamicECRFForm: React.FC<DynamicECRFFormProps> = ({
  fields,
  initialData = {},
  onDataChange,
  onValidationChange,
  readOnly = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  useEffect(() => {
    const newErrors = validateForm();
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (onValidationChange) {
      onValidationChange(isValid, newErrors);
    }
  }, [formData, onValidationChange]);

  const validateField = (field: ECRFField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }

    if (!value) return null;

    switch (field.type) {
      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return `${field.label} must be a valid number`;
        }
        if (field.validation?.min !== undefined && numValue < field.validation.min) {
          return `${field.label} must be at least ${field.validation.min}`;
        }
        if (field.validation?.max !== undefined && numValue > field.validation.max) {
          return `${field.label} must be no more than ${field.validation.max}`;
        }
        break;

      case 'text':
      case 'textarea':
        const strValue = String(value);
        if (field.validation?.minLength && strValue.length < field.validation.minLength) {
          return `${field.label} must be at least ${field.validation.minLength} characters`;
        }
        if (field.validation?.maxLength && strValue.length > field.validation.maxLength) {
          return `${field.label} must be no more than ${field.validation.maxLength} characters`;
        }
        if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(strValue)) {
          return `${field.label} format is invalid`;
        }
        break;

      case 'date':
        const dateValue = new Date(value);
        if (isNaN(dateValue.getTime())) {
          return `${field.label} must be a valid date`;
        }
        break;
    }

    return null;
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    return newErrors;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setTouched(prev => ({ ...prev, [fieldId]: true }));
  };

  const handleFieldBlur = (fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
  };

  const renderField = (field: ECRFField) => {
    const value = formData[field.id] || '';
    const error = touched[field.id] ? errors[field.id] : '';
    const hasError = !!error;

    const baseClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
    const errorClasses = hasError ? "border-red-500 focus:ring-red-500" : "border-gray-300";
    const disabledClasses = readOnly ? "bg-gray-100 cursor-not-allowed" : "";

    const fieldProps = {
      id: field.id,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleFieldChange(field.id, e.target.value),
      onBlur: () => handleFieldBlur(field.id),
      className: `${baseClasses} ${errorClasses} ${disabledClasses}`,
      disabled: readOnly,
      required: field.required
    };

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            {...fieldProps}
            placeholder={field.description}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            {...fieldProps}
            min={field.validation?.min}
            max={field.validation?.max}
            step="any"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            {...fieldProps}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...fieldProps}
            rows={4}
            placeholder={field.description}
          />
        );

      case 'dropdown':
        return (
          <select {...fieldProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.id}
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              onBlur={() => handleFieldBlur(field.id)}
              disabled={readOnly}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.id} className="text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );

      default:
        return (
          <input
            type="text"
            {...fieldProps}
          />
        );
    }
  };

  if (fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No form fields configured for this visit type.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {fields.map(field => (
        <div key={field.id} className="space-y-2">
          {field.type !== 'checkbox' && (
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {renderField(field)}
          
          {field.description && field.type !== 'checkbox' && (
            <p className="text-sm text-gray-500">{field.description}</p>
          )}
          
          {errors[field.id] && touched[field.id] && (
            <p className="text-sm text-red-600">{errors[field.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
};
