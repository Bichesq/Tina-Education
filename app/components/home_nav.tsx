"use client";
import Link from "next/link";
import AuthSect from "./authSect";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function HomeNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto w-[90%] max-w-7xl">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Tina Education
          </Link>
          <button
            className="text-gray-800 text-2xl md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:block absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none`}
          >
            <ul className="flex flex-col md:flex-row items-center">
              <li className="ml-0 md:ml-8">
                <Link href="/" className="text-gray-800 font-medium">
                  Home
                </Link>
              </li>
              
              <li className="ml-0 md:ml-8">
                <Link href="/books" className="text-gray-800 font-medium">
                  Books
                </Link>
              </li>
              <li className="ml-0 md:ml-8">
                <Link href="/journals" className="text-gray-800 font-medium">
                  Journals
                </Link>
              </li>
              <li className="ml-0 md:ml-8">
                <Link href="#" className="text-gray-800 font-medium">
                  Publisher with Us
                </Link>
              </li>
              <li className="ml-0 md:ml-8">
                <div className="flex justify-center items-center gap-5 mb-8 md:mb-0 relative text-gray-500">
                  <AuthSect />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
