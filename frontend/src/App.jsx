import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Weight from "./Weight";
import Food from "./Food";
import AddFood from "./AddFood";
import EditFood from "./EditFood";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/weight" element={<Weight />} />
        <Route
          path="/food"
          element={user ? <Food user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/add-food"
          element={user ? <AddFood user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-food/:id"
          element={user ? <EditFood user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
