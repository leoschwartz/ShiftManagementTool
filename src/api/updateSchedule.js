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
  const apiUrl = import.meta.env.VITE_API_URL + "/schedule/update";
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  try {
    const res = await axios.put(
      apiUrl,
      { id: employeeId, updateData: updateData },
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
