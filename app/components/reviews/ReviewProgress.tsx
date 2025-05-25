"use client";

interface ReviewProgressProps {
  review: any;
  progress: number;
  timeSpent: number;
}

export default function ReviewProgress({ review, progress, timeSpent }: ReviewProgressProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Pending Assignment", color: "bg-yellow-100 text-yellow-800", icon: "⏳" };
      case "ACCEPTED":
        return { label: "Assignment Accepted", color: "bg-green-100 text-green-800", icon: "✅" };
      case "IN_REVIEW":
        return { label: "In Review", color: "bg-blue-100 text-blue-800", icon: "📖" };
      case "REVIEW_SUBMITTED":
        return { label: "Review Submitted", color: "bg-purple-100 text-purple-800", icon: "📤" };
      default:
        return { label: "Unknown", color: "bg-gray-100 text-gray-800", icon: "❓" };
    }
  };

  const statusInfo = getStatusInfo(review.status);

  const progressSteps = [
    { id: 1, name: "Assignment Received", completed: true },
    { id: 2, name: "Assignment Accepted", completed: review.status !== "PENDING" },
    { id: 3, name: "Review in Progress", completed: ["IN_REVIEW", "REVIEW_SUBMITTED"].includes(review.status) },
    { id: 4, name: "Review Submitted", completed: review.status === "REVIEW_SUBMITTED" },
  ];

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Review Progress</h2>

        {/* Current Status */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              <span className="mr-2">{statusInfo.icon}</span>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Review Timeline</h3>
          <div className="space-y-4">
            {progressSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {step.completed ? "✓" : step.id}
                </div>
                <div className="ml-4 flex-1">
                  <p className={`text-sm font-medium ${
                    step.completed ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {step.name}
                  </p>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className={`absolute left-4 mt-8 w-0.5 h-4 ${
                    step.completed ? "bg-green-500" : "bg-gray-200"
                  }`} style={{ marginLeft: "15px" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Completion Progress */}
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Progress</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Review Form Completion</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Complete all required sections to submit your review.
          </p>
        </div>

        {/* Time Tracking */}
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatTime(timeSpent)}
              </div>
              <div className="text-sm text-gray-600">Total Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {review.revisionRound}
              </div>
              <div className="text-sm text-gray-600">Revision Round</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {review.overallRating || "—"}
              </div>
              <div className="text-sm text-gray-600">Current Rating</div>
            </div>
          </div>
        </div>

        {/* Review Details */}
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <strong className="text-gray-900">Manuscript:</strong>
              <p className="text-gray-600 mt-1">{review.manuscript.title}</p>
            </div>
            <div>
              <strong className="text-gray-900">Author:</strong>
              <p className="text-gray-600 mt-1">{review.manuscript.user.name}</p>
            </div>
            <div>
              <strong className="text-gray-900">Type:</strong>
              <p className="text-gray-600 mt-1">{review.manuscript.type}</p>
            </div>
            <div>
              <strong className="text-gray-900">Assigned:</strong>
              <p className="text-gray-600 mt-1">{formatDate(review.createdAt)}</p>
            </div>
            <div>
              <strong className="text-gray-900">Last Updated:</strong>
              <p className="text-gray-600 mt-1">{formatDate(review.updatedAt)}</p>
            </div>
            <div>
              <strong className="text-gray-900">Review ID:</strong>
              <p className="text-gray-600 mt-1 font-mono text-xs">{review.id}</p>
            </div>
          </div>
        </div>

        {/* Guidelines Reminder */}
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Review Guidelines</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Provide constructive, specific feedback that helps improve the manuscript</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Evaluate content accuracy, methodology, and contribution to the field</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Comment on writing quality, organization, and presentation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Be respectful and professional in all feedback</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use the communication panel for questions or concerns about the review process</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
