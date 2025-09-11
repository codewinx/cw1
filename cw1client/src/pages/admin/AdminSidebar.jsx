import React from "react";
import { NavLink } from "react-router-dom";
import {
  ShoppingCart,
  Users,
  Package,
  ClipboardList,
  DollarSign,
  FileText,
  BarChart3,
} from "lucide-react";
import LogoutButton from "../../component/LogoutButton"; 
import herhinessLogo from "../../assets/herhinesslogo.png"; // 👈 your uploaded logo

const AdminSidebar = () => {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Staff Management", path: "/admin/staff" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Package, label: "Inventory", path: "/admin/inventory" },
    { icon: ClipboardList, label: "Task Manager", path: "/admin/tasks" },
    { icon: DollarSign, label: "Payments", path: "/admin/payments" },
    { icon: FileText, label: "Reports", path: "/admin/reports" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-white to-pink-50 border-r border-gray-200 h-screen flex flex-col justify-between shadow-lg">
      <div>
        {/* Logo / Branding */}
        <div className="p-6 flex items-center space-x-3">
          <img
            src={herhinessLogo}
            alt="Her&tness Logo"
            className="object-contain rounded-md shadow-sm"
          />
          {/* <div>
            <h1 className="text-xl font-bold text-pink-600">Her&tness</h1>
            <p className="text-sm text-gray-500">Boutique Admin</p>
          </div> */}
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-pink-600 bg-pink-100 shadow-sm"
                    : "text-gray-600 hover:text-pink-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button (bottom) */}
      <div className="mb-6 px-4">
        <LogoutButton />
      </div>
    </div>
  );
};

export default AdminSidebar;
