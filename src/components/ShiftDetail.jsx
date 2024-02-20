import Modal from "./utils/Modal";
import PropTypes from "prop-types";
export default function ShiftDetail(props) {
  const shift = props.shift;
  return (
    <Modal title="Shift Detail">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Shift ID:</h2>
          <p className="text-xl font-bold">{shift.id}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Shift Name:</h2>
          <p className="text-xl font-bold">{shift.name}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Start Time:</h2>
          <p className="text-xl font-bold">{shift.starTime}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">End Time:</h2>
          <p className="text-xl font-bold">{shift.endTime}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Shift Description:</h2>
          <p className="text-xl font-bold">{shift.desc}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Location:</h2>
          <p className="text-xl font-bold">{shift.location}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Completed:</h2>
          <input
            type="checkbox"
            checked={shift.completed}
            className="text-xl font-bold"
            disabled
          />
        </div>
      </div>
    </Modal>
  );
}

ShiftDetail.propTypes = {
  shift: PropTypes.object,
};
