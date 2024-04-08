import axios from "axios";
// @param {string} userToken
// @param {string} notificationId
// @param {string} userId
export const removeNotification = async (userToken, notificationId, userId) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/user/notification/remove";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.post(
      apiUrl,
      {
        userId,
        notificationId,
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