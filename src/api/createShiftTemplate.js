import axios from "axios";

export const createShiftTemplate = async (userToken, shiftData) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/shifts/createTemplated";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  shiftData.startTime = addDays(shiftData.startTime, -6); //convert from first day to first monday
  shiftData.endTime = addDays(shiftData.endTime, -6);
  try {
    const res = await axios({
      method: "post",
      url: apiUrl,
      headers: {
        Authorization: "Bearer " + userToken,
      },
      data: shiftData,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
