import axios from "axios";

// @param {string} userToken

export const getAllAdminsAndManagers = async (userToken) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/admin/all";

  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }

  try {
    const res = await axios.get(apiUrl, {
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
