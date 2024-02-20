import { verifyString } from "../utils/verifyString";
import { verifyDate } from "../utils/verifyDate";
import { v4 as uuidv4 } from "uuid";
import { getShift } from "../api/getShift";

export class ShiftSchedule {
  // ShiftSchedule class
  // @param id: string
  // @param archived: boolean
  // @param shiftIdList: Array of strings
  // @param desc: string
  // @param startTime: Date
  // @param employeeId: string
  constructor({ id, archived, shiftIdList, desc, startTime, employeeId }) {
    this.id = id && verifyString(id) ? id : uuidv4();
    this.desc = verifyString(desc) ? desc : "";
    // check if the date is valid
    // if it is, set it to the date, if not, check if the date is a string
    // if it is, throw an error, if not, set it to the current date
    if (verifyDate(startTime)) {
      this.startTime = new Date(startTime);
    } else if (verifyString(startTime)) {
      throw new Error("Invalid date format for startTime");
    } else {
      throw new Error("Start time is required");
    }
    this.endTime = new Date(this.startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
    // employeeId is required
    if (verifyString(employeeId)) {
      this.employeeId = employeeId;
    } else {
      throw new Error("Employee ID is required");
    }
    this.archived = archived && typeof archived == "boolean" ? archived : false;
    this.shiftIdList =
      shiftIdList && Array.isArray(shiftIdList) ? shiftIdList : [];
  }
  addShiftId(shiftId) {
    this.shiftIdList.push(shiftId);
  }
  addMultipleShiftIds(shiftIdList) {
    this.shiftIdList = this.shiftIdList.concat(shiftIdList);
  }
  removeShiftId(shiftId) {
    this.shiftIdList = this.shiftIdList.filter((id) => id !== shiftId);
  }
  removeMultipleShiftIds(shiftIdList) {
    this.shiftIdList = this.shiftIdList.filter(
      (id) => !shiftIdList.includes(id)
    );
  }
  getDetailedShifts = async (userToken) => {
    let shifts = [];
    for (let i = 0; i < this.shiftIdList.length; i++) {
      const shift = await getShift(userToken, this.shiftIdList[i]);
      shifts.push(shift);
    }
    return shifts;
  };
}
