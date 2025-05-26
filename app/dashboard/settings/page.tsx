import { auth } from "@/auth";
import { prisma } from "../../../prisma";
import { Suspense } from "react";
import Image from "next/image";

async function SettingsContent() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-500">Please log in to access settings.</p>
      </div>
    );
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          User Not Found
        </h3>
        <p className="text-gray-500">Unable to load user settings.</p>
      </div>
    );
  }

  const settingsSections = [
    {
      id: "profile",
      title: "Profile Information",
      description: "Update your personal information and profile details",
      icon: "👤",
    },
    {
      id: "notifications",
      title: "Notification Preferences",
      description: "Manage how you receive notifications and alerts",
      icon: "🔔",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      description: "Control your privacy settings and account security",
      icon: "🔒",
    },
    {
      id: "preferences",
      title: "Writing Preferences",
      description: "Customize your writing environment and tools",
      icon: "✏️",
    },
    {
      id: "account",
      title: "Account Management",
      description: "Manage your account settings and subscription",
      icon: "⚙️",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.name || "Anonymous User"}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <span
              className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                user.role === "ADMIN"
                  ? "bg-red-100 text-red-800"
                  : user.role === "REVIEWER"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <span className="text-2xl">{section.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {section.description}
                </p>
                <button className="text-blue-900 hover:text-blue-700 font-medium text-sm">
                  Configure →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">
                Receive email updates about your manuscripts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Review Reminders</p>
              <p className="text-sm text-gray-500">
                Get reminded about pending reviews
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto-save Drafts</p>
              <p className="text-sm text-gray-500">
                Automatically save your work while writing
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-500">
                Use dark theme for the interface
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Actions
        </h3>
        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-xl">📥</span>
              <div>
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-500">
                  Download all your manuscripts and data
                </p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🔄</span>
              <div>
                <p className="font-medium text-gray-900">Reset Preferences</p>
                <p className="text-sm text-gray-500">
                  Reset all settings to default values
                </p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🗑️</span>
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-600">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Support */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
            <span className="text-2xl mr-3">📚</span>
            <div>
              <p className="font-medium text-gray-900">Documentation</p>
              <p className="text-sm text-gray-500">Browse our help docs</p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
            <span className="text-2xl mr-3">💬</span>
            <div>
              <p className="font-medium text-gray-900">Contact Support</p>
              <p className="text-sm text-gray-500">Get help from our team</p>
            </div>
          </button>

          <button className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
            <span className="text-2xl mr-3">🐛</span>
            <div>
              <p className="font-medium text-gray-900">Report Bug</p>
              <p className="text-sm text-gray-500">Report an issue</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsLoading() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and application settings
        </p>
      </div>

      <Suspense fallback={<SettingsLoading />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}
