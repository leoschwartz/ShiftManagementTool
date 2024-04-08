import React from "react";
import { useEffect, useRef, useState } from "react";
import Schedule from "../components/Schedule";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
import { userIdAtom } from "../globalAtom";

import { getSchedule } from "../api/getSchedule";
import { getScheduleById } from "../api/getScheduleById"
import { getShifts } from "../api/getShifts";
import { getCurrentUser } from "../api/getCurrentUser";

const ScheduleUnassignedView = () => {
  const [userToken] = useAtom(userTokenAtom);
  const [managerId, setManagerId] = useState("");
  useEffect(() => {
    const body = async () => {
      const res = await getCurrentUser(userToken)
      setManagerId(res.accountInfo.reportTo);
    }
    body();
  }, []);
  return (
    <>
    <div className="text-3xl p-2 pl-16 text-center">Unassigned Shifts</div>
    <section className="flex justify-center items-center" id="home">
      <div className="fixed inset-0 h-full bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
      {managerId && (
        <div className="w-11/12 h-5/6">
          <Schedule employeeId={managerId} propAllowEdits={false} propOnePage={false} propRetro={false} propAllowRequest={true}
          propGetSchedule={getSchedule} propGetScheduleById={getScheduleById} propGetShifts={getShifts} />
        </div>
      )}
    </section>
    </>
  );
};
export default ScheduleUnassignedView;
