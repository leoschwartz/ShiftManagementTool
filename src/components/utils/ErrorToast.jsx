import { Toast } from "flowbite-react";
import { HiX } from "react-icons/hi";
import PropTypes from "prop-types";

ErrorToast.propTypes = {
  onClose: PropTypes.func,
  message: PropTypes.string,
};

function ErrorToast(props) {
  return (
    <Toast style={{ position: "fixed", bottom: "20px", left: "20px" }}>
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
        <HiX className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">{props.message}</div>
      <Toast.Toggle onClick={() => props.onClose()} />
    </Toast>
  );
}

export default ErrorToast;
