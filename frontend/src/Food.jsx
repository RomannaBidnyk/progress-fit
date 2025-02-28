import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const Food = () => {
  const navigate = useNavigate();
  const [foodList, setFoodList] = useState([]);

  // Function to group food items by dateEaten
  const groupByDate = (foods) => {
    return foods.reduce((acc, food) => {
      const date = formatDate(food.dateEaten); // Group by dateEaten now
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(food);
      return acc;
    }, {});
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/food`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .then((data) => {
        setFoodList(data.foods || []);
      })
      .catch((error) => {
        console.error("Error fetching foods:", error);
        setFoodList([]);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/food/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFoodList((prevFoodList) =>
          prevFoodList.filter((food) => food._id !== id)
        );
        console.log(data.msg);
      })
      .catch((error) => console.error("Error deleting food:", error));
  };

  const handleEdit = (id) => {
    navigate(`/edit-food/${id}`);
  };

  const groupedFoodList = groupByDate(foodList);

  return (
    <div className="food">
      <h2>Food Page</h2>

      {/* Back Button */}
      <button className="btn" onClick={() => navigate("/dashboard")}>
        Back
      </button>

      {/* Add Food Button */}
      <button className="btn" onClick={() => navigate("/add-food")}>
        Add Food
      </button>

      {/* Food List Grouped by dateEaten */}
      <div className="food-list">
        {Object.keys(groupedFoodList).length > 0 ? (
          Object.keys(groupedFoodList).map((date) => (
            <div key={date} className="food-date-group">
              <h3>{date}</h3>
              {groupedFoodList[date].map((food) => (
                <div key={food._id} className="food-item">
                  <h4>{food.name}</h4>
                  <p>Size: {food.size}g</p>
                  <p>Calories: {food.calories}</p>
                  <p>Meal: {food.meal}</p>
                  <p>Date Eaten: {formatDate(food.dateEaten)}</p>{" "}
                  <button onClick={() => handleEdit(food._id)}>Edit</button>
                  <button onClick={() => handleDelete(food._id)}>Delete</button>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No food items found.</p>
        )}
      </div>
    </div>
  );
};

export default Food;
