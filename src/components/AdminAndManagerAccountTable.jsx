import { Table } from "flowbite-react";
import PropTypes from "prop-types";

AdminAndManagerAccountTable.propTypes = {
  userList: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

function AdminAndManagerAccountTable(props) {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>Full Name</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Active</Table.HeadCell>
        <Table.HeadCell>Created On</Table.HeadCell>
        <Table.HeadCell>
          <span className="sr-only">Details</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {props.userList.map((user) => (
          <Table.Row key={user.id} className="bg-white ">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">
              {user.firstName} {user.lastName}
            </Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>{user.active ? "Yes" : "No"}</Table.Cell>
            <Table.Cell>{user.createdOn}</Table.Cell>
            <Table.Cell>
              <button
                onClick={() => props.handleEdit(user)}
                className="font-medium bg-forth hover:bg-third text-white py-2 px-4 rounded mr-3"
              >
                Edit
              </button>
              <button
                onClick={() => props.handleDelete(user)}
                className="font-medium bg-forth hover:bg-third text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default AdminAndManagerAccountTable;
