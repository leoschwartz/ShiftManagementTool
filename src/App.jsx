import "./App.css";
import SchedulePage from "./routes/SchedulePage";
import Homepage from "./routes/Homepage";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Profile from "./routes/Profile";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "./globalAtom";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  return (
    // <>
    //   <Router>
    //     <Routes>
    //       <Route
    //         path="/login"
    //         element={
    //           <>
    //             <Navbar />
    //             <Login />
    //           </>
    //         }
    //       ></Route>
    //       <Route
    //         path="*"
    //         element={
    //           <>
    //             <Navbar />
    //             {isLoggedIn ? <Homepage /> : <Login />}
    //           </>
    //         }
    //       ></Route>
    //       <Route
    //         path="/homepage"
    //         element={
    //           <>
    //             <Navbar />
    //             <Homepage />
    //           </>
    //         }
    //       ></Route>
    //       <Route
    //         path="/profile"
    //         element={
    //           <>
    //             <Navbar />
    //             <Profile />
    //           </>
    //         }
    //       ></Route>
    //       <Route
    //         path="/schedule"
    //         element={
    //           <>
    //             <Navbar />
    //             <SchedulePage />
    //           </>
    //         }
    //       ></Route>
    //     </Routes>
    //   </Router>
    // </>
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          ></Route>
          <Route
            path="/homepage"
            element={
              <>
                <Homepage />
              </>
            }
          ></Route>
          <Route
            path="/profile"
            element={
              <>
                <Profile />
              </>
            }
          ></Route>
          <Route
            path="/schedule"
            element={
              <>
                <SchedulePage />
              </>
            }
          ></Route>
          <Route
            path="*"
            element={<>{isLoggedIn ? <Homepage /> : <Login />}</>}
          ></Route>
          {/* for testing */}
          <Route path="landing" element={<Landing />} />
          <Route element={<ProtectedRoute />}>
            <Route path="home" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="analytics" element={<Analytics />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<p>There&apos;s nothing here: 404!</p>} />
          {/* delete above */}
        </Routes>
      </Router>
    </>
  );
}

// for testing
const Landing = () => {
  return <h2>Landing (Public: anyone can access this page)</h2>;
};

const Home = () => {
  return <h2>Home (Protected: authenticated user required)</h2>;
};

const Dashboard = () => {
  return <h2>Dashboard (Protected: authenticated user required)</h2>;
};

const Analytics = () => {
  return (
    <h2>
      Analytics (Protected: authenticated user with permission analyze required)
    </h2>
  );
};

const Admin = () => {
  return (
    <h2>Admin (Protected: authenticated user with role admin required)</h2>
  );
};
export default App;
