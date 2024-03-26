import { updateShift } from "./updateShift"
export const updateShiftTemplate = async (userToken, shiftData) => {
  shiftData.startTime = addDays(shiftData.startTime, -6); //convert from first day to first monday
  shiftData.endTime = addDays(shiftData.endTime, -6);
  return updateShift(userToken,shiftData);
};
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
