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
} from "lucide-react";
import LogoutButton from "../../component/LogoutButton"; 
import logo from "../../assets/logo.png";

export default function AdminSidebar({ open, setOpen }) {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Staff Management", path: "/admin/staff" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Package, label: "Service Control", path: "/admin/service-control" },
    { icon: ClipboardList, label: "Task Manager", path: "/admin/tasks" },
    { icon: DollarSign, label: "Payments", path: "/admin/payments" },
    { icon: FileText, label: "Reports", path: "/admin/reports" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 border-r border-pink-200/40 h-screen flex flex-col justify-between shadow-lg transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        <div className="relative z-10 flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex justify-end p-4 md:hidden">
            <button onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Logo / Branding */}
          <div className="hidden lg:block p-4 flex justify-center mb-4">
            <img
              src={logo}
              alt="Her Hiness Logo"
              className="hidden lg:block  w-80 h-32 ml-8 object-cover rounded"              
            />
          </div>

          {/* Navigation */}
          <nav className="-mt-8 px-3 flex-1 ">
            {menuItems.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-pink-400 to-purple-400 shadow-md"
                      : "text-gray-700 hover:text-black hover:bg-pink-200/50 hover:shadow-sm backdrop-blur-sm"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${
                        isActive
                          ? "bg-white/20"
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}
                    >
                      <Icon className="w-2 h-2" />
                    </div>
                    <span className="font-medium tracking-wide">{label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout Button fixed at bottom */}
          <div className="border-t p-4">
            <LogoutButton className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
}