import PropTypes from "prop-types";

FormEditAdminAndManager.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

function FormEditAdminAndManager(props) {
  return (
    <form
      className="space-y-4 max-w-lg mx-auto my-3"
      onSubmit={props.handleFormSubmit}
    >
      <div className="flex items-center justify-between">
        <label htmlFor="firstName" className="mb-2 font-semibold text-primary">
          First Name:
        </label>
        <input
          type="text"
          id="firstName"
          placeholder={props.user.firstName}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fifth ml-2 w-7/12 xs:w-3/4"
        />
      </div>
      <div className="flex items-center justify-between">
        <label htmlFor="lastName" className="mb-2 font-semibold text-primary">
          Last Name:
        </label>
        <input
          type="text"
          id="lastName"
          placeholder={props.user.lastName}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fifth ml-2 w-7/12 xs:w-3/4"
        />
      </div>
      <button
        type="submit"
        className="font-medium bg-forth hover:bg-third text-white py-2 px-4 rounded float-end"
      >
        Update
      </button>
    </form>
  );
}

export default FormEditAdminAndManager;
