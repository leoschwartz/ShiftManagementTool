import axios from "axios";

export const deleteShift = async (userToken, shiftId) => {
  //   const apiUrl = import.meta.env.VITE_API_URL + "/shift/delete";
  const apiUrl = "http://localhost:5000/shifts/delete/" + shiftId;
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.delete(apiUrl, {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
