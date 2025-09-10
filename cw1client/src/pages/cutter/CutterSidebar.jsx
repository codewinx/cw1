import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, ClipboardList, Clock, CheckCircle, Menu, X } from "lucide-react";
import { getTasks } from "../../api/cutter";

const CutterSidebar = () => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [taskCounts, setTaskCounts] = useState({ pending: 0, inProgress: 0, done: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const badgeColors = {
    pending: "bg-red-500",
    inProgress: "bg-yellow-400",
    done: "bg-green-500",
  };

  const fetchTaskCounts = async () => {
    try {
      const data = await getTasks();
      const tasksArray = Array.isArray(data) ? data : data.tasks || [];
      setTaskCounts({
        pending: tasksArray.filter((t) => t.status === "pending").length,
        inProgress: tasksArray.filter((t) => t.status === "in-progress").length,
        done: tasksArray.filter((t) => t.status === "done").length,
      });
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTaskCounts();
  }, []);

  useEffect(() => {
    if (location.pathname === "/cutter/CutterTasks")
      setTaskCounts((prev) => ({ ...prev, pending: 0 }));
    else if (location.pathname === "/cutter/CutterInprogress")
      setTaskCounts((prev) => ({ ...prev, inProgress: 0 }));
    else if (location.pathname === "/cutter/CutterCompleted")
      setTaskCounts((prev) => ({ ...prev, done: 0 }));
  }, [location.pathname]);

  // Close sidebar on outside click (mobile only)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (window.innerWidth >= 1024) return; // lg breakpoint and above -> do nothing
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/cutter/dashboard" },
    {
      icon: ClipboardList,
      label: "Tasks",
      path: "/cutter/CutterTasks",
      count: taskCounts.pending,
      color: badgeColors.pending,
    },
    {
      icon: Clock,
      label: "InProgress Tasks",
      path: "/cutter/CutterInprogress",
      count: taskCounts.inProgress,
      color: badgeColors.inProgress,
    },
    {
      icon: CheckCircle,
      label: "Completed Tasks",
      path: "/cutter/CutterCompleted",
      count: taskCounts.done,
      color: badgeColors.done,
    },
    { icon: ClipboardList, label: "Reassign Tasks", path: "/cutter/CutterReassign" },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden border-b flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden fixed top-4 left-2 z-50 p-2 rounded-md bg-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:static top-0 left-0 h-full bg-white border-r border-gray-200 w-64 transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-300 z-50`}
      >
        {/* Mobile Header with Logo + Close Button */}
        <div className="lg:hidden p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-pink-600">Her&tness</h2>
            <p className="text-sm text-gray-500">Boutique Cutter</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="p-6 hidden lg:flex items-center space-x-3 border-b">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Her&tness</h1>
            <p className="text-sm text-gray-500">Boutique Cutter</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-6">
          {menuItems.map(({ icon: Icon, label, path, count, color }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 mt-2 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-pink-500 bg-pink-50 border-r-2 border-pink-500"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
              onClick={() => setIsOpen(false)} // close on mobile click
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </div>
              {count > 0 && (
                <span
                  className={`${color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}
                >
                  {count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default CutterSidebar;
