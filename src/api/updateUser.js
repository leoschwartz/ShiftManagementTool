import axios from "axios";

// updateUser updates a user
// @param {string} userToken
// @param {string} userId
// @param {object} updateData
// @returns {object} updated user

export const updateUser = async (userToken, userId, updateData) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/user";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.put(
      apiUrl,
      { id: userId, ...updateData },
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
