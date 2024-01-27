import "./App.css";
import SchedulePage from "./routes/SchedulePage";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Profile from "./routes/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Error404 from "./routes/Error404";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/profile" element={<Profile />}></Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/schedule" element={<SchedulePage />} />
          </Route>
          <Route path="*" element={<Error404 />}></Route>
        </Routes>
      </Router>
    </>
  );
}
export default App;
