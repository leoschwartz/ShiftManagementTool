import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { userTokenAtom } from "../globalAtom";

const EmployeeList = () => {

    const [employeeList, setEmployeeList] = useState([]);
    const [userToken] = useAtom(userTokenAtom);
    var employeeNum = 0;

    const [showAddEmployeePopup, setShowAddEmployeePopup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const openAddEmployeePopup = () => {
      setShowAddEmployeePopup(true);
    };

    const closeAddEmployeePopup = () => {
      setShowAddEmployeePopup(false);
    };

    const handleCreateEmployee = async () => {
      try {
        // Creating new user
        const createUserResponse = await fetch(`${(import.meta as any).env.VITE_API_URL}/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            accessLevel: 0,
            reportTo: "manager@gmail.com",
            active: 1,
          }),
        });
  
        if (createUserResponse.ok) {
          console.log('User created successfully!');
        } else {
          console.error('Failed to create user');
          return;
        }
  
        // Updating the employee list
        const updateUserResponse = await fetch(`${(import.meta as any).env.VITE_API_URL}/user`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            employeeList: [...employeeList, email],
          }),
        });
  
        if (updateUserResponse.ok) {
          console.log('Employee list updated successfully!');
          setEmployeeList([...employeeList, email]);
          closeAddEmployeePopup();
        } else {
          console.error('Failed to update employee list');
        }
      } catch (error) {
        console.error('Error creating employee:', error);
      }
    };
  

    useEffect(() => {
        const fetchEmployeeList = async () => {
          try {
            const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/user`, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            });
    
            if (response.ok) {
              const userData = await response.json();
    
              setEmployeeList(userData.employeeList);
            } else {
              console.error("Failed to fetch employee list");
            }
          } catch (error) {
            console.error("Error fetching employee list:", error);
          }
        };
        fetchEmployeeList();
    }, [userToken]);

    console.log(employeeList);

    return (
        <>
            <div className="absolute inset-0 bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
            <div className="flex flex-col items-center mt-16 px-8 lg:px-32 md:px-24 sm:px-16">
                {/* Add Employee button */}
                <button
                  className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                  onClick={openAddEmployeePopup}
                >
                  Add Employee
                </button>
                {/* Frame for employee list */}
                <div className="mt-4 text-center w-full">
                    <div className="bg-white p-4 border border-primary rounded-lg">
                        <ul className="text-left space-y-2">
                            {/* Render an <li> for each employee in the list */}
                            {employeeList.map((employee, index) => (
                                <li key={index} className="flex">
                                {/* <span className="ml-2">{employee.firstName + " " + employee.lastName}</span> */}
                                <span className="ml-2">Employee#{index + 1}</span>
                                </li>
                            ))}
                        </ ul>
                    </div>
                </ div>

                {/* Add Employee Popup */}
                {showAddEmployeePopup && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-8">
                    <div className="bg-white p-8 rounded-lg">
                      <h2 className="text-lg font-semibold mb-4">Add Employee</h2>
                      <label>
                        Email:
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                      </label>
                      <label>
                        Password:
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                      </label>
                      <label>
                        First Name:
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                      </label>
                      <label>
                        Last Name:
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                      </label>
                      <div className="flex justify-end">
                        <button
                          className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                          onClick={handleCreateEmployee}
                        >
                          Create
                        </button>
                        <button
                          className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                          onClick={closeAddEmployeePopup}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
        </>
    );
};

export default EmployeeList;