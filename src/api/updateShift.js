import axios from "axios";

export const updateShift = async (userToken, shiftData) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/shifts/update";
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
      data: shiftData,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
