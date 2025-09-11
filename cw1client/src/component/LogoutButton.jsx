// src/components/LogoutButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logoutUser } from "../api/auth"; // 👈 generic logout

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // clear all user session
    navigate("/"); // redirect to home/login
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
    >
      <LogOut className="w-5 h-5 mr-3" />
      Logout
    </button>
  );
};

export default LogoutButton;
