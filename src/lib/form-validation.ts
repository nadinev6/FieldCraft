import { z } from "zod";
import { exampleForm } from "./form-definitions";
import {
  textFieldSchema,
  numberFieldSchema,
  checkboxFieldSchema,
  selectFieldSchema,
  radioFieldSchema,
  textareaFieldSchema,
  dateFieldSchema,
} from "./form-field-schemas";

// Map field type to schema
const fieldSchemas: Record<string, any> = {
  text: textFieldSchema,
  number: numberFieldSchema,
  checkbox: checkboxFieldSchema,
  select: selectFieldSchema,
  radio: radioFieldSchema,
  textarea: textareaFieldSchema,
  date: dateFieldSchema,
  password: textFieldSchema, // You can create a passwordFieldSchema for stricter rules
};

// Build Zod schema for form data
export function buildFormSchema(formDef: any[]) {
  const shape: Record<string, any> = {};

  formDef.forEach(section => {
    if (section.type === "group" && Array.isArray(section.fields)) {
      section.fields.forEach(field => {
        const schema = fieldSchemas[field.type];
        if (schema) {
          shape[field.name] = schema;
        }
      });
    }
  });

  return z.object(shape);
}

// Validate form data against schema
export function validateFormData(formDef: any[], data: Record<string, any>) {
  const schema = buildFormSchema(formDef);
  return schema.safeParse(data);
}

// Example usage (for development)
// const result = validateFormData(exampleForm, { username: "user", password: "pass" });
// if (!result.success) { /* handle errors */ }