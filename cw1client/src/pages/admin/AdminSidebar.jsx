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
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      {/* Logo / Branding */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Her&tness</h1>
            <p className="text-sm text-gray-500">Boutique Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-pink-500 bg-pink-50 border-r-2 border-pink-500"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`
            }
          >
            <Icon className="w-5 h-5 mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
