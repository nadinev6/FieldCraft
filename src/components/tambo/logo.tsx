"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { z } from "zod";

// Zod schema for Logo component props
export const logoSchema = z.object({
  imageUrl: z.string().url().describe("URL of the logo image to display"),
  altText: z.string().optional().default("Logo").describe("Alternative text for the logo image"),
  shape: z.enum(["rounded", "square", "circle"]).optional().default("square").describe("Shape of the logo (rounded corners, square, or circular)"),
  alignment: z.enum(["left", "center", "right"]).optional().default("center").describe("Horizontal alignment of the logo within its container"),
  size: z.enum(["sm", "md", "lg", "xl"]).optional().default("md").describe("Size of the logo"),
  containerClass: z.string().optional().describe("Additional CSS classes for the logo container"),
});

export type LogoProps = z.infer<typeof logoSchema>;

// Helper function to get alignment classes
const getAlignmentClass = (alignment: "left" | "center" | "right") => {
  switch (alignment) {
    case "left": return "justify-start";
    case "center": return "justify-center";
    case "right": return "justify-end";
    default: return "justify-center";
  }
};

// Helper function to get shape classes
const getShapeClass = (shape: "rounded" | "square" | "circle") => {
  switch (shape) {
    case "rounded": return "rounded-lg";
    case "square": return "rounded-none";
    case "circle": return "rounded-full";
    default: return "rounded-none";
  }
};

// Helper function to get size classes
const getSizeClass = (size: "sm" | "md" | "lg" | "xl") => {
  switch (size) {
    case "sm": return "w-16 h-16";
    case "md": return "w-24 h-24";
    case "lg": return "w-32 h-32";
    case "xl": return "w-48 h-48";
    default: return "w-24 h-24";
  }
};

/**
 * Logo component for displaying images with customizable shape and alignment
 * @component
 * @example
 * ```tsx
 * <Logo
 *   imageUrl="https://example.com/logo.png"
 *   shape="rounded"
 *   alignment="center"
 *   size="lg"
 *   altText="Company Logo"
 * />
 * ```
 */
export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ imageUrl, altText, shape, alignment, size, containerClass, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoading, setImageLoading] = React.useState(true);

    const handleImageLoad = () => {
      setImageLoading(false);
      setImageError(false);
    };

    const handleImageError = () => {
      setImageLoading(false);
      setImageError(true);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full py-4",
          getAlignmentClass(alignment || "center"),
          containerClass
        )}
        {...props}
      >
        <div className="relative">
          {imageLoading && (
            <div
              className={cn(
                "animate-pulse bg-gray-200 dark:bg-gray-700",
                getSizeClass(size || "md"),
                getShapeClass(shape || "square")
              )}
            />
          )}
          
          {imageError ? (
            <div
              className={cn(
                "flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600",
                getSizeClass(size || "md"),
                getShapeClass(shape || "square")
              )}
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 text-gray-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs text-gray-500">Failed to load</p>
              </div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={altText}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={cn(
                "object-cover transition-opacity duration-200",
                getSizeClass(size || "md"),
                getShapeClass(shape || "square"),
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
          )}
        </div>
      </div>
    );
  }
);

Logo.displayName = "Logo";