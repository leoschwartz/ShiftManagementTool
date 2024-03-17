import axios from "axios";

// updateEmployeeManager updates a employee
// @param {string} userToken
// @param {string} managerId
// @param {string} employeeId

export const updateEmployeeManager = async (userToken, managerId, employeeId) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/employee/" + employeeId;
  console.log(apiUrl);
  console.log("managerId passed: " + managerId);
  console.log("employeeId passed: " + employeeId);
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.put(
      apiUrl,
      { managerId: managerId },
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
