import axios from "axios";
// BE AWARE THIS CONVERTS DATES FROM 1900-01-01 to 1900-01-07
export const getShiftTemplates = async (userToken, scheduleId) => { 
  const apiUrl = import.meta.env.VITE_API_URL + "/scheduleTemplate/getTemplateShifts/" + scheduleId;
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
      x.startTime = addDays(new Date(x.startTime), 6); //convert from first day to first monday
      x.endTime = addDays(new Date(x.endTime), 6);
    }
    return res.data;
  } catch (error) {
    console.log(error);
  }
  return [];
};
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
