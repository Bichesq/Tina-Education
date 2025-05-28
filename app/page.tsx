import Link from "next/link";
import React from "react";
import FeaturedPublications from "./components/home/FeaturedPublications";

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Secondary Navigation */}
      <div className="bg-white border-b mt-18 border-gray-200 shadow-sm">
        <div className="container mx-auto w-[90%] max-w-7xl">
          <ul className="flex py-4 space-x-8">
            <li>
              <Link
                href="/books"
                className="text-gray-800 font-medium hover:text-blue-900 transition-colors"
              >
                Books
              </Link>
            </li>
            <li>
              <Link
                href="/articles"
                className="text-gray-800 font-medium hover:text-blue-900 transition-colors"
              >
                Articles
              </Link>
            </li>
            <li>
              <Link
                href="/journals"
                className="text-gray-800 font-medium hover:text-blue-900 transition-colors"
              >
                Journals
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto w-[90%] max-w-7xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Enhance the Author in You
          </h1>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Access eBooks, Journals, and professional tools to elevate your
            writing craft and connect with the academic community.
          </p>

          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                className="w-full px-6 py-4 rounded-lg text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
                placeholder="Search Authors, Books and Journals..."
              />
              <button className="absolute right-2 top-2 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white text-blue-900 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="#journals"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-900 transition-colors"
            >
              Explore Journals
            </Link>
            <Link
              href="#books"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-900 transition-colors"
            >
              Explore eBooks
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto w-[90%] max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Tina Education?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the tools and resources that make academic publishing and
              collaboration seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center text-2xl mb-6">
                📚
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Custom eBook Library
              </h3>
              <p className="text-gray-600">
                Build and manage your personal digital library with advanced
                organization tools and seamless access across devices.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-green-50 text-green-900 rounded-lg flex items-center justify-center text-2xl mb-6">
                📋
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Peer-to-Peer Review Process
              </h3>
              <p className="text-gray-600">
                Engage in collaborative academic review with structured feedback
                systems and transparent evaluation processes.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-purple-50 text-purple-900 rounded-lg flex items-center justify-center text-2xl mb-6">
                ✍️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Writing Resources
              </h3>
              <p className="text-gray-600">
                Access comprehensive writing tools, templates, and guidelines to
                enhance your academic writing and publication success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Publications Section */}
      <FeaturedPublications />

      {/* Call to Action Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto w-[90%] max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Academic Journey?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community of researchers, authors, and academics. Share
              your work, collaborate with peers, and advance your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center text-3xl mb-6 mx-auto">
                🚀
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                For Authors & Researchers
              </h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Publish your research and manuscripts
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Access peer review networks
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Build your academic profile
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Connect with the academic community
                </li>
              </ul>
              <div className="text-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
                >
                  Start Publishing
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="w-16 h-16 bg-green-50 text-green-900 rounded-lg flex items-center justify-center text-3xl mb-6 mx-auto">
                📖
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                For Readers & Reviewers
              </h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Access extensive academic library
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Participate in peer review process
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Discover latest research
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  Support academic excellence
                </li>
              </ul>
              <div className="text-center">
                <Link
                  href="/dashboard/reviews"
                  className="inline-flex items-center px-6 py-3 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
                >
                  Start Reviewing
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
