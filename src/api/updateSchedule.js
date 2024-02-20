import axios from "axios";

// updateShiftSchedule updates a shift schedule
// To remove a shift from the shift schedule, use removeShift key
// To remove multiple shifts from the shift schedule, use removeMultipleShifts key
// To add a shift to the shift schedule, use addShift key
// To add multiple shifts to the shift schedule, use addMultipleShifts key
// @param {string} userToken
// @param {string} employeeId
// @param {object} updateData
// @returns {object} updated schedule

export const updateSchedule = async (userToken, employeeId, updateData) => {
  const apiUrl = import.meta.env.VITE_API_URL + "/schedule/updateSchedule";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios({
      method: "put",
      url: apiUrl,
      headers: {
        Authorization: "Bearer " + userToken,
      },
      data: {
        employeeId: employeeId,
        updateData: updateData,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
