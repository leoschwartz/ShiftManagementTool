import Theme2 from "../components/theme/Theme2";
import { getAllAdminsAndManagers } from "../api/getAllAdminsAndManagers";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
import AdminAndManagerAccountTable from "../components/AdminAndManagerAccountTable";
import { deleteUser } from "../api/deleteUser";
import Modal from "../components/utils/Modal";
import SuccessToast from "../components/utils/SuccessToast";
import ErrorToast from "../components/utils/ErrorToast";

function AdminManagerAccountList() {
  const [userToken] = useAtom(userTokenAtom);
  const [managerList, setManagerList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [ToastMessage, setToastMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  // Get all admins and managers
  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (user) => {
    setModalTitle("Edit " + user.email);
    setIsModalOpen(true);
    setSelectedUser(user);
  };

  const handleDelete = async (user) => {
    const result = window.confirm("Do you want to delete " + user.email + "?");
    if (result) {
      const data = await deleteUser(userToken, user.id);
      if (data && data.status == "ok") {
        fetchData();
        setShowSuccessToast(true);
        setToastMessage("User deleted successfully");
      } else {
        setShowErrorToast(true);
        setToastMessage("Failed to delete user");
      }
    }
  };

  const fetchData = async () => {
    const data = await getAllAdminsAndManagers(userToken);
    if (data) {
      data.managers.forEach((manager) => {
        const milliseconds =
          manager.createdOn.seconds * 1000 +
          manager.createdOn.nanoseconds / 1000000;
        manager.createdOn = new Date(milliseconds).toLocaleDateString();
      });
      data.admins.forEach((admin) => {
        const milliseconds =
          admin.createdOn.seconds * 1000 +
          admin.createdOn.nanoseconds / 1000000;
        admin.createdOn = new Date(milliseconds).toLocaleDateString();
      });
      setManagerList(data.managers);
      setAdminList(data.admins);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <>
      <Theme2 />
      <Modal
        title={modalTitle}
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form
          className="space-y-4 max-w-lg mx-auto my-3"
          onSubmit={handleFormSubmit}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="firstName"
              className="mb-2 font-semibold text-primary"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              value={selectedUser.firstName}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fifth ml-2 w-7/12 xs:w-3/4"
            />
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="lastName"
              className="mb-2 font-semibold text-primary"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              value={selectedUser.lastName}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fifth ml-2 w-7/12 xs:w-3/4"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="email" className="mb-2 font-semibold text-primary">
              Email:
            </label>
            <input
              type="text"
              id="email"
              value={selectedUser.email}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fifth ml-2 w-7/12 xs:w-3/4"
            />
          </div>
          <button
            type="submit"
            className="font-medium bg-forth hover:bg-third text-white py-2 px-4 rounded float-end"
          >
            Update
          </button>
        </form>
      </Modal>
      <section className="overflow-x-auto mx-2 sm:mx-6">
        <h1 className="text-3xl font-semibold tracking-wide my-4 text-primary">
          Account manager
        </h1>
        <div>
          <h2 className="text-2xl font-semibold text-secondary my-2">Admin</h2>
          <AdminAndManagerAccountTable
            userList={adminList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-secondary my-2">
            Manager
          </h2>
          <AdminAndManagerAccountTable
            userList={managerList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </section>
      {showSuccessToast && (
        <SuccessToast
          message={ToastMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      {showErrorToast && (
        <ErrorToast
          message={ToastMessage}
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </>
  );
}

export default AdminManagerAccountList;
