import axios from "axios";
// @param {string} userToken
// @param {string} createdBy
// @param {string} title
// @param {string} content
export const createNotification = async (userToken, createdBy, title, content) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/user/notification";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.post(
      apiUrl,
      {
        createdBy,
        title,
        content
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
