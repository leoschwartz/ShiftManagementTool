import axios from "axios";

export const getReport = async (userToken, reportId) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/report/" + reportId;
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.get(apiUrl, {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    });
    // console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
