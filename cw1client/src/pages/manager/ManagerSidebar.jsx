import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Users,
  ShoppingCart,
  Scissors,
  ListChecks,
  Hand,
  Package,
  ClipboardList , 
  DollarSign, 
  Shirt,
} from "lucide-react";
import LogoutButton from "../../component/LogoutButton"; // 👈 import your logout button

const ManagerSidebar = ({ closeSidebar }) => {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/manager/dashboard" },
    { icon: Users, label: "Staff Management", path: "/manager/staff" },
    { icon: ListChecks, label: "Customers", path: "/manager/customers" },
    { icon: ShoppingCart, label: "Orders", path: "/manager/orders" },
    { icon: Package, label: "Service Control", path: "/manager/service-control" },
    { icon: ClipboardList, label: "Task Manager", path: "/manager/tasks" },
    { icon: DollarSign, label: "Payments", path: "/manager/payments" },

    // { icon: Users, label: "Task Manager", path: "/manager/task" },
    // { icon: ShoppingCart, label: "In-progress Tasks", path: "/manager/in-progress tasks" },
    // { icon: Scissors, label: "Completed Tasks", path: "/manager/completedtasks" },
    // { icon: Hand, label: "Reassign Tasks", path: "/manager/reassigntasks" },
    // { icon: Shirt, label: "Staff Manager", path: "/manager/staffmanager" },
    // { icon: ListChecks, label: "Order Management", path: "/manager/ordermanagement" },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white via-pink-50 to-pink-100 border-r border-gray-200">
      {/* Close button for mobile */}
      <div className="sm:hidden flex justify-end p-4">
        <button
          onClick={closeSidebar}
          className="text-gray-500 hover:text-pink-600 focus:outline-none"
        >
          ✕
        </button>
      </div>

      {/* Logo / Branding */}
      <div className="p-6 border-b border-pink-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-400 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 text-transparent bg-clip-text">
              Her&tness
            </h1>
            <p className="text-sm text-gray-500 tracking-wide">Manager Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={closeSidebar} // close sidebar on mobile
            className={({ isActive }) =>
              `flex items-center gap-4 mx-4 mt-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "text-white bg-gradient-to-r from-pink-500 to-rose-400 shadow-md"
                  : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="px-4 py-3 mt-auto">
        <LogoutButton />
      </div>

      {/* Footer / Branding */}
      <div className="p-4 border-t border-pink-200 text-xs text-center text-gray-500">
        © 2025 Her&tness
      </div>
    </div>
  );
};

export default ManagerSidebar;
