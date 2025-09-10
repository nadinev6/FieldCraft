import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTamboComponentState } from "@tambo-ai/react";
import { exampleForm } from "@/lib/form-definitions";
import { z } from "zod";
import { formFieldSchema } from "@/lib/form-field-schemas";
import { ChevronDown, Star, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipProvider } from "@/components/tambo/suggestions-tooltip";
import type { MultiStepForm } from '@/lib/multistep-form-definitions';

// InfoPopover component for displaying disclaimer information
const InfoPopover: React.FC<{
  triggerLabel: string;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}> = ({ triggerLabel, content, side = "top", align = "center" }) => {
  return (
    <Tooltip
      content={
        <div className="max-w-xs p-2">
          <p className="text-xs text-white leading-relaxed">{content}</p>
        </div>
      }
      side={side}
      align={align}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-400 hover:bg-gray-500 dark:bg-zinc-600 dark:hover:bg-zinc-500 transition-colors"
        aria-label={triggerLabel}
      >
        <Info className="w-3 h-3 text-white" />
      </button>
    </Tooltip>
  );
};

// Base input styling
const baseInputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 dark:bg-zinc-800 dark:text-gray-100 dark:border-zinc-600 dark:focus:border-zinc-500";

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
  buttonsAlign: z.enum(["left", "center", "right"]).optional().default("right").describe("Global alignment for all form buttons"),
  multiStep: z.boolean().optional().default(false).describe("Enable multi-step form navigation where only one section is visible at a time"),
  multiStepFormDef: z.lazy(() => z.object({
    steps: z.array(z.object({
      title: z.string().describe("Title of the form step"),
      description: z.string().optional().describe("Optional description for the step"),
      fields: z.array(formFieldSchema).describe("Array of form fields for this step"),
    })).min(1).describe("Array of form steps, each containing fields"),
    allowStepSkipping: z.boolean().optional().default(false).describe("Whether users can skip steps or must complete them in order"),
    showStepNumbers: z.boolean().optional().default(true).describe("Whether to show step numbers in the progress indicator"),
  })).optional().describe("Multi-step form definition with steps containing fields"),
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

// Internal state interface for FormRenderer
interface FormRendererState {
  stepIndex: number;
  collapsedGroups: Record<number, boolean>;
  formDef?: z.infer<typeof formFieldSchema>[];
  buttons?: z.infer<typeof buttonSchema>[];
  buttonsAlign?: "left" | "center" | "right";
  multiStep?: boolean;
  multiStepFormDef?: MultiStepForm;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  formDef,
  buttons,
  buttonsAlign,
  multiStep = false,
  multiStepFormDef
}) => {
  // Initialize internal state
  const [internalState, setInternalState] = useState<FormRendererState>({
    stepIndex: 0,
    collapsedGroups: {},
  });

  // Use Tambo streaming props to sync incoming props with internal state
  useTamboComponentState(
    internalState,
    setInternalState,
    {
      formDef: formDef || exampleForm,
      buttons,
      buttonsAlign: buttonsAlign || "right",
      multiStep: multiStep || false,
      multiStepFormDef,
    }
  );

  // Derive the actual form definition based on multiStep mode
  const actualFormDef = React.useMemo(() => {
    if (internalState.multiStep && internalState.multiStepFormDef) {
      const currentStep = internalState.multiStepFormDef.steps[internalState.stepIndex];
      return currentStep?.fields || [];
    }
    return internalState.formDef || exampleForm;
  }, [internalState.multiStep, internalState.multiStepFormDef, internalState.stepIndex, internalState.formDef]);

  // Clamp step index within valid range when form definition changes
  useEffect(() => {
    if (internalState.multiStep && internalState.multiStepFormDef) {
      const maxSteps = internalState.multiStepFormDef.steps.length;
      if (internalState.stepIndex >= maxSteps) {
        setInternalState(prev => ({ 
          ...prev, 
          stepIndex: Math.max(0, maxSteps - 1) 
        }));
      }
    }
  }, [internalState.multiStep, internalState.multiStepFormDef?.steps.length, internalState.stepIndex]);

  // Initialize collapsed groups when form definition changes
  useEffect(() => {
    const initialCollapsedState: Record<number, boolean> = {};
    actualFormDef.forEach((section, idx) => {
      if (section.type === "group" && section.collapsible) {
        initialCollapsedState[idx] = section.defaultCollapsed || false;
      }
    });
    setInternalState(prev => ({ 
      ...prev, 
      collapsedGroups: initialCollapsedState 
    }));
  }, [actualFormDef]);

  const toggleGroupCollapse = (groupIndex: number) => {
    setInternalState(prev => ({
      ...prev,
      collapsedGroups: {
        ...prev.collapsedGroups,
        [groupIndex]: !prev.collapsedGroups[groupIndex]
      }
    }));
  };

  const handleNextStep = () => {
    if (internalState.multiStep && internalState.multiStepFormDef) {
      const maxSteps = internalState.multiStepFormDef.steps.length;
      if (internalState.stepIndex < maxSteps - 1) {
        setInternalState(prev => ({ 
          ...prev, 
          stepIndex: prev.stepIndex + 1 
        }));
      }
    } else {
      if (internalState.stepIndex < actualFormDef.length - 1) {
        setInternalState(prev => ({ 
          ...prev, 
          stepIndex: prev.stepIndex + 1 
        }));
      }
    }
  };

  const handlePreviousStep = () => {
    if (internalState.stepIndex > 0) {
      setInternalState(prev => ({ 
        ...prev, 
        stepIndex: prev.stepIndex - 1 
      }));
    }
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
      
      const isCollapsed = internalState.collapsedGroups[idx] || false;
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
      console.log(`Rendering individual field of type: '${section.type}' (normalized: '${normalizedType}')`);
      return renderFormField(section, idx);
    }
  };

  const sectionsToRender = internalState.multiStep 
    ? [actualFormDef[internalState.stepIndex]].filter(Boolean)
    : actualFormDef;

  const getSectionIndex = (renderIndex: number) => {
    return internalState.multiStep ? internalState.stepIndex : renderIndex;
  };

  // Calculate step boundaries based on multiStep mode
  const { isFirstStep, isLastStep, totalSteps, currentStep } = React.useMemo(() => {
    if (internalState.multiStep && internalState.multiStepFormDef) {
      const total = internalState.multiStepFormDef.steps.length;
      return {
        isFirstStep: internalState.stepIndex === 0,
        isLastStep: internalState.stepIndex === total - 1,
        totalSteps: total,
        currentStep: internalState.stepIndex + 1
      };
    } else {
      const total = actualFormDef.length;
      return {
        isFirstStep: internalState.stepIndex === 0,
        isLastStep: internalState.stepIndex === total - 1,
        totalSteps: total,
        currentStep: internalState.stepIndex + 1
      };
    }
  }, [internalState.multiStep, internalState.multiStepFormDef, internalState.stepIndex, actualFormDef.length]);

  // Get current step info for multi-step forms
  const currentStepInfo = React.useMemo(() => {
    if (internalState.multiStep && internalState.multiStepFormDef) {
      return internalState.multiStepFormDef.steps[internalState.stepIndex];
    }
    return null;
  }, [internalState.multiStep, internalState.multiStepFormDef, internalState.stepIndex]);

  return (
    <TooltipProvider>
      <div className={cn(
        "max-w-md mx-auto p-8 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700",
        "bg-white dark:bg-zinc-900",
        "text-gray-900 dark:text-gray-100"
      )}>
        {multiStep && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {internalState.stepIndex + 1} of {actualFormDef.length}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(((internalState.stepIndex + 1) / actualFormDef.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((internalState.stepIndex + 1) / actualFormDef.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <form>
          {sectionsToRender.map((section, renderIdx) => {
            const actualIdx = getSectionIndex(renderIdx);
            console.log(`Rendering section at renderIdx: ${renderIdx}, actualIdx: ${actualIdx}`, section);
            return renderFormSection(section, actualIdx);
          })}
          
          {multiStep && (
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={isFirstStep}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                  isFirstStep 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              {!isLastStep ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          )}
          
          {(!multiStep || isLastStep) && (
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
          )}
        </form>
      </div>
    </TooltipProvider>
  );
};