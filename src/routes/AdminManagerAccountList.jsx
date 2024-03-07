import Theme2 from "../components/theme/Theme2";
import { getAllAdminsAndManagers } from "../api/getAllAdminsAndManagers";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userTokenAtom } from "../globalAtom";
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
        {/* see all */}
        {/* See only managers */}
        {/* See only admins */}
      </section>
    </>
  );
}

export default AdminManagerAccountList;
