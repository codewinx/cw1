import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Clock,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { getTasks } from "../../api/cutter";
import LogoutButton from "../../component/LogoutButton";

const CutterSidebar = () => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    inProgress: 0,
    done: 0,
    reassigned: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  const badgeColors = {
    pending: "bg-red-500",
    inProgress: "bg-yellow-400",
    done: "bg-green-500",
    reassigned: "bg-blue-500",
  };

  const fetchTaskCounts = async () => {
    try {
      const data = await getTasks();
      const allTasks = [
        ...(data.pending || []),
        ...(data.inProgress || []),
        ...(data.completed || []),
        ...(data.reassigned || []),
      ];
      setTaskCounts({
        pending: allTasks.filter((t) => t.status === "pending").length,
        inProgress: allTasks.filter((t) => t.status === "in-progress").length,
        done: allTasks.filter((t) => t.status === "done").length,
        reassigned: allTasks.filter((t) => t.wasReassigned).length,
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
    else if (location.pathname === "/cutter/CutterReassign")
      setTaskCounts((prev) => ({ ...prev, reassigned: 0 }));
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (window.innerWidth >= 1024) return;
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
      label: "In Progress Tasks",
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
    {
      icon: ClipboardList,
      label: "Reassigned Tasks",
      path: "/cutter/CutterReassign",
      count: taskCounts.reassigned,
      color: badgeColors.reassigned,
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden border-b flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden fixed top-4 left-2 z-50 p-2 rounded-md bg-white"
        >
          {isOpen ? <X className="w-6 h-6 " /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:static top-0 left-0 h-full bg-white border-r border-gray-200 w-64 transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-300 z-50
          flex flex-col justify-between`}
      >
        <div>
          {/* Logo only */}
    <div className="hidden lg:block p-4 flex justify-center">
           {/* Desktop / Laptop Logo */}
  <img
    src="/src/assets/herhinesslogo.png" // Replace with desktop logo
    alt="Her&tness Logo"
    className="hidden lg:block  w-64 h-32 object-cover rounded"
  />
  <h1></h1>
  </div>
  <div className="  block lg:hidden flex justify-center border-b">
             {/* Mobile Logo */}
  <img
    src="/src/assets/herhinesslogo.png" // Replace with mobile logo
    alt="Her&tness Logo"
    className="block lg:hidden w-48 h-32 object-cover rounded"
  />
  {/* Close button (only for mobile) */}
  <button
    onClick={() => setIsOpen(false)}
    className="lg:hidden absolute top-2 right-2 p-2 rounded-md hover:bg-gray-100"
  >
    <X className="w-6 h-6 text-gray-600" />
  </button>
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
                onClick={() => setIsOpen(false)}
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

        {/* Logout button at the bottom */}
        <div className="border-t p-4 ">
          <LogoutButton className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors" />
        </div>
      </div>
    </>
  );
};

export default CutterSidebar;
