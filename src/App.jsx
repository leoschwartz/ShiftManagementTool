import "./App.css";
import Home from "./routes/Home";
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
                <Navbar />
                <Login />
              </>
            }
          ></Route>
          <Route
            path="/home-test"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          ></Route>
          <Route
            path="*"
            element={
              <>
                <Navbar />
                {isLoggedIn ? (
                  <Homepage />
                ) : (
                  <Login setIsLoggedIn={setIsLoggedIn} />
                )}
              </>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;