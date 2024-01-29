import React, { useState } from "react";
import Theme1 from "../components/theme/Theme1";
import { addNewUser } from "../api/addNewUser";

const AddNewUserPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState("1");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Handle form submission logic here
    const res = await addNewUser(
      email,
      password,
      accessLevel,
      firstName,
      lastName
    );
    if (res) {
      setNotification("User created successfully");
    } else {
      setError("Something went wrong");
    }

    // Clear form inputs and error message
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setAccessLevel("1");
    setError("");
  };

  return (
    <>
      <Theme1 />
      <div className="max-w-md mx-auto my-8">
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
          <button
            type="submit"
            className="bg-fifth hover:bg-forth text-white font-bold py-2 px-4 rounded"
          >
            Create
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNewUserPage;
