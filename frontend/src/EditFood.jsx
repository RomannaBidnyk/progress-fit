import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditFood = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState({
    name: "",
    size: 1,
    calories: 0,
    meal: "snacks",
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
    <div>
      <h2>Edit Food</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={food.name}
          onChange={handleChange}
          placeholder="Food Name"
        />
        <input
          type="number"
          name="size"
          value={food.size}
          onChange={handleChange}
          placeholder="Size (grams)"
        />
        <input
          type="number"
          name="calories"
          value={food.calories}
          onChange={handleChange}
          placeholder="Calories"
        />
        <select name="meal" value={food.meal} onChange={handleChange}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snacks">Snacks</option>
        </select>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditFood;
