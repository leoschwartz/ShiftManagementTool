import axios from "axios";
export const getScheduleById = async (userToken, id) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/schedule/get/" + id;
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.post(
      apiUrl,
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
