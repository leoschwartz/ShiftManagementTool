import { useState } from "react";
import { useAtom } from "jotai";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import { userIdAtom } from "../globalAtom";
import { Toast } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';

// eslint-disable-next-line react/prop-types
const AddEmployeeButton = ({ userToken }) => {
  const [showAddEmployeePopup, setShowAddEmployeePopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId] = useAtom(userIdAtom);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleAddEmployee = async () => {
    try {
      // Create employee
      const createEmployeeResponse = await fetch(import.meta.env.VITE_API_URL + "/employee/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          accessLevel: 0,
          active: 1,
          managerId: userId,
        }),
      });
      
      if (createEmployeeResponse.ok) {
        const newEmployee = await createEmployeeResponse.json();
        const employeeId = newEmployee.id;

        // Add employee to employeeList
        const updateManagerResponse = await fetch(import.meta.env.VITE_API_URL + "/manager/addEmployee", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            managerId: userId,
            managerUpdatedData: {
              addEmployee: employeeId,
            },
          }),
        });

        if (updateManagerResponse.ok) {
          console.log("Employee added to manager's list!");
          setShowSuccessToast(true);
          setShowAddEmployeePopup(false);
        } else {
          console.error("Failed to update manager's employee list");
          setShowErrorToast(true);
        }
      } else {
        console.error("Failed to create employee");
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      setShowErrorToast(true);
    }
  };

  return (
    <>
      <Button onClick={() => setShowAddEmployeePopup(true)} className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2" style={{ zIndex: 10 }}>Add Employee</Button>
      <Modal show={showAddEmployeePopup} size="md" popup onClose={() => setShowAddEmployeePopup(false)}>
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
              <Button onClick={handleAddEmployee} className="text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded mr-2">Add</Button>
              <Button onClick={() => setShowAddEmployeePopup(false)} className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded">Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {showSuccessToast && (
        <Toast style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Employee added.</div>
          <Toast.Toggle onClick={() => setShowSuccessToast(false)} />
        </Toast>
      )}
      {showErrorToast && (
        <Toast style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Failed to add employee.</div>
          <Toast.Toggle onClick={() => setShowErrorToast(false)} />
        </Toast>
      )}
    </>
  );
};

export default AddEmployeeButton;
