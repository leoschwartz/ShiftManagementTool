//https://fullcalendar.io/docs/events-function for info on fetchInfo object
import axios from "axios";

export const getShiftsForReport = async (userToken, employeeId, startTime, endTime) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/shifts/getRange";
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
      data: {
        employeeId: employeeId,
        startTime: startTime,
        endTime: endTime,
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