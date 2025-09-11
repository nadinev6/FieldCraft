import { z } from "zod";

// Text field schema
export const textFieldSchema = z.object({
  type: z.literal("text"),
  label: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  defaultValue: z.string().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
});

// Number field schema
export const numberFieldSchema = z.object({
  type: z.literal("number"),
  label: z.string(),
  name: z.string(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  required: z.boolean().optional(),
  defaultValue: z.number().optional(),
});

// Checkbox field schema
export const checkboxFieldSchema = z.object({
  type: z.literal("checkbox"),
  label: z.string(),
  name: z.string(),
  required: z.boolean().optional(),
  defaultChecked: z.boolean().optional(),
});

// Select field schema
export const selectFieldSchema = z.object({
  type: z.literal("select"),
  label: z.string(),
  name: z.string(),
  required: z.boolean().optional(),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      disabled: z.boolean().optional(),
    })
  ),
  defaultValue: z.string().optional(),
});

// Radio field schema
export const radioFieldSchema = z.object({
  type: z.literal("radio"),
  label: z.string(),
  name: z.string(),
  required: z.boolean().optional(),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      disabled: z.boolean().optional(),
    })
  ),
  defaultValue: z.string().optional(),
});

// Textarea field schema
export const textareaFieldSchema = z.object({
  type: z.literal("textarea"),
  label: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  defaultValue: z.string().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  rows: z.number().optional(),
});

// Date field schema
export const dateFieldSchema = z.object({
  type: z.literal("date"),
  label: z.string(),
  name: z.string(),
  required: z.boolean().optional(),
  min: z.string().optional(), // ISO date string
  max: z.string().optional(), // ISO date string
  defaultValue: z.string().optional(), // ISO date string
});

// Divider schema 
export const dividerFieldSchema = z.object({
  type: z.literal("divider"),
  label: z.string().optional(),
});

// Vertical divider schema
export const verticalDividerFieldSchema = z.object({
  type: z.literal("verticalDivider"),
});

// Group/Section schema (for nested fields)
export const groupFieldSchema = z.object({
  type: z.literal("group"),
  label: z.string(),
  name: z.string().optional(),
  fields: z.array(z.lazy(() => formFieldSchema)),
  description: z.string().optional(),
  disclaimer: z.string().optional().describe("Optional disclaimer or additional instructions displayed in a popover"),
  collapsible: z.boolean().optional().default(false).describe("Whether this group can be collapsed/expanded"),
  defaultCollapsed: z.boolean().optional().default(false).describe("Initial collapsed state if collapsible is true"),
  columns: z.number().min(1).optional().describe("Number of columns for fields within this group"),
  condition: z
    .object({
      field: z.string(),
      value: z.any(),
      operator: z.enum(["equals", "notEquals", "greaterThan", "lessThan"]).optional(),
    })
    .optional(),
});

// Star rating field schema
export const starRatingFieldSchema = z.object({
  type: z.literal("starRating"),
  label: z.string(),
  name: z.string(),
  maxRating: z.number().min(1).max(10).optional().default(5),
  required: z.boolean().optional(),
  defaultValue: z.number().min(0).optional(),
  allowHalf: z.boolean().optional().default(false),
});

// Box rating field schema
export const boxRatingFieldSchema = z.object({
  type: z.literal("boxRating"),
  label: z.string(),
  name: z.string(),
  maxRating: z.number().min(1).max(10).optional().default(10),
  required: z.boolean().optional(),
  defaultValue: z.number().min(0).optional(),
  minLabel: z.string().optional().describe("Label for the minimum rating (e.g., 'Least Likely')"),
  maxLabel: z.string().optional().describe("Label for the maximum rating (e.g., 'Most Likely')"),
});

// Heading field schema
export const headingFieldSchema = z.object({
  type: z.literal("heading"),
  text: z.string().describe("The heading text content"),
  level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional().default("h2").describe("The heading level (h1-h6)"),
  alignment: z.enum(["left", "center", "right"]).optional().default("left").describe("Text alignment"),
  className: z.string().optional().describe("Additional CSS classes for custom styling"),
});

// Paragraph field schema
export const paragraphFieldSchema = z.object({
  type: z.literal("paragraph"),
  text: z.string().describe("The paragraph text content"),
  alignment: z.enum(["left", "center", "right"]).optional().default("left").describe("Text alignment"),
  className: z.string().optional().describe("Additional CSS classes for custom styling"),
});

// Union schema for all field types
export const formFieldSchema = z.union([
  textFieldSchema,
  numberFieldSchema,
  checkboxFieldSchema,
  selectFieldSchema,
  radioFieldSchema,
  textareaFieldSchema,
  dateFieldSchema,
  groupFieldSchema,
  dividerFieldSchema,
  verticalDividerFieldSchema,
  starRatingFieldSchema,
  boxRatingFieldSchema,
  headingFieldSchema,
  paragraphFieldSchema,
]);

// Button schema for custom buttons
const buttonSchema = z.object({
  label: z.string().describe("The text displayed on the button"),
  type: z.enum(["submit", "button", "reset"]).optional().default("button").describe("The HTML button type"),
  variant: z.enum(["primary", "secondary", "outline", "danger"]).optional().default("primary").describe("The visual style variant of the button"),
  action: z.string().optional().describe("Optional action identifier for handling button clicks"),
  align: z.enum(["left", "center", "right"]).optional().default("right").describe("Horizontal alignment of the button group"),
  colorClass: z.string().optional().describe("Custom Tailwind CSS classes for button styling (e.g., 'bg-blue-500 text-white')"),
});

// Zod schema for FormRenderer props
export const formRendererPropsSchema = z.object({
  formDef: z.array(formFieldSchema).optional().describe("Array of form field definitions that define the structure and fields of the form to render"),
  buttons: z.array(buttonSchema).optional().describe("Optional array of custom buttons to render at the bottom of the form"),
  buttonsAlign: z.enum(["left", "center", "right"]).optional().default("right").describe("Global alignment for all form buttons"),
  multiStep: z.boolean().optional().default(false).describe("Enable multi-step form navigation where only one section is visible at a time"),
  multiStepFormDef: z.lazy(() => multiStepFormSchema).optional().describe("Multi-step form definition with steps containing fields"),
  // Styling properties for AI-controlled form appearance
  backgroundColor: z.string().optional().describe("Background color (hex, rgb, or CSS color name)"),
  textColor: z.string().optional().describe("Text color (hex, rgb, or CSS color name)"),
  fontSize: z.number().min(8).max(72).optional().describe("Font size in pixels"),
  fontFamily: z.string().optional().describe("Font family name"),
  borderRadius: z.number().min(0).max(50).optional().describe("Border radius in pixels"),
  padding: z.number().min(0).max(100).optional().describe("Padding in pixels"),
  margin: z.number().min(0).max(100).optional().describe("Margin in pixels"),
  borderWidth: z.number().min(0).max(10).optional().describe("Border width in pixels"),
  borderColor: z.string().optional().describe("Border color (hex, rgb, or CSS color name)"),
  // Styling properties for AI-controlled form appearance
  backgroundColor: z.string().optional().describe("Background color (hex, rgb, or CSS color name)"),
  textColor: z.string().optional().describe("Text color (hex, rgb, or CSS color name)"),
  fontSize: z.number().min(8).max(72).optional().describe("Font size in pixels"),
  fontFamily: z.string().optional().describe("Font family name"),
  borderRadius: z.number().min(0).max(50).optional().describe("Border radius in pixels"),
  padding: z.number().min(0).max(100).optional().describe("Padding in pixels"),
  margin: z.number().min(0).max(100).optional().describe("Margin in pixels"),
  borderWidth: z.number().min(0).max(10).optional().describe("Border width in pixels"),
  borderColor: z.string().optional().describe("Border color (hex, rgb, or CSS color name)"),
});

// Form step schema for multi-step forms
export const formStepSchema = z.object({
  title: z.string().describe("Title of the form step"),
  description: z.string().optional().describe("Optional description for the step"),
  fields: z.array(formFieldSchema).describe("Array of form fields for this step"),
});

// Multi-step form schema
export const multiStepFormSchema = z.object({
  steps: z.array(formStepSchema).min(1).describe("Array of form steps, each containing fields"),
  allowStepSkipping: z.boolean().optional().default(false).describe("Whether users can skip steps or must complete them in order"),
  showStepNumbers: z.boolean().optional().default(true).describe("Whether to show step numbers in the progress indicator"),
});

export type FormField = z.infer<typeof formFieldSchema>;