import React from "react";
import Schedule from "../components/Schedule";
import { useAtom } from "jotai";
import { userIdAtom } from "../globalAtom";

import { getSchedule } from "../api/getSchedule";
import { getScheduleById } from "../api/getScheduleById"
import { getShifts } from "../api/getShifts";

const ScheduleView = () => {
  const [userId] = useAtom(userIdAtom);
  return (
    <>
      <div className="text-3xl p-2 pl-16 text-center">View Shifts</div>
      <section className="flex justify-center items-center" id="home">
        <div className="fixed inset-0 h-full bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
        <div className="w-11/12 h-5/6">
          <Schedule employeeId={userId ?? ""} propAllowEdits={false} propOnePage={false} propRetro={false}
          propGetSchedule={getSchedule} propGetScheduleById={getScheduleById} propGetShifts={getShifts} />
        </div>
      </section>
    </>
  );
};
export default ScheduleView;
