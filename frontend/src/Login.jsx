import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginRegister.module.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.loginRegisterContainer}>
      <h2>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}  className={styles.loginRegisterForm}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
      </form>
      <a href="#" className={styles.cancelLink} onClick={() => navigate("/")}>
        Cancel
      </a>
    </div>
  );
};

export default Login;
