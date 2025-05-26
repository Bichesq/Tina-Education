"use client";

import { useState } from "react";

interface ManuscriptViewerProps {
  manuscript: {
    id: string;
    title: string;
    abstract: string;
    content: string;
    keywords: string;
    type: string;
    pdfFile: string;
    user: {
      name: string | null;
      email: string;
    };
  };
}

export default function ManuscriptViewer({
  manuscript,
}: ManuscriptViewerProps) {
  const [viewMode, setViewMode] = useState<"content" | "pdf">("content");
  const [fontSize, setFontSize] = useState(16);

  const handleDownloadPDF = () => {
    if (manuscript.pdfFile) {
      window.open(manuscript.pdfFile, "_blank");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Viewer Controls */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="flex bg-white rounded-lg border border-gray-300">
            <button
              onClick={() => setViewMode("content")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === "content"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              📄 Text View
            </button>
            <button
              onClick={() => setViewMode("pdf")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === "pdf"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              📋 PDF View
            </button>
          </div>

          {viewMode === "content" && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Font Size:</span>
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                A-
              </button>
              <span className="text-sm text-gray-600">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                A+
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {manuscript.pdfFile && (
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              📥 Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {viewMode === "content" ? (
          <div
            className="max-w-4xl mx-auto p-8"
            style={{ fontSize: `${fontSize}px` }}
          >
            {/* Manuscript Header */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {manuscript.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <strong>Author:</strong> {manuscript.user.name || "Unknown"}
                </div>
                <div>
                  <strong>Type:</strong> {manuscript.type}
                </div>
                <div className="md:col-span-2">
                  <strong>Keywords:</strong> {manuscript.keywords}
                </div>
              </div>
            </div>

            {/* Abstract */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Abstract
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {manuscript.abstract}
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Content
              </h2>
              <div className="prose prose-lg max-w-none">
                <div
                  className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: manuscript.content }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100">
            {manuscript.pdfFile ? (
              <iframe
                src={manuscript.pdfFile}
                className="w-full h-full border-0"
                title={`PDF: ${manuscript.title}`}
              />
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-lg">No PDF file available</p>
                <p className="text-sm">
                  Please use the text view to read the manuscript
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
