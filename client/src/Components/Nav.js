import React, { useState } from 'react';
import { UserButton, useUser } from "@clerk/clerk-react";
import { FaChevronDown } from 'react-icons/fa';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser(); 

  if (!isLoaded) return null;

  return (
    <div className="relative z-50">
      <nav className="w-full top-0 z-50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/bicapslogo.png" className="h-10 w-auto" alt="Bicaps Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Bicaps</span>
          </a>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className={`fixed top-0 right-0 h-full w-4/5 bg-white dark:bg-gray-1000 shadow-lg transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} duration-1000 ease-in-out`}>
              <div className="p-4 flex flex-col h-full">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 dark:text-gray-400 self-end"
                >
                  <span className="sr-only">Close menu</span>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l12 12M1 13L13 1"
                    />
                  </svg>
                </button>
                {/* mobile nav */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ul className="flex flex-col w-full text-center">
                    <li className="text-lg my-2">
                      <a href="/" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Home</a>
                    </li>
                    <li className="text-lg my-2 relative group">
                      <a href="#" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                        Add <FaChevronDown className="inline ml-1"/>
                      </a>
                      <ul className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg hidden group-hover:block z-60">
                        <li className="text-lg my-2">
                          <a href="/addproject" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Add Projects</a>
                        </li>
                        <li className="text-lg my-2">
                          <a href="/add" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Add Clients</a>
                        </li>
                      </ul>
                    </li>
                    <li className="text-lg my-2 relative group">
                      <a href="#" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                        New <FaChevronDown className="inline ml-1"/>
                      </a>
                      <ul className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg hidden group-hover:block z-60">
                        <li className="text-lg my-2">
                          <a href="/new" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>New Clients</a>
                        </li>
                        <li className="text-lg my-2">
                          <a href="/entity" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>New Entity</a>
                        </li>
                        <li className="text-lg my-2">
                          <a href="/projecttype" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Projects Type</a>
                        </li>
                      </ul>
                    </li>
                    <li className="text-lg my-2">
                      <a href="/records" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Records</a>
                    </li>
                    <li className="text-lg my-2">
                      <a href="/timesheet" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Timesheet</a>
                    </li>
                    <li className="text-lg my-2">
                      <a href="/overview" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Overview</a>
                    </li>
                    <li className="text-lg my-2">
                      <a href="/live" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Live</a>
                    </li>
                    {isSignedIn && (
                      <li className="text-lg my-2">
                        <UserButton className="text-lg underline rounded-lg" />
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Desktop */}
          <div className="hidden w-full md:block md:w-auto">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gradient-to-r from-green-200 via-green-400 to-green-600 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 items-center">
              <li>
                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">Home</a>
              </li>
              <li className="relative group">
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Add <FaChevronDown className="inline ml-1"/>
                </a>
                <ul className="absolute left-0 top-full mt-1 w-48 bg-gradient-to-r from-green-200 via-green-400 to-green-600 dark:bg-gray-800 shadow-lg rounded-lg hidden group-hover:block z-60">
                  <li>
                    <a href="/addproject" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Projects</a>
                  </li>
                  <li>
                    <a href="/add" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Clients</a>
                  </li>
                </ul>
              </li>
              <li className="relative group">
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  New <FaChevronDown className="inline ml-1"/>
                </a>
                <ul className="absolute left-0 top-full mt-1 w-48 bg-gradient-to-r from-green-200 via-green-400 to-green-600 dark:bg-gray-800 shadow-lg rounded-lg hidden group-hover:block z-60">
                  <li>
                    <a href="/new" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Clients</a>
                  </li>
                  <li>
                    <a href="/entity" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Entity</a>
                  </li>
                  <li>
                    <a href="/projecttype" className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Projects Type</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/records" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Records</a>
              </li>
              <li>
                <a href="/timesheet" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Timesheet</a>
              </li>
              <li>
                <a href="/overview" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Overview</a>
              </li>
              <li>
                <a href="/live" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Live</a>
              </li>
              {isSignedIn && (
                <li>
                  <UserButton className="text-lg underline rounded-lg" />
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
