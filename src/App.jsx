import "./App.css";
import SchedulePage from "./routes/SchedulePage";
import Homepage from "./routes/Homepage";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Profile from "./routes/Profile";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "./globalAtom";
function App() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
              </>
            }
          ></Route>
          <Route
            path="*"
            element={
              <>
                <Navbar />
                {isLoggedIn ? <Homepage /> : <Login />}
              </>
            }
          ></Route>
          <Route
            path="/homepage"
            element={
              <>
                <Navbar />
                <Homepage />
              </>
            }
          ></Route>
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          ></Route>
          <Route
            path="/schedule"
            element={
              <>
                <Navbar />
                <SchedulePage />
              </>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
