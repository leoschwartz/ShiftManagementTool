import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table } from "flowbite-react";
import getCategories from "../api/getCategories";


const TablesByCategory = ({ userId, userToken, employeeList }) => {
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories(userId, userToken);
      setCategoryList(categories);
    };
    fetchCategories();
  }, [userId, userToken]);

  return (
    <>
      {categoryList.map((category, index) => (
        <div key={index}>
          <div className="overflow-x-auto mt-4">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="w-3/4">{category}</Table.HeadCell>
                <Table.HeadCell className="w-1/4"><span className="sr-only">Edit Schedule</span></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {employeeList.length > 0 ? (
                  employeeList.map((employee, index) => (
                    <Table.Row
                      key={index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="w-3/4">{`Employee#${index + 1}`}</Table.Cell>
                      <Table.Cell className="w-1/4">
                        <Link
                          to={`/scheduleEditor/${employee}`}
                          className="font-medium text-secondary hover:underline dark:text-cyan-500"
                        >
                          Edit Schedule
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-3/4">Sample Employee</Table.Cell>
                    <Table.Cell className="w-1/4">
                      <Link
                        to={`/scheduleEditor/sample`}
                        className="font-medium text-secondary hover:underline dark:text-cyan-500"
                      >
                        Edit Schedule
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      ))}
    </>
  );
};

export default TablesByCategory;
