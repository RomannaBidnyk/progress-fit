import { useNavigate } from "react-router-dom";

const Food = () => {
  const navigate = useNavigate();

  return (
    <div className="food">
      <h2>Food Page</h2>
      <button className="btn" onClick={() => navigate("/dashboard")}>
        Back
      </button>
      {/* You can add content related to the Food page here */}
    </div>
  );
};

export default Food;