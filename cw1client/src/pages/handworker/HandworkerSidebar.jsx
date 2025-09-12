import React from "react";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { BarChart3, FileText, Clock, CheckCircle } from "lucide-react";
import LogoutButton from "../../component/LogoutButton";
import herhinesslogo from "../../assets/herhinesslogo.png";

export default function HandworkerSidebar({ open, setOpen }) {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/handworker/dashboard" },
    { icon: FileText, label: "New Tasks", path: "/handworker/new-tasks" },
    { icon: Clock, label: "In-Progress", path: "/handworker/in-progress-tasks" },
    { icon: CheckCircle, label: "Completed", path: "/handworker/completed-tasks" },
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
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 -left-10 w-32 h-32 bg-pink-200/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 -right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-pink-100/20 to-purple-100/20 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex justify-end p-4 md:hidden">
            <button onClick={() => setOpen(false)}>
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Logo / Branding */}
          <div className="p-3 flex flex-col items-center border-b border-pink-200/40 -mt-11">
            <img
              src={herhinesslogo}
              alt="Her Hiness Logo"
              className="w-32 h-auto object-contain transform hover:scale-105 transition-transform duration-300"
            />
            <div className="text-center -mt-10">
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Handworker Panel
              </h1>
              <p className="text-xs text-gray-600 font-medium">
                 Management Portal
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 px-3 flex-1">
            {menuItems.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-pink-400 to-purple-400 shadow-md"
                      : "text-gray-700 hover:text-white hover:bg-pink-200/50 hover:shadow-sm backdrop-blur-sm"
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
                      <Icon className="w-4 h-4" />
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
          <div className="px-4 py-3 mt-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-gray-200 text-gray-700 hover:bg-white/20 transition-colors">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
