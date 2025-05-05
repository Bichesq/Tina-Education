
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomeNav(session: { user: { name: string; }; }) {

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
                    About Us
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
                    Publisher with Us
                  </Link>
                </li>

                <li className="ml-8">
                  <div className="flex justify-center gap-5 mb-8 relative text-gray-500">
                    {!session && (
                      <>
                        <button
                          className="px-5 py-2 border border-black rounded text-gray-800 hover:bg-black hover:text-white hover:bg-opacity-10 transition-colors"
                          onClick={() => signIn("github")}
                        >
                          Sign In
                        </button>
                        <Link href={"/signup"}>
                          <button className="px-5 py-2 border border-white rounded bg-blue-900 text-white hover:bg-black">
                            Sign up
                          </button>
                        </Link>
                      </>
                    )}
                    {session && (
                      <>
                        <span className="text-gray-800 font-medium">
                          {session?.user?.name || "Guest"}
                        </span>
                        <button
                          onClick={() => signOut()}
                          className="px-5 py-2 border border-black rounded text-gray-800 hover:bg-black hover:text-white hover:bg-opacity-10 transition-colors"
                        >
                          Sign out
                        </button>
                      </>
                    )}
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    
  );
}
