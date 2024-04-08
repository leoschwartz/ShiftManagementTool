import axios from "axios";

export const updateScheduleTemplate = async (userToken, scheduleId, updateData) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/scheduleTemplate/update";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.put(
      apiUrl,
      { id: scheduleId, updateData: updateData },
      {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};