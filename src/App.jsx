import "./App.css";
import ScheduleView from "./routes/ScheduleView";
import ScheduleEditor from "./routes/ScheduleEditor";
import ScheduleTemplateEditor from "./routes/ScheduleTemplateEditor";
import Navbar from "./components/Navbar";
import NotificationIcon from "./components/NotificationIcon";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Profile from "./routes/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Error404 from "./routes/Error404";
import Unauthorize from "./routes/Unauthorize";
import AuthorizationCheck from "./components/AuthorizationCheck";
import AddNewUserPage from "./routes/AddNewUserPage";
import EmployeeList from "./routes/EmployeeList";
import AdminManagerAccountList from "./routes/AdminManagerAccountList";
import PerformanceView from "./routes/PerformanceView";
import ScheduleUnassignedEditor from "./routes/ScheduleUnassignedEditor";
import ScheduleUnassignedView from "./routes/ScheduleUnassignedView";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <NotificationIcon />
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <AuthorizationCheck
                  accessLevel={import.meta.env.VITE_ADMIN_ACCESS}
                />
              }
            >
              <Route
                path="/accountManager"
                element={<AdminManagerAccountList />}
              />
              <Route path="/addNewUser" element={<AddNewUserPage />}></Route>
            </Route>
            <Route
              element={
                <AuthorizationCheck
                  accessLevel={import.meta.env.VITE_MANAGER_ACCESS}
                />
              }
            >
              <Route
                path="/scheduleEditor/:employee"
                element={<ScheduleEditor />}
              ></Route>
              <Route
                path="/scheduleTemplateEditor/:employee"
                element={<ScheduleTemplateEditor />}
              ></Route>
              <Route
                path="/scheduleUnassignedEditor"
                element={<ScheduleUnassignedEditor />}
              ></Route>
              <Route
                path="/performance/:employeeId"
                element={<PerformanceView />}
              ></Route>
            </Route>
            <Route
              element={
                <AuthorizationCheck
                  accessLevel={import.meta.env.VITE_EMPLOYEE_ACCESS}
                />
              }
            >
              <Route path="/schedule" element={<ScheduleView />}></Route>
              <Route
                path="/scheduleUnassignedView"
                element={<ScheduleUnassignedView />}
              ></Route>
            </Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/unauthorize" element={<Unauthorize />} />
          </Route>
          <Route path="*" element={<Login />}></Route>
          <Route path="*" element={<Error404 />}></Route>
          <Route path="/employeeList" element={<EmployeeList />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
