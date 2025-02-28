import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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
      .map((weight) => new Date(weight.weightOnDate).toLocaleDateString()), // x-axis (dates)
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

  return (
    <div className="weight">
      <h2>Weight Page</h2>
      <button className="btn" onClick={() => navigate("/dashboard")}>
        Back
      </button>

      <h3>Weight Chart</h3>
      <Line data={chartData} />

      <h3>Add New Weight</h3>
      <form onSubmit={handleCreateWeight}>
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
        <button type="submit">Add Weight</button>
        {error && <p style={{ color: "red", fontStyle: "italic" }}>{error}</p>}
      </form>

      <h3>Existing Weights</h3>
      <ul>
        {currentWeights.map((weight) => (
          <li key={weight._id}>
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
                <button onClick={handleUpdateWeight}>Save</button>
                <button onClick={() => setEditWeightId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {weight.weight} kg on{" "}
                {new Date(weight.weightOnDate).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })}
                <button onClick={() => handleEditWeight(weight._id, weight)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteWeight(weight._id)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Weight;
