import Image from "next/image";
import Link from "next/link";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 py-6 min-h-screen">
      {/* Secondary Navigation */}
      <div className="bg-white border-t border-b border-gray-200">
        <div className="w-11/12 max-w-6xl mx-auto">
          <ul className="flex py-4">
            <li className="mr-8">
              <Link href="#" className="text-gray-800 font-medium">
                Books
              </Link>
            </li>
            <li className="mr-8">
              <Link href="#" className="text-gray-800 font-medium">
                Authors
              </Link>
            </li>
            <li className="mr-8">
              <Link href="#" className="text-gray-800 font-medium">
                Journals
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16 text-center">
        <div className="w-11/12 max-w-6xl mx-auto">
          <h1 className="text-3xl mb-4">Enhance the Author in you.</h1>
          <p className="text-lg mb-8">
            Access eBooks, Journals, and tools to help up your craft.
          </p>

          <div className="max-w-lg mx-auto my-8">
            <input
              type="text"
              className="w-full px-4 py-3 rounded-full text-base text-gray-800 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search Authors, Books and Journals"
            />
          </div>

          <div className="flex justify-center gap-5 mb-8">
            <a
              href="#"
              className="px-5 py-2 border border-white rounded text-white hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Get Started
            </a>
            <a
              href="#"
              className="px-5 py-2 border border-white rounded bg-gray-200 text-gray-800"
            >
              Explore Journals
            </a>
            <a
              href="#"
              className="px-5 py-2 border border-white rounded text-white hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Explore eBooks
            </a>
          </div>

          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="w-2 h-2 rounded-full bg-white bg-opacity-50"></span>
            <span className="w-2 h-2 rounded-full bg-white bg-opacity-50"></span>
            <span className="w-2 h-2 rounded-full bg-white bg-opacity-50"></span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="w-11/12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-400 p-8 rounded hover:transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <h3 className="text-lg font-medium">Custom eBook Library</h3>
            </div>
            <div className="bg-gray-400 p-8 rounded hover:transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <h3 className="text-lg font-medium">
                Peer-to-Peer Review Process
              </h3>
            </div>
            <div className="bg-gray-400 p-8 rounded hover:transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <h3 className="text-lg font-medium">Writing Resources</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-8">
        <div className="w-11/12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div className="flex bg-gray-100 text-gray-800">
              <div className="w-3/5">
                <Image
                  className="w-full"
                  src="/images/The Marital Journey cover.jpg"
                  alt="The Marital Journey"
                  width={135}
                  height={145}
                />
              </div>
              <div className="w-2/5 self-center p-5">
                <h3 className="font-medium">The Marital Journey</h3>
                <p>Nkwain Sam</p>
              </div>
            </div>
            <div className="flex bg-gray-100 text-gray-800">
              <div className="w-3/5 h-48 bg-teal-700"></div>
              <div className="w-2/5 self-center p-5">
                <h3 className="font-medium">Title</h3>
                <p>Author</p>
              </div>
            </div>
            <div className="flex bg-gray-100">
              <div className="w-3/5 h-48 bg-teal-700"></div>
              <div className="w-2/5 self-center p-5">
                <h3 className="font-medium">Title</h3>
                <p>Author</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-5">
            <span className="w-2 h-2 rounded-full bg-gray-800"></span>
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            <div className="flex bg-gray-100">
              <div className="w-3/5 h-48 bg-teal-700"></div>
              <div className="w-2/5 self-center p-5">
                <h3 className="font-medium">Title</h3>
                <p>Author</p>
              </div>
            </div>
            <div className="flex bg-gray-100">
              <div className="w-3/5 h-48 bg-teal-700"></div>
              <div className="w-2/5 self-center p-5">
                <h3 className="font-medium">Title</h3>
                <p>Author</p>
              </div>
            </div>
            <div className="flex bg-gray-100">
              <div className="w-3/5 h-48 bg-teal-700"></div>
              <div className="w-2/5 self-center p-5">
                <h3 className="font-medium">Title</h3>
                <p>Author</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution Section */}
      <section className="py-12 text-center">
        <div className="w-11/12 max-w-6xl mx-auto">
          <h2 className="text-2xl font-medium mb-6">Contribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-gray-200 h-64 rounded"></div>
            <div className="text-right">
              <p>Description on the flow users support their work</p>
              <a
                href="#"
                className="inline-block mt-5 px-5 py-2 border border-gray-800 rounded text-gray-800"
              >
                Publisher Area
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
