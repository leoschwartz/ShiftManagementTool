import axios from "axios";

// @param {string} email
// @param {string} password
// @returns {string, number} {token, accessLevel}
export const authenticateUser = async (email, password) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/user/login";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.post(apiUrl, {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
