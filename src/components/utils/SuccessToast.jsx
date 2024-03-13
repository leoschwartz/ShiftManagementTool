import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import PropTypes from "prop-types";

SuccessToast.propTypes = {
  onClose: PropTypes.func,
  message: PropTypes.string,
};

function SuccessToast(props) {
  return (
    <Toast style={{ position: "fixed", bottom: "20px", left: "20px" }}>
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
        <HiCheck className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">{props.message}</div>
      <Toast.Toggle onClick={() => props.onClose()} />
    </Toast>
  );
}

export default SuccessToast;
