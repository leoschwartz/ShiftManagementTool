import React from "react";
import Schedule from "../components/Schedule";
import { useAtom } from "jotai";
import { userIdAtom } from "../globalAtom";

const ScheduleView = () => {
  const [userId] = useAtom(userIdAtom);
   return (
    <section className="flex justify-center items-center" id="home">
      <div className="fixed inset-0 h-full bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
      <div className="max-w-xl w-full">
        <Schedule scheduleUser={userId} allowEdit={false} header={"Your Schedule"}/>
      </div>
    </section>
  );
}
export default ScheduleView;
