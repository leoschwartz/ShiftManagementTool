import axios from "axios";

export const createShiftTemplate = async (userToken, shiftData) => {
  // Depending on how the schedule template is stored, the createShift endpoint might move the shift 
  // to a different schedule to 'fix' the date not being in range. Safe choice is to use a new endpoint
  /* shiftData is in the following format:
  {
        id: uuid(),
        startTime: date object,
        endTime: date object,
        allDay: true/false,
        employeeId: employeeId,
        createdBy: current user ID,
        parentSchedule: xxxx-xxxx, <--- This may be null if no schedule template existed! 
                  It's expected that the server will add it if a schedule template exists, or create a new one and add it.
                  The first one received should create the schedule template, the rest should just add to it
                  You can see how I did this in utils/findScheduleParent. Template version should be simpler since it doesn't care about dates
        name: string,
        desc: string,
        location: string,
      }
  */
  // Aside from the possibility of missing a schedule template id, this is ready to be passed directly into database/createShiftInstance
  // todo
  return shiftData;
};
