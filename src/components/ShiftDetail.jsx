import Modal from "./utils/Modal";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
import PropTypes from "prop-types";
import { dateToHourMinute } from "../utils/dateToHourMinute";
import { getUser } from "../api/getUser";
export default function ShiftDetail(props) {
  const shift = props.shift;
  const [createdBy, setCreatedBy] = useState(null);  
  const [userToken] = useAtom(userTokenAtom);
  useEffect(() => {
    const body = async () => {
      const res = await getUser(userToken, shift.createdBy)
      setCreatedBy(res);
    }
    if (shift)
      body();
  }, []);
  function requestShift(event) {
    event.preventDefault();
  }
  return (
    <Modal
      title="Shift Detail"
      onClose={props.closeModal}
      isModalOpen={props.isModalOpen}
    >
      <div className="flex flex-col">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-forth">Shift ID:</h2>
          <p className="text-xl ">{shift?.id}</p>
        </div>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-forth">Shift Name:</h2>
          <p className="text-xl">{shift?.name}</p>
        </div>
        {!shift?.allDay && (
          <>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-forth">Start Time:</h2>
              <p className="text-xl ">
                {shift?.startTime && dateToHourMinute(shift.startTime)}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-forth">End Time:</h2>
              <p className="text-xl ">
                {shift?.endTime && dateToHourMinute(shift.endTime)}
              </p>
            </div>
          </>
        )}
        {shift?.allDay && (
          <>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-forth">All day:</h2>
              <input type="checkbox" checked={shift?.allDay} disabled />
            </div>
          </>
        )}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-forth">Shift Description:</h2>
          <p className="text-xl ">{shift?.desc}</p>
        </div>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-forth">Location:</h2>
          <p className="text-xl ">{shift?.location}</p>
        </div>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-forth">Created By:</h2>
          <p className="text-xl ">
            {createdBy?.firstName} {createdBy?.lastName}
          </p>
        </div>
        
        {props.allowRequest && (
            <button
              onClick={requestShift}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full ml-2"
            >
              Request Shift
            </button>
          )}
      </div>
    </Modal>
  );
}

ShiftDetail.propTypes = {
  shift: PropTypes.object,
  isModalOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  key: PropTypes.number,
  allowRequest: PropTypes.bool,
};
