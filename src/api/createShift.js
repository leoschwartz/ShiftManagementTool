import axios from "axios";

// createShift creates a shift
// should you the shift model to make sure it works (optional)
// @param {string} userToken
// @param {object} shiftData
// @returns {object} created shift

export const createShift = async (userToken, shiftData) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/shifts/create";
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
