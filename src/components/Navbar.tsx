import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar as FbNavbar } from "flowbite-react";
import {
  isLoggedInAtom,
  userAccessLevelAtom,
  userTokenAtom,
} from "../globalAtom";
import { useAtom } from "jotai";

function Navbar() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [accessLevel] = useAtom(userAccessLevelAtom);
  const [, setUserTokenAtom] = useAtom(userTokenAtom);
  const location = useLocation();

  let redirectPath =
    accessLevel === 0
      ? "/schedule"
      : accessLevel === 1
      ? "/employeeList"
      : accessLevel === 2
      ? "/accountManager"
      : "/unauthorize";
  const handleLogout = () => {
    setUserTokenAtom(null);
  };
  const isLoginPage = !isLoggedIn && location.pathname === "/login";

  return (
    <FbNavbar
      fluid
      className="bg-gradient-to-tr from-third to-fifth w-full z-20 top-0 start-0 border-b border-primary"
    >
      <FbNavbar.Brand as={Link} to={redirectPath}>
        <span className="text-white self-center text-2xl font-semibold whitespace-nowrap ">
          Shift Management Tool
        </span>
      </FbNavbar.Brand>
      <FbNavbar.Toggle />
      <FbNavbar.Collapse>
        {isLoggedIn && (
          <>
            {accessLevel == 0 && (
            <>
              <FbNavbar.Link
                as={Link}
                to="/schedule"
                className="text-white hover:text-secondary"
              >
                Schedule
              </FbNavbar.Link>
              <FbNavbar.Link
                  as={Link}
                  to="/scheduleUnassignedView"
                  className="text-white hover:text-secondary"
                >
                  Unassigned Shifts
                </FbNavbar.Link>
              </>
            )}
            {accessLevel == 1 && (
              <>
                <FbNavbar.Link
                  as={Link}
                  to="/employeeList"
                  className="text-white hover:text-secondary"
                >
                  Employee List
                </FbNavbar.Link>
                <FbNavbar.Link
                  as={Link}
                  to="/scheduleUnassignedEditor"
                  className="text-white hover:text-secondary"
                >
                   Unassigned Shifts
                </FbNavbar.Link>
              </>
            )}
            {accessLevel == 2 && (
              <>
                <FbNavbar.Link
                  as={Link}
                  to="/accountManager"
                  className="text-white hover:text-secondary"
                >
                  Account Manager
                </FbNavbar.Link>
                <FbNavbar.Link
                  as={Link}
                  to="/addNewUser"
                  className="text-white hover:text-secondary"
                >
                  Add New User
                </FbNavbar.Link>
              </>
            )}
            <FbNavbar.Link
              as={Link}
              to="/profile"
              className="text-white hover:text-secondary"
            >
              Profile
            </FbNavbar.Link>
            <FbNavbar.Link
              onClick={handleLogout}
              as={Link}
              to="/login"
              className="text-white hover:text-secondary"
            >
              Log out
            </FbNavbar.Link>
          </>
        )}
      </FbNavbar.Collapse>
      {/* Login button outside hamburger menu */}
      {!isLoginPage &&
        !isLoggedIn && ( // Omit the log in button on the login page
          <div className="hidden md:block">
            <Link
              to="/login"
              className="text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              Log in
            </Link>
          </div>
        )}
    </FbNavbar>
  );
}

export default Navbar;
