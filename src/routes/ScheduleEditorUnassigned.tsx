import React from "react";
import { useParams } from "react-router-dom";
import Schedule from "../components/Schedule";
import { getUser } from "../api/getUser"
import { useAtom } from "jotai";
import { userIdAtom } from "../globalAtom";

const ScheduleEditorUnassigned = () => {
  const [userId] = useAtom(userIdAtom);
  //getUser(userId, employee);
   return (
    <section className="flex justify-center items-center" id="home">
      <div className="fixed inset-0 h-full bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
      <div className="max-w-xl w-full">
        <Schedule scheduleUser={null} allowEdit={true} header={"Unassigned Shifts"}/>
      </div>
    </section>
  );
}
export default ScheduleEditorUnassigned;
