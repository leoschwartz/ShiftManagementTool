import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { Table } from "flowbite-react";
import { userTokenAtom, userIdAtom } from "../globalAtom";
import React from "react";
import TablesByCategory from "../components/TablesByCategory";
import AddCategoryButton from "../components/AddCategoryButton";

const EmployeeList = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [userToken] = useAtom(userTokenAtom);
  const [userId] = useAtom(userIdAtom);

  useEffect(() => {
    // Gets the manager employee list so it can be passed to the 
    // TablesByCategory component
    const fetchEmployeeList = async () => {
      try {
        const response = await fetch(
          `${(import.meta as any).env.VITE_API_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          if (userData.employeeList) {
            setEmployeeList(userData.employeeList);
          } else {
            console.warn("employeeList is null!");
            setEmployeeList([]);
          }
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
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 -z-50"
      >
        <div className="blur-[106px] h-1/3 bg-gradient-to-br from-primary to-secondary opacity-50 "></div>
        <div className="blur-[106px] h-3/4 bg-gradient-to-r from-forth to-fifth opacity-30"></div>
      </div>
      <div className="relative mt-16 px-8 lg:px-32 md:px-24 sm:px-16">
        <AddCategoryButton userToken={userToken} />
        <TablesByCategory userId={userId} userToken={userToken} employeeList={employeeList} />
        <br />
      </div>
    </>
  );
};

export default EmployeeList;