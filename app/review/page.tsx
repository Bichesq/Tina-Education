"use client";
import Link from "next/link";
import { useState } from "react";

export default function ReviewerWorkspace() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStars, setActiveStars] = useState(3);

  const openReviewWorkspace = () => setIsModalOpen(true);
  const closeReviewWorkspace = () => setIsModalOpen(false);

  const handleStarClick = (index: number) => {
    setActiveStars(index + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <Link
              href="/home"
              className="text-2xl font-bold text-gray-800 no-underline"
            >
              Tina Education
            </Link>
            <nav className="main-nav">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 font-medium hover:text-blue-900"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 font-medium hover:text-blue-900"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 font-medium hover:text-blue-900"
                  >
                    Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 font-medium hover:text-blue-900"
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-blue-900 font-bold hover:text-blue-900"
                  >
                    Reviewer Workspace
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-800 font-medium hover:text-blue-900"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="secondary-nav border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <ul className="flex py-4">
              <li className="mr-6">
                <Link
                  href="/dashboard"
                  className="text-gray-800 font-medium hover:text-blue-900"
                >
                  Dashboard
                </Link>
              </li>
              <li className="mr-6">
                <Link
                  href="#"
                  className="text-gray-800 font-medium hover:text-blue-900"
                >
                  Pending Requests
                </Link>
              </li>
              <li className="mr-6">
                <Link
                  href="#"
                  className="text-gray-800 font-medium hover:text-blue-900"
                >
                  Active Reviews
                </Link>
              </li>
              <li className="mr-6">
                <Link
                  href="#"
                  className="text-gray-800 font-medium hover:text-blue-900"
                >
                  Completed Reviews
                </Link>
              </li>
              <li className="mr-6">
                <Link
                  href="#"
                  className="text-gray-800 font-medium hover:text-blue-900"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Dashboard Section */}
      <section className="dashboard pt-32 pb-12">
        <div className="container mx-auto px-4 flex">
          {/* Sidebar */}
          <aside className="sidebar w-64 bg-white shadow-md fixed h-[calc(100vh-60px)] overflow-y-auto">
            <div className="sidebar-menu py-5">
              <ul>
                <li>
                  <Link
                    href="#"
                    className="flex items-center py-2 px-4 text-gray-800 font-medium bg-blue-50 text-blue-900 border-l-4 border-blue-900"
                  >
                    <span className="mr-2">📊</span>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                  >
                    <span className="mr-2">📚</span>
                    <span>My Publications</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                  >
                    <span className="mr-2">📝</span>
                    <span>Drafts</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/review"
                    className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                  >
                    <span className="mr-2">📋</span>
                    <span>Reviews</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                  >
                    <span className="mr-2">📈</span>
                    <span>Analytics</span>
                  </Link>
                </li>
              </ul>

              <div className="menu-section mt-5 pt-5 border-t border-gray-200">
                <h3 className="px-5 mb-4 text-gray-500 text-sm uppercase">
                  Collaboration
                </h3>
                <ul>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                    >
                      <span className="mr-2">👥</span>
                      <span>Co-authors</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                    >
                      <span className="mr-2">💬</span>
                      <span>Messages</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/notifications"
                      className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                    >
                      <span className="mr-2">🔔</span>
                      <span>Notifications</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="menu-section mt-5 pt-5 border-t border-gray-200">
                <h3 className="px-5 mb-4 text-gray-500 text-sm uppercase">
                  Resources
                </h3>
                <ul>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                    >
                      <span className="mr-2">📕</span>
                      <span>My Library</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                    >
                      <span className="mr-2">🧰</span>
                      <span>Writing Tools</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                    >
                      <span className="mr-2">📅</span>
                      <span>Calendar</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center py-2 px-4 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-4 hover:border-blue-900"
                    >
                      <span className="mr-2">⚙️</span>
                      <span>Settings</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content ml-64 pl-8 pr-4 w-[calc(100%-16rem)]">
            <div className="dashboard-header flex justify-between items-center mb-8">
              <div className="welcome-text">
                <h1 className="text-2xl text-gray-800 mb-2">
                  Welcome back, Dr. Johnson
                </h1>
                <p className="text-gray-600">
                  Here's an overview of your review activities
                </p>
              </div>
              <div className="date">
                <p className="text-gray-600">March 23, 2025</p>
              </div>
            </div>

            <div className="stats-cards grid grid-cols-4 gap-5 mb-8">
              <div className="stat-card bg-white p-5 rounded-lg shadow-sm text-center">
                <div className="card-icon text-2xl mb-2">📝</div>
                <h3 className="text-sm text-gray-600 mb-2">Pending Requests</h3>
                <p className="text-2xl font-bold text-blue-900">3</p>
              </div>
              <div className="stat-card bg-white p-5 rounded-lg shadow-sm text-center">
                <h3 className="text-sm text-gray-600 mb-2">Active Reviews</h3>
                <p className="text-2xl font-bold text-blue-900">4</p>
              </div>
              <div className="stat-card bg-white p-5 rounded-lg shadow-sm text-center">
                <h3 className="text-sm text-gray-600 mb-2">
                  Completed Reviews
                </h3>
                <p className="text-2xl font-bold text-blue-900">27</p>
              </div>
              <div className="stat-card bg-white p-5 rounded-lg shadow-sm text-center">
                <h3 className="text-sm text-gray-600 mb-2">Due This Week</h3>
                <p className="text-2xl font-bold text-blue-900">2</p>
              </div>
            </div>

            <div className="pending-requests mb-10">
              <div className="section-header flex justify-between items-center mb-5">
                <h2 className="text-xl text-gray-800">
                  Pending Review Requests
                </h2>
                <div className="filter-options">
                  <select className="px-4 py-2 border border-gray-300 rounded bg-white">
                    <option>All Types</option>
                    <option>Books</option>
                    <option>Journals</option>
                    <option>Articles</option>
                  </select>
                </div>
              </div>

              <div className="requests-grid grid grid-cols-2 gap-5 mb-10">
                {/* Request Card 1 */}
                <div className="request-card bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="request-header px-5 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-base text-gray-800">
                      Advanced Educational Psychology
                    </h3>
                    <span className="request-type px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-800">
                      Book
                    </span>
                  </div>
                  <div className="request-content p-5">
                    <div className="request-meta flex text-sm text-gray-600 mb-4">
                      <div className="author mr-5">
                        Author:{" "}
                        <span className="font-bold text-gray-800">
                          Maria Garcia
                        </span>
                      </div>
                      <div className="deadline">
                        Requested by:{" "}
                        <span className="font-bold text-gray-800">
                          April 15, 2025
                        </span>
                      </div>
                    </div>
                    <div className="request-description text-sm text-gray-700 mb-5 leading-relaxed">
                      <p>
                        A comprehensive textbook on educational psychology
                        focusing on learning theories and their practical
                        applications in modern classrooms.
                      </p>
                    </div>
                    <div className="request-actions flex gap-3">
                      <button className="btn btn-primary px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
                        Accept
                      </button>
                      <button className="btn btn-secondary px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        Decline
                      </button>
                    </div>
                  </div>
                </div>

                {/* Request Card 2 */}
                <div className="request-card bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="request-header px-5 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-base text-gray-800">
                      Cognitive Development in Digital Age
                    </h3>
                    <span className="request-type px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-800">
                      Journal
                    </span>
                  </div>
                  <div className="request-content p-5">
                    <div className="request-meta flex text-sm text-gray-600 mb-4">
                      <div className="author mr-5">
                        Author:{" "}
                        <span className="font-bold text-gray-800">
                          James Wilson
                        </span>
                      </div>
                      <div className="deadline">
                        Requested by:{" "}
                        <span className="font-bold text-gray-800">
                          April 10, 2025
                        </span>
                      </div>
                    </div>
                    <div className="request-description text-sm text-gray-700 mb-5 leading-relaxed">
                      <p>
                        Research paper examining the impact of digital
                        technologies on cognitive development in children aged
                        5-12 years.
                      </p>
                    </div>
                    <div className="request-actions flex gap-3">
                      <button className="btn btn-primary px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
                        Accept
                      </button>
                      <button className="btn btn-secondary px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        Decline
                      </button>
                    </div>
                  </div>
                </div>

                {/* Request Card 3 */}
                <div className="request-card bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="request-header px-5 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-base text-gray-800">
                      Teaching Mathematics Through Project-Based Learning
                    </h3>
                    <span className="request-type px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-800">
                      Article
                    </span>
                  </div>
                  <div className="request-content p-5">
                    <div className="request-meta flex text-sm text-gray-600 mb-4">
                      <div className="author mr-5">
                        Author:{" "}
                        <span className="font-bold text-gray-800">
                          Sarah Ahmed
                        </span>
                      </div>
                      <div className="deadline">
                        Requested by:{" "}
                        <span className="font-bold text-gray-800">
                          April 5, 2025
                        </span>
                      </div>
                    </div>
                    <div className="request-description text-sm text-gray-700 mb-5 leading-relaxed">
                      <p>
                        An exploration of effective project-based learning
                        approaches for teaching mathematics in middle and high
                        school settings.
                      </p>
                    </div>
                    <div className="request-actions flex gap-3">
                      <button className="btn btn-primary px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
                        Accept
                      </button>
                      <button className="btn btn-secondary px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="active-reviews mb-10">
              <div className="section-header flex justify-between items-center mb-5">
                <h2 className="text-xl text-gray-800">Active Reviews</h2>
                <div className="filter-options">
                  <select className="px-4 py-2 border border-gray-300 rounded bg-white">
                    <option>All Status</option>
                    <option>In Progress</option>
                    <option>Due Soon</option>
                  </select>
                </div>
              </div>

              <div className="review-cards grid grid-cols-3 gap-5">
                {/* Review Card 1 */}
                <div className="review-card bg-white rounded-lg shadow-sm overflow-hidden relative">
                  <span className="review-status absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600">
                    Due in 2 days
                  </span>
                  <div className="review-img h-32 bg-teal-800 flex justify-center items-center text-white font-bold">
                    Book Cover
                  </div>
                  <div className="review-content p-5">
                    <h3 className="text-base text-gray-800 mb-2">
                      The Future of STEM Education
                    </h3>
                    <p className="text-sm text-gray-600">Author: Robert Chen</p>
                    <p className="text-sm text-gray-600">Due: March 25, 2025</p>
                    <div className="progress-bar h-1.5 bg-gray-200 rounded-full my-4">
                      <div
                        className="progress-fill h-full bg-blue-900 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Progress: 75% complete
                    </p>
                    <button
                      onClick={openReviewWorkspace}
                      className="btn btn-primary mt-3 px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 w-full"
                    >
                      Continue Review
                    </button>
                  </div>
                </div>

                {/* Review Card 2 */}
                <div className="review-card bg-white rounded-lg shadow-sm overflow-hidden relative">
                  <span className="review-status absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600">
                    In Progress
                  </span>
                  <div className="review-img h-32 bg-teal-800 flex justify-center items-center text-white font-bold">
                    Journal Cover
                  </div>
                  <div className="review-content p-5">
                    <h3 className="text-base text-gray-800 mb-2">
                      Inclusive Education Strategies
                    </h3>
                    <p className="text-sm text-gray-600">
                      Author: Lisa Johnson
                    </p>
                    <p className="text-sm text-gray-600">Due: April 3, 2025</p>
                    <div className="progress-bar h-1.5 bg-gray-200 rounded-full my-4">
                      <div
                        className="progress-fill h-full bg-blue-900 rounded-full"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Progress: 30% complete
                    </p>
                    <button className="btn btn-primary mt-3 px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 w-full">
                      Continue Review
                    </button>
                  </div>
                </div>

                {/* Review Card 3 */}
                <div className="review-card bg-white rounded-lg shadow-sm overflow-hidden relative">
                  <span className="review-status absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600">
                    In Progress
                  </span>
                  <div className="review-img h-32 bg-teal-800 flex justify-center items-center text-white font-bold">
                    Article Cover
                  </div>
                  <div className="review-content p-5">
                    <h3 className="text-base text-gray-800 mb-2">
                      Digital Literacy for Educators
                    </h3>
                    <p className="text-sm text-gray-600">Author: David Kim</p>
                    <p className="text-sm text-gray-600">Due: April 10, 2025</p>
                    <div className="progress-bar h-1.5 bg-gray-200 rounded-full my-4">
                      <div
                        className="progress-fill h-full bg-blue-900 rounded-full"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Progress: 45% complete
                    </p>
                    <button className="btn btn-primary mt-3 px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 w-full">
                      Continue Review
                    </button>
                  </div>
                </div>

                {/* Review Card 4 */}
                <div className="review-card bg-white rounded-lg shadow-sm overflow-hidden relative">
                  <span className="review-status absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                    Due Tomorrow
                  </span>
                  <div className="review-img h-32 bg-teal-800 flex justify-center items-center text-white font-bold">
                    Book Cover
                  </div>
                  <div className="review-content p-5">
                    <h3 className="text-base text-gray-800 mb-2">
                      Assessment Techniques in Higher Education
                    </h3>
                    <p className="text-sm text-gray-600">Author: Emily Wong</p>
                    <p className="text-sm text-gray-600">Due: March 24, 2025</p>
                    <div className="progress-bar h-1.5 bg-gray-200 rounded-full my-4">
                      <div
                        className="progress-fill h-full bg-blue-900 rounded-full"
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Progress: 90% complete
                    </p>
                    <button className="btn btn-primary mt-3 px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 w-full">
                      Continue Review
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="resources mb-10">
              <div className="section-header flex justify-between items-center mb-5">
                <h2 className="text-xl text-gray-800">Reviewer Resources</h2>
              </div>

              <div className="resources-grid grid grid-cols-3 gap-5">
                {/* Resource Card 1 */}
                <div className="resource-card bg-white rounded-lg shadow-sm p-5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-base text-gray-800 mb-2">
                    Reviewer Guidelines
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Standard guidelines and best practices for conducting
                    effective reviews.
                  </p>
                  <Link
                    href="#"
                    className="btn btn-secondary inline-block px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    View Guidelines
                  </Link>
                </div>

                {/* Resource Card 2 */}
                <div className="resource-card bg-white rounded-lg shadow-sm p-5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-base text-gray-800 mb-2">
                    Evaluation Criteria
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Detailed criteria for evaluating different types of
                    educational materials.
                  </p>
                  <Link
                    href="#"
                    className="btn btn-secondary inline-block px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    View Criteria
                  </Link>
                </div>

                {/* Resource Card 3 */}
                <div className="resource-card bg-white rounded-lg shadow-sm p-5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-base text-gray-800 mb-2">
                    Review Templates
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Standardized templates to help structure your review
                    feedback.
                  </p>
                  <Link
                    href="#"
                    className="btn btn-secondary inline-block px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    View Templates
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="footer-content grid grid-cols-2 gap-8">
            <div className="footer-left">
              <div className="quick-links">
                <h3 className="text-lg mb-4">Quick Links</h3>
                <ul>
                  <li className="mb-2">
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="#" className="text-gray-300 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Books
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Reviewer Resources
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-right">
              <div className="services mb-6">
                <h3 className="text-lg mb-4">Services</h3>
                <ul>
                  <li className="mb-2">
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Publishing
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Editing
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Formatting
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Peer Review
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="newsletter">
                <h3 className="text-lg mb-4">News Letter Sign up</h3>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    className="px-4 py-2 w-3/4 border-none focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-200">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>Copyright © 2025 - Tina Education</p>
          </div>
        </div>
      </footer>

      {/* Review Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal bg-white w-11/12 max-w-4xl rounded-lg overflow-hidden">
            <div className="modal-header px-6 py-4 bg-blue-900 text-white flex justify-between items-center">
              <h2 className="text-xl">
                The Future of STEM Education - Review Workspace
              </h2>
              <button
                onClick={closeReviewWorkspace}
                className="text-2xl bg-transparent border-none text-white"
              >
                &times;
              </button>
            </div>
            <div className="modal-body px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="review-workspace grid grid-cols-2 gap-6">
                <div className="document-viewer bg-gray-50 p-5 rounded-lg h-[500px] overflow-y-auto">
                  <h3 className="text-lg font-medium mb-3">
                    Chapter 1: The Evolution of STEM Education
                  </h3>
                  <p className="mb-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam in dui mauris. Vivamus hendrerit arcu sed erat
                    molestie vehicula. Sed auctor neque eu tellus rhoncus ut
                    eleifend nibh porttitor. Ut in nulla enim. Phasellus
                    molestie magna non est bibendum non venenatis nisl tempor.
                  </p>
                  <p className="mb-3">
                    Suspendisse in orci enim. Donec suscipit ante in hendrerit
                    placerat. Etiam commodo suscipit diam, vel aliquam nisi
                    mattis vitae. In lacinia condimentum auctor. Integer ut
                    tempus metus. Vivamus consequat felis vel magna suscipit ut
                    pretium mi molestie.
                  </p>
                  <h4 className="text-md font-medium mb-2">
                    1.1 Historical Context
                  </h4>
                  <p className="mb-3">
                    Vestibulum ante ipsum primis in faucibus orci luctus et
                    ultrices posuere cubilia Curae; Ut vel bibendum urna. Nulla
                    facilisi. Aenean iaculis aliquet turpis, vel eleifend mauris
                    eleifend vel. Quisque vestibulum fringilla leo, eget pretium
                    justo tempor vitae.
                  </p>
                  <p className="mb-3">
                    Cras auctor sagittis neque, vel hendrerit metus placerat
                    quis. Sed non eros ut lacus dignissim pellentesque.
                    Suspendisse potenti. Nulla facilisi. Etiam tincidunt enim
                    eget nisi interdum, vel condimentum sapien maximus.
                  </p>
                  <h4 className="text-md font-medium mb-2">
                    1.2 Current Landscape
                  </h4>
                  <p className="mb-3">
                    Nullam convallis, odio ac varius facilisis, magna dolor
                    pharetra sem, sit amet fermentum enim ex eget nisi. Etiam
                    tincidunt, arcu in pharetra tempus, tellus mauris sodales
                    odio, vel consequat quam diam eget nisi.
                  </p>
                </div>
                <div className="review-form">
                  <h3 className="text-lg font-medium mb-4">Your Review</h3>
                  <div className="rating-section mb-4">
                    <p className="mb-2">Overall Rating:</p>
                    <div className="rating-select flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`star text-2xl cursor-pointer ${
                            star <= activeStars
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => handleStarClick(star - 1)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="content-evaluation" className="block mb-2">
                      Content Evaluation:
                    </label>
                    <textarea
                      id="content-evaluation"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Evaluate the accuracy, relevance, and depth of the content..."
                      rows={5}
                    ></textarea>
                  </div>
                  <div className="form-group mb-4">
                    <label
                      htmlFor="presentation-evaluation"
                      className="block mb-2"
                    >
                      Style & Presentation:
                    </label>
                    <textarea
                      id="presentation-evaluation"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Evaluate writing style, organization, and clarity..."
                      rows={5}
                    ></textarea>
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="strengths" className="block mb-2">
                      Strengths:
                    </label>
                    <textarea
                      id="strengths"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Note major strengths of the material..."
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="weaknesses" className="block mb-2">
                      Areas for Improvement:
                    </label>
                    <textarea
                      id="weaknesses"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Suggest areas that need improvement..."
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button className="btn btn-secondary px-5 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Save Draft
              </button>
              <button className="btn btn-primary px-5 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
