"use client";

import React, { useState } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import type { RJSFSchema, UiSchema, FormProps } from '@rjsf/utils';
import { cn } from '@/lib/utils';

export interface JSONSchemaFormViewerProps {
  jsonSchema: RJSFSchema;
  uiSchema?: UiSchema;
  formData?: any;
  onSubmit?: (data: any) => void;
  onChange?: (data: any) => void;
  title?: string;
  description?: string;
  className?: string;
  showSubmitButton?: boolean;
  submitButtonText?: string;
  isMultiStep?: boolean;
  steps?: Array<{ title: string; description?: string; fields: string[] }>;
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

// Custom field template to ensure consistent styling
const FieldTemplate: React.FC<any> = (props) => {
  const {
    id,
    classNames,
    label,
    help,
    required,
    description,
    errors,
    children,
  } = props;

  return (
    <div className={cn("mb-4", classNames)}>
      {label && (
        <label htmlFor={id} className="block mb-2 font-medium text-gray-700 text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-600 mb-2">{description}</p>
      )}
      {children}
      {errors && (
        <div className="mt-1">
          {errors.map((error: string, index: number) => (
            <p key={index} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}
      {help && (
        <p className="text-sm text-gray-500 mt-1">{help}</p>
      )}
    </div>
  );
};

// Custom object field template for better layout
const ObjectFieldTemplate: React.FC<any> = (props) => {
  const { title, description, properties, required, uiSchema } = props;
  
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      <div className="grid grid-cols-1 gap-4">
        {properties.map((element: any) => (
          <div key={element.name} className="w-full">
            {element.content}
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom widgets with consistent styling
const customWidgets = {
  TextWidget: (props: any) => (
    <input
      {...props}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
    />
  ),
  EmailWidget: (props: any) => (
    <input
      {...props}
      type="email"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
    />
  ),
  PasswordWidget: (props: any) => (
    <input
      {...props}
      type="password"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
    />
  ),
  TextareaWidget: (props: any) => (
    <textarea
      {...props}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
      rows={props.options?.rows || 4}
    />
  ),
  SelectWidget: (props: any) => (
    <select
      {...props}
      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
    >
      {props.options.enumOptions?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
  CheckboxWidget: (props: any) => (
    <div className="flex items-center">
      <input
        {...props}
        type="checkbox"
        className="mr-3 w-4 h-4 accent-gray-600"
      />
      <label className="text-sm font-medium text-gray-700">{props.label}</label>
    </div>
  ),
  RadioWidget: (props: any) => (
    <div className="space-y-2">
      {props.options.enumOptions?.map((option: any, index: number) => (
        <div key={option.value} className="flex items-center">
          <input
            type="radio"
            id={`${props.id}-${index}`}
            name={props.name}
            value={option.value}
            checked={props.value === option.value}
            onChange={() => props.onChange(option.value)}
            className="mr-3 w-4 h-4 accent-gray-600"
          />
          <label htmlFor={`${props.id}-${index}`} className="text-sm text-gray-700">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  ),
  RangeWidget: (props: any) => (
    <div className="space-y-2">
      <input
        {...props}
        type="range"
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="text-sm text-gray-600 text-center">
        {props.value} / {props.schema.maximum || 5}
      </div>
    </div>
  ),
};

export const JSONSchemaFormViewer: React.FC<JSONSchemaFormViewerProps> = ({
  jsonSchema,
  uiSchema = {},
  formData = {},
  onSubmit,
  onChange,
  title,
  description,
  className,
  showSubmitButton = true,
  submitButtonText = "Submit",
  isMultiStep = false,
  steps = [],
  currentStep = 0,
  onStepChange,
}) => {
  const [internalFormData, setInternalFormData] = useState(formData);
  const [currentStepIndex, setCurrentStepIndex] = useState(currentStep);

  const handleFormChange = (data: any) => {
    setInternalFormData(data.formData);
    onChange?.(data.formData);
  };

  const handleFormSubmit = (data: any) => {
    onSubmit?.(data.formData);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      setCurrentStepIndex(prevStep);
      onStepChange?.(prevStep);
    }
  };

  // For multi-step forms, create a filtered schema for the current step
  const getStepSchema = () => {
    if (!isMultiStep || !steps[currentStepIndex]) {
      return jsonSchema;
    }

    const currentStepFields = steps[currentStepIndex].fields;
    const stepProperties: Record<string, any> = {};
    const stepRequired: string[] = [];

    currentStepFields.forEach(fieldName => {
      if (jsonSchema.properties && jsonSchema.properties[fieldName]) {
        stepProperties[fieldName] = jsonSchema.properties[fieldName];
        if (jsonSchema.required?.includes(fieldName)) {
          stepRequired.push(fieldName);
        }
      }
    });

    return {
      ...jsonSchema,
      title: steps[currentStepIndex].title,
      description: steps[currentStepIndex].description,
      properties: stepProperties,
      required: stepRequired.length > 0 ? stepRequired : undefined,
    };
  };

  const getStepUISchema = () => {
    if (!isMultiStep || !steps[currentStepIndex]) {
      return uiSchema;
    }

    const currentStepFields = steps[currentStepIndex].fields;
    const stepUISchema: any = {};

    currentStepFields.forEach(fieldName => {
      if (uiSchema[fieldName]) {
        stepUISchema[fieldName] = uiSchema[fieldName];
      }
    });

    return stepUISchema;
  };

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className={cn(
      "max-w-md mx-auto p-8 rounded-xl shadow-lg border border-gray-200 bg-white text-gray-900",
      className
    )}>
      {title && !isMultiStep && (
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      
      {description && !isMultiStep && (
        <p className="text-gray-600 mb-6">{description}</p>
      )}

      {isMultiStep && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-900 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <Form
        schema={getStepSchema()}
        uiSchema={getStepUISchema()}
        formData={internalFormData}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        validator={validator}
        templates={{
          FieldTemplate,
          ObjectFieldTemplate,
        }}
        widgets={customWidgets}
        showErrorList={false}
      >
        {isMultiStep ? (
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={handlePreviousStep}
              disabled={isFirstStep}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                isFirstStep 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              ← Previous
            </button>
            
            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-200"
              >
                Next →
              </button>
            ) : showSubmitButton ? (
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-200"
              >
                {submitButtonText}
              </button>
            ) : null}
          </div>
        ) : showSubmitButton ? (
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-200"
            >
              {submitButtonText}
            </button>
          </div>
        ) : null}
      </Form>
    </div>
  );
};

export default JSONSchemaFormViewer;