import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, ShoppingBag, BarChart } from "lucide-react";

export default function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-gray-100 flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-lg border-b border-gray-700">
        Butic Shop
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
          to="/customers"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          <Users size={20} /> Customers
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          <ShoppingBag size={20} /> Orders
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          <BarChart size={20} /> Reports
        </NavLink>
      </nav>
    </div>
  );
}
