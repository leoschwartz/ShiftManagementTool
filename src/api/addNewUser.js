import axios from "axios";
export const addNewUser = async (email, password, ...userInfo) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/user/register";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.post(apiUrl, {
      email,
      password,
      ...userInfo,
    });
    return res.data.token;
  } catch (error) {
    console.log(error);
    return null;
  }
};