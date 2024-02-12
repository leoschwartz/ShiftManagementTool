import React from "react";
import ScheduleView from "../components/ScheduleView";
import { useAtom } from "jotai";
import { userTokenAtom, userAccessLevelAtom } from "../globalAtom";

const SchedulePage = () => {
  const [userToken] = useAtom(userTokenAtom);
   return (
    <section className="flex justify-center items-center" id="home">
      <div className="fixed inset-0 h-full bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
      <div className="max-w-xl w-full">
        <ScheduleView scheduleUser={userToken} allowEdit={true}/>
      </div>
    </section>
  );
}
export default SchedulePage;
