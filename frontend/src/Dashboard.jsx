// src/Dashboard.jsx
import { useNavigate } from "react-router-dom";

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the authentication token from localStorage
    localStorage.removeItem("token");

    // Clear the user state
    setUser(null);

    // Redirect the user to the login page
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
