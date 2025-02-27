import { useNavigate } from "react-router-dom";

const Weight = () => {
  const navigate = useNavigate();

  return (
    <div className="weight">
      <h2>Weight Page</h2>
      <button className="btn" onClick={() => navigate("/dashboard")}>
        Back
      </button>
      {/* You can add content related to the Weight page here */}
    </div>
  );
};

export default Weight;
