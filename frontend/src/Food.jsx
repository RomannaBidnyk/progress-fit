import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import styles from "./Food.module.css";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const formatDate = (dateString) => {
  const date = new Date(dateString).toLocaleDateString("en-US", {
    timeZone: "UTC",
  });
  return date;
};

const Food = () => {
  const navigate = useNavigate();
  const [foodList, setFoodList] = useState([]);

  const groupByDateAndMeal = (foods) => {
    return foods.reduce((acc, food) => {
      const date = formatDate(food.dateEaten);
      if (!acc[date]) acc[date] = {};
      if (!acc[date][food.meal]) acc[date][food.meal] = [];
      acc[date][food.meal].push(food);
      return acc;
    }, {});
  };

  const sortGroupedFood = (groupedFoodList) => {
    const sortedDates = Object.keys(groupedFoodList).sort(
      (a, b) => new Date(b) - new Date(a)
    );
    return sortedDates;
  };

  const calculateCaloriesData = (groupedFoodList, date) => {
    const chartData = [];
    const labels = [];
    const backgroundColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#FF9F40",
    ];
    let totalCalories = 0;

    if (groupedFoodList[date]) {
      Object.keys(groupedFoodList[date]).forEach((meal) => {
        const mealFoods = groupedFoodList[date][meal];
        const mealCalories = mealFoods.reduce(
          (sum, food) => sum + food.calories,
          0
        );
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
          data: chartData,
          backgroundColor: backgroundColors,
          hoverOffset: 4,
        },
      ],
      totalCalories,
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
        setFoodList((prevFoodList) =>
          prevFoodList.filter((food) => food._id !== id)
        );
      })
      .catch((error) => console.error("Error deleting food:", error));
  };

  const handleEdit = (id) => {
    navigate(`/edit-food/${id}`);
  };

  const groupedFoodList = groupByDateAndMeal(foodList);
  const sortedDates = sortGroupedFood(groupedFoodList);

  return (
    <div className={styles.food}>
      <button
        className={styles.backButton}
        onClick={() => navigate("/dashboard")}
      >
        ← Dashboard
      </button>

      <h2 className={styles.title}>Food Tracker</h2>

      <button className={styles.addFood} onClick={() => navigate("/add-food")}>
        Add Food
      </button>

      <div className={styles.foodList}>
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => {
            const chartData = calculateCaloriesData(groupedFoodList, date);
            return (
              <div key={date} className={styles.foodDateGroup}>
                <div className={styles.dateHeader}>
                  <h3 className={styles.totalCalories}>
                    {chartData.totalCalories} calories total
                  </h3>
                  <h3>{date}</h3>
                </div>

                {/* Donut Chart */}
                <div className={styles.chartAndMealData}>
                  <div className={styles.doughnutChartContainer}>
                    <Doughnut
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: "bottom",
                          },
                          tooltip: {
                            callbacks: {
                              label: (tooltipItem) => {
                                return `${tooltipItem.label.split(" (")[0]}: ${
                                  tooltipItem.raw
                                } cal`;
                              },
                              footer: (tooltipItems) => {
                                const dataset =
                                  tooltipItems[0]?.dataset?.data || [];
                                const totalCalories = dataset.reduce(
                                  (acc, val) => acc + val,
                                  0
                                );
                                return `Total Calories: ${totalCalories} cal`;
                              },
                            },
                          },
                          title: {
                            display: true,
                            text: "Calories per meal",
                          },
                        },
                      }}
                    />
                  </div>

                  <div className={styles.foodMealGroup}>
                    {Object.keys(groupedFoodList[date]).map((meal) => (
                      <div key={meal} className={styles.foodMealGroup}>
                        <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                        <div className={styles.mealFoodItems}>
                          {groupedFoodList[date][meal].map((food) => (
                            <div key={food._id} className={styles.foodCard}>
                              <div className={styles.foodCardHeader}>
                                <h5>{food.name}</h5>
                                <p className={styles.highlightedCalories}>
                                  {food.calories} calories
                                </p>
                              </div>
                              <p>Size: {food.size}g</p>
                              <div className={styles.cardActions}>
                                <button
                                  className={styles.editButton}
                                  onClick={() => handleEdit(food._id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className={styles.deleteButton}
                                  onClick={() => handleDelete(food._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
