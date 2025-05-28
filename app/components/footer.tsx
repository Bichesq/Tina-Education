import Link from "next/link";

export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto w-[90%] max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/books"
                      className="text-gray-300 hover:text-white"
                    >
                      Books
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/journals"
                      className="text-gray-300 hover:text-white"
                    >
                      Journals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/articles"
                      className="text-gray-300 hover:text-white"
                    >
                      Articles
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Publishing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Editing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white">
                    Formatting
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Newsletter Sign Up</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="px-4 py-2 w-full"
                />
                <button className="bg-white text-gray-900 px-4 py-2">
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400">Copyright © 2025 - Tina Education</p>
          </div>
        </div>
      </footer>
    );
}