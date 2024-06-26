import { useState } from "react";
import { useAtom } from "jotai";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { userIdAtom } from "../globalAtom";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { addNewUser } from "../api/addNewUser";
import { updateManager } from "../api/updateManager";
import { updateEmployee } from "../api/updateEmployee";
import PropTypes from "prop-types";



const AddEmployeeButton = ({ userToken, refreshEmployeeList }) => {
  const [showAddEmployeePopup, setShowAddEmployeePopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [managerId] = useAtom(userIdAtom);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleAddEmployee = async () => {
    try {
      const userInfo = {
        reportTo: managerId,
        accessLevel: 0,
        active: 1,
        firstName,
        lastName,
      };
      const createEmployeeResponse = await addNewUser(
        userToken,
        email,
        password,
        userInfo
      );
      if (createEmployeeResponse.success) {
        const newEmployee = createEmployeeResponse.user;
        const employeeId = newEmployee.id;
        const employeeAccountInfoId = newEmployee.accountInfo.id;
        // console.log("New employee obj: " + JSON.stringify(newEmployee));
        // Update reportTo with managerId
        await updateEmployee(userToken, employeeAccountInfoId, {reportTo: managerId});

        // Add employee to employeeList
        const updateManagerResponse = await updateManager(
          userToken,
          managerId,
          { addEmployee: employeeId }
        );

        if (updateManagerResponse.success) {
          setShowSuccessToast(true);
          setShowAddEmployeePopup(false);
          await refreshEmployeeList();
        } else {
          setShowErrorToast(true);
        }
      } else {
        setShowErrorToast(true);
      }
    } catch (error) {
      setShowErrorToast(true);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowAddEmployeePopup(true)}
        className="text-white bg-fifth font-semibold hover:bg-forth px-4 py-2 rounded mr-2"
        style={{ zIndex: 10 }}
      >
        Add Employee
      </button>
      <Modal
        show={showAddEmployeePopup}
        size="md"
        popup
        onClose={() => setShowAddEmployeePopup(false)}
      >
        <Modal.Body>
          <div className="space-y-6">
            <br />
            <h2 className="text-lg font-semibold mb-4">Add Employee</h2>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeEmail" value="Email:" />
              </div>
              <TextInput
                id="employeeEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeePassword" value="Password:" />
              </div>
              <TextInput
                id="employeePassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeFirstName" value="First Name:" />
              </div>
              <TextInput
                id="employeeFirstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeLastName" value="Last Name:" />
              </div>
              <TextInput
                id="employeeLastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleAddEmployee}
                className="text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded mr-2"
              >
                Add
              </Button>
              <Button
                onClick={() => setShowAddEmployeePopup(false)}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {showSuccessToast && (
        <Toast style={{ position: "fixed", bottom: "20px", left: "20px" }}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Employee added.</div>
          <Toast.Toggle onClick={() => setShowSuccessToast(false)} />
        </Toast>
      )}
      {showErrorToast && (
        <Toast style={{ position: "fixed", bottom: "20px", left: "20px" }}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            Failed to add employee.
          </div>
          <Toast.Toggle onClick={() => setShowErrorToast(false)} />
        </Toast>
      )}
    </>
  );
};


AddEmployeeButton.propTypes = {
  userToken: PropTypes.string.isRequired,
  refreshEmployeeList: PropTypes.func.isRequired,
};
export default AddEmployeeButton;
