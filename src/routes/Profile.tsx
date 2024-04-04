import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userTokenAtom, userAccessLevelAtom, userIdAtom } from "../globalAtom";
import { Modal, Toast, Spinner } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import Theme1 from "../components/theme/Theme1";
import { updateUser } from "../api/updateUser";
import { getUser } from "../api/getUser";

const Profile = () => {
  const [userToken] = useAtom(userTokenAtom);
  const [currAccessLevel] = useAtom(userAccessLevelAtom);
  const [userId, setUserId] = useAtom(userIdAtom);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(true);
  const [accessLevel, setAccessLevel] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUser(userToken);

        setUserId(userData.id);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setActive(userData.active);
        setAccessLevel(userData.accessLevel);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userToken]);

  const saveChanges = async () => {
    try {
      setLoading(true);
      const response = await updateUser(userToken, userId, {
        firstName: firstName,
        lastName: lastName,
        active: active,
        accessLevel: currAccessLevel,
      });
      if (response) {
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
      <Theme1 />
      <div className="flex flex-col items-center px-8 mt-8 lg:px-32 md:px-24 sm:px-16">
        <h1 className="text-3xl font-bold mb-4">Profile Information</h1>
        <div className="mt-4 text-center w-full">
          <div className="bg-white p-4 border border-primary rounded-lg text-left space-y-2">
            <div className="pb-2 mb-2 flex">
              <span className="font-semibold w-1/3 inline-block">Email:</span>
              <span className="ml-2">{email}</span>
            </div>
            <div className="pb-2 mb-2 flex">
              <span className="font-semibold w-1/3 inline-block">
                First Name:
              </span>
              <span className="ml-2">{firstName}</span>
            </div>
            <div className="pb-2 mb-2 flex">
              <span className="font-semibold w-1/3 inline-block">
                Last Name:
              </span>
              <span className="ml-2">{lastName}</span>
            </div>

            {currAccessLevel >= 1 ? (
              <div className="pb-2 mb-2 flex">
                <span className="font-semibold w-1/3 inline-block">
                  Active:
                </span>
                <span className="ml-2">{active ? "Yes" : "No"}</span>
              </div>
            ) : (
              <div className="pb-2 mb-2 flex">
                <span className="font-semibold w-1/3 inline-block">
                  Active:
                </span>
                <span className="ml-2">{active ? "Yes" : "No"}</span>
              </div>
            )}
            <div className="pb-2 mb-2 flex">
              <span className="font-semibold w-1/3 inline-block">
                Access Level:
              </span>
              <span className="ml-2">{accessLevel}</span>
            </div>
          </div>
        </div>

        {/* Save Changes button with spinner */}
        <div className="flex justify-start mt-4">
          {loading ? (
            <Spinner aria-label="Saving changes..." color="pink" />
          ) : (
            <div className="flex justify-between items-center">
              <button
                className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-5"
                onClick={() => setIsModalOpen(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal show={isModalOpen} popup onClose={() => setIsModalOpen(false)}>
        <Modal.Body>
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                  onClick={() => {
                    saveChanges();
                    setIsModalOpen(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      {/* Success Toast */}
      {showSuccessToast && (
        <Toast style={{ position: "fixed", bottom: "20px", left: "20px" }}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Changes saved</div>
          <Toast.Toggle onClick={() => setShowSuccessToast(false)} />
        </Toast>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <Toast style={{ position: "fixed", bottom: "20px", left: "20px" }}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Failed to save changes</div>
          <Toast.Toggle onClick={() => setShowErrorToast(false)} />
        </Toast>
      )}
    </>
  );
};

export default Profile;
