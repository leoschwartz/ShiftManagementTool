import axios from "axios";

export const updateShiftTemplate = async (userToken, shiftData) => {
  // shiftData is just the entire shift object
  // intended to be passed directly into database/updateShiftInstance
  // No need to worry about null schedule IDs here (unlike createShiftTemplate), since any existing shift already has one.
  // todo
  return shiftData;
};
