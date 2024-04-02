import React from "react";
import { useParams } from "react-router-dom";
import Schedule from "../components/Schedule";

import { getScheduleTemplate } from "../api/getScheduleTemplate";
import { getShiftTemplates } from "../api/getShiftTemplates";
import { createShiftTemplate } from "../api/createShiftTemplate";
import { updateShiftTemplate } from "../api/updateShiftTemplate";
import { updateScheduleTemplate } from "../api/updateScheduleTemplate";
import { deleteShift } from "../api/deleteShift";//careful about this! both schedules use same api here!

//Failsafe for frontend bugs
const getScheduleByIdFailsafe = async (userToken, id) => {
  //Normally this getScheduleById gets called when a shift becomes visible that is part of a schedule other than the 'current' one
  //Since templates only have one schedule, this should never happen.
  //means there's a bug somewhere
  console.error("getScheduleByIdFailsafe called! This should never happen! Schedule ID requested: " + id);
}

//Important note!
/* The one-page calendar works by locking the date range to '1900-01-07' - '1900-01-14'
   This is the first Sunday-inclusive week expressible in UNIX time. 
   This means all startTimes and endTimes on new shifts will fall in this range, 
   and shifts and schedules need to be retrieved in this range in order to be visible.
*/

const ScheduleTemplateEditor = () => {
  let { employee } = useParams();
  return (
    <div className="">
    <div className="text-3xl p-2 pl-16 text-center">Edit Shift Template</div>
      <Schedule employeeId={employee ?? ""} propAllowEdits={true} propOnePage={true} propRetro={true}
      propCreateShift={(createShiftTemplate)} propDeleteShift={deleteShift} propGetSchedule={getScheduleTemplate}
      propGetScheduleById={getScheduleByIdFailsafe} propGetShifts={getShiftTemplates} propUpdateSchedule={updateScheduleTemplate} 
      propUpdateShift={updateShiftTemplate}/>
    </div>
  );
};
export default ScheduleTemplateEditor;
