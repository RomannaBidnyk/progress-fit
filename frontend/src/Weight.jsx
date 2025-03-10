import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styles from "./Weight.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Weight = () => {
  const navigate = useNavigate();

  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState({ weight: "", weightOnDate: "" });
  const [error, setError] = useState(null);
  const [editWeightId, setEditWeightId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [weightsPerPage] = useState(5);

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to midnight to avoid time issues
    return today.toISOString().split("T")[0]; // Return the date in YYYY-MM-DD format
  };

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/weights`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weights");
        }

        const data = await response.json();
        const sortedWeights = data.weights.sort(
          (a, b) => new Date(b.weightOnDate) - new Date(a.weightOnDate) // Descending order for the list
        );

        setWeights(sortedWeights);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching weights:", error);
      }
    };

    fetchWeights();
  }, []);

  useEffect(() => {
    setNewWeight({ weight: "", weightOnDate: getTodayDate() });
  }, []);

  const handleChange = (e) => {
    setNewWeight({
      ...newWeight,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateWeight = async (e) => {
    e.preventDefault();

    const dateInput = new Date(newWeight.weightOnDate);
    const formattedDate = dateInput.toISOString().split("T")[0];

    if (
      weights.some(
        (w) =>
          new Date(w.weightOnDate).toISOString().split("T")[0] === formattedDate
      )
    ) {
      setError(
        "Weight entry for this date already exists. Try editing the existing entry."
      );
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/weights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...newWeight,
            weightOnDate: formattedDate, // Send correctly formatted date
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create weight entry");
      }
      const data = await response.json();

      const updatedWeights = [...weights, data.newWeight].sort(
        (a, b) => new Date(b.weightOnDate) - new Date(a.weightOnDate) // Descending order for the list
      );

      setWeights(updatedWeights);
      setNewWeight({ weight: "", weightOnDate: getTodayDate() });
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error("Error creating weight:", error);
    }
  };

  const handleEditWeight = (weightId, weightData) => {
    setEditWeightId(weightId);
    setNewWeight({
      weight: weightData.weight,
      weightOnDate: weightData.weightOnDate.split("T")[0],
    });
  };

  const handleUpdateWeight = async (e) => {
    e.preventDefault();

    const dateInput = new Date(newWeight.weightOnDate);
    const formattedDate = dateInput.toISOString().split("T")[0];

    if (
      weights.some(
        (w) =>
          w._id !== editWeightId && // Exclude the currently edited weight
          new Date(w.weightOnDate).toISOString().split("T")[0] === formattedDate
      )
    ) {
      setError(
        "A weight entry already exists for this date. Please choose another date."
      );
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/weights/${editWeightId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...newWeight,
            weightOnDate: formattedDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update weight entry");
      }

      const data = await response.json();
      const updatedWeights = weights.map((weight) =>
        weight._id === data.updatedWeight._id ? data.updatedWeight : weight
      );
      setWeights(updatedWeights);
      setNewWeight({ weight: "", weightOnDate: getTodayDate() });
      setEditWeightId(null);
    } catch (error) {
      setError(error.message);
      console.error("Error updating weight:", error);
    }
  };

  const handleDeleteWeight = async (weightId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/weights/${weightId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete weight entry");
      }

      setWeights(weights.filter((weight) => weight._id !== weightId));
    } catch (error) {
      setError(error.message);
      console.error("Error deleting weight:", error);
    }
  };

  // For the chart, sort weights from oldest to newest (ascending)
  const chartData = {
    labels: weights
      .slice() // Create a copy of the weights array
      .sort((a, b) => new Date(a.weightOnDate) - new Date(b.weightOnDate)) // Ascending order for the chart
      .map((weight) =>
        new Date(weight.weightOnDate).toLocaleDateString("en-US", {
          timeZone: "UTC",
        })
      ), // x-axis (dates)

    datasets: [
      {
        label: "Weight Over Time (kg)",
        data: weights
          .slice()
          .sort((a, b) => new Date(a.weightOnDate) - new Date(b.weightOnDate)) // Ascending order for the chart
          .map((weight) => weight.weight), // y-axis (weights)
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const indexOfLastWeight = currentPage * weightsPerPage;
  const indexOfFirstWeight = indexOfLastWeight - weightsPerPage;
  const currentWeights = weights.slice(indexOfFirstWeight, indexOfLastWeight);

  const totalPages = Math.ceil(weights.length / weightsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.weightContainer}>
      <button
        className={styles.backButton}
        onClick={() => navigate("/dashboard")}
      >
        ← Return to Dashboard
      </button>

      <h2 className={styles.title}>Weight Tracker</h2>

      <h3 className={styles.sectionTitle}>Weight Chart</h3>
      <div className={styles.chartContainer}>
        <Line data={chartData} />
      </div>

      <h3 className={styles.sectionTitle}>Add New Weight</h3>
      <form className={styles.addWeightForm} onSubmit={handleCreateWeight}>
        <label>
          Weight:
          <input
            type="number"
            name="weight"
            value={newWeight.weight}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="weightOnDate"
            value={newWeight.weightOnDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className={styles.addButton}>
          Add Weight
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}

      <h3 className={styles.existingWeightsTitle}>Existing Weights</h3>
      <ul className={styles.weightList}>
        {currentWeights.map((weight) => (
          <li key={weight._id} className={styles.weightItem}>
            {editWeightId === weight._id ? (
              <div>
                <input
                  type="number"
                  name="weight"
                  value={newWeight.weight}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="weightOnDate"
                  value={newWeight.weightOnDate}
                  onChange={handleChange}
                  required
                />
                <div className={styles.buttonGroup}>
                  <button
                    onClick={handleUpdateWeight}
                    className={styles.saveButton}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditWeightId(null)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {weight.weight} kg on{" "}
                {new Date(weight.weightOnDate).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })}
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditWeight(weight._id, weight)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteWeight(weight._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${styles.paginationButton} ${
            currentPage === 1 ? styles.disabled : ""
          }`}
        >
          Previous
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={`${styles.paginationButton} ${
              page === currentPage ? styles.active : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${styles.paginationButton} ${
            currentPage === totalPages ? styles.disabled : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Weight;
