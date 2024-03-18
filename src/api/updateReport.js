import axios from "axios";

export const updateReport = async (userToken, reportId, reportData) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/report/update";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.put(
      apiUrl,
      { reportId: reportId, updatedData: reportData },
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
