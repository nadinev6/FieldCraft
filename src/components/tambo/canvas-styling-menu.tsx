"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Paintbrush2 } from "lucide-react";
import * as React from "react";
import { useState, useRef, useEffect } from "react";

interface CanvasStylingMenuProps {
  onBackgroundChange?: (backgroundClass: string) => void;
  className?: string;
}

const backgroundOptions = [
  {
    name: "Default",
    class: "bg-white/50 backdrop-blur-sm",
    preview: "bg-white border-2 border-gray-200",
  },
  {
    name: "Clean White",
    class: "bg-white",
    preview: "bg-white border-2 border-gray-200",
  },
  {
    name: "Light Gray",
    class: "bg-gray-50",
    preview: "bg-gray-50 border-2 border-gray-200",
  },
  {
    name: "Soft Green",
    class: "bg-green-50/80",
    preview: "bg-green-50 border-2 border-green-200",
  },
  {
    name: "Soft Blue",
    class: "bg-blue-50/80",
    preview: "bg-blue-50 border-2 border-blue-200",
  },
  {
    name: "Warm Cream",
    class: "bg-amber-50/60",
    preview: "bg-amber-50 border-2 border-amber-200",
  },
];

export function CanvasStylingMenu({ onBackgroundChange, className }: CanvasStylingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(backgroundOptions[0]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionSelect = (option: typeof backgroundOptions[0]) => {
    setSelectedOption(option);
    onBackgroundChange?.(option.class);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex size-8 cursor-default items-center justify-center rounded-full transition-all [&_svg]:size-4",
          "text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50",
          isOpen && "text-zinc-950 dark:text-zinc-50"
        )}
        aria-label="Canvas styling options"
        title="Canvas styling"
      >
        <Paintbrush2 />
        {isOpen && (
          <motion.div
            layoutId="canvas-styling-option"
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
            className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700"
          />
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-10 right-0 z-50 min-w-[200px] rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-lg p-2"
        >
          <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 px-2 py-1 mb-1">
            Canvas Background
          </div>
          <div className="space-y-1">
            {backgroundOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => handleOptionSelect(option)}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-2 rounded-md text-left text-sm transition-colors",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  selectedOption.name === option.name && "bg-zinc-100 dark:bg-zinc-800"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-sm",
                    option.preview
                  )}
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {option.name}
                </span>
                {selectedOption.name === option.name && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-zinc-600 dark:bg-zinc-400" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}