"use client";

import { withInteractable } from "@tambo-ai/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const stylingPanelSchema = z.object({
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

type StylingPanelProps = z.infer<typeof stylingPanelSchema>;

function StylingPanelBase(props: StylingPanelProps) {
  const [styles, setStyles] = useState<StylingPanelProps>(props);
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const prevPropsRef = useRef<StylingPanelProps>(props);

  // Update local state when props change from Tambo
  useEffect(() => {
    const prevProps = prevPropsRef.current;
    console.log("Styling props effect triggered");
    console.log("Previous props:", prevProps);
    console.log("Current props:", props);

    // Find which fields changed
    const changedFields = new Set<string>();

    // Check each field for changes
    Object.keys(props).forEach((key) => {
      const propKey = key as keyof StylingPanelProps;
      if (props[propKey] !== prevProps[propKey]) {
        changedFields.add(key);
        console.log(`${key} changed:`, prevProps[propKey], "->", props[propKey]);
      }
    });

    console.log("Changed fields:", Array.from(changedFields));

    // Update state and ref
    setStyles(props);
    prevPropsRef.current = props;

    if (changedFields.size > 0) {
      setUpdatedFields(changedFields);
      // Clear highlights after animation
      const timer = setTimeout(() => {
        setUpdatedFields(new Set());
        console.log("Cleared animation fields");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [props]);

  const handleChange = (field: keyof StylingPanelProps, value: string | number) => {
    setStyles((prev) => ({ ...prev, [field]: value }));
  };

  // Generate preview styles
  const previewStyles: React.CSSProperties = {
    backgroundColor: styles.backgroundColor || "#ffffff",
    color: styles.textColor || "#000000",
    fontSize: styles.fontSize ? `${styles.fontSize}px` : "16px",
    fontFamily: styles.fontFamily || "Arial, sans-serif",
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : "8px",
    padding: styles.padding ? `${styles.padding}px` : "16px",
    margin: styles.margin ? `${styles.margin}px` : "8px",
    borderWidth: styles.borderWidth ? `${styles.borderWidth}px` : "1px",
    borderColor: styles.borderColor || "#e5e7eb",
    borderStyle: "solid",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md dark:bg-zinc-800 dark:border dark:border-zinc-700">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Style Panel</h2>

      {/* Color Controls */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-zinc-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Colors</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.backgroundColor || "#ffffff"}
                  onChange={(e) => handleChange("backgroundColor", e.target.value)}
                  className={`w-12 h-10 rounded border border-gray-300 dark:border-zinc-600 ${
                    updatedFields.has("backgroundColor") ? "animate-pulse" : ""
                  }`}
                />
                <input
                  type="text"
                  value={styles.backgroundColor || ""}
                  onChange={(e) => handleChange("backgroundColor", e.target.value)}
                  placeholder="#ffffff"
                  className={`flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-700 dark:text-gray-100 ${
                    updatedFields.has("backgroundColor") ? "animate-pulse" : ""
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.textColor || "#000000"}
                  onChange={(e) => handleChange("textColor", e.target.value)}
                  className={`w-12 h-10 rounded border border-gray-300 dark:border-zinc-600 ${
                    updatedFields.has("textColor") ? "animate-pulse" : ""
                  }`}
                />
                <input
                  type="text"
                  value={styles.textColor || ""}
                  onChange={(e) => handleChange("textColor", e.target.value)}
                  placeholder="#000000"
                  className={`flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-700 dark:text-gray-100 ${
                    updatedFields.has("textColor") ? "animate-pulse" : ""
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Border Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.borderColor || "#e5e7eb"}
                  onChange={(e) => handleChange("borderColor", e.target.value)}
                  className={`w-12 h-10 rounded border border-gray-300 dark:border-zinc-600 ${
                    updatedFields.has("borderColor") ? "animate-pulse" : ""
                  }`}
                />
                <input
                  type="text"
                  value={styles.borderColor || ""}
                  onChange={(e) => handleChange("borderColor", e.target.value)}
                  placeholder="#e5e7eb"
                  className={`flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-700 dark:text-gray-100 ${
                    updatedFields.has("borderColor") ? "animate-pulse" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="border-b border-gray-200 dark:border-zinc-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Typography</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Size (px)
              </label>
              <input
                type="number"
                min="8"
                max="72"
                value={styles.fontSize || 16}
                onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-700 dark:text-gray-100 ${
                  updatedFields.has("fontSize") ? "animate-pulse" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Family
              </label>
              <select
                value={styles.fontFamily || "Arial, sans-serif"}
                onChange={(e) => handleChange("fontFamily", e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-700 dark:text-gray-100 ${
                  updatedFields.has("fontFamily") ? "animate-pulse" : ""
                }`}
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Courier New, monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="system-ui, sans-serif">System UI</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="border-b border-gray-200 dark:border-zinc-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Layout</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Border Radius (px)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={styles.borderRadius || 8}
                onChange={(e) => handleChange("borderRadius", parseInt(e.target.value))}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-700 dark:text-gray-100 ${
                  updatedFields.has("borderRadius") ? "animate-pulse" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Border Width (px)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={styles.borderWidth || 1}
                onChange={(e) => handleChange("borderWidth", parseInt(e.target.value))}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-700 dark:text-gray-100 ${
                  updatedFields.has("borderWidth") ? "animate-pulse" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Padding (px)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={styles.padding || 16}
                onChange={(e) => handleChange("padding", parseInt(e.target.value))}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-700 dark:text-gray-100 ${
                  updatedFields.has("padding") ? "animate-pulse" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Margin (px)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={styles.margin || 8}
                onChange={(e) => handleChange("margin", parseInt(e.target.value))}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-zinc-700 dark:text-gray-100 ${
                  updatedFields.has("margin") ? "animate-pulse" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Preview</h3>
          <div
            style={previewStyles}
            className="min-h-[100px] flex items-center justify-center"
          >
            <p>Sample text with applied styles</p>
          </div>
        </div>
      </div>

      {/* Current Styles Display */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-zinc-700 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Styles (JSON)
        </h4>
        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
          {JSON.stringify(styles, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// Create the interactable component
const InteractableStylingPanel = withInteractable(StylingPanelBase, {
  componentName: "StylingPanel",
  description: "Interactive styling panel for customizing colors, typography, and layout properties",
  propsSchema: stylingPanelSchema,
});

// Export a wrapper that provides default props and handles state
export function StylingPanel() {
  return (
    <InteractableStylingPanel
      backgroundColor="#ffffff"
      textColor="#000000"
      fontSize={16}
      fontFamily="Arial, sans-serif"
      borderRadius={8}
      padding={16}
      margin={8}
      borderWidth={1}
      borderColor="#e5e7eb"
      onPropsUpdate={(newProps) => {
        console.log("Styling updated from Tambo:", newProps);
      }}
    />
  );
}

export { stylingPanelSchema };