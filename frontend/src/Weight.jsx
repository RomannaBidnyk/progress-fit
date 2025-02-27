import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Weight = () => {
  const navigate = useNavigate();

  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState({ weight: "", weightOnDate: "" });
  const [error, setError] = useState(null);
  const [editWeightId, setEditWeightId] = useState(null); // Track which weight is being edited

  const getTodayDate = () => new Date().toISOString().split("T")[0]; // Ensure correct format

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
        setWeights(data.weights);
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

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/weights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newWeight),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create weight entry");
      }

      const data = await response.json();
      setWeights([...weights, data.newWeight]);
      setNewWeight({ weight: "", weightOnDate: getTodayDate() });
    } catch (error) {
      setError(error.message);
      console.error("Error creating weight:", error);
    }
  };

  const handleEditWeight = (weightId, weightData) => {
    setEditWeightId(weightId); // Set the ID of the weight being edited
    setNewWeight({
      weight: weightData.weight,
      weightOnDate: weightData.weightOnDate.split("T")[0],
    });
  };

  const handleUpdateWeight = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/weights/${editWeightId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newWeight),
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
      setEditWeightId(null); // Reset the edit mode
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

  return (
    <div className="weight">
      <h2>Weight Page</h2>
      <button className="btn" onClick={() => navigate("/dashboard")}>
        Back
      </button>

      {error && <p className="error">{error}</p>}

      <h3>Existing Weights</h3>
      <ul>
        {weights.map((weight) => (
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
                {new Date(weight.weightOnDate).toLocaleDateString()}
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

      {/* Create new weight form */}
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
      </form>
    </div>
  );
};

export default Weight;
