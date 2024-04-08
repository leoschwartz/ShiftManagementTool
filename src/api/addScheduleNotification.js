import axios from "axios";
// @param {string} userToken
// @param {string} notificationId
// @param {string} userId
export const addScheduleNotification = async (userToken, notificationId, userId) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/user/notification/add";
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