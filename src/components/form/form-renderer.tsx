import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { exampleForm } from "@/lib/form-definitions";
import { z } from "zod";
import { formFieldSchema } from "@/lib/form-field-schemas";
import { ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoPopover } from "@/components/ui/info-popover";

// Base input styling
const baseInputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 dark:bg-zinc-800 dark:text-gray-100 dark:border-zinc-600 dark:focus:border-zinc-500";

// Base label styling
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
  formDef: z.array(formFieldSchema).optional().describe("Array of form field definitions that define the structure and fields of the form to render"),
  buttons: z.array(buttonSchema).optional().describe("Optional array of custom buttons to render at the bottom of the form"),
});

export type FormRendererProps = z.infer<typeof formRendererPropsSchema>;

// Helper function to get explicit Tailwind grid column classes
const getGridColsClass = (columns?: number) => {
  switch (columns) {
    case 1: return "grid-cols-1";
    case 2: return "grid-cols-2";
    case 3: return "grid-cols-3";
    case 4: return "grid-cols-4";
    default: return "grid-cols-1"; // Default to 1 column if not specified or invalid
  }
};

// Helper function to normalize field types
const normalizeFieldType = (type: string): string => {
  if (typeof type === 'string') {
    const normalized = type.toLowerCase().trim();
    if (normalized === 'rating') {
      return 'starRating';
    }
    return normalized;
  }
  return type;
};

// Helper function to get button alignment classes
const getButtonAlignmentClass = (alignment?: "left" | "center" | "right") => {
  switch (alignment) {
    case "left": return "justify-start";
    case "center": return "justify-center";
    case "right": return "justify-end";
    default: return "justify-end"; // Default to right alignment
  }
};

// Individual field components
const FieldComponents: Record<string, React.FC<any>> = {
  text: ({ label, name, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <input type="text" id={name} name={name} className={baseInputClass} {...props} />
    </div>
  ),
  email: ({ label, name, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <input type="email" id={name} name={name} className={baseInputClass} {...props} />
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
  checkbox: ({ label, name, ...props }) => (
    <div className="mb-4">
      <div className="flex items-center">
        <input type="checkbox" id={name} name={name} className="mr-3 w-4 h-4 accent-blue-600 dark:accent-blue-500" {...props} />
        <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      </div>
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
  date: ({ label, name, ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={baseLabelClass}>{label}</label>
      <input type="date" id={name} name={name} className={baseInputClass} {...props} />
    </div>
  ),
  radio: ({ label, name, options, defaultValue, ...props }) => {
    return (
      <div className="mb-4">
        <fieldset>
          <legend className={baseLabelClass}>{label}</legend>
          <div className="space-y-2">
            {options?.map((option: any, idx: number) => (
              <div key={`${name}-${option.value}`} className="flex items-center">
                <input
                  type="radio" 
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  className="mr-3 w-4 h-4 accent-blue-600 dark:accent-blue-500"
                  disabled={option.disabled}
                  defaultChecked={option.value === defaultValue} // Use defaultChecked for initial state
                  {...props}
                />
                <label htmlFor={`${name}-${option.value}`} className="text-sm text-gray-700 dark:text-gray-200">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    );
  },
  starRating: ({ label, name, maxRating = 5, defaultValue = 0, allowHalf = false, ...props }) => {
    const [rating, setRating] = useState(defaultValue);
    const [hoverRating, setHoverRating] = useState(0);
    
    const handleStarClick = (starValue: number) => {
      setRating(starValue);
    };
    
    const handleStarHover = (starValue: number) => {
      setHoverRating(starValue);
    };
    
    const handleMouseLeave = () => {
      setHoverRating(0);
    };
    
    const getStarFill = (starIndex: number) => {
      const currentRating = hoverRating || rating;
      if (allowHalf) {
        if (starIndex <= currentRating - 0.5) {
          return 'full';
        } else if (starIndex <= currentRating) {
          return 'half';
        }
        return 'empty';
      } else {
        return starIndex <= currentRating ? 'full' : 'empty';
      }
    };
    
    return (
      <div className="mb-4">
        <label className={baseLabelClass}>{label}</label>
        <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
          {Array.from({ length: maxRating }, (_, index) => {
            const starValue = index + 1;
            const fillType = getStarFill(starValue);
            
            return (
              <button
            key={starValue}
            type="button"
            className="p-1 hover:scale-110 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            aria-label={`Rate ${starValue} out of ${maxRating} stars`}
          >
            <Star
              className={`w-6 h-6 transition-colors duration-150 ${
                fillType === 'full'
                  ? 'fill-yellow-400 text-yellow-400'
                  : fillType === 'half'
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'fill-transparent text-gray-300 hover:text-yellow-400'
              }`}
            />
          </button>
            );
          })}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {rating > 0 ? `${rating}/${maxRating}` : 'No rating'}
          </span>
        </div>
        <input
          type="hidden"
          name={name}
          defaultValue={rating}
          {...props}
        />
      </div>
    );
  },
  divider: ({ label }) => (
    <div className="my-8">
      {label && <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{label}</h3>}
      <hr className="border-gray-300 dark:border-zinc-700" />
    </div>
  ),
  verticalDivider: () => (
    <div className="w-px bg-gray-300 dark:bg-zinc-700 mx-4 self-stretch"></div>
  ),
  heading: ({ text, level = "h2", alignment = "left", className, ...props }) => {
    const HeadingTag = level as keyof JSX.IntrinsicElements;
    const alignmentClass = alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";
    const levelClasses = {
      h1: "text-3xl font-bold mb-6 mt-8",
      h2: "text-2xl font-bold mb-4 mt-6", 
      h3: "text-xl font-semibold mb-3 mt-5",
      h4: "text-lg font-semibold mb-2 mt-4",
      h5: "text-base font-medium mb-2 mt-3",
      h6: "text-sm font-medium mb-2 mt-2"
    };
    
    return (
      <HeadingTag 
        className={cn(
          levelClasses[level],
          alignmentClass,
          "text-gray-900 dark:text-gray-100",
          className
        )}
        {...props}
      >
        {text}
      </HeadingTag>
    );
  },
  paragraph: ({ text, alignment = "left", className, ...props }) => {
    const alignmentClass = alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";
    
    return (
      <p 
        className={cn(
          "mb-4 text-gray-700 dark:text-gray-300 leading-relaxed",
          alignmentClass,
          className
        )}
        {...props}
      >
        {text}
      </p>
    );
  },
};

export const FormRenderer: React.FC<FormRendererProps> = ({ formDef, buttons }) => {
export const FormRenderer: React.FC<FormRendererProps> = ({ formDef, buttons, buttonsAlign }) => {
  const actualFormDef = formDef === undefined ? exampleForm : formDef;
  
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});
  
  useEffect(() => {
    const initialCollapsedState: Record<number, boolean> = {};
    actualFormDef.forEach((section, idx) => {
      if (section.type === "group" && section.collapsible) {
        initialCollapsedState[idx] = section.defaultCollapsed || false;
      }
    });
    setCollapsedGroups(initialCollapsedState);
  }, [actualFormDef]);
  
  const toggleGroupCollapse = (groupIndex: number) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupIndex]: !prev[groupIndex]
    }));
  };
  
  const handleButtonClick = (button: z.infer<typeof buttonSchema>, event: React.MouseEvent<HTMLButtonElement>) => {
    if (button.action) {
      const customEvent = new CustomEvent('formButtonClick', {
        detail: { action: button.action, button, event }
      });
      window.dispatchEvent(customEvent);
    }
    
    if (button.type !== 'submit') {
      event.preventDefault();
    }
  };

  // Helper function to render individual form fields (input components only)
  const renderFormField = (field: any, key: string | number) => {
    const normalizedType = normalizeFieldType(field.type);
    
    console.log(`Rendering field with type: '${field.type}' (normalized: '${normalizedType}')`);
    
    const Field = FieldComponents[normalizedType];
    if (!Field) {
      console.warn(`No component for field type: '${field.type}' (normalized: '${normalizedType}')`);
      return null;
    }
    
    return <Field key={key} {...field} />;
  };

  // Recursive function to render form sections (groups, dividers, or individual fields)
  const renderFormSection = (section: any, idx: number): React.ReactNode => {
    console.log(`Processing section ${idx}:`, section);
    console.log(`Section type: '${section?.type}' (typeof: ${typeof section?.type})`);
    
    if (!section) {
      console.log(`Skipping empty section ${idx}`);
      return null;
    }
    
    const normalizedType = normalizeFieldType(section.type);
    
    console.log(`Normalized type: '${normalizedType}'`);
    console.log(`Is group? ${normalizedType === "group"}`);
    console.log(`Is divider? ${normalizedType === "divider"}`);
    
    if (normalizedType === "group") {
      if (!section.fields || !Array.isArray(section.fields) || section.fields.length === 0) {
        console.warn(`Skipping group "${section.label}" - missing or empty fields array:`, section);
        return null;
      }
      
      const isCollapsed = collapsedGroups[idx] || false;
      const isCollapsible = section.collapsible || false;
      
      console.log(`Rendering group "${section.label}" with ${section.fields.length} fields, columns: ${section.columns}`);
      
      return (
        <fieldset key={idx} className="mb-8">
          <legend className="flex items-center w-full">
            {isCollapsible ? (
              <button
                type="button"
                onClick={() => toggleGroupCollapse(idx)}
                className="flex items-center gap-2 text-left font-medium text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors mr-2"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCollapsed ? '-rotate-90' : 'rotate-0'
                  }`}
                />
                {section.label}
              </button>
            ) : (
              <span className="font-medium text-gray-800 dark:text-gray-200 mr-2">{section.label}</span>
            )}
            {section.disclaimer && (
              <InfoPopover
                triggerLabel="Additional Information"
                content={section.disclaimer}
                side="right"
                align="start"
              />
            )}
          </legend>
          
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isCollapsed ? 'max-h-0 opacity-0' : 'max-h-none opacity-100'
          }`}>
            <div className={cn(
              "pt-4",
              section.columns && "grid gap-x-4 items-start",
              section.columns && getGridColsClass(section.columns)
            )}>
              {section.fields.map((field, fIdx) => {
                // Recursively render each field in the group
                // This handles nested groups, dividers, and individual fields
                return renderFormSection(field, fIdx);
              })}
            </div>
          </div>
        </fieldset>
      );
    } else if (normalizedType === "divider") {
      console.log(`Rendering divider: "${section.label}"`);
      return <FieldComponents.divider key={idx} {...section} />;
    } else {
      // Handle individual fields (text, number, starRating, etc.)
      console.log(`Rendering individual field of type: '${section.type}' (normalized: '${normalizedType}')`);
      return renderFormField(section, idx);
    }
  };
  return (
    <div className="max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
      <form>
        {actualFormDef.map((section, idx) => renderFormSection(section, idx))}
        
        <div className={cn("flex gap-3 mt-6", getButtonAlignmentClass(buttonsAlign))}>
          {buttons && buttons.length > 0 ? (
            buttons.map((button, idx) => (
              <button
                key={idx}
                type={button.type}
                className={cn(
                  button.colorClass || buttonVariants[button.variant || "primary"]
                )}
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