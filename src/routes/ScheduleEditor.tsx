import React from "react";
import { useParams } from "react-router-dom";
import Schedule from "../components/Schedule";

import { getSchedule } from "../api/getSchedule";
import { getScheduleById } from "../api/getScheduleById"
import { getShifts } from "../api/getShifts";
import { createShift } from "../api/createShift";
import { updateShift } from "../api/updateShift";
import { updateSchedule } from "../api/updateSchedule";
import { deleteShift } from "../api/deleteShift";

const ScheduleEditor = () => {
  let { employee } = useParams();
  return (
    <div className="">
      <Schedule employeeId={employee ?? ""} propAllowEdits={true} propOnePage={false}
      propCreateShift={createShift} propDeleteShift={deleteShift} propGetSchedule={getSchedule}
      propGetScheduleById={getScheduleById} propGetShifts={getShifts} propUpdateSchedule={updateSchedule} 
      propUpdateShift={updateShift}/>
    </div>
  );
};
export default ScheduleEditor;
