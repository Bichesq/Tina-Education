import { auth } from "@/auth";
import { prisma } from "../../prisma";
import { redirect } from "next/navigation";
import ReviewerApplicationForm from "../components/reviewer/ReviewerApplicationForm";

async function checkExistingApplication(userId: string) {
  try {
    const application = await prisma.reviewerApplication.findUnique({
      where: { userId },
    });
    return application;
  } catch (error) {
    console.error("Failed to check existing application:", error);
    return null;
  }
}

async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        affiliation: true,
        expertise: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export default async function ReviewerApplicationPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await getUser(session.user.id);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            User Not Found
          </h3>
          <p className="text-gray-500">Unable to load user information.</p>
        </div>
      </div>
    );
  }

  // Check if user is already a reviewer or admin
  if (user.role === "REVIEWER" || user.role === "ADMIN") {
    redirect("/dashboard/reviews");
  }

  // Check if user has already applied
  const existingApplication = await checkExistingApplication(session.user.id);
  
  if (existingApplication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Application Already Submitted
          </h3>
          <p className="text-gray-500 mb-6">
            You have already submitted a reviewer application. The status of your application is:
          </p>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            existingApplication.status === "PENDING" 
              ? "bg-yellow-100 text-yellow-800"
              : existingApplication.status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : existingApplication.status === "UNDER_REVIEW"
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800"
          }`}>
            {existingApplication.status === "PENDING" && "⏳ Pending Review"}
            {existingApplication.status === "APPROVED" && "✅ Approved"}
            {existingApplication.status === "UNDER_REVIEW" && "🔍 Under Review"}
            {existingApplication.status === "REJECTED" && "❌ Rejected"}
          </div>
          <div className="space-y-3">
            <a
              href="/dashboard/reviews"
              className="block w-full px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Go to Reviews
            </a>
            <a
              href="/dashboard"
              className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Apply to Become a Reviewer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of expert reviewers and help maintain the quality of academic publications. 
            Your expertise and insights are valuable to the scholarly community.
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Reviewer Requirements
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Advanced degree (Master's or PhD) in relevant field</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Demonstrated expertise in your area of specialization</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Commitment to timely and thorough manuscript reviews</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Adherence to ethical standards and confidentiality</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Availability to review 2-4 manuscripts per month</span>
            </li>
          </ul>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Application Form
            </h2>
            <p className="text-gray-600 mt-1">
              Please provide detailed information about your qualifications and experience
            </p>
          </div>
          
          <div className="p-6">
            <ReviewerApplicationForm user={user} />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            What Happens Next?
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <span className="mr-3 text-blue-600">1.</span>
              <span>Your application will be reviewed by our administrative team</span>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-blue-600">2.</span>
              <span>We may contact you for additional information or clarification</span>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-blue-600">3.</span>
              <span>You will receive an email notification about the decision</span>
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-blue-600">4.</span>
              <span>If approved, you will be granted reviewer access and receive training materials</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
