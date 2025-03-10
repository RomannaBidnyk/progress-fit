import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditFood.module.css";

const EditFood = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState({
    name: "",
    size: 1,
    calories: 0,
    meal: "snacks",
    dateEaten: "",
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/food/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFood(data.food);
      })
      .catch((err) => {
        console.error("Error fetching food:", err);
      });
  }, [id, user.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood((prevFood) => ({
      ...prevFood,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_URL}/api/food/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(food),
    })
      .then((response) => response.json())
      .then(() => {
        navigate("/food");
      })
      .catch((err) => {
        console.error("Error updating food:", err);
      });
  };

  return (
    <div className={styles.editFoodContainer}>
      <div className={styles.editFoodCard}>
        <h2>Edit Food</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={food.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Size (grams)</label>
            <input
              type="number"
              name="size"
              value={food.size}
              onChange={handleChange}
              required
              min="1"
              max="5000"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Calories</label>
            <input
              type="number"
              name="calories"
              value={food.calories}
              onChange={handleChange}
              required
              min="1"
              max="5000"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Meal</label>
            <select
              name="meal"
              value={food.meal}
              onChange={handleChange}
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Date Eaten</label>
            <input
              type="date"
              name="dateEaten"
              value={food.dateEaten}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>

        <a className={styles.cancelLink} onClick={() => navigate("/food")}>
          Cancel
        </a>
      </div>
    </div>
  );
};

export default EditFood;
