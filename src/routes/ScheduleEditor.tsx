import React from "react";
import { useParams } from "react-router-dom";
import Schedule from "../components/Schedule";
import { getUser } from "../api/getUser"
import { useAtom } from "jotai";
import { userIdAtom } from "../globalAtom";

const ScheduleView = () => {
  const [userId] = useAtom(userIdAtom);
  let { employee } = useParams();
  //getUser(userId, employee);
  //TODO - Replace "Employee" with name! api/getUser
  const headerName = "Employee";
   return (
    <section className="flex justify-center items-center" id="home">
      <div className="fixed inset-0 h-full bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
      <div className="max-w-xl w-full">
        <Schedule scheduleUser={employee} allowEdit={true} header={"Schedule for " + headerName}/>
      </div>
    </section>
  );
}
export default ScheduleView;
