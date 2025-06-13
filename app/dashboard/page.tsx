import Link from "next/link";
import Greeting from "../components/greeting";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentManuscripts from "../components/dashboard/RecentManuscripts";
import RecentActivities from "../components/dashboard/RecentActivities";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="p-8 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <Greeting />
        <div className="flex gap-4">          
          <Link
            href="/manuscripts/new"
            className="px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
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
                Recent Manuscripts
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
        <RecentManuscripts />
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
            <div className="flex-1 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              [Views & Downloads Chart]
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 h-64 flex flex-col">
            <h3 className="font-bold text-gray-400 mb-5">
              Reader Demographics
            </h3>
            <div className="flex-1 bg-gray-100 rounded flex items-center justify-center text-gray-400">
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
                <p className="text-gray-400 text-sm">
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
                <p className="text-gray-400 text-sm">
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
                <p className="text-gray-400 text-sm">
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
    </div>
  );
}
