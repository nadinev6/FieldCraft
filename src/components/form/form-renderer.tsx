"use client";

import React, { useEffect, useState, useRef } from 'react';
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
const getBaseInputClass = (backgroundColor?: string, textColor?: string) => {
  const baseClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200";
  if (backgroundColor || textColor) {
    return baseClass;
  }
  return `${baseClass} bg-[var(--form-field-background)] text-[var(--form-field-text-color)]`;
};

// Base label styling
const getBaseLabelClass = (textColor?: string) => {
  const baseClass = "block mb-2 font-medium text-sm";
  if (textColor) {
    return baseClass;
  }
  return `${baseClass} text-[var(--form-label-text-color)]`;
};

// Button styling variants
const buttonVariants = {
  primary: "px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-200",
  secondary: "px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all duration-200",
  outline: "px-6 py-3 rounded-lg border border-gray-300 bg-transparent text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200",
  danger: "px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200",
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
  })).optional().describe("Multi-step form configuration with steps, each containing fields"),
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
  text: ({ label, name, backgroundColor, textColor, ...props }) => {
    const inputStyle: React.CSSProperties = {};
    if (backgroundColor) inputStyle.backgroundColor = backgroundColor;
    if (textColor) inputStyle.color = textColor;
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
    <div className="mb-4">
      <label htmlFor={name} className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
      <input type="text" id={name} name={name} className={getBaseInputClass(backgroundColor, textColor)} style={inputStyle} {...props} />
    </div>
  )},
  email: ({ label, name, backgroundColor, textColor, ...props }) => {
    const inputStyle: React.CSSProperties = {};
    if (backgroundColor) inputStyle.backgroundColor = backgroundColor;
    if (textColor) inputStyle.color = textColor;
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
    <div className="mb-4">
      <label htmlFor={name} className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
      <input type="email" id={name} name={name} className={getBaseInputClass(backgroundColor, textColor)} style={inputStyle} {...props} />
    </div>
  )},
  password: ({ label, name, backgroundColor, textColor, ...props }) => {
    const inputStyle: React.CSSProperties = {};
    if (backgroundColor) inputStyle.backgroundColor = backgroundColor;
    if (textColor) inputStyle.color = textColor;
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
    <div className="mb-4">
      <label htmlFor={name} className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
      <input type="password" id={name} name={name} className={getBaseInputClass(backgroundColor, textColor)} style={inputStyle} {...props} />
    </div>
  )},
  number: ({ label, name, min, max, step, backgroundColor, textColor, ...props }) => {
    const inputStyle: React.CSSProperties = {};
    if (backgroundColor) inputStyle.backgroundColor = backgroundColor;
    if (textColor) inputStyle.color = textColor;
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
    <div className="mb-4">
      <label htmlFor={name} className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
      <input 
        type="number" 
        id={name} 
        name={name} 
        min={min}
        max={max}
        step={step}
        className={getBaseInputClass(backgroundColor, textColor)}
        style={inputStyle}
        {...props} 
      />
    </div>
  )},
  checkbox: ({ label, name, textColor, ...props }) => {
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
    <div className="mb-4">
      <div className="flex items-center">
        <input type="checkbox" id={name} name={name} className="mr-3 w-4 h-4 accent-gray-600" {...props} />
        <label htmlFor={name} className="text-sm font-medium text-[var(--form-label-text-color)]" style={labelStyle}>{label}</label>
      </div>
    </div>
  )},
  select: ({ label, name, options, backgroundColor, textColor, ...props }) => {
    const selectStyle: React.CSSProperties = {};
    if (backgroundColor) selectStyle.backgroundColor = backgroundColor;
    if (textColor) selectStyle.color = textColor;
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
    <div className="mb-4">
      <label htmlFor={name} className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
      <select id={name} name={name} className={getBaseInputClass(backgroundColor, textColor)} style={selectStyle} {...props}>
        {options?.map((option: any, idx: number) => (
          <option key={idx} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )},
  textarea: ({ label, name, rows = 4, backgroundColor, textColor, ...props }) => {
    const textareaStyle: React.CSSProperties = {};
    if (backgroundColor) textareaStyle.backgroundColor = backgroundColor;
    if (textColor) textareaStyle.color = textColor;
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
    <div className="mb-4">
      <label htmlFor={name} className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={getBaseInputClass(backgroundColor, textColor)}
        style={textareaStyle}
        {...props}
      />
    </div>
  )},
  date: ({ label, name, backgroundColor, textColor, ...props }) => {
    const inputStyle: React.CSSProperties = {};
    if (backgroundColor) inputStyle.backgroundColor = backgroundColor;
    if (textColor) inputStyle.color = textColor;
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
    <div className="mb-4">
      <label htmlFor={name} className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
      <input type="date" id={name} name={name} className={getBaseInputClass(backgroundColor, textColor)} style={inputStyle} {...props} />
    </div>
  )},
  radio: ({ label, name, options, defaultValue, textColor, ...props }) => {
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
      <div className="mb-4">
        <fieldset>
          <legend className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</legend>
          <div className="space-y-2">
            {options?.map((option: any, idx: number) => (
              <div key={`${name}-${option.value}`} className="flex items-center">
                <input
                  type="radio" 
                  id={`${name}-${option.value}`}
                  name={name}
                  value={option.value}
                  className="mr-3 w-4 h-4 accent-green-600 dark:accent-green-500"
                  disabled={option.disabled}
                  defaultChecked={option.value === defaultValue} // Use defaultChecked for initial state
                  {...props}
                />
                <label htmlFor={`${name}-${option.value}`} className="text-sm text-[var(--form-label-text-color)]" style={labelStyle}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    );
  },
  starRating: ({ label, name, maxRating = 5, defaultValue = 0, allowHalf = false, textColor, ...props }) => {
    const [rating, setRating] = useState(defaultValue);
    const [hoverRating, setHoverRating] = useState(0);
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    const ratingTextStyle: React.CSSProperties = {};
    if (textColor) ratingTextStyle.color = textColor;
    
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
        <label className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
        <div className="flex items-center gap-3" onMouseLeave={handleMouseLeave}>
          {Array.from({ length: maxRating }, (_, index) => {
            const starValue = index + 1;
            const fillType = getStarFill(starValue);
            
            return (
              <button
                key={starValue}
                type="button"
                className="p-1 hover:scale-110 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
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
          <span className="text-sm font-medium text-[var(--form-label-text-color)]" style={ratingTextStyle}>
            {rating} / {maxRating}
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
  boxRating: ({ label, name, maxRating = 10, defaultValue = 0, minLabel, maxLabel, textColor, ...props }) => {
    const [rating, setRating] = useState(defaultValue);
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    const handleBoxClick = (value: number) => {
      setRating(value);
    };
    
    return (
      <div className="mb-4">
        <label className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            {minLabel && (
              <span className="text-xs text-[var(--form-label-text-color)] flex-shrink-0" style={labelStyle}>
                {minLabel}
              </span>
            )}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {Array.from({ length: maxRating + 1 }, (_, index) => {
                const value = index;
                const isSelected = rating === value;
                
                return (
                  <button
                    key={value}
                    type="button"
                    className={cn(
                      "w-10 h-10 border-2 rounded-md font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500",
                      isSelected
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    )}
                    onClick={() => handleBoxClick(value)}
                    aria-label={`Rate ${value} out of ${maxRating}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
            {maxLabel && (
              <span className="text-xs text-[var(--form-label-text-color)] flex-shrink-0" style={labelStyle}>
                {maxLabel}
              </span>
            )}
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-[var(--form-label-text-color)]" style={labelStyle}>
              Selected: {rating}
            </span>
          </div>
        </div>
        <input
          type="hidden"
          name={name}
          value={rating}
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
  heading: ({ text, level = "h2", alignment = "left", className, backgroundColor, textColor, ...props }: any) => {
    const HeadingTag = level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    const alignmentClass = alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";
    const levelClasses: Record<string, string> = {
      h1: "text-3xl font-bold mb-6 mt-8",
      h2: "text-2xl font-bold mb-4 mt-6", 
      h3: "text-xl font-semibold mb-3 mt-5",
      h4: "text-lg font-semibold mb-2 mt-4",
      h5: "text-base font-medium mb-2 mt-3",
      h6: "text-sm font-medium mb-2 mt-2"
    };
    
    const dynamicStyles: React.CSSProperties = {};
    if (backgroundColor) {
      dynamicStyles.backgroundColor = backgroundColor;
      dynamicStyles.padding = '0.75rem';
      dynamicStyles.borderRadius = '0.375rem';
    }
    if (textColor) dynamicStyles.color = textColor;
    
    return React.createElement(
      HeadingTag,
      {
        className: cn(
          levelClasses[level],
          alignmentClass,
          "text-gray-900 dark:text-gray-200",
          className
        ),
        style: dynamicStyles,
        ...props
      },
      text
    );
  },
  paragraph: ({ text, alignment = "left", className, backgroundColor, textColor, ...props }) => {
    const alignmentClass = alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left";
    
    const dynamicStyles: React.CSSProperties = {};
    if (backgroundColor) dynamicStyles.backgroundColor = backgroundColor;
    if (textColor) dynamicStyles.color = textColor;
    
    return (
      <p 
        className={cn(
          "mb-4 text-gray-700 dark:text-gray-200 leading-relaxed px-3 py-2 rounded",
          alignmentClass,
          className
        )}
        style={dynamicStyles}
        {...props}
      >
        {text}
      </p>
    );
  },
  file: ({ label, name, accept = "*/*", textColor, ...props }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setPreviewUrl(null);
        }
      }
    };
    
    const handleRemoveFile = () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    const labelStyle: React.CSSProperties = {};
    if (textColor) labelStyle.color = textColor;
    
    return (
      <div className="mb-4">
        <label className={getBaseLabelClass(textColor)} style={labelStyle}>{label}</label>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Images, Documents, PDFs, and more</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                id={name}
                name={name}
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
                {...props}
              />
            </label>
          </div>
          
          {selectedFile && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
};

export const FormRenderer: React.FC<FormRendererProps> = ({
  formDef,
  buttons,
  buttonsAlign,
  multiStep = false,
  multiStepFormDef,
  borderColor,
  borderRadius,
  padding,
  margin,
  borderWidth,
}) => {
  // Internal UI state (not controlled by Tambo)
  const [stepIndex, setStepIndex] = useState(0);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({});

  // Tambo-controlled props (each managed individually)
  const [currentFormDef] = useTamboComponentState("formDef", formDef || exampleForm);
  const [currentButtons] = useTamboComponentState("buttons", buttons);
  const [currentButtonsAlign] = useTamboComponentState("buttonsAlign", buttonsAlign || "right");
  const [isMultiStep] = useTamboComponentState("multiStep", multiStep || false);
  const [currentMultiStepFormDef] = useTamboComponentState("multiStepFormDef", multiStepFormDef);
  
  // Tambo-controlled styling props
  const [currentBackgroundColor] = useTamboComponentState("backgroundColor", backgroundColor);
  const [currentTextColor] = useTamboComponentState("textColor", textColor);
  const [currentFontSize] = useTamboComponentState("fontSize", fontSize);
  const [currentFontFamily] = useTamboComponentState("fontFamily", fontFamily);
  const [currentBorderRadius] = useTamboComponentState("borderRadius", borderRadius);
  const [currentPadding] = useTamboComponentState("padding", padding);
  const [currentMargin] = useTamboComponentState("margin", margin);
  const [currentBorderWidth] = useTamboComponentState("borderWidth", borderWidth);
  const [currentBorderColor] = useTamboComponentState("borderColor", borderColor);

  // Derive the actual form definition based on multiStep mode
  const actualFormDef = React.useMemo(() => {
    if (isMultiStep && currentMultiStepFormDef) {
      const currentStep = currentMultiStepFormDef.steps[stepIndex];
      return currentStep?.fields || [];
    }
    return currentFormDef || exampleForm;
  }, [isMultiStep, currentMultiStepFormDef, stepIndex, currentFormDef]);

  // Clamp step index within valid range when form definition changes
  useEffect(() => {
    if (isMultiStep && currentMultiStepFormDef) {
      const maxSteps = currentMultiStepFormDef.steps.length;
      if (stepIndex >= maxSteps) {
        setStepIndex(Math.max(0, maxSteps - 1));
      }
    }
  }, [isMultiStep, currentMultiStepFormDef?.steps.length, stepIndex]);

  // Initialize collapsed groups when form definition changes
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

  const handleNextStep = () => {
    if (isMultiStep && currentMultiStepFormDef) {
      const maxSteps = currentMultiStepFormDef.steps.length;
      if (stepIndex < maxSteps - 1) {
        setStepIndex(prev => prev + 1);
      }
    } else {
      if (stepIndex < actualFormDef.length - 1) {
        setStepIndex(prev => prev + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
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
    
    return <Field 
      key={key} 
      {...field} 
      backgroundColor={currentBackgroundColor} 
      textColor={currentTextColor}
      fontSize={currentFontSize}
      fontFamily={currentFontFamily}
    />;
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
              {section.fields.map((field: any, fIdx: number) => {
                return renderFormField(field, fIdx);
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

  const sectionsToRender = actualFormDef;

  const getSectionIndex = (renderIndex: number) => {
    return renderIndex;
  };

  // Generate dynamic styles from Tambo-controlled props
  const dynamicStyles: React.CSSProperties = React.useMemo(() => {
    const styles: React.CSSProperties = {};
    
    if (currentBackgroundColor) styles.backgroundColor = currentBackgroundColor;
    if (currentTextColor) styles.color = currentTextColor;
    if (currentFontSize) styles.fontSize = `${currentFontSize}px`;
    if (currentFontFamily) styles.fontFamily = currentFontFamily;
    if (currentBorderRadius) styles.borderRadius = `${currentBorderRadius}px`;
    if (currentPadding) styles.padding = `${currentPadding}px`;
    if (currentMargin) styles.margin = `${currentMargin}px`;
    if (currentBorderWidth) {
      styles.borderWidth = `${currentBorderWidth}px`;
      styles.borderStyle = 'solid';
    }
    if (currentBorderColor) styles.borderColor = currentBorderColor;
    
    return styles;
  }, [
    currentBackgroundColor,
    currentTextColor,
    currentFontSize,
    currentFontFamily,
    currentBorderRadius,
    currentPadding,
    currentMargin,
    currentBorderWidth,
    currentBorderColor
  ]);

  // Calculate step boundaries based on multiStep mode
  const { isFirstStep, isLastStep, totalSteps, currentStep } = React.useMemo(() => {
    if (isMultiStep && currentMultiStepFormDef) {
      const total = currentMultiStepFormDef.steps.length;
      return {
        isFirstStep: stepIndex === 0,
        isLastStep: stepIndex === total - 1,
        totalSteps: total,
        currentStep: stepIndex + 1
      };
    } else {
      const total = actualFormDef.length;
      return {
        isFirstStep: stepIndex === 0,
        isLastStep: stepIndex === total - 1,
        totalSteps: total,
        currentStep: stepIndex + 1
      };
    }
  }, [isMultiStep, currentMultiStepFormDef, stepIndex, actualFormDef.length]);

  // Get current step info for multi-step forms
  const currentStepInfo = React.useMemo(() => {
    if (isMultiStep && currentMultiStepFormDef) {
      return currentMultiStepFormDef.steps[stepIndex];
    }
    return null;
  }, [isMultiStep, currentMultiStepFormDef, stepIndex]);

  return (
    <TooltipProvider>
      <div className={cn(
        "w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200",
        "bg-white", // Always white background for forms
        "text-gray-900"
      )}
      style={dynamicStyles}
      >
        {isMultiStep && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gray-900 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
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
          
          <div className="flex items-center justify-center gap-4 mt-6">
            {isMultiStep && !isFirstStep && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all duration-200 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
            
            
            <div className={cn(
              "flex gap-3",
              !isMultiStep || isLastStep ? getButtonAlignmentClass(currentButtonsAlign) : "justify-end"
            )}>
              {isMultiStep && !isLastStep ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                // Show submit button on last step or for non-multistep forms
                <>
                  {currentButtons && currentButtons.length > 0 ? (
                    currentButtons
                      .filter(button => {
                        // Filter out navigation buttons on multistep forms
                        if (isMultiStep) {
                          const label = button.label.toLowerCase();
                          return !label.includes('previous') && !label.includes('next');
                        }
                        return true;
                      })
                      .map((button, idx) => (
                        <button
                          key={idx}
                          type={button.type}
                          className={cn(
                            "px-6 py-3 rounded-lg font-medium transition-all duration-200",
                            button.variant === "primary" ? "bg-gray-900 text-white hover:bg-gray-800" :
                            button.variant === "secondary" ? "bg-gray-200 text-gray-800 hover:bg-gray-300" :
                            button.variant === "outline" ? "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50" :
                            button.variant === "danger" ? "bg-red-600 text-white hover:bg-red-700" :
                            "bg-gray-900 text-white hover:bg-gray-800"
                          )}
                          onClick={(e) => handleButtonClick(button, e)}
                        >
                          {button.label}
                        </button>
                      ))
                  ) : (
                    <button type="submit" className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-200">
                      Submit
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
};