import { useNavigate } from "react-router-dom";

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}!</h2>
      <div className="dashboard-buttons">
        <button className="btn" onClick={() => navigate("/weight")}>
          Weight
        </button>
        <button className="btn" onClick={() => navigate("/food")}>
          Food
        </button>
      </div>
      <br />
      <button className="btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
