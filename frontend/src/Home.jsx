import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import homeImage from "./assets/home_page.webp";

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Welcome to ProgressFit App</h1>

      <img className={styles.homeImage} src={homeImage} alt="ProgressFit App" />

      <p className={styles.description}>
        Track your weight, monitor your daily calorie intake, and visualize your
        progress over time with our easy-to-use app. Take control of your
        fitness journey today!
      </p>

      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <button
            className={styles.button}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div>
          <button
            className={styles.homeButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className={styles.homeButton}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
