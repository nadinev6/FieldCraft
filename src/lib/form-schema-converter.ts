import type { FormField } from './form-field-schemas';
import type { MultiStepForm } from './multistep-form-definitions';

export interface JSONSchemaProperty {
  type: string;
  title?: string;
  description?: string;
  enum?: string[];
  enumNames?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  default?: any;
  properties?: Record<string, JSONSchemaProperty>;
  required?: string[];
  items?: JSONSchemaProperty;
}

export interface JSONSchema {
  type: 'object';
  title?: string;
  description?: string;
  properties: Record<string, JSONSchemaProperty>;
  required?: string[];
}

export interface UISchemaProperty {
  'ui:widget'?: string;
  'ui:placeholder'?: string;
  'ui:description'?: string;
  'ui:help'?: string;
  'ui:disabled'?: boolean;
  'ui:readonly'?: boolean;
  'ui:options'?: Record<string, any>;
  [key: string]: any;
}

export interface UISchema {
  [key: string]: UISchemaProperty | UISchema;
}

/**
 * Converts a custom FormField to JSON Schema property
 */
function convertFieldToJSONSchema(field: FormField): JSONSchemaProperty {
  const baseProperty: JSONSchemaProperty = {
    title: field.label || field.name,
  };

  switch (field.type) {
    case 'text':
    case 'password':
      return {
        ...baseProperty,
        type: 'string',
        minLength: field.minLength,
        maxLength: field.maxLength,
        pattern: field.pattern,
        default: field.defaultValue,
      };

    case 'email':
      return {
        ...baseProperty,
        type: 'string',
        format: 'email',
        default: field.defaultValue,
      };

    case 'number':
      return {
        ...baseProperty,
        type: 'number',
        minimum: field.min,
        maximum: field.max,
        default: field.defaultValue,
      };

    case 'checkbox':
      return {
        ...baseProperty,
        type: 'boolean',
        default: field.defaultChecked || false,
      };

    case 'select':
      return {
        ...baseProperty,
        type: 'string',
        enum: field.options?.map(opt => opt.value) || [],
        enumNames: field.options?.map(opt => opt.label) || [],
        default: field.defaultValue,
      };

    case 'radio':
      return {
        ...baseProperty,
        type: 'string',
        enum: field.options?.map(opt => opt.value) || [],
        enumNames: field.options?.map(opt => opt.label) || [],
        default: field.defaultValue,
      };

    case 'textarea':
      return {
        ...baseProperty,
        type: 'string',
        minLength: field.minLength,
        maxLength: field.maxLength,
        default: field.defaultValue,
      };

    case 'date':
      return {
        ...baseProperty,
        type: 'string',
        format: 'date',
        default: field.defaultValue,
      };

    case 'starRating':
      return {
        ...baseProperty,
        type: 'number',
        minimum: 0,
        maximum: field.maxRating || 5,
        default: field.defaultValue || 0,
      };

    default:
      return {
        ...baseProperty,
        type: 'string',
      };
  }
}

/**
 * Converts a custom FormField to UI Schema property
 */
function convertFieldToUISchema(field: FormField): UISchemaProperty {
  const baseUIProperty: UISchemaProperty = {
    'ui:placeholder': field.placeholder,
    'ui:description': field.description,
  };

  switch (field.type) {
    case 'password':
      return {
        ...baseUIProperty,
        'ui:widget': 'password',
      };

    case 'textarea':
      return {
        ...baseUIProperty,
        'ui:widget': 'textarea',
        'ui:options': {
          rows: field.rows || 4,
        },
      };

    case 'radio':
      return {
        ...baseUIProperty,
        'ui:widget': 'radio',
      };

    case 'starRating':
      return {
        ...baseUIProperty,
        'ui:widget': 'StarRatingWidget',
      };

    default:
      return baseUIProperty;
  }
}

/**
 * Converts custom form definition to JSON Schema and UI Schema
 */
export function convertFormDefToJSONSchema(formDef: FormField[]): {
  jsonSchema: JSONSchema;
  uiSchema: UISchema;
} {
  const properties: Record<string, JSONSchemaProperty> = {};
  const uiSchema: UISchema = {};
  const required: string[] = [];

  function processFields(fields: FormField[], prefix = '') {
    fields.forEach((field) => {
      if (field.type === 'group') {
        // Handle groups by flattening their fields
        if (field.fields && Array.isArray(field.fields)) {
          processFields(field.fields, prefix);
        }
      } else if (field.type === 'divider' || field.type === 'verticalDivider') {
        // Skip dividers in JSON Schema
        return;
      } else if (field.type === 'heading' || field.type === 'paragraph') {
        // Skip text elements in JSON Schema
        return;
      } else if (field.name) {
        const fieldName = prefix + field.name;
        properties[fieldName] = convertFieldToJSONSchema(field);
        uiSchema[fieldName] = convertFieldToUISchema(field);
        
        if (field.required) {
          required.push(fieldName);
        }
      }
    });
  }

  processFields(formDef);

  const jsonSchema: JSONSchema = {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  };

  return { jsonSchema, uiSchema };
}

/**
 * Converts multi-step form definition to JSON Schema and UI Schema
 */
export function convertMultiStepFormToJSONSchema(multiStepForm: MultiStepForm): {
  jsonSchema: JSONSchema;
  uiSchema: UISchema;
  steps: Array<{ title: string; description?: string; fields: string[] }>;
} {
  const allProperties: Record<string, JSONSchemaProperty> = {};
  const allUISchema: UISchema = {};
  const allRequired: string[] = [];
  const steps: Array<{ title: string; description?: string; fields: string[] }> = [];

  multiStepForm.steps.forEach((step, stepIndex) => {
    const stepFields: string[] = [];
    
    step.fields.forEach((field) => {
      if (field.type === 'group') {
        if (field.fields && Array.isArray(field.fields)) {
          field.fields.forEach((groupField) => {
            if (groupField.name && groupField.type !== 'divider' && groupField.type !== 'heading' && groupField.type !== 'paragraph') {
              const fieldName = groupField.name;
              allProperties[fieldName] = convertFieldToJSONSchema(groupField);
              allUISchema[fieldName] = convertFieldToUISchema(groupField);
              stepFields.push(fieldName);
              
              if (groupField.required) {
                allRequired.push(fieldName);
              }
            }
          });
        }
      } else if (field.name && field.type !== 'divider' && field.type !== 'heading' && field.type !== 'paragraph') {
        const fieldName = field.name;
        allProperties[fieldName] = convertFieldToJSONSchema(field);
        allUISchema[fieldName] = convertFieldToUISchema(field);
        stepFields.push(fieldName);
        
        if (field.required) {
          allRequired.push(fieldName);
        }
      }
    });

    steps.push({
      title: step.title,
      description: step.description,
      fields: stepFields,
    });
  });

  const jsonSchema: JSONSchema = {
    type: 'object',
    title: 'Multi-Step Form',
    properties: allProperties,
    required: allRequired.length > 0 ? allRequired : undefined,
  };

  return { jsonSchema, uiSchema: allUISchema, steps };
}

/**
 * Extracts form definition from a rendered component's props
 */
export function extractFormDefFromComponent(component: any): FormField[] | null {
  if (!component || typeof component !== 'object') {
    return null;
  }

  // Check if it's a React element with FormRenderer
  if (component.type && component.props) {
    const props = component.props;
    
    // Check for regular form definition
    if (props.formDef && Array.isArray(props.formDef)) {
      return props.formDef;
    }
    
    // Check for multi-step form definition
    if (props.multiStepFormDef && props.multiStepFormDef.steps) {
      // Flatten all steps into a single form definition
      const allFields: FormField[] = [];
      props.multiStepFormDef.steps.forEach((step: any) => {
        if (step.fields && Array.isArray(step.fields)) {
          allFields.push(...step.fields);
        }
      });
      return allFields;
    }
  }

  return null;
}