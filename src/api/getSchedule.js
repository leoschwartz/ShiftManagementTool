import axios from "axios";
export const getSchedule = async (userToken, employeeId, date) => {
    const apiUrl = import.meta.env.VITE_API_URL + "/schedule/getByDate";
  // const apiUrl = "http://localhost:5000/schedule/getByDate";
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
    if (res.data) {
      res.data.startTime = new Date(res.data.startTime);
      res.data.endTime = new Date(res.data.endTime);
    }
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
