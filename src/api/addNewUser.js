import axios from "axios";
// @param {string} userToken
// @param {string} email
// @param {string} password
// @param {Object} userInfo
export const addNewUser = async (userToken, email, password, userInfo) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/user/register";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    console.log(email)
    console.log(password)
    console.log(userInfo)
    const res = await axios.post(
      apiUrl,
      {
        email,
        password,
        ...userInfo,
      },
      {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
