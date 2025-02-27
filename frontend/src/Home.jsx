import { useNavigate } from "react-router-dom";

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to ProgressFit App</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      )}
    </div>
  );
};

export default Home;
