import { useEffect, useState } from "react";

const App = () => {
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((response) => response.text())
      .then((data) => setBackendMessage(data))
      .catch((error) =>
        setBackendMessage("Error fetching data from backend:", error)
      );
  }, []);

  return (
    <div>
      <h1>ProgressFit App</h1>
      <p>Backend says: {backendMessage}</p>
    </div>
  );
};

export default App;
