import { useState } from "react";
import Notification from "./utils/Notification";
import Modal from "./utils/Modal";
import PropTypes from "prop-types";
import { dateToHourMinute } from "../utils/dateToHourMinute";
import ReportModal from "./ReportModal";
function ShiftDetailEditor(props) {
  const [error, setError] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  var shift = props.shift;
  if (!shift) return;
  function onSubmit(event) {
    event.preventDefault();
    if (!shift.name) {
      setError("Name is required!"); //suggested by prof on mar18 meeting
      return;
    }
    if (!shift.startTime || !shift.endTime || shift.startTime >= shift.endTime) {
      setError("Invalid time range!");
      return;
    }
    props.onSubmit(shift);
  }
  function onDelete(event) {
    event.preventDefault();
    props.onDelete(shift);
  }

  const openReportModal = () => {
    console.log("open report modal");
    setIsReportModalOpen(true);
  };
  return (
    <>
      {shift.report && (
        <ReportModal
          isModalOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportId={shift.report}
        />
      )}
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
                Start Time:{" "}
                <input
                  type="time"
                  defaultValue={dateToHourMinute(shift.startTime)}
                  onChange={(e) => {
                    shift.startTime.setHours(e.target.value.substring(0, 2));
                    shift.startTime.setMinutes(e.target.value.substring(3, 5));
                  }}
                />
              </p>
              <p className="mb-2">
                End Time:{" "}
                <input
                  type="time"
                  defaultValue={dateToHourMinute(shift.endTime)}
                  onChange={(e) => {
                    shift.endTime.setHours(e.target.value.substring(0, 2));
                    shift.endTime.setMinutes(e.target.value.substring(3, 5));
                  }}
                />
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
              onChange={(e) => {
                shift.name = e.target.value;
              }}
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
              onChange={(e) => {
                shift.desc = e.target.value;
              }}
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
              onChange={(e) => {
                shift.location = e.target.value;
              }}
            />
          </div>
          <input
            type="submit"
            value="Submit"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full"
          />
          <button
            onClick={onDelete}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full ml-2"
          >
            Delete shift
          </button>
          {shift?.report && (
            <button
              onClick={openReportModal}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full ml-2"
            >
              View/Edit report
            </button>
          )}
        </form>
        {error !== "" && (
          <Notification
            message={error}
            showCloseButton={true}
            onClose={() => setError("")}
            type="error"
          />
        )}
      </Modal>
    </>
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
