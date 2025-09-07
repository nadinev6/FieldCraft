import React from "react";
import { exampleForm } from "@/lib/form-definitions";
import { z } from "zod";
import { formFieldSchema } from "@/lib/form-field-schemas";

// Standard field styling
const baseInputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 dark:bg-zinc-800 dark:text-gray-100 dark:border-zinc-600 dark:focus:border-zinc-500";

const baseLabelClass =
  "block mb-2 font-medium text-gray-700 dark:text-gray-200 text-sm";

// Button styling variants
const buttonVariants = {
  primary: "px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-200 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
  secondary: "px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all duration-200 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600",
  outline: "px-6 py-3 rounded-lg border border-gray-300 bg-transparent text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-800",
  danger: "px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 dark:bg-red-500 dark:hover:bg-red-600",
};

// Button schema for custom buttons
const buttonSchema = z.object({
  label: z.string().describe("The text displayed on the button"),
  type: z.enum(["submit", "button", "reset"]).optional().default("button").describe("The HTML button type"),
  variant: z.enum(["primary", "secondary", "outline", "danger"]).optional().default("primary").describe("The visual style variant of the button"),
  action: z.string().optional().describe("Optional action identifier for handling button clicks"),
});
// Zod schema for FormRenderer props
export const formRendererPropsSchema = z.object({
  formDef: z.array(formFieldSchema).describe("Array of form field definitions that define the structure and fields of the form to render"),
  buttons: z.array(buttonSchema).optional().describe("Optional array of custom buttons to render at the bottom of the form"),
});

export type FormRendererProps = z.infer<typeof formRendererPropsSchema>;

// Individual field components
const FieldComponents: Record<string, React.FC<any>> = {
  text: ({ label, name, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <input type="text" id={name} name={name} className={baseInputClass} {...props} />
    </div>
  ),
  password: ({ label, name, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <input type="password" id={name} name={name} className={baseInputClass} {...props} />
    </div>
  ),
  number: ({ label, name, min, max, step, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <input 
        type="number" 
        id={name} 
        name={name} 
        min={min}
        max={max}
        step={step}
        className={baseInputClass} 
        {...props} 
      />
    </div>
  ),
  select: ({ label, name, options, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <select id={name} name={name} className={baseInputClass} {...props}>
        {options?.map((option: any, idx: number) => (
          <option key={idx} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
  date: ({ label, name, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <input type="date" id={name} name={name} className={baseInputClass} {...props} />
    </div>
  ),
  checkbox: ({ label, name, ...props }) => (
    <div className="mb-4">
      <div className="flex items-center">
        <input type="checkbox" id={name} name={name} className="mr-3 w-4 h-4 accent-blue-600 dark:accent-blue-500" {...props} />
        <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      </div>
    </div>
  ),
  radio: ({ label, name, options, ...props }) => (
    <div className="mb-4">
      <fieldset>
        <legend className={baseLabelClass}>{label}</legend>
        <div className="space-y-2">
          {options?.map((option: any, idx: number) => (
            <div key={idx} className="flex items-center">
              <input
                type="radio"
                id={`${name}-${idx}`}
                name={name}
                value={option.value}
                className="mr-3 w-4 h-4 accent-blue-600 dark:accent-blue-500"
                disabled={option.disabled}
                {...props}
              />
              <label htmlFor={`${name}-${idx}`} className="text-sm text-gray-700 dark:text-gray-200">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  ),
  textarea: ({ label, name, rows = 4, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={baseInputClass}
        {...props}
      />
    </div>
  ),
  divider: ({ label }) => (
    <div className="my-8">
      {label && <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{label}</h3>}
      <hr className="border-gray-300 dark:border-zinc-700" />
    </div>
  ),
};

export const FormRenderer: React.FC<FormRendererProps & { formDef?: any[] }> = ({
  formDef,
  buttons,
}) => {
  // Use exampleForm as default if no formDef is provided
  const actualFormDef = formDef || exampleForm;

  // Check if we have any renderable fields
  const hasRenderableFields = actualFormDef.some(section => {
    if (section.type === "group" && Array.isArray(section.fields)) {
      return section.fields.length > 0;
    }
    return section.type !== "divider";
  });

  // If no renderable fields, show a message
  if (!hasRenderableFields) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No Form Fields Available
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            The form definition is empty or contains no renderable fields.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Try asking for a specific form, like "Create a user registration form with username, email, and password fields"
          </p>
        </div>
      </div>
    );
  }

  const handleButtonClick = (button: z.infer<typeof buttonSchema>, event: React.MouseEvent<HTMLButtonElement>) => {
    if (button.action) {
      // Emit a custom event with the action identifier
      const customEvent = new CustomEvent('formButtonClick', {
        detail: { action: button.action, button, event }
      });
      window.dispatchEvent(customEvent);
    }
    
    // For submit buttons, let the default form submission behavior occur
    if (button.type !== 'submit') {
      event.preventDefault();
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
      <form>
        {actualFormDef.map((section, idx) => {
        if (section.type === "group" && Array.isArray(section.fields)) {
          return (
            <fieldset key={idx} className="mb-8">
              <legend className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {section.label}
              </legend>
              {section.fields.map((field: any, fIdx: number) => {
                const Field = FieldComponents[field.type];
                return Field ? (
                  <Field key={fIdx} {...field} />
                ) : null;
              })}
            </fieldset>
          );
        }
        if (section.type === "divider") {
          const Divider = FieldComponents.divider;
          return Divider ? <Divider key={idx} {...section} /> : null;
        }
        return null;
      })}
      
      {/* Custom buttons or default submit button */}
      <div className="flex gap-3 justify-end mt-6">
        {buttons && buttons.length > 0 ? (
          buttons.map((button, idx) => (
            <button
              key={idx}
              type={button.type}
              className={buttonVariants[button.variant]}
              onClick={(e) => handleButtonClick(button, e)}
            >
              {button.label}
            </button>
          ))
        ) : (
          <button type="submit" className={buttonVariants.primary}>
            Submit
          </button>
        )}
      </div>
      </form>
    </div>
  );
};