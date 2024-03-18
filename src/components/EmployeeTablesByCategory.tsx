import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Spinner } from "flowbite-react";
import getCategories from "../api/getCategories";
import { getUser } from "../api/getUser";

const EmployeeTablesByCategory = ({ userId, userToken, employeeList }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeListDetails, setEmployeeListDetails] = useState<any[]>([]);
  const [undefinedCategoryEmployees, setUndefinedCategoryEmployees] = useState<
    any[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories(userId, userToken);
      setCategoryList(categories);
      // for (let i = 0; i < employeeList.length; i++) {
      //   const employeeDetails = await getUser(userToken, employeeList[i]);
      //   setEmployeeListDetails((prevState) => [...prevState, employeeDetails]);
      // }
      const array = await Promise.all(
        employeeList.map(async (employee) => {
          const employeeDetails = await getUser(userToken, employee);
          return employeeDetails;
        })
      );
      setEmployeeListDetails(array);
      setLoading(false);
    };
    fetchCategories();
  }, [employeeList]);

  useEffect(() => {
    if (employeeListDetails) {
      setUndefinedCategoryEmployees(
        employeeListDetails.filter(
          (employee) => employee.accountInfo.category === -1
        )
      );
    } else {
      setUndefinedCategoryEmployees([]);
    }
  }, [employeeListDetails]);

  return (
    <>
      {loading ? ( // Spinner while loading
        <div className="flex justify-center mt-8">
          <Spinner color="pink" aria-label="Loading..." />
        </div>
      ) : (
        <>
          {/* Table for employees with no category */}
          {undefinedCategoryEmployees.length > 0 && (
            <div>
              <div className="overflow-x-auto mt-4">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell className="w-3/4">
                      Undefined Category
                    </Table.HeadCell>
                    <Table.HeadCell className="w-1/4">
                      <span className="sr-only">Edit Schedule</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {undefinedCategoryEmployees.map((employee, index) => (
                      <Table.Row
                        key={index}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Table.Cell className="w-3/4">{`${employee.firstName} ${employee.lastName}`}</Table.Cell>
                        <Table.Cell className="w-1/4">
                          <Link
                            to={`/scheduleEditor/${employee.id}`}
                            className="font-medium text-secondary hover:underline mr-4 text-nowrap"
                          >
                            Edit Schedule
                          </Link>
                          <Link
                            to={`/performance/${employee.id}`}
                            className="font-medium text-secondary hover:underline text-nowrap "
                          >
                            View Performance
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          )}

          {/* Tables for the other categories */}
          {categoryList.map((category, index) => (
            <div key={index}>
              <div className="overflow-x-auto mt-4">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell className="w-3/4">
                      {category}
                    </Table.HeadCell>
                    <Table.HeadCell className="w-1/4">
                      <span className="sr-only">Edit Schedule</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {employeeList
                      .filter((employee) => employee.category === index)
                      .map((employee, index) => (
                        <Table.Row
                          key={index}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell className="w-3/4">{`Employee#${
                            index + 1
                          }`}</Table.Cell>
                          <Table.Cell className="w-1/4">
                            <Link
                              to={`/scheduleEditor/${employee.id}`}
                              className="font-medium text-secondary hover:underline dark:text-cyan-500"
                            >
                              Edit Schedule
                            </Link>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    {/* Render if no employees for the category */}
                    {employeeListDetails.filter(
                      (employee) => employee.category === index
                    ).length === 0 && (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="w-3/4">
                          No employees for this category
                        </Table.Cell>
                        <Table.Cell className="w-1/4"></Table.Cell> {/* */}
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default EmployeeTablesByCategory;
