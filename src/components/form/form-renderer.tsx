import React from "react";
import { exampleForm } from "@/lib/form-definitions";
import { z } from "zod";
import { formFieldSchema } from "@/lib/form-field-schemas";

// Standard field styling
const baseInputClass =
  "w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-zinc-900 dark:text-gray-100 dark:border-zinc-700";

const baseLabelClass =
  "block mb-2 font-semibold text-gray-700 dark:text-gray-200";

// Button styling variants
const buttonVariants = {
  primary: "px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600",
  secondary: "px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600",
  outline: "px-6 py-2 rounded-lg border border-gray-300 bg-transparent text-gray-700 font-semibold hover:bg-gray-50 transition dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-800",
  danger: "px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition dark:bg-red-500 dark:hover:bg-red-600",
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
  date: ({ label, name, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <input type="date" id={name} name={name} className={baseInputClass} {...props} />
    </div>
  ),
  checkbox: ({ label, name, ...props }) => (
    <div className="mb-4 flex items-center">
      <input type="checkbox" id={name} name={name} className="mr-2 accent-blue-600 dark:accent-blue-500" {...props} />
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
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
                className="mr-2 accent-blue-600 dark:accent-blue-500"
                disabled={option.disabled}
                {...props}
              />
              <label htmlFor={`${name}-${idx}`} className="text-gray-700 dark:text-gray-200">
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
    <hr aria-label={label} className="my-8 border-gray-300 dark:border-zinc-700" />
  ),
};

export const FormRenderer: React.FC<FormRendererProps & { formDef?: any[] }> = ({
  formDef = exampleForm,
  buttons,
}) => {
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
    <form className="max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900">
      {formDef.map((section, idx) => {
        if (section.type === "group" && Array.isArray(section.fields)) {
          return (
            <fieldset key={idx} className="mb-8">
              <legend className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
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
  );
};