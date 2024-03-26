//https://fullcalendar.io/docs/events-function for info on fetchInfo object
import axios from "axios";

// @param {string} userToken
// @param {string} employeeId
// @param {Date} startTime
// @param {Date} endTime
// @returns {Array} array of shifts
export const getShifts = async (userToken, scheduleId) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/schedule/getScheduleShifts/" + scheduleId;
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios({
      method: "get",
      url: apiUrl,
      headers: {
        Authorization: "Bearer " + userToken,
      },
    });
    for (const x of res.data) {
      x.startTime = new Date(x.startTime);
      x.endTime = new Date(x.endTime);
    }
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
