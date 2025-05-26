"use client";

import React, { useState } from "react";

// Simplified editor component - Slate dependencies not installed
// This is a placeholder until slate and slate-react are properly installed

interface SlateEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SlateEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
}: SlateEditorProps) {
  const [content, setContent] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Simple toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50">
        <div className="flex space-x-2">
          <button
            type="button"
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            onClick={() => {
              // Simple bold toggle - would need proper implementation with slate
              console.log("Bold clicked");
            }}
          >
            Bold
          </button>
          <button
            type="button"
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            onClick={() => {
              // Simple italic toggle - would need proper implementation with slate
              console.log("Italic clicked");
            }}
          >
            Italic
          </button>
        </div>
      </div>

      {/* Simple textarea - replace with proper Slate editor when dependencies are installed */}
      <textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-64 p-4 border-0 resize-none focus:outline-none focus:ring-0"
      />
    </div>
  );
}
