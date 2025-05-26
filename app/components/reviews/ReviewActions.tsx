"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewActionsProps {
  reviewId: string;
  status: string;
  manuscriptTitle: string;
}

export default function ReviewActions({ reviewId, status, manuscriptTitle }: ReviewActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<"ACCEPT_ASSIGNMENT" | "DECLINE_ASSIGNMENT" | null>(null);
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleAction = (selectedAction: "ACCEPT_ASSIGNMENT" | "DECLINE_ASSIGNMENT") => {
    setAction(selectedAction);
    setShowModal(true);
  };

  const submitAssignmentResponse = async () => {
    if (!action) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          reason: reason.trim() || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const actionText = action === "ACCEPT_ASSIGNMENT" ? "accepted" : "declined";
        alert(`Assignment ${actionText} successfully! The author has been notified.`);

        // Refresh the page to show updated status
        router.refresh();
        setShowModal(false);
        setReason("");
        setAction(null);
      } else {
        alert(`Error: ${data.error || "Failed to respond to assignment"}`);
      }
    } catch (error) {
      console.error("Error responding to assignment:", error);
      alert("Failed to respond to assignment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setReason("");
    setAction(null);
  };

  if (status !== "PENDING") {
    return null;
  }

  return (
    <>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleAction("ACCEPT_ASSIGNMENT")}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✅ Accept Assignment
        </button>
        <button
          onClick={() => handleAction("DECLINE_ASSIGNMENT")}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ❌ Decline Assignment
        </button>
      </div>

      {/* Assignment Response Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {action === "ACCEPT_ASSIGNMENT" ? "Accept" : "Decline"} Review
              Assignment
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              You are about to{" "}
              <strong>
                {action === "ACCEPT_ASSIGNMENT" ? "accept" : "decline"}
              </strong>{" "}
              the review assignment for:
              <br />
              <em>&quot;{manuscriptTitle}&quot;</em>
            </p>

            {action === "ACCEPT_ASSIGNMENT" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>By accepting:</strong> You will gain access to the
                  manuscript and review platform where you can evaluate the work
                  and submit your review report.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Reason/Note Textarea */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {action === "ACCEPT_ASSIGNMENT" ? "Note" : "Decline Reason"}{" "}
                  <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    action === "ACCEPT_ASSIGNMENT"
                      ? "Add any notes or comments..."
                      : "Please provide a reason for declining..."
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitAssignmentResponse}
                disabled={isLoading}
                className={`px-4 py-2 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  action === "ACCEPT_ASSIGNMENT"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isLoading
                  ? "Submitting..."
                  : `${action === "ACCEPT_ASSIGNMENT" ? "Accept" : "Decline"} Assignment`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
