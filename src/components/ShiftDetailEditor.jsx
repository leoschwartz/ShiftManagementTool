import Modal from "./utils/Modal";
import PropTypes from "prop-types";
import { dateToHourMinute } from "../utils/dateToHourMinute";
function ShiftDetailEditor(props) {
  var shift = props.shift;
  if (!shift) return;
  function onSubmit(event) {
    event.preventDefault();
    props.onSubmit(shift);
  }
  function onDelete(event) {
    event.preventDefault();
    props.onDelete(shift);
  }
  return (
    <Modal
      title="Edit shift"
      isModalOpen={props.isModalOpen}
      onClose={props.closeModal}
    >
      <div id="info" className="mb-4">
        <p className="mb-2">Event ID: {shift.id}</p>
        {props.shift?.allDay ? (
          <p className="mb-2">All day: {shift.allDay}</p>
        ) : (
          <>
            <p className="mb-2">
              Start Time: {dateToHourMinute(shift.startTime)}
            </p>
            <p className="mb-2">
              End Time: {dateToHourMinute(shift.endTime)}
            </p>
          </>
        )}
      </div>
      <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            defaultValue={shift.name}
            onChange={(e) => {shift.name = e.target.value}}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="desc"
          >
            Description:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="desc"
            type="text"
            name="desc"
            defaultValue={shift.desc}
            onChange={(e) => {shift.desc = e.target.value}}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="location"
          >
            Location:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            name="location"
            defaultValue={shift.location}
            onChange={(e) => {shift.desc = e.target.value}}
          />
        </div>
        <input
          type="submit"
          value="Submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
        <button
          onClick={onDelete}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full ml-4"
        >
          Delete shift
        </button>
      </form>
    </Modal>
  );
}

ShiftDetailEditor.propTypes = {
  isModalOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  shift: PropTypes.object,
  key: PropTypes.number,
};

export default ShiftDetailEditor;
