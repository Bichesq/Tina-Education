import Link from "next/link";
import { auth } from "@/auth";
import Greeting from "../components/greeting";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentPublications from "../components/dashboard/RecentPublications";
import RecentActivities from "../components/dashboard/RecentActivities";
import { Suspense } from "react";

export default async function Dashboard() {
  const session = await auth();
  if (!session) {
    return <div>Please log in to access the dashboard.</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* side bar */}
      <div className="flex pt-15 min-h-screen">
        <aside className="fixed w-64 bg-white shadow-md h-[calc(100vh-3rem)] overflow-y-auto">
          <div className="py-5">
            <ul>
              <li className="mb-1">
                <Link
                  href="#"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900 bg-blue-50 text-blue-900 border-l-3 border-blue-900"
                >
                  <span className="mr-3 text-lg">📊</span>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  href="/publications"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                >
                  <span className="mr-3 text-lg">📚</span>
                  <span>My Publications</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  href="#"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                >
                  <span className="mr-3 text-lg">📝</span>
                  <span>Drafts</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  href="/review"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                >
                  <span className="mr-3 text-lg">📋</span>
                  <span>Reviews</span>
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  href="#"
                  className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                >
                  <span className="mr-3 text-lg">📈</span>
                  <span>Analytics</span>
                </Link>
              </li>
            </ul>

            <div className="mt-5 pt-5 border-t border-gray-200">
              <h3 className="px-5 mb-4 text-gray-500 text-sm uppercase">
                Collaboration
              </h3>
              <ul>
                <li className="mb-1">
                  <Link
                    href="#"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">👥</span>
                    <span>Co-authors</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="#"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">💬</span>
                    <span>Messages</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="/notifications"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">🔔</span>
                    <span>Notifications</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-200">
              <h3 className="px-5 mb-4 text-gray-500 text-sm uppercase">
                Resources
              </h3>
              <ul>
                <li className="mb-1">
                  <Link
                    href="#"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">📕</span>
                    <span>My Library</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="#"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">🧰</span>
                    <span>Writing Tools</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="#"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">📅</span>
                    <span>Calendar</span>
                  </Link>
                </li>
                <li className="mb-1">
                  <Link
                    href="#"
                    className="flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900"
                  >
                    <span className="mr-3 text-lg">⚙️</span>
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-8">
          <div className="flex justify-between items-center mb-8">
            <Greeting />
            <div className="flex gap-4">
              <button className="px-5 py-2 bg-white text-blue-900 border border-blue-900 rounded">
                Import Content
              </button>
              <Link
                href="/manuscripts"
                className="px-5 py-2 bg-blue-900 text-white rounded"
              >
                Create New
              </Link>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm p-5 animate-pulse"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-200 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2 w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            }
          >
            <DashboardStats />
          </Suspense>

          <Suspense
            fallback={
              <div className="mb-8">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Publications
                  </h2>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                    >
                      <div className="h-40 bg-gray-200"></div>
                      <div className="p-5">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <RecentPublications />
          </Suspense>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                Analytics Overview
              </h2>
              <Link href="#" className="text-blue-900 font-medium">
                Detailed Reports
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-white rounded-lg shadow-sm p-5 col-span-2 h-64 flex flex-col">
                <h3 className="font-bold text-gray-400 mb-5">
                  Publication Performance
                </h3>
                <div className="flex-1 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  [Views & Downloads Chart]
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 h-64 flex flex-col">
                <h3 className="font-bold text-gray-400 mb-5">
                  Reader Demographics
                </h3>
                <div className="flex-1 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  [Demographics Chart]
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                Upcoming Deadlines
              </h2>
              <Link href="#" className="text-blue-900 font-medium">
                View Calendar
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="mt-4">
                <div className="flex mb-4 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center mr-4">
                    <span className="text-lg font-bold text-blue-900">25</span>
                    <span className="text-xs text-blue-900">Mar</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-400 mb-1">
                      Conference Paper Submission
                    </h4>
                    <p className="text-gray-600 text-sm">
                      EdTech Global Summit 2025
                    </p>
                  </div>
                </div>

                <div className="flex mb-4 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center mr-4">
                    <span className="text-lg font-bold text-blue-900">02</span>
                    <span className="text-xs text-blue-900">Apr</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-400 mb-1">
                      Peer Review Deadline
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Educational Psychology Journal
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex flex-col items-center justify-center mr-4">
                    <span className="text-lg font-bold text-blue-900">15</span>
                    <span className="text-xs text-blue-900">Apr</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-400 mb-1">
                      Book Chapter Draft
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Modern Teaching Anthology
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="mb-8">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Activities
                  </h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-5">
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-4 animate-pulse"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          >
            <RecentActivities />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
