import axios from "axios";

export const getManager = async (userToken, managerId) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL + `/manager/${managerId}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting employee list:", error);
    return null;
  }
};
