import axios from "axios";
export const getScheduleTemplate = async (userToken, employeeId, date) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/scheduleTemplate/getFor";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.post(
      apiUrl,
      {
        employeeId: employeeId,
        date: date,
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
