import axios from "axios";

export const updateManager = async (userToken, managerId, managerData) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/manager/" + managerId;
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.put(apiUrl, {...managerData}, {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
