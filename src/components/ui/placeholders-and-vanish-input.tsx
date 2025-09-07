"use client";

import { useState } from "react";

interface PlaceholdersAndVanishInputProps {
  placeholders: string[];
  onChange?: (value: string) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: PlaceholdersAndVanishInputProps) {
  const [activePlaceholderIndex, setActivePlaceholderIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const handleFocus = () => {
    setActivePlaceholderIndex(-1);
  };

  const handleBlur = () => {
    if (!inputValue.trim()) {
      setActivePlaceholderIndex(0);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={inputValue}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder=""
          />
          
          {activePlaceholderIndex >= 0 && (
            <div className="absolute left-4 top-3 text-gray-400 pointer-events-none select-none">
              {placeholders[activePlaceholderIndex]}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}