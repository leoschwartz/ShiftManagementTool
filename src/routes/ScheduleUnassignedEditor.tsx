import React from "react";
import { useParams } from "react-router-dom";
import Schedule from "../components/Schedule";

import { getScheduleUnassigned } from "../api/getScheduleUnassigned";
import { getScheduleById } from "../api/getScheduleById"
import { getShifts } from "../api/getShifts";
import { createShiftUnassigned } from "../api/createShiftUnassigned";
import { updateShift } from "../api/updateShift";
import { updateSchedule } from "../api/updateSchedule";
import { deleteShift } from "../api/deleteShift";

const ScheduleUnassignedEditor = () => {
  let { employee } = useParams();
  return (
    <div className="">
      <Schedule employeeId={employee ?? ""} propAllowEdits={true} propOnePage={false} propRetro={false}
      propCreateShift={createShiftUnassigned} propDeleteShift={deleteShift} propGetSchedule={getScheduleUnassigned}
      propGetScheduleById={getScheduleById} propGetShifts={getShifts} propUpdateSchedule={updateSchedule} 
      propUpdateShift={updateShift}/>
    </div>
  );
};
export default ScheduleUnassignedEditor;
