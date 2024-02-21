import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { userTokenAtom, userAccessLevelAtom } from "../globalAtom";

const Profile = () => {
  // Variables for populating and editing
  const [editingFirstName, setEditingFirstName] = useState(false);
  const [editingLastName, setEditingLastName] = useState(false);
  const [editingActive, setEditingActive] = useState(false);
  const [editingAccessLevel, setEditingAccessLevel] = useState(false);
  const [editingReportsTo, setEditingReportsTo] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(true);
  const [accessLevel, setAccessLevel] = useState("");
  const [reportsTo, setReportsTo] = useState("");

  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedActive, setEditedActive] = useState(true);
  const [editedAccessLevel, setEditedAccessLevel] = useState("");
  const [editedReportsTo, setEditedReportsTo] = useState("");

  const [userToken] = useAtom(userTokenAtom);
  const [currAccessLevel] = useAtom(userAccessLevelAtom);

  //Populate user variables
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${(import.meta as any).env.VITE_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();

          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
          setActive(userData.active);
          setAccessLevel(userData.accessLevel);
          setReportsTo(userData.reportTo);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userToken]);

  // Popup handlers
  const openFirstNameEditor = () => {
    setEditingFirstName(true);
    setEditedFirstName(firstName);
  };

  const openLastNameEditor = () => {
    setEditingLastName(true);
    setEditedLastName(lastName);
  };

  const openActiveEditor = () => {
    setEditingActive(true);
    setEditedActive(active);
  };

  const openAccessLevelEditor = () => {
    setEditingAccessLevel(true);
    setEditedAccessLevel(accessLevel);
  };

  const openReportsToEditor = () => {
    setEditingReportsTo(true);
    setEditedReportsTo(reportsTo);
  };

  const closeFirstNameEditor = () => {
    setEditingFirstName(false);
  };

  const closeLastNameEditor = () => {
    setEditingLastName(false);
  };

  const closeActiveEditor = () => {
    setEditingActive(false);
  };

  const closeAccessLevelEditor = () => {
    setEditingAccessLevel(false);
  };

  const closeReportsToEditor = () => {
    setEditingReportsTo(false);
  };

  const saveFirstName = () => {
    setFirstName(editedFirstName);
    closeFirstNameEditor();
  };

  const saveLastName = () => {
    setLastName(editedLastName);
    closeLastNameEditor();
  };

  const saveActive = () => {
    setActive(editedActive);
    closeActiveEditor();
  };

  const saveAccessLevel = () => {
    setAccessLevel(editedAccessLevel);
    closeAccessLevelEditor();
  };

  const saveReportsTo = () => {
    setReportsTo(editedReportsTo);
    closeReportsToEditor();
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(
        `${(import.meta as any).env.VITE_API_URL}/user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            firstName: editedFirstName,
            lastName: editedLastName,
            active: editedActive,
            accessLevel: editedAccessLevel,
            reportTo: editedReportsTo,
          }),
        }
      );
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 -z-50"
      >
        <div className="blur-[106px] h-1/3 bg-gradient-to-br from-primary to-secondary opacity-50 "></div>
        <div className="blur-[106px] h-3/4 bg-gradient-to-r from-forth to-fifth opacity-30"></div>
      </div>
      <div className="flex flex-col items-center mt-16 px-8 lg:px-32 md:px-24 sm:px-16">
        {/* Profile Pic */}
        <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="http://placekitten.com/150/150"
            alt="Profile"
          />
        </div>

        {/* Details */}
        <div className="mt-4 text-center w-full">
          {/* Frame for the details block */}
          <div className="bg-white p-4 border border-primary rounded-lg">
            <ul className="text-left space-y-2">
              <li className="pb-2 mb-2 flex">
                <span className="font-semibold w-20 inline-block">
                  First Name:
                </span>
                <span className="ml-2">{firstName}</span>
                <button
                  className="ml-auto text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={openFirstNameEditor}
                >
                  Edit
                </button>
              </li>
              <li className="pb-2 mb-2 flex">
                <span className="font-semibold w-20 inline-block">
                  Last Name:
                </span>
                <span className="ml-2">{lastName}</span>
                <button
                  className="ml-auto text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={openLastNameEditor}
                >
                  Edit
                </button>
              </li>
              <li className="pb-2 mb-2 flex">
                <span className="font-semibold w-20 inline-block">Email:</span>
                <span className="ml-2">{email}</span>
              </li>
              {currAccessLevel >= 1 ? (
                // Render Edit button for managers and admins
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Active:
                  </span>
                  <span className="ml-2">{active ? "Yes" : "No"}</span>
                  <button
                    className="ml-auto text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={openActiveEditor}
                  >
                    Edit
                  </button>
                </li>
              ) : (
                // Render without Edit button for employees
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Active:
                  </span>
                  <span className="ml-2">{active ? "Yes" : "No"}</span>
                </li>
              )}
              {currAccessLevel >= 1 ? (
                // Render Edit button for managers and admins
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Access Level:
                  </span>
                  <span className="ml-2">{accessLevel}</span>
                  <button
                    className="ml-auto text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={openAccessLevelEditor}
                  >
                    Edit
                  </button>
                </li>
              ) : (
                // Render without Edit button for employees
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Access Level:
                  </span>
                  <span className="ml-2">{accessLevel}</span>
                </li>
              )}
              {currAccessLevel >= 1 ? (
                // Render Edit button for managers and admins
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Reports To:
                  </span>
                  <span className="ml-2">{reportsTo}</span>
                  <button
                    className="ml-auto text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={openReportsToEditor}
                  >
                    Edit
                  </button>
                </li>
              ) : (
                // Render without Edit button for employees
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Reports To:
                  </span>
                  <span className="ml-2">{reportsTo}</span>
                </li>
              )}
              {/* Employee List shown if manager
              {currAccessLevel === 1 && (
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">Employee List:</span>
                  <span className="ml-2">
                    <Link to="/profile">
                      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.2 9.8a3.4 3.4 0 0 0-4.8 0L5 13.2A3.4 3.4 0 0 0 9.8 18l.3-.3m-.3-4.5a3.4 3.4 0 0 0 4.8 0L18 9.8A3.4 3.4 0 0 0 13.2 5l-1 1"/>
                      </svg>
                    </Link>
                  </span>
                </li>
              )} */}
            </ul>
          </div>
        </div>

        {/* Save Changes button */}
        <div className="flex justify-start mt-4">
          <button
            className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>

        {/* Popup for First Name edit */}
        {editingFirstName && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Edit First Name</h2>
              <input
                type="text"
                value={editedFirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                  onClick={saveFirstName}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={closeFirstNameEditor}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup for Last Name edit */}
        {editingLastName && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Edit Last Name</h2>
              <input
                type="text"
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                  onClick={saveLastName}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={closeLastNameEditor}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup for Active edit */}
        {editingActive && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Edit Active</h2>
              <label>
                <input
                  type="checkbox"
                  checked={editedActive}
                  onChange={(e) => setEditedActive(e.target.checked)}
                  className="mr-2"
                />
                Active
              </label>
              <div className="flex justify-end">
                <button
                  className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                  onClick={saveActive}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={closeActiveEditor}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Popup for Access Level edit */}
        {editingAccessLevel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Edit Access Level</h2>
              <input
                type="text"
                value={editedAccessLevel}
                onChange={(e) => setEditedAccessLevel(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                  onClick={saveAccessLevel}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={closeAccessLevelEditor}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup for Reports To edit */}
        {editingReportsTo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Edit Reports To</h2>
              <input
                type="text"
                value={editedReportsTo}
                onChange={(e) => setEditedReportsTo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                  onClick={saveReportsTo}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={closeReportsToEditor}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
