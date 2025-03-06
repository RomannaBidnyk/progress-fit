import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import weightIcon from "./assets/weight-icon.jpg";
import foodIcon from "./assets/food-icon.webp";

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
        <div className={styles.card} onClick={() => navigate("/weight")}>
          <img src={weightIcon} alt="Weight" />
          <p>Log Weight</p>
        </div>
        <div className={styles.card} onClick={() => navigate("/food")}>
          <img src={foodIcon} alt="Food" />
          <p>Track Food</p>
        </div>
      </div>
      <br />
      <a href="#" className={styles.logoutLink} onClick={handleLogout}>
        Logout
      </a>
    </div>
  );
};

export default Dashboard;
