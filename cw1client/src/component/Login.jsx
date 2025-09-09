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
       console.log("Login response:", data); 

      const { role } = data;

switch (role.toLowerCase()) {
  case "admin":
    navigate("/admin/dashboard");
    break;
  case "tailor":
    navigate("/tailor/dashboard");
    break;
  case "manager":
    navigate("/manager/dashboard");
    break;
  case "cutter":
    navigate("/cutter/dashboard");
    break;
  default:
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
