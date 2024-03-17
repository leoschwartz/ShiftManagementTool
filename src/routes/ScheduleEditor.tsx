import React from "react";
import { useParams } from "react-router-dom";
import Schedule from "../components/Schedule";
import { getUser } from "../api/getUser";
import { useAtom } from "jotai";
import { userIdAtom } from "../globalAtom";

const ScheduleView = () => {
  let { employee } = useParams();
  return (
    <div className="">
      <Schedule employeeId={employee ?? ""} />
    </div>
  );
};
export default ScheduleView;
