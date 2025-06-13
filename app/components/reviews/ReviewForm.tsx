"use client";

import { useState } from "react";

interface ReviewData {
  contentEvaluation: string;
  styleEvaluation: string;
  strengths: string;
  weaknesses: string;
  recommendation: string;
  confidentialComments: string;
  publicComments: string;
  overallRating: number;
}

interface Manuscript {
  id: string;
  title: string;
  abstract: string;
  content: string;
}

interface ReviewFormProps {
  reviewData: ReviewData;
  setReviewData: React.Dispatch<React.SetStateAction<ReviewData>>;
  manuscript: Manuscript;
}

export default function ReviewForm({
  reviewData,
  setReviewData,
}: ReviewFormProps) {
  const [activeSection, setActiveSection] = useState("evaluation");

  const handleInputChange = (field: string, value: string | number) => {
    setReviewData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRatingClick = (rating: number) => {
    handleInputChange("overallRating", rating);
  };

  const recommendations = [
    {
      value: "ACCEPT",
      label: "Accept",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      value: "MINOR_REVISIONS",
      label: "Minor Revisions",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      value: "MAJOR_REVISIONS",
      label: "Major Revisions",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    {
      value: "REJECT",
      label: "Reject",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  ];

  const sections = [
    { id: "evaluation", label: "Evaluation", icon: "📋" },
    { id: "feedback", label: "Feedback", icon: "💭" },
    { id: "recommendation", label: "Recommendation", icon: "⭐" },
    { id: "comments", label: "Comments", icon: "💬" },
  ];

  return (
    <div className="h-full flex">
      {/* Section Navigation */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Review Sections
        </h3>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === section.id
                  ? "bg-blue-100 text-blue-900 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>

        {/* Progress Indicator */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Completion Status
          </h4>
          <div className="space-y-2 text-xs">
            <div
              className={`flex items-center ${reviewData.contentEvaluation ? "text-green-600" : "text-gray-400"}`}
            >
              <span className="mr-2">
                {reviewData.contentEvaluation ? "✅" : "⭕"}
              </span>
              Content Evaluation
            </div>
            <div
              className={`flex items-center ${reviewData.styleEvaluation ? "text-green-600" : "text-gray-400"}`}
            >
              <span className="mr-2">
                {reviewData.styleEvaluation ? "✅" : "⭕"}
              </span>
              Style Evaluation
            </div>
            <div
              className={`flex items-center ${reviewData.strengths ? "text-green-600" : "text-gray-400"}`}
            >
              <span className="mr-2">{reviewData.strengths ? "✅" : "⭕"}</span>
              Strengths
            </div>
            <div
              className={`flex items-center ${reviewData.weaknesses ? "text-green-600" : "text-gray-400"}`}
            >
              <span className="mr-2">
                {reviewData.weaknesses ? "✅" : "⭕"}
              </span>
              Areas for Improvement
            </div>
            <div
              className={`flex items-center ${reviewData.recommendation ? "text-green-600" : "text-gray-400"}`}
            >
              <span className="mr-2">
                {reviewData.recommendation ? "✅" : "⭕"}
              </span>
              Recommendation
            </div>
            <div
              className={`flex items-center ${reviewData.publicComments ? "text-green-600" : "text-gray-400"}`}
            >
              <span className="mr-2">
                {reviewData.publicComments ? "✅" : "⭕"}
              </span>
              Public Comments
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeSection === "evaluation" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Manuscript Evaluation
            </h2>

            {/* Overall Rating */}
            <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overall Rating
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    className={`text-3xl transition-colors ${
                      star <= reviewData.overallRating
                        ? "text-yellow-400 hover:text-yellow-500"
                        : "text-gray-300 hover:text-gray-400"
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-4 text-sm text-gray-600">
                  {reviewData.overallRating}/5 stars
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Rate the overall quality of this manuscript (1 = Poor, 5 =
                Excellent)
              </p>
            </div>

            {/* Content Evaluation */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Content Evaluation
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Evaluate the accuracy, relevance, depth, and scholarly merit of
                the content.
              </p>
              <textarea
                value={reviewData.contentEvaluation}
                onChange={(e) =>
                  handleInputChange("contentEvaluation", e.target.value)
                }
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-500"
                placeholder="Assess the content quality, accuracy of information, depth of analysis, relevance to the field, and contribution to existing knowledge..."
              />
            </div>

            {/* Style Evaluation */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Style & Presentation
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Evaluate writing style, organization, clarity, and presentation
                quality.
              </p>
              <textarea
                value={reviewData.styleEvaluation}
                onChange={(e) =>
                  handleInputChange("styleEvaluation", e.target.value)
                }
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-500"
                placeholder="Comment on writing clarity, organization structure, flow of ideas, grammar, formatting, and overall presentation..."
              />
            </div>
          </div>
        )}

        {activeSection === "feedback" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Detailed Feedback
            </h2>

            {/* Strengths */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Strengths
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Highlight the major strengths and positive aspects of the
                manuscript.
              </p>
              <textarea
                value={reviewData.strengths}
                onChange={(e) => handleInputChange("strengths", e.target.value)}
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-500"
                placeholder="Note the manuscript's key strengths, innovative aspects, well-executed sections, and valuable contributions..."
              />
            </div>

            {/* Areas for Improvement */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Areas for Improvement
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Identify specific areas that need improvement and provide
                constructive suggestions.
              </p>
              <textarea
                value={reviewData.weaknesses}
                onChange={(e) =>
                  handleInputChange("weaknesses", e.target.value)
                }
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-500"
                placeholder="Provide specific, constructive feedback on areas that need improvement, methodological concerns, gaps in analysis, or presentation issues..."
              />
            </div>
          </div>
        )}

        {activeSection === "recommendation" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Final Recommendation
            </h2>

            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Select your recommendation:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec) => (
                  <button
                    key={rec.value}
                    onClick={() =>
                      handleInputChange("recommendation", rec.value)
                    }
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      reviewData.recommendation === rec.value
                        ? `${rec.color} border-current`
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold">{rec.label}</div>
                    <div className="text-sm mt-1 opacity-75">
                      {rec.value === "ACCEPT" &&
                        "Manuscript is ready for publication"}
                      {rec.value === "MINOR_REVISIONS" &&
                        "Small changes needed before acceptance"}
                      {rec.value === "MAJOR_REVISIONS" &&
                        "Significant revisions required"}
                      {rec.value === "REJECT" &&
                        "Manuscript not suitable for publication"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "comments" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

            {/* Public Comments */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Comments for Author
              </label>
              <p className="text-sm text-gray-600 mb-4">
                These comments will be shared with the author. Provide
                constructive feedback and suggestions.
              </p>
              <textarea
                value={reviewData.publicComments}
                onChange={(e) =>
                  handleInputChange("publicComments", e.target.value)
                }
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-500"
                placeholder="Provide detailed feedback for the author, including specific suggestions for improvement, questions, and recommendations..."
              />
            </div>

            {/* Confidential Comments */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Confidential Comments for Editor
              </label>
              <p className="text-sm text-gray-600 mb-4">
                These comments are only for the editor and will not be shared
                with the author.
              </p>
              <textarea
                value={reviewData.confidentialComments}
                onChange={(e) =>
                  handleInputChange("confidentialComments", e.target.value)
                }
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-500"
                placeholder="Share any concerns, questions, or additional context that should only be seen by the editor..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
