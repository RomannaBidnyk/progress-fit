import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Weight = () => {
  const navigate = useNavigate();

  // State to store weights
  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState({ weight: "", weightOnDate: "" });
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await fetch("/api/weights", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch weights");
        }

        const data = await response.json();
        setWeights(data.weights);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchWeights();
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
      const response = await fetch("/api/weights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newWeight),
      });

      if (!response.ok) {
        throw new Error("Failed to create weight entry");
      }

      const data = await response.json();
      setWeights([...weights, data.newWeight]);
      setNewWeight({ weight: "", weightOnDate: "" });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="weight">
      <h2>Weight Page</h2>
      <button className="btn" onClick={() => navigate("/dashboard")}>
        Back
      </button>

      {/* Display weights */}
      {error && <p className="error">{error}</p>}

      <h3>Existing Weights</h3>
      <ul>
        {weights.map((weight) => (
          <li key={weight._id}>
            {weight.weight} kg on{" "}
            {new Date(weight.weightOnDate).toLocaleDateString()}
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
