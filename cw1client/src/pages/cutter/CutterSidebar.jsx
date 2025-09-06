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
  Clock,
  CheckCircle
} from "lucide-react";

const CutterSidebar = () => {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/cutter/dashboard" },

    { icon: ClipboardList, label: "Assigned Tasks", path: "/cutter/Assigned-Tasks" },
     { icon: Clock, label: "Pending Tasks", path: "/cutter/Pending-Tasks" },
      { icon: CheckCircle, label: "Completed Tasks", path: "/cutter/Completed-Tasks" }
    
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
            <p className="text-sm text-gray-500">Boutique Cutter</p>
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
              `flex items-center gap-3 mt-2 px-6 py-3 text-sm font-medium transition-colors ${
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

export default CutterSidebar;
