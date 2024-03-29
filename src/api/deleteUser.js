import axios from "axios";

export const deleteUser = async (userToken, id) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/user/" + id;
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
