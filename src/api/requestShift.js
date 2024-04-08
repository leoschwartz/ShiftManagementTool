import axios from "axios";

export const requestShift = async (userToken, shift) => {
  //TODO - IMPLEMENT
  const apiUrl = import.meta.env.VITE_API_URL + "/todo";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.put(
      apiUrl,
      { shift: shift },
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
