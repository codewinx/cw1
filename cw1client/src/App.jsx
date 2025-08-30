import { Routes, Route } from "react-router-dom";
import Login from "../src/component/Login";
import AdminDashboard from "../src/pages/admin/AdminDashboard";
// add more dashboards as needed

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      {/* Add routes for other roles */}
    </Routes>
  );
}
