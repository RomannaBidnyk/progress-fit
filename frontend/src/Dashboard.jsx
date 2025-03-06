import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css"; // Import the styles

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className={styles.dashboard}>
      <h2>Welcome, {user.name}!</h2>
      <p className={styles.description}>
        Track your progress by logging your weight and food intake. Use the
        buttons below to navigate to different sections.
      </p>
      <div className={styles.dashboardButtons}>
        <button className={styles.btn} onClick={() => navigate("/weight")}>
          Weight
        </button>
        <button className={styles.btn} onClick={() => navigate("/food")}>
          Food
        </button>
      </div>
      <br />
      <a href="#" className={styles.logoutLink} onClick={handleLogout}>
        Logout
      </a>
    </div>
  );
};

export default Dashboard;
