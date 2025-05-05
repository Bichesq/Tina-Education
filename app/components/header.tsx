import Link from "next/link";

export default function Header() {
    return (
      <header className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto w-[90%] max-w-7xl">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Tina Education
            </Link>
            <nav>
              <ul className="flex items-center">
                <li className="ml-8">
                  <Link href="/" className="text-gray-800 font-medium">
                    Home
                  </Link>
                </li>
                <li className="ml-8">
                  <Link href="#" className="text-gray-800 font-medium">
                    Books
                  </Link>
                </li>
                <li className="ml-8">
                  <Link href="#" className="text-gray-800 font-medium">
                    Journals
                  </Link>
                </li>
                <li className="ml-8">
                  <Link href="#" className="text-gray-800 font-medium">
                    Publishers
                  </Link>
                </li>
                <li className="ml-8">
                  <div className="relative group">
                    <button className="flex items-center text-gray-800 font-medium py-3 px-4 -ml-4">
                      Notifications
                    </button>
                    <div className="hidden group-hover:block absolute bg-gray-50 min-w-40 shadow-lg rounded">
                      <ul className="py-1">
                        <li className="px-4 py-2 border-b border-gray-100 text-gray-800">
                          You have a new review to check.
                        </li>
                        <li className="px-4 py-2 border-b border-gray-100 text-gray-800">
                          New message from John Doe.
                        </li>
                        <li className="px-4 py-2 text-gray-800">
                          System update available.
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li className="ml-8">
                  <div className="relative">
                    <Link
                      href="/logout"
                      className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold"
                    >
                      JD
                    </Link>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    );
}
