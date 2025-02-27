import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddFood = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [size, setSize] = useState(1);
  const [calories, setCalories] = useState(1);
  const [meal, setMeal] = useState("snacks");

  const handleSubmit = (e) => {
    e.preventDefault();
    const foodData = { name, size, calories, meal };

    fetch(`${import.meta.env.VITE_API_URL}/api/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(foodData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Food added:", data);
        navigate("/food");
      })
      .catch((error) => console.error("Error adding food:", error));
  };

  return (
    <div className="add-food">
      <h2>Add Food</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Size (grams)</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            min="1"
            max="5000"
          />
        </div>
        <div>
          <label>Calories</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
            min="1"
            max="5000"
          />
        </div>
        <div>
          <label>Meal</label>
          <select
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            required
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
          </select>
        </div>
        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default AddFood;
