import "./App.css";
import Homepage from "./routes/Homepage";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <Navbar />
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
