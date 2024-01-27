import axios from "axios";

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
    return res.data.token;
  } catch (error) {
    console.log(error);
    return null;
  }
};
