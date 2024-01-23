import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-tr from-third to-fifth dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-primary dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/homepage" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="text-white self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Shift Management Tool</span>
        </Link>
        {isLoggedIn && (
          <div className="hidden md:flex md:order-2 space-x-4 md:space-x-8 rtl:space-x-reverse items-center">
            <Link to="/homepage" className="text-white hover:text-secondary">
              Home
            </Link>
            <Link to="/profile" className="text-white hover:text-secondary">
              Profile
            </Link>
            <Link to="/schedule" className="text-white hover:text-secondary">
              Schedule
            </Link>
            <button
              onClick={handleLogout}
              className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <Link to="/login">
                Log out
              </Link>
            </button>
          </div>
        )}
        {!isLoggedIn && (
          <div className="hidden md:block">
            <a
              href="/login"
              className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Log in
            </a>
          </div>
        )}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`} id="navbar-sticky">
            <div className="flex flex-col items-center mt-4">
              {isLoggedIn && (
                <>
                  <Link to="/homepage" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-secondary py-2 px-3">
                    Home
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-secondary py-2 px-3">
                    Profile
                  </Link>
                  <Link to="/schedule" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-secondary py-2 px-3">
                    Schedule
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <Link to="/login">
                      Log out
                    </Link>
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <a
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Log in
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
