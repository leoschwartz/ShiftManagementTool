import Theme2 from "../components/theme/Theme2";
import { getAllAdminsAndManagers } from "../api/getAllAdminsAndManagers";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
import { Table } from "flowbite-react";
function AdminManagerAccountList() {
  const [userToken] = useAtom(userTokenAtom);
  const [managerList, setManagerList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  // Get all admins and managers
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllAdminsAndManagers(userToken);
      console.log(data);
      if (data) {
        setManagerList(data.managers);
        setAdminList(data.admins);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Theme2 />
      <section>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Product name</Table.HeadCell>
            <Table.HeadCell>Color</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {'Apple MacBook Pro 17"'}
              </Table.Cell>
              <Table.Cell>Sliver</Table.Cell>
              <Table.Cell>Laptop</Table.Cell>
              <Table.Cell>$2999</Table.Cell>
              <Table.Cell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Edit
                </a>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </section>
    </>
  );
}

export default AdminManagerAccountList;
