import "./App.css";
import Homepage from "./routes/Homepage";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
