import { prisma } from "../../../prisma";
import ReviewerApplicationActions from "./ReviewerApplicationActions";

async function getReviewerApplications() {
  try {
    const applications = await prisma.reviewerApplication.findMany({
      where: {
        status: {
          in: ["PENDING", "UNDER_REVIEW"],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            affiliation: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10, // Show latest 10 applications
    });

    return applications;
  } catch (error) {
    console.error("Failed to fetch reviewer applications:", error);
    return [];
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getStatusInfo(status: string) {
  switch (status) {
    case "PENDING":
      return {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏳",
      };
    case "UNDER_REVIEW":
      return {
        label: "Under Review",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "🔍",
      };
    case "APPROVED":
      return {
        label: "Approved",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✅",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "❌",
      };
    default:
      return {
        label: "Unknown",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "❓",
      };
  }
}

export default async function ReviewerApplications() {
  const applications = await getReviewerApplications();

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Pending Applications
        </h3>
        <p className="text-gray-500">
          All reviewer applications have been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const status = getStatusInfo(application.status);
        
        return (
          <div
            key={application.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900">
                    {application.user.name || "Unnamed User"}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}
                  >
                    {status.icon} {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {application.user.email}
                </p>
                {application.user.affiliation && (
                  <p className="text-sm text-gray-500">
                    {application.user.affiliation}
                  </p>
                )}
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Applied</p>
                <p>{formatDate(application.createdAt)}</p>
              </div>
            </div>

            {/* Expertise Preview */}
            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-700 mb-1">
                Areas of Expertise:
              </h5>
              <p className="text-sm text-gray-600 line-clamp-2">
                {application.expertise}
              </p>
            </div>

            {/* Motivation Preview */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-1">
                Motivation:
              </h5>
              <p className="text-sm text-gray-600 line-clamp-2">
                {application.motivation}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <a
                href={`/dashboard/admin/applications/${application.id}`}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View Full Application
              </a>
              
              <ReviewerApplicationActions
                applicationId={application.id}
                currentStatus={application.status}
                applicantName={application.user.name || application.user.email}
              />
            </div>
          </div>
        );
      })}

      {/* View All Link */}
      <div className="text-center pt-4 border-t border-gray-200">
        <a
          href="/dashboard/admin/applications"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          View All Applications →
        </a>
      </div>
    </div>
  );
}
