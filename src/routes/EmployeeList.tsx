import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { userTokenAtom } from "../globalAtom";

const EmployeeList = () => {

    const [employeeList, setEmployeeList] = useState([]);
    const [userToken] = useAtom(userTokenAtom);
    var employeeNum = 0;

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

    return (
        <>
            <div className="absolute inset-0 bg-gradient-to-tr from-third to-fifth -z-10 opacity-50"></div>
            <div className="flex flex-col items-center mt-16 px-8 lg:px-32 md:px-24 sm:px-16">
                {/* Frame for employee list */}
                <div className="mt-4 text-center w-full">
                    <div className="bg-white p-4 border border-primary rounded-lg">
                        <ul className="text-left space-y-2">
                            <li className="flex">
                                <span className="ml-2">Employee name</span>
                            </li>
                            {/* Render an <li> for each employee in the list */}
                            {employeeList.map((employee, index) => (
                                <li key={index} className="flex">
                                {/* <span className="ml-2">{employee.firstName + " " + employee.lastName}</span> */}
                                <span className="ml-2">Employee#{employeeNum}</span>
                                </li>
                            ))}
                        </ ul>
                    </div>
                </ div>
            </div>
        </>
    );
};

export default EmployeeList;