import Modal from "./utils/Modal";
import PropTypes from "prop-types";
import { dateToHourMinute } from "../utils/dateToHourMinute";
function ScheduleAddFullEmptyForm(props) {
  return (
    <Modal
      title="Add a new shift"
      isModalOpen={props.isModalOpen}
      onClose={props.closeModal}
    >
      <div id="info" className="mb-4">
        <p className="mb-2">Event ID: {props.selectedEvent?.id}</p>
        {props.selectedEvent?.allDay ? (
          <p className="mb-2">All day: {props.selectedEvent?.allDay}</p>
        ) : (
          <>
            <p className="mb-2">
              Start Time: {dateToHourMinute(props.selectedEvent?.start)}
            </p>
            <p className="mb-2">
              End Time: {dateToHourMinute(props.selectedEvent?.end)}
            </p>
          </>
        )}
      </div>
      <form className="max-w-sm mx-auto" onSubmit={props.onSubmit}>
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
          />
        </div>
        <input
          type="submit"
          value="Submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
      </form>
    </Modal>
  );
}

ScheduleAddFullEmptyForm.propTypes = {
  isModalOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedEvent: PropTypes.object,
};

export default ScheduleAddFullEmptyForm;
