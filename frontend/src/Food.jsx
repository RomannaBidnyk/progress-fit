import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const Food = () => {
  const navigate = useNavigate();
  const [foodList, setFoodList] = useState([]);

  // Function to group food items by dateEaten and then by meal
  const groupByDateAndMeal = (foods) => {
    return foods.reduce((acc, food) => {
      const date = formatDate(food.dateEaten); // Group by dateEaten
      if (!acc[date]) {
        acc[date] = {}; // Initialize a new date group if it doesn't exist
      }
      if (!acc[date][food.meal]) {
        acc[date][food.meal] = []; // Initialize a new meal group inside the date
      }
      acc[date][food.meal].push(food); // Add food to the correct group
      return acc;
    }, {});
  };

  // Function to calculate the calories per meal for the doughnut chart
  const calculateCaloriesData = (groupedFoodList, date) => {
    const chartData = [];
    const labels = [];
    
    if (groupedFoodList[date]) {
      Object.keys(groupedFoodList[date]).forEach((meal) => {
        const mealFoods = groupedFoodList[date][meal];
        const totalCalories = mealFoods.reduce(
          (sum, food) => sum + food.calories,
          0
        );
        chartData.push(totalCalories);
        labels.push(`${meal} (${totalCalories} cal)`);
      });
    }

    return {
      labels,
      datasets: [
        {
          label: "Calories per Meal",
          data: chartData,
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"
          ],
          hoverOffset: 4,
        },
      ],
    };
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
        const foods = data.foods || [];
        setFoodList(foods);
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

  const groupedFoodList = groupByDateAndMeal(foodList);

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

      {/* Food List Grouped by Date and Meal */}
      <div className="food-list">
        {Object.keys(groupedFoodList).length > 0 ? (
          Object.keys(groupedFoodList).map((date) => (
            <div key={date} className="food-date-group">
              <h3>{date}</h3>

              {/* Display the donut chart for each date */}
              <div className="doughnut-chart-container">
                <Doughnut data={calculateCaloriesData(groupedFoodList, date)} />
              </div>

              {/* Loop through each meal type for this date */}
              {Object.keys(groupedFoodList[date]).map((meal) => (
                <div key={meal} className="food-meal-group">
                  <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                  <div className="meal-food-items">
                    {groupedFoodList[date][meal].map((food) => (
                      <div key={food._id} className="food-item">
                        <div className="food-item-header">
                          <h5>{food.name}</h5>
                          <p className="highlighted-calories">
                            {food.calories} calories
                          </p>{" "}
                          {/* Highlighted calories */}
                        </div>
                        <p>Size: {food.size}g</p>
                        <p>
                          {food.meal} on {formatDate(food.dateEaten)}
                        </p>
                        <button onClick={() => handleEdit(food._id)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(food._id)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
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
