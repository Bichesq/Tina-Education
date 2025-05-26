"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ManuscriptViewer from "./ManuscriptViewer";
import ReviewForm from "./ReviewForm";
import ReviewProgress from "./ReviewProgress";
import CommunicationPanel from "./CommunicationPanel";

interface Review {
  id: string;
  manuscript: {
    title: string;
    user: {
      name: string;
    };
    type: string;
  };
  messages: Array<{
    id: string;
    content: string;
    sender: string;
    createdAt: string;
    user: {
      name: string;
      email: string;
    };
  }>;
  contentEvaluation?: string;
  styleEvaluation?: string;
  strengths?: string;
  weaknesses?: string;
  recommendation?: string;
  confidentialComments?: string;
  publicComments?: string;
  overallRating?: number;
  timeSpent?: number;
}

interface ReviewInterfaceProps {
  review: Review;
}

export default function ReviewInterface({ review }: ReviewInterfaceProps) {
  const [activeTab, setActiveTab] = useState("manuscript");
  const [reviewData, setReviewData] = useState({
    contentEvaluation: review.contentEvaluation || "",
    styleEvaluation: review.styleEvaluation || "",
    strengths: review.strengths || "",
    weaknesses: review.weaknesses || "",
    recommendation: review.recommendation || "",
    confidentialComments: review.confidentialComments || "",
    publicComments: review.publicComments || "",
    overallRating: review.overallRating || 3,
  });
  const [timeSpent, setTimeSpent] = useState(review.timeSpent || 0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const router = useRouter();

  // Track time spent on review
  useEffect(() => {
    setStartTime(new Date());

    const interval = setInterval(() => {
      if (startTime) {
        setTimeSpent((prev: number) => prev + 1);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startTime]);

  const handleSaveDraft = async () => {
    try {
      const response = await fetch(`/api/reviews/${review.id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reviewData,
          timeSpent,
          progressPercentage: calculateProgress(),
        }),
      });

      if (response.ok) {
        alert("Draft saved successfully!");
      } else {
        alert("Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewData.recommendation) {
      alert("Please provide a recommendation before submitting");
      return;
    }

    if (!reviewData.contentEvaluation || !reviewData.publicComments) {
      alert(
        "Please complete the content evaluation and public comments before submitting"
      );
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${review.id}/submit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reviewData,
          timeSpent,
          progressPercentage: 100,
          status: "REVIEW_SUBMITTED",
        }),
      });

      if (response.ok) {
        alert("Review submitted successfully!");
        router.push("/dashboard/reviews");
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  const calculateProgress = () => {
    const fields = [
      reviewData.contentEvaluation,
      reviewData.styleEvaluation,
      reviewData.strengths,
      reviewData.weaknesses,
      reviewData.recommendation,
      reviewData.publicComments,
    ];

    const completedFields = fields.filter(
      (field) => field && field.trim().length > 0
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const tabs = [
    { id: "manuscript", label: "📄 Manuscript", icon: "📄" },
    { id: "review", label: "📝 Review Form", icon: "📝" },
    { id: "communication", label: "💬 Communication", icon: "💬" },
    { id: "progress", label: "📊 Progress", icon: "📊" },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Review: {review.manuscript.title}
            </h1>
            <p className="text-sm text-gray-600">
              Author: {review.manuscript.user.name} • Type:{" "}
              {review.manuscript.type}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Time spent: {Math.floor(timeSpent / 60)}h {timeSpent % 60}m
            </div>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              💾 Save Draft
            </button>
            <button
              onClick={handleSubmitReview}
              className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
            >
              📤 Submit Review
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === "manuscript" && (
          <ManuscriptViewer manuscript={review.manuscript} />
        )}
        {activeTab === "review" && (
          <ReviewForm
            reviewData={reviewData}
            setReviewData={setReviewData}
            manuscript={review.manuscript}
          />
        )}
        {activeTab === "communication" && (
          <CommunicationPanel review={review} messages={review.messages} />
        )}
        {activeTab === "progress" && (
          <ReviewProgress
            review={review}
            progress={calculateProgress()}
            timeSpent={timeSpent}
          />
        )}
      </main>
    </div>
  );
}
