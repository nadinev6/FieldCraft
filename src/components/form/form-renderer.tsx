import React from "react";
import { exampleForm } from "@/lib/form-definitions";
import { z } from "zod";
import { formFieldSchema } from "@/lib/form-field-schemas";

// Standard field styling
const baseInputClass =
  "w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-zinc-900 dark:text-gray-100 dark:border-zinc-700";

const baseLabelClass =
  "block mb-2 font-semibold text-gray-700 dark:text-gray-200";

const baseButtonClass =
  "w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600";

// Zod schema for FormRenderer props
export const formRendererPropsSchema = z.object({
  formDef: z.array(formFieldSchema).describe("Array of form field definitions that define the structure and fields of the form to render"),
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
  divider: ({ label }) => (
    <hr aria-label={label} className="my-8 border-gray-300 dark:border-zinc-700" />
  ),
  // Add other field types 
};

export const FormRenderer: React.FC<FormRendererProps & { formDef?: any[] }> = ({
  formDef = exampleForm,
}) => {
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
      <button type="submit" className={baseButtonClass}>
        Submit
      </button>
    </form>
    );
};