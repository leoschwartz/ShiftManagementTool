import axios from "axios";

// createSchedule creates a schedule
// should you the schedule model to make sure it works (optional)
// @param {string} userToken
// @param {object} scheduleData
// @returns {object} created schedule

export const createSchedule = async (userToken, scheduleData) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/schedule/create";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios({
      method: "post",
      url: apiUrl,
      headers: {
        Authorization: "Bearer " + userToken,
      },
      data: scheduleData,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
