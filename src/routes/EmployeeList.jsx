import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userTokenAtom, userIdAtom } from "../globalAtom";
import { deleteUser } from "../api/deleteUser";
import EmployeeTablesByCategory from "../components/EmployeeTablesByCategory";
import AddCategoryButton from "../components/AddCategoryButton";
import AddEmployeeButton from "../components/AddEmployeeButton";
import { getManager } from "../api/getManager";
import { updateManager } from "../api/updateManager";
import { Button, Label, Modal, TextInput } from "flowbite-react";

const EmployeeList = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [userToken] = useAtom(userTokenAtom);
  const [userId] = useAtom(userIdAtom);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [employeeFirstName, setEmployeeFirstName] = useState("");
  const [employeeLastName, setEmployeeLastName] = useState("");
  const [employeeCategory, setEmployeeCategory] = useState("");

  // Gets the manager employee list so it can be passed to the
  // TablesByCategory component
  const fetchEmployeeList = async () => {
    try {
      const userData = await getManager(userToken, userId);

      if (userData) {
        console.log(userData);
        if (userData.employeeList.length !== 0) {
          setEmployeeList(userData.employeeList);
        } else {
          setEmployeeList([]);
        }
      } else {
        console.error("Failed to fetch employee list");
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  const handleEmployeeUpdate = async () => {
    setEmployeeFirstName("");
    setEmployeeLastName("");
    setSelectedEmployee({});
  };
  const handleEmployeeDelete = async () => {
    try {
      await deleteUser(userToken, selectedEmployee.id);
      await updateManager(userToken, userId, {removeEmployee: selectedEmployee.id});
      setEmployeeFirstName("");
      setEmployeeLastName("");
      setEmployeeCategory("");
      setSelectedEmployee({});
      console.log("Employee deleted");
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 -z-50"
      >
        <div className="blur-[106px] h-1/3 bg-gradient-to-br from-primary to-secondary opacity-50 "></div>
        <div className="blur-[106px] h-3/4 bg-gradient-to-r from-forth to-fifth opacity-30"></div>
      </div>
      <div className="relative mt-16 px-8 lg:px-32 md:px-24 sm:px-16">
        <div className="flex mb-4">
          <AddCategoryButton
            userToken={userToken || ""}
            refreshEmployeeList={fetchEmployeeList}
          />
          <AddEmployeeButton
            userToken={userToken || ""}
            refreshEmployeeList={fetchEmployeeList}
          />
        </div>
        <EmployeeTablesByCategory
          userId={userId}
          userToken={userToken}
          employeeList={employeeList}
          setIsEmployeeModalOpen={setIsEmployeeModalOpen}
          setSelectedEmployee={setSelectedEmployee}
        />
        <br />
      </div>

      <Modal
        show={isEmployeeModalOpen}
        size="md"
        popup
        onClose={() => setIsEmployeeModalOpen(false)}
      >
        <Modal.Body>
          <div className="space-y-6">
            <br />
            <h2 className="text-lg font-semibold mb-4">Add Employee</h2>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeFirstName" value="First Name:" />
              </div>
              <TextInput
                id="employeeFirstName"
                type="text"
                value={employeeFirstName}
                placeholder={selectedEmployee.firstName}
                onChange={(value) => setEmployeeFirstName(value)}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeLastName" value="Last Name:" />
              </div>
              <TextInput
                id="employeeLastName"
                type="text"
                value={employeeLastName}
                placeholder={selectedEmployee.lastName}
                onChange={(value) => setEmployeeLastName(value)}
              />
            </div>

            {/* change to dropdown */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="employeeCategory" value="Category:" />
              </div>
              <TextInput
                id="employeeCategory"
                type="text"
                value={employeeCategory}
                placeholder={selectedEmployee.category}
                onChange={(value) => setEmployeeCategory(value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => handleEmployeeUpdate()}
                className="text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded mr-2"
              >
                Update
              </Button>
              <Button
                onClick={() => handleEmployeeDelete()}
                className="text-white bg-amber-500 hover:bg-amber-600 px-3 py-2 rounded mr-2"
              >
                Delete
              </Button>
              <Button
                onClick={() => {
                  setIsEmployeeModalOpen(false);
                }}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EmployeeList;
