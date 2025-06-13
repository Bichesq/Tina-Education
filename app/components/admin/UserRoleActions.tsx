"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserRoleActionsProps {
  userId: string;
  currentRole: string;
  userName: string;
}

export default function UserRoleActions({
  userId,
  currentRole,
  userName,
}: UserRoleActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = async (newRole: "USER" | "REVIEWER" | "ADMIN") => {
    if (isLoading || newRole === currentRole) return;

    const confirmMessage = `Are you sure you want to change ${userName}'s role from ${currentRole} to ${newRole}?`;
    
    if (!confirm(confirmMessage)) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user role");
      }

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {error && (
        <span className="text-xs text-red-600 mr-2">{error}</span>
      )}
      
      {/* Role Change Buttons */}
      {currentRole !== "USER" && (
        <button
          onClick={() => handleRoleChange("USER")}
          disabled={isLoading}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Make User"
        >
          {isLoading ? "..." : "👤"}
        </button>
      )}
      
      {currentRole !== "REVIEWER" && (
        <button
          onClick={() => handleRoleChange("REVIEWER")}
          disabled={isLoading}
          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
          title="Make Reviewer"
        >
          {isLoading ? "..." : "📖"}
        </button>
      )}
      
      {currentRole !== "ADMIN" && (
        <button
          onClick={() => handleRoleChange("ADMIN")}
          disabled={isLoading}
          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
          title="Make Admin"
        >
          {isLoading ? "..." : "👑"}
        </button>
      )}
    </div>
  );
}
