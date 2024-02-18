import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isLoggedInAtom, userAccessLevelAtom } from "../globalAtom";
import { useAtom } from "jotai";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [accessLevel] = useAtom(userAccessLevelAtom);

  const handleLogout = () => {
    // setIsLoggedIn(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-tr from-third to-fifth w-full z-20 top-0 start-0 border-b border-primary ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/schedule"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="text-white self-center text-2xl font-semibold whitespace-nowrap ">
            Shift Management Tool
          </span>
        </Link>
        {isLoggedIn && (
          <div className="hidden md:flex md:order-2 space-x-4 md:space-x-8 rtl:space-x-reverse items-center">
            {accessLevel == 0 ? (
              <Link to="/schedule" className="text-white hover:text-secondary">
                Schedule
              </Link>
            ) : null}
            {accessLevel == 1 ? (
                <Link to="/scheduleEditorUnassigned" className="text-white hover:text-secondary">
                  Unassigned Shifts
                </Link>
            ) : null}
            {accessLevel == 1 ? (
              <Link to="/employeeList" className="text-white hover:text-secondary">
                Employee List
              </Link>
            ) : null}
            {accessLevel == 2 && (
              <Link to="/addNewUser" className="text-white hover:text-secondary">
                Add New User
              </Link>
            )}

            <Link to="/profile" className="text-white hover:text-secondary">
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              <Link to="/login">Log out</Link>
            </button>
          </div>
        )}
        {!isLoggedIn && (
          <div className="hidden md:block">
            <a
              href="/login"
              className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center "
            >
              Log in
            </a>
          </div>
        )}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
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
          <div
            className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}
            id="navbar-sticky"
          >
            <div className="flex flex-col items-center mt-4">
              {isLoggedIn && (
                <>
                  <Link
                    to="/schedule"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-secondary py-2 px-3"
                  >
                    Schedule
                  </Link>
                  {accessLevel == 1 ? (
                    <Link
                      to="/employeeList"
                      className="text-white hover:text-secondary"
                    >
                      Employee List
                    </Link>
                  ) : null}
                  {accessLevel == 2 && (
                    <Link
                      to="/addNewUser"
                      className="text-white hover:text-secondary"
                    >
                      Add New User
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-secondary py-2 px-3"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-4 text-center "
                  >
                    <Link to="/login">Log out</Link>
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <a
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mt-4 text-center "
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
