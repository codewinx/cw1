import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
// import { getTasks } from "../../api/handworker"; // Uncomment when you have the API
import LogoutButton from "../../component/LogoutButton";
import logo from "../../assets/logo.png";

const HandworkerSidebar = () => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [taskCounts, setTaskCounts] = useState({
    new: 0,
    inProgress: 0,
    completed: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  const badgeColors = {
    new: "bg-blue-500",
    inProgress: "bg-yellow-400",
    completed: "bg-green-500",
  };

  const fetchTaskCounts = async () => {
    try {
      // Uncomment when you have the API endpoint
      // const data = await getTasks();
      // const allTasks = [
      //   ...(data.newTasks || []),
      //   ...(data.inProgress || []),
      //   ...(data.completed || []),
      // ];
      // setTaskCounts({
      //   new: allTasks.filter((t) => t.status === "new").length,
      //   inProgress: allTasks.filter((t) => t.status === "in-progress").length,
      //   completed: allTasks.filter((t) => t.status === "completed").length,
      // });

      // Mock data for now - replace with actual API call
      setTaskCounts({
        new: 5,
        inProgress: 3,
        completed: 12,
      });
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTaskCounts();
  }, []);

  useEffect(() => {
    // Reset badge counts when visiting respective pages
    if (location.pathname === "/handworker/newtasks")
      setTaskCounts((prev) => ({ ...prev, new: 0 }));
    else if (location.pathname === "/handworker/inprogresstasks")
      setTaskCounts((prev) => ({ ...prev, inProgress: 0 }));
    else if (location.pathname === "/handworker/completedtasks")
      setTaskCounts((prev) => ({ ...prev, completed: 0 }));
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
    { icon: BarChart3, label: "Dashboard", path: "/handworker/dashboard" },
    {
      icon: FileText,
      label: "Tasks",
      path: "/handworker/tasks",
      count: taskCounts.new,
      color: badgeColors.new,
    },
    {
      icon: Clock,
      label: "In-Progress",
      path: "/handworker/inprogresstasks",
      count: taskCounts.inProgress,
      color: badgeColors.inProgress,
    },
    {
      icon: CheckCircle,
      label: "Completed",
      path: "/handworker/completedtasks",
      count: taskCounts.completed,
      color: badgeColors.completed,
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden border-b flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden fixed top-4 left-2 z-50 p-2 rounded-md"
        >
          {isOpen ? <X className="w-6 h-6 " /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed lg:static top-0 left-0 h-full bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 border-r border-pink-200/40 w-64 transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-300 z-50
          flex flex-col justify-between shadow-lg`}
      >
        <div>
          {/* Logo for Desktop */}
          <div className="hidden lg:block p-4 flex ml-8 justify-center">
            <img
              src={logo}
              alt="Her Hiness Logo"
              className="hidden lg:block w-80 h-32 object-cover rounded"
            />
          </div>

          {/* Logo for Mobile with Close Button */}
          <div className="block lg:hidden flex ml-10 justify-center  border-pink-200/30 relative">
            <img
              src={logo}
              alt="Her Hiness Logo"
              className="block lg:hidden w-60 h-30 object-cover rounded"
            />
            {/* Close button (only for mobile) */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden absolute top-2 right-2 p-2 rounded-md hover:bg-pink-200/30"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Menu */}
          <nav className="-mt-10 lg:-mt-12">
            {menuItems.map(({ icon: Icon, label, path, count, color }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-3 mt-2 px-6 py-3 text-sm font-medium transition-all duration-300 rounded-lg mx-2 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-pink-400 to-purple-400 shadow-md"
                      : "text-gray-700 hover:text-white hover:bg-pink-200/50 hover:shadow-sm backdrop-blur-sm"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors duration-300 ${
                    location.pathname === path
                      ? "bg-white/20"
                      : "bg-white/10 group-hover:bg-white/20"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium tracking-wide">{label}</span>
                </div>
                {count > 0 && (
                  <span
                    className={`${color} text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm`}
                  >
                    {count}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout button at the bottom */}
        <div className="border-t border-pink-200/30 p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-pink-200/30 text-gray-700 hover:bg-white/20 transition-colors">
            <LogoutButton className="flex items-center w-full text-sm font-medium hover:text-red-600 transition-colors" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HandworkerSidebar;