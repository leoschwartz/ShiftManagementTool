import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Spinner } from "flowbite-react";
import getCategories from "../api/getCategories";
import { getUserById } from "../api/getUserById";

const EmployeeTablesByCategory = ({
  userId,
  userToken,
  employeeList,
  setIsEmployeeModalOpen,
  setSelectedEmployee,
  isEmployeeModalOpen,
}) => {
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
      const array = await Promise.all(
        employeeList.map(async (employee) => {
          const employeeDetails = await getUserById(userToken, employee);
          return employeeDetails;
        })
      );
      // console.log(array);
      setEmployeeListDetails(array);
      setLoading(false);
    };
    fetchCategories();
  }, [employeeList, isEmployeeModalOpen]);

  useEffect(() => {

    if (employeeListDetails) {
      setUndefinedCategoryEmployees(
        employeeListDetails.filter(
          (employee) => employee?.accountInfo?.category === -1
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

                    <Table.HeadCell className="w-2/5">
                      Undefined Category
                    </Table.HeadCell>
                    <Table.HeadCell className=" flex justify-center">
                      Options

                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {undefinedCategoryEmployees.map((employee, index) => (

                      <Table.Row key={index} className="bg-white">
                        <Table.Cell className="w-2/5">{`${employee.firstName} ${employee.lastName}`}</Table.Cell>
                        <Table.Cell className=" flex justify-end">

                          <Link
                            to={`/scheduleEditor/${employee.id}`}
                            className="font-medium text-secondary hover:underline mr-4 text-nowrap"
                          >
                            Edit Schedule
                          </Link><br/>
                          <Link
                            to={`/scheduleTemplateEditor/${employee.id}`}
                            className="font-medium text-secondary hover:underline dark:text-cyan-500"
                          >
                            Edit Schedule Template
                          </Link><br/>
                          <Link
                            to={`/performance/${employee.id}`}
                            className="font-medium text-secondary hover:underline text-nowrap mr-4"
                          >
                            View Performance
                          </Link>
                          <a
                            className="font-medium text-secondary hover:underline hover:cursor-pointer text-nowrap"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsEmployeeModalOpen(true);
                            }}
                          >
                            View Account
                          </a>
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
                    <Table.HeadCell className="w-2/5">
                      {category}
                    </Table.HeadCell>
                    <Table.HeadCell className=" flex justify-center">
                      Options
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {employeeListDetails
                      .filter((employee) => {
                        return employee?.accountInfo.category === index;
                      })
                      .map((employee, index) => (
                        <Table.Row key={index} className="bg-white ">
                          <Table.Cell className="w-2/5">{`${employee.firstName} ${employee.lastName}`}</Table.Cell>
                          <Table.Cell className=" flex justify-end">
                            <Link
                              to={`/scheduleEditor/${employee.id}`}
                              className="font-medium text-secondary hover:underline mr-4 text-nowrap"
                            >
                              Edit Schedule
                            </Link><br/>
                            <Link
                              to={`/scheduleTemplateEditor/${employee.id}`}
                              className="font-medium text-secondary hover:underline dark:text-cyan-500"
                            >
                              Edit Schedule Template
                            </Link><br/>
                            <Link
                              to={`/performance/${employee.id}`}
                              className="font-medium text-secondary hover:underline text-nowrap "
                            >
                              View Performance
                            </Link>
                            <Link
                              to={`/performance/${employee.id}`}
                              className="font-medium text-secondary hover:underline text-nowrap mr-4"
                            >
                              View Performance
                            </Link>
                            <a
                              className="font-medium text-secondary hover:underline hover:cursor-pointer text-nowrap"
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setIsEmployeeModalOpen(true);
                              }}
                            >
                              View Account
                            </a>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    {/* Render if no employees for the category */}
                    {employeeListDetails.filter((employee) => {
                      employee?.accountInfo?.category && employee?.accountInfo?.category === index;
                    }).length === 0 && (
                      <Table.Row className="bg-white">
                        <Table.Cell className="w-2/5">
                          No employees for this category
                        </Table.Cell>
                        <Table.Cell></Table.Cell> {/* */}
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
