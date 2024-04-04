import axios from "axios";

export const getEmployeeList = async (userToken, managerId) => {
  try {
    const apiUrl =
      import.meta.env.VITE_API_URL + `/manager/employeeList/${managerId}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (response.status === 200) {
      // console.log("Employee list fetched!");
      return response.data;
    } else {
      // console.error("Could not get employee list");
      return [];
    }
  } catch (error) {
    console.error("Error getting employee list:", error);
    return [];
  }
};
