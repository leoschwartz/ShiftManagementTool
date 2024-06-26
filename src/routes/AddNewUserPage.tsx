import React, { useState } from "react";
import Theme1 from "../components/theme/Theme1";
import { addNewUser } from "../api/addNewUser";
import { userTokenAtom } from "../globalAtom";
import { useAtom } from "jotai";
import { Spinner } from "flowbite-react";

const AddNewUserPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState("1");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [userToken] = useAtom(userTokenAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Validate form inputs
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Handle form submission logic here
    const res = await addNewUser(userToken, email, password, {
      firstName: firstName,
      lastName: lastName,
      accessLevel: accessLevel,
    });
    if (res) {
      setNotification("User created successfully");
      setError("");
    } else {
      setError("Something went wrong");
      setNotification("");
    }

    // Clear form inputs and error message
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setAccessLevel("1");

    setIsLoading(false);
  };

  return (
    <>
      <Theme1 />
      <div className="w-full max-w-md sm:my-8 mx-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-3xl font-bold mb-4">Create a new user</h1>
        <form className="space-y-4 mx-2" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName" className="block mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="accessLevel" className="block mb-1">
              Access Level
            </label>
            <select
              name="accessLevel"
              id="accessLevel"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
            >
              <option value="1">Manager</option>
              <option value="2">Admin</option>
            </select>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {notification && <p className="text-green-500">{notification}</p>}
          <div className="flex justify-center items-center">
            {isLoading ? (
              <Spinner aria-label="Loading" color="pink" />
            ) : (
              <button
                type="submit"
                className="bg-fifth hover:bg-forth text-white font-bold py-2 px-4 rounded"
              >
                Create
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewUserPage;
