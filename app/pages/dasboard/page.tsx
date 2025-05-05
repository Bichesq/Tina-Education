import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* side bar */}
      <div className="flex pt-20 min-h-screen">
        <aside className="fixed w-64 bg-white shadow-md h-[calc(100vh-5rem)] overflow-y-auto">
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
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, John!
            </h1>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl mb-4">
                📚
              </div>
              <h3 className="text-2xl text-gray-400 font-bold mb-1">15</h3>
              <p className="text-gray-600 text-sm">Total Publications</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl mb-4">
                👁️
              </div>
              <h3 className="text-2xl text-gray-400 font-bold mb-1">2,458</h3>
              <p className="text-gray-600 text-sm">Total Views</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl mb-4">
                ⬇️
              </div>
              <h3 className="text-2xl text-gray-400 font-bold mb-1">350</h3>
              <p className="text-gray-600 text-sm">Downloads</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl mb-4">
                📝
              </div>
              <h3 className="text-2xl text-gray-400 font-bold mb-1">3</h3>
              <p className="text-gray-600 text-sm">Pending Reviews</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Publications
              </h2>
              <Link href="#" className="text-blue-900 font-medium">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-40 bg-teal-700 relative">
                  <div className="absolute top-2 right-2 px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                    Published
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-400 mb-2">
                    Modern Teaching Methodologies
                  </h3>
                  <div className="flex justify-between text-gray-600 text-sm mb-4">
                    <span>Mar 15, 2025</span>
                    <span>786 views</span>
                  </div>
                  <div className="flex justify-between">
                    <Link
                      href="#"
                      className="text-blue-900 font-medium text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      href="#"
                      className="text-blue-900 font-medium text-sm"
                    >
                      View Stats
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-40 bg-teal-700 relative">
                  <div className="absolute top-2 right-2 px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-medium">
                    Draft
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-400 mb-2">
                    Digital Learning Platforms
                  </h3>
                  <div className="flex justify-between text-gray-600 text-sm mb-4">
                    <span>Mar 10, 2025</span>
                    <span>Last edited 2d ago</span>
                  </div>
                  <div className="flex justify-between">
                    <Link
                      href="#"
                      className="text-blue-900 font-medium text-sm"
                    >
                      Continue Editing
                    </Link>
                    <Link
                      href="#"
                      className="text-blue-900 font-medium text-sm"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-40 bg-teal-700 relative">
                  <div className="absolute top-2 right-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                    Under Review
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-400 mb-2">
                    Curriculum Development Strategies
                  </h3>
                  <div className="flex justify-between text-gray-600 text-sm mb-4">
                    <span>Mar 8, 2025</span>
                    <span>2 reviews pending</span>
                  </div>
                  <div className="flex justify-between">
                    <Link
                      href="#"
                      className="text-blue-900 font-medium text-sm"
                    >
                      Check Status
                    </Link>
                    <Link
                      href="#"
                      className="text-blue-900 font-medium text-sm"
                    >
                      View Comments
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

          <div className="mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                Recent Activities
              </h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="mt-4">
                <div className="flex mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-900 mr-4">
                    📝
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-400 mb-1">
                      New Review Received
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Dr. Sarah Johnson reviewed your paper "Modern Teaching
                      Methodologies"
                    </p>
                    <span className="text-gray-400 text-xs mt-1 block">
                      2 hours ago
                    </span>
                  </div>
                </div>

                <div className="flex mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-900 mr-4">
                    👥
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-400 mb-1">
                      Co-author Request
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Prof. Michael Chen wants to collaborate on "Digital
                      Learning Platforms"
                    </p>
                    <span className="text-gray-400 text-xs mt-1 block">
                      Yesterday
                    </span>
                  </div>
                </div>

                <div className="flex mb-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-900 mr-4">
                    ⬇️
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-400 mb-1">
                      Download Milestone
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Your publication "Assessment Techniques" reached 100
                      downloads
                    </p>
                    <span className="text-gray-400 text-xs mt-1 block">
                      2 days ago
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-900 mr-4">
                    🔔
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-500 mb-1">
                      Upcoming Conference
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Reminder: EdTech Global Summit 2025 registration closes
                      soon
                    </p>
                    <span className="text-gray-400 text-xs mt-1 block">
                      3 days ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
