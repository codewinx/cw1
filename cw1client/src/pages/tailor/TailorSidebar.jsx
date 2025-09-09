import React from "react";
import { X } from "lucide-react";
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
  CheckCircle,
} from "lucide-react";

export default function TailorSidebar({ open, setOpen }) {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/tailor/dashboard" },
    { icon: FileText, label: "Task Manager", path: "/tailor/tasks" },
    { icon: DollarSign, label: "Payments", path: "/tailor/payments" },
    { icon: Clock, label: "Reports", path: "/tailor/reports" },
    { icon: CheckCircle, label: "Completed", path: "/tailor/completed" },
  ];

  return (
    <>
      {/* Overlay - only on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg z-50 transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block`}
      >
        {/* Close Button - only mobile */}
        <div className="flex justify-end p-4 md:hidden">
          <button onClick={() => setOpen(false)}>
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Logo / Heading */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-pink-600">Her&tness</h2>
          <p className="text-sm text-gray-500">Boutique Admin</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-pink-100 text-pink-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
