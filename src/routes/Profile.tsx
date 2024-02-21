import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { userTokenAtom, userAccessLevelAtom } from "../globalAtom";
import { Modal, Button, Checkbox, Label, TextInput, Toast, Spinner } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';

const Profile = () => {
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

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const saveChanges = async () => {
    try {
      setLoading(true);
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
            accessLevel: currAccessLevel,
            reportTo: editedReportsTo,
          }),
        }
      );
      if (response.ok) {
        setShowSuccessToast(true);
      } else {
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      setShowErrorToast(true); 
    } finally {
      setLoading(false);
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
        <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="http://placekitten.com/150/150"
            alt="Profile"
          />
        </div>

        <div className="mt-4 text-center w-full">
          <div className="bg-white p-4 border border-primary rounded-lg">
            <ul className="text-left space-y-2">
              <li className="pb-2 mb-2 flex">
                <span className="font-semibold w-20 inline-block">
                  First Name:
                </span>
                <span className="ml-2">{firstName}</span>
                <button
                  className="ml-auto text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => setEditingFirstName(true)}
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
                  onClick={() => setEditingLastName(true)}
                >
                  Edit
                </button>
              </li>
              <li className="pb-2 mb-2 flex">
                <span className="font-semibold w-20 inline-block">Email:</span>
                <span className="ml-2">{email}</span>
              </li>
              {currAccessLevel >= 1 ? (
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Active:
                  </span>
                  <span className="ml-2">{active ? "Yes" : "No"}</span>
                  <button
                    className="ml-auto text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => setEditingActive(true)}
                  >
                    Edit
                  </button>
                </li>
              ) : (
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Active:
                  </span>
                  <span className="ml-2">{active ? "Yes" : "No"}</span>
                </li>
              )}
              {currAccessLevel >= 1 ? (
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Access Level:
                  </span>
                  <span className="ml-2">{accessLevel}</span>
                  <button
                    className="ml-auto text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => setEditingAccessLevel(true)}
                  >
                    Edit
                  </button>
                </li>
              ) : (
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Access Level:
                  </span>
                  <span className="ml-2">{accessLevel}</span>
                </li>
              )}
              {currAccessLevel >= 1 ? (
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Reports To:
                  </span>
                  <span className="ml-2">{reportsTo}</span>
                  <button
                    className="ml-auto text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => setEditingReportsTo(true)}
                  >
                    Edit
                  </button>
                </li>
              ) : (
                <li className="pb-2 mb-2 flex">
                  <span className="font-semibold w-20 inline-block">
                    Reports To:
                  </span>
                  <span className="ml-2">{reportsTo}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Save Changes button with spinner */}
        <div className="flex justify-start mt-4">
          {loading ? ( 
            <Spinner aria-label="Saving changes..." color="pink"/>
          ) : (
            <button
              className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
              onClick={saveChanges}
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <Toast style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <HiCheck className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">Changes saved</div>
            <Toast.Toggle onClick={() => setShowSuccessToast(false)} />
          </Toast>
        )}

        {/* Error Toast */}
        {showErrorToast && (
          <Toast style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <HiX className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">Failed to save changes</div>
            <Toast.Toggle onClick={() => setShowErrorToast(false)} />
          </Toast>
        )}

        <Modal show={editingFirstName} popup onClose={() => setEditingFirstName(false)}>
          <Modal.Body>
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
                  onClick={() => {
                    setFirstName(editedFirstName);
                    setEditingFirstName(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={() => setEditingFirstName(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={editingLastName} popup onClose={() => setEditingLastName(false)}>
          <Modal.Body>
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
                  onClick={() => {
                    setLastName(editedLastName);
                    setEditingLastName(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={() => setEditingLastName(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={editingActive} popup onClose={() => setEditingActive(false)}>
          <Modal.Body>
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
                  onClick={() => {
                    setActive(editedActive);
                    setEditingActive(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={() => setEditingActive(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={editingAccessLevel} popup onClose={() => setEditingAccessLevel(false)}>
          <Modal.Body>
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
                  onClick={() => {
                    setAccessLevel(editedAccessLevel);
                    setEditingAccessLevel(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={() => setEditingAccessLevel(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={editingReportsTo} popup onClose={() => setEditingReportsTo(false)}>
          <Modal.Body>
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
                  onClick={() => {
                    setReportsTo(editedReportsTo);
                    setEditingReportsTo(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={() => setEditingReportsTo(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

      </div>
    </>
  );
};

export default Profile;

