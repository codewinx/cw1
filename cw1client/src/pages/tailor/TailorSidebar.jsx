import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, ShoppingBag, BarChart } from "lucide-react";

export default function TailorSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-gray-100 flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-lg border-b border-gray-700">
        <h1>Her Hiness</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          <Home size={20} /> Dashboard
        </NavLink>
        <NavLink
          to="/newworks"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          <BarChart size={20} /> New Work
        </NavLink> 
        

        
      </nav>
    </div>
  );
}
