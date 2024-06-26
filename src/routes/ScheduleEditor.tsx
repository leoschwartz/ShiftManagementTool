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
      <div className="text-3xl p-2 pl-16 text-center">Edit Shifts</div>
      <Schedule employeeId={employee ?? ""} propAllowEdits={true} propOnePage={false} propRetro={false}
      propCreateShift={createShift} propDeleteShift={deleteShift} propGetSchedule={getSchedule}
      propGetScheduleById={getScheduleById} propGetShifts={getShifts} propUpdateSchedule={updateSchedule} 
      propUpdateShift={updateShift}/>
    </div>
  );
};
export default ScheduleEditor;
