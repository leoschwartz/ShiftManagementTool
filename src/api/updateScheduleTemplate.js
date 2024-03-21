import axios from "axios";

export const updateScheduleTemplate = async (userToken, scheduleId, updateData) => {
  // updateData is intended to be passed directly into database/updateShiftSchedule
  /* format is as follows:
    {
      addMultipleShifts: ["id1", "id2"],
      removeMultipleShifts: ["id1". "id2"],
    }
  */
  //todo
};
