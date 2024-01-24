import React from "react";

const Profile = () => {
  return (
    <div className="flex flex-col items-center mt-16">
      {/* Profile Pic */}
      <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src="http://placekitten.com/150/150"
          alt="Profile"
        />
      </div>

      {/* Details */}
      <div className="mt-4 text-center">
        <div className="bg-white rounded p-4">
          <ul className="text-left">
            <li className="border-b border-primary pb-2 mb-2">
              <span className="font-semibold">Name:</span> John Doe
            </li>
            <li className="border-b border-primary pb-2 mb-2">
              <span className="font-semibold">Email:</span> john.doe@example.com
            </li>
            <li className="border-b border-primary pb-2 mb-2">
              <span className="font-semibold">Rating:</span> 4.5
            </li>
            <li>
              <span className="font-semibold">Reports:</span> 10
            </li>
          </ul>
        </div>
      </div>

      <button className="mt-4 text-white bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Edit Profile
      </button>
    </div>
  );
};

export default Profile;