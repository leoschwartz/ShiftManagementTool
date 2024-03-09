import Theme2 from "../components/theme/Theme2";
import { getAllAdminsAndManagers } from "../api/getAllAdminsAndManagers";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
import AdminAndManagerAccountTable from "../components/AdminAndManagerAccountTable";
function AdminManagerAccountList() {
  const [userToken] = useAtom(userTokenAtom);
  const [managerList, setManagerList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  // Get all admins and managers
  useEffect(() => {
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
        console.log(data);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (user) => {
    console.log("View details of user with id: ", id);
  };

  const handleDelete = (user) => {
    // Show a confirmation dialog
    const result = window.confirm("Do you want to delete " + user.email + "?");
  };

  return (
    <>
      <Theme2 />
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
    </>
  );
}

export default AdminManagerAccountList;
