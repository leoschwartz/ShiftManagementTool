import React from "react";
import ScheduleView from "../components/ScheduleView";

const SchedulePage = () => {
   return (
    <section className="flex justify-center items-center" id="home">
      <div className="fixed inset-0 h-full bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
      <ScheduleView scheduleUser="todo"/>
    </section>
  );
}
export default SchedulePage;
