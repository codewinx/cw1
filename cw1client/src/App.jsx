import { useEffect, useState } from "react";
import api from "./api/axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/") // this calls your Express "/" route
      .then((res) => setMessage(res.data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Frontend Connected to Backend</h1>
      <p>Message from server: {message}</p>
    </div>
  );
}

export default App;
