import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  ClipboardList,
  Clock,
  CheckCircle,
} from "lucide-react";
import { getTasks } from "../../api/cutter";

const CutterSidebar = () => {
  const location = useLocation();
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    inProgress: 0,
    done: 0,
  });

  // Badge colors
  const badgeColors = {
    pending: "bg-red-500",
    inProgress: "bg-yellow-400",
    done: "bg-green-500",
  };

  const fetchTaskCounts = async () => {
    try {
      const data = await getTasks();
      const tasksArray = Array.isArray(data) ? data : data.tasks || [];

      const counts = {
        pending: tasksArray.filter((t) => t.status === "pending").length,
        inProgress: tasksArray.filter((t) => t.status === "in-progress").length,
        done: tasksArray.filter((t) => t.status === "done").length,
      };

      setTaskCounts(counts);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTaskCounts();
  }, []);

  // Clear badge when visiting page
  useEffect(() => {
    if (location.pathname === "/cutter/CutterTasks") {
      setTaskCounts((prev) => ({ ...prev, pending: 0 }));
    } else if (location.pathname === "/cutter/CutterInprogress") {
      setTaskCounts((prev) => ({ ...prev, inProgress: 0 }));
    } else if (location.pathname === "/cutter/CutterCompleted") {
      setTaskCounts((prev) => ({ ...prev, done: 0 }));
    }
  }, [location.pathname]);

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/cutter/dashboard" },
    { icon: ClipboardList, label: "Tasks", path: "/cutter/CutterTasks", count: taskCounts.pending, color: badgeColors.pending },
    { icon: Clock, label: "InProgress Tasks", path: "/cutter/CutterInprogress", count: taskCounts.inProgress, color: badgeColors.inProgress },
    { icon: CheckCircle, label: "Completed Tasks", path: "/cutter/CutterCompleted", count: taskCounts.done, color: badgeColors.done },
    { icon: ClipboardList, label: "Reassign Tasks", path: "/cutter/CutterReassign" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
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
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </div>
            {count > 0 && (
              <span className={`${color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                {count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default CutterSidebar;
