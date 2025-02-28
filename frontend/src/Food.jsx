import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const Food = () => {
  const navigate = useNavigate();
  const [foodList, setFoodList] = useState([]);

  // Group food by date and meal
  const groupByDateAndMeal = (foods) => {
    return foods.reduce((acc, food) => {
      const date = formatDate(food.dateEaten);
      if (!acc[date]) acc[date] = {};
      if (!acc[date][food.meal]) acc[date][food.meal] = [];
      acc[date][food.meal].push(food);
      return acc;
    }, {});
  };

  // Calculate data for the Doughnut chart
  const calculateCaloriesData = (groupedFoodList, date) => {
    const chartData = [];
    const labels = [];
    const backgroundColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"]; // Colors for meals
    let totalCalories = 0;

    if (groupedFoodList[date]) {
      Object.keys(groupedFoodList[date]).forEach((meal, index) => {
        const mealFoods = groupedFoodList[date][meal];
        const mealCalories = mealFoods.reduce((sum, food) => sum + food.calories, 0);
        chartData.push(mealCalories);
        labels.push(`${meal} (${mealCalories} cal)`);
        totalCalories += mealCalories;
      });
    }

    return {
      labels,
      datasets: [
        {
          label: "Calories per Meal",
          data: chartData, // Total is NOT added here
          backgroundColor: backgroundColors,
          hoverOffset: 4,
        },
      ],
      totalCalories, // Store total separately for legend
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
        if (!response.ok) throw new Error("Unauthorized");
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
      .then(() => {
        setFoodList((prevFoodList) => prevFoodList.filter((food) => food._id !== id));
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
          Object.keys(groupedFoodList).map((date) => {
            const chartData = calculateCaloriesData(groupedFoodList, date);
            return (
              <div key={date} className="food-date-group">
                <h3>{date}</h3>

                {/* Donut Chart */}
                <div className="doughnut-chart-container">
                  <Doughnut
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          labels: {
                            color: "#000000", // Ensures all legend text is black
                            generateLabels: (chart) => {
                              let labels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
                              labels.push({
                                text: `Total: ${chartData.totalCalories} cal`,
                                fillStyle: "#000000", // Black color for "Total"
                                strokeStyle: "#000000",
                                hidden: false,
                              });
                              return labels;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

                {/* Loop through each meal for this date */}
                {Object.keys(groupedFoodList[date]).map((meal) => (
                  <div key={meal} className="food-meal-group">
                    <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                    <div className="meal-food-items">
                      {groupedFoodList[date][meal].map((food) => (
                        <div key={food._id} className="food-item">
                          <div className="food-item-header">
                            <h5>{food.name}</h5>
                            <p className="highlighted-calories">{food.calories} calories</p>
                          </div>
                          <p>Size: {food.size}g</p>
                          <p>{food.meal} on {formatDate(food.dateEaten)}</p>
                          <button onClick={() => handleEdit(food._id)}>Edit</button>
                          <button onClick={() => handleDelete(food._id)}>Delete</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <p>No food items found.</p>
        )}
      </div>
    </div>
  );
};

export default Food;
