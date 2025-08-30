import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../api/auth"; // import api call

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await userLogin(username, password); // 👈 using admin.js

      const { role } = data; // role comes from backend response

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "tailor") {
        navigate("/tailor/dashboard");
      } else if (role === "manager") {
        navigate("/manager/dashboard");
      }else if (role === "cutter") {
        navigate("/cutter/dashboard");
      } 
      else {
        navigate("/");
      }
    } catch (error) {
      alert("Invalid login credentials");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
