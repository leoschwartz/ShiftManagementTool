import "./App.css";
import SchedulePage from "./routes/SchedulePage";
import Homepage from "./routes/Homepage";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Profile from "./routes/Profile";
import { useState } from "react";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> 
                <Login setIsLoggedIn={setIsLoggedIn} />
              </>
            }
          ></Route>
          <Route
            path="*"
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                 {isLoggedIn ? (
                  <Homepage />
                ) : (
                  <Login setIsLoggedIn={setIsLoggedIn} />
                )}
              </>
            }
          ></Route>
          <Route
            path="/homepage"
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> 
                <Homepage />
              </>
            }
          ></Route>
          <Route
            path="/profile"
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> 
                <Profile />
              </>
            }
          ></Route>
          <Route
            path="/schedule"
            element={
              <>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> 
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