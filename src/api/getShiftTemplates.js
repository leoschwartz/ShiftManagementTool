import axios from "axios";

// @param {string} userToken
// @param {string} employeeId
// @param {Date} startTime
// @param {Date} endTime
// @returns {Array} array of shifts
export const getShiftTemplates = async (userToken, scheduleId) => {
  // startTime and endTime params should be ignored. Similar deal to getScheduleTemplate. 
  // It's expected that this will cast the shift startTime and endTimes into date objects!
  /* e.g.
    for (const x of res.data) {
      x.startTime = new Date(x.startTime);
      x.endTime = new Date(x.endTime);
    }
  */
  // todo
  return [];
};
