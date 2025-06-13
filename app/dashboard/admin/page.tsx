import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminStats from "../../components/admin/AdminStats";
import ReviewerApplications from "../../components/admin/ReviewerApplications";
import UserManagement from "../../components/admin/UserManagement";

async function checkAdminAccess(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Failed to check admin access:", error);
    return false;
  }
}

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const isAdmin = await checkAdminAccess(session.user.id);
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-500 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, review applications, and monitor system statistics
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <Suspense fallback={<AdminStatsLoading />}>
            <AdminStats />
          </Suspense>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reviewer Applications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Reviewer Applications
              </h2>
              <p className="text-gray-600 mt-1">
                Review and approve pending applications
              </p>
            </div>
            <div className="p-6">
              <Suspense fallback={<ApplicationsLoading />}>
                <ReviewerApplications />
              </Suspense>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                User Management
              </h2>
              <p className="text-gray-600 mt-1">
                Manage user roles and permissions
              </p>
            </div>
            <div className="p-6">
              <Suspense fallback={<UserManagementLoading />}>
                <UserManagement />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/dashboard/admin/users"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">👥</span>
              <div>
                <h3 className="font-medium text-blue-900">All Users</h3>
                <p className="text-sm text-blue-700">Manage all users</p>
              </div>
            </a>
            
            <a
              href="/dashboard/admin/manuscripts"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3">📄</span>
              <div>
                <h3 className="font-medium text-green-900">Manuscripts</h3>
                <p className="text-sm text-green-700">Review submissions</p>
              </div>
            </a>
            
            <a
              href="/dashboard/admin/reviews"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mr-3">📖</span>
              <div>
                <h3 className="font-medium text-purple-900">Reviews</h3>
                <p className="text-sm text-purple-700">Monitor reviews</p>
              </div>
            </a>
            
            <a
              href="/dashboard/admin/settings"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl mr-3">⚙️</span>
              <div>
                <h3 className="font-medium text-gray-900">Settings</h3>
                <p className="text-sm text-gray-700">System settings</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsLoading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}

function UserManagementLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}
