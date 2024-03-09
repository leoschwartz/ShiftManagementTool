import PropTypes from "prop-types";

Notification.propTypes = {
  message: PropTypes.string.isRequired, // Add prop validation for 'message'
  showCloseButton: PropTypes.bool.isRequired, // Add prop validation for 'showCloseButton'
  onClose: PropTypes.func, // Add prop validation for 'onClose'
  type: PropTypes.string, // Add prop validation for 'type'
};

function Notification(props) {
  return (
    <div
      className={`bg-green-100 border ${
        props.type == "success"
          ? "border-green-400 text-green-700"
          : props.type == "error"
          ? "border-red-400 text-red-700"
          : "border-amber-400 text-amber-700"
      }  px-4 py-3 rounded relative my-5`}
    >
      <strong className="font-bold">Success!</strong>
      <span className="block sm:inline">
        {props.message ? props.message : "Your changes have been saved."}
      </span>
      {props.showCloseButton && (
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg
            onClick={props.onClose}
            className={`fill-current h-6 w-6 ${
              props.type == "success"
                ? "text-green-500"
                : props.type == "error"
                ? "text-amber-500"
                : "text-amber-500"
            } `}
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.95 5.95a.75.75 0 011.06 1.06L11.06 12l4.95 4.95a.75.75 0 11-1.06 1.06L10 13.06l-4.95 4.95a.75.75 0 01-1.06-1.06L8.94 12 4.95 7.05a.75.75 0 011.06-1.06L10 10.94l4.95-4.95z"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

export default Notification;
