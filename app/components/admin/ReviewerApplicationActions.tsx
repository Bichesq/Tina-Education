"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewerApplicationActionsProps {
  applicationId: string;
  currentStatus: string;
  applicantName: string;
}

export default function ReviewerApplicationActions({
  applicationId,
  currentStatus,
  applicantName,
}: ReviewerApplicationActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async (action: "APPROVE" | "REJECT" | "UNDER_REVIEW") => {
    if (isLoading) return;

    const confirmMessage = 
      action === "APPROVE" 
        ? `Are you sure you want to approve ${applicantName}'s reviewer application?`
        : action === "REJECT"
        ? `Are you sure you want to reject ${applicantName}'s reviewer application?`
        : `Mark ${applicantName}'s application as under review?`;

    if (!confirm(confirmMessage)) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/reviewer-applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update application");
      }

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStatus === "APPROVED" || currentStatus === "REJECTED") {
    return (
      <span className="text-sm text-gray-500">
        {currentStatus === "APPROVED" ? "✅ Approved" : "❌ Rejected"}
      </span>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
      
      {currentStatus === "PENDING" && (
        <button
          onClick={() => handleAction("UNDER_REVIEW")}
          disabled={isLoading}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
        >
          {isLoading ? "..." : "Review"}
        </button>
      )}
      
      <button
        onClick={() => handleAction("APPROVE")}
        disabled={isLoading}
        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
      >
        {isLoading ? "..." : "Approve"}
      </button>
      
      <button
        onClick={() => handleAction("REJECT")}
        disabled={isLoading}
        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
      >
        {isLoading ? "..." : "Reject"}
      </button>
    </div>
  );
}
