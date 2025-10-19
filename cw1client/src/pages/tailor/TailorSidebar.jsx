import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, ClipboardList, Clock, CheckCircle, Menu, X } from "lucide-react";
import { getTasks } from "../../api/tailor";
import logo from "../../assets/logo.png";
import LogoutButton from "../../component/LogoutButton";

const TailorSidebar = () => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [tasks, setTasks] = useState({
    pending: [],
    inProgress: [],
    completed: [],
    reassigned: [],
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch tasks and keep only unique orderNo
  const fetchTasks = async () => {
    try {
      const data = await getTasks();

      const uniqueByOrder = (arr) => {
        const seen = new Set();
        return arr.filter((task) => {
          const orderNo = task?.order?.orderNo;
          if (!orderNo) return false;
          if (seen.has(orderNo)) return false;
          seen.add(orderNo);
          return true;
        });
      };

      // Include "done" status from completed tasks
      const completedTasks = (data.completed || []).map((t) => ({
        ...t,
        status: t.status || "done",
      }));

      setTasks({
        pending: uniqueByOrder(data.pending || []),
        inProgress: uniqueByOrder(data.inProgress || []),
        completed: uniqueByOrder(completedTasks),
        reassigned: uniqueByOrder(data.reassigned || []),
      });
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/tailor/dashboard" },
    { icon: ClipboardList, label: "Assigned Tasks", path: "/tailor/new-tasks", count: tasks.pending.length },
    { icon: Clock, label: "In Progress", path: "/tailor/in-progress-tasks", count: tasks.inProgress.length },
    { icon: CheckCircle, label: "Completed", path: "/tailor/completed-tasks", count: tasks.completed.length },
    { icon: ClipboardList, label: "Reassigned", path: "/tailor/reassigntasks", count: tasks.reassigned.length },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 flex flex-col justify-between shadow-lg h-screen
          w-56 sm:w-60 md:w-72 lg:w-80
          ${isMobile ? "bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50" : "bg-gradient-to-r from-pink-50 via-purple-50 to-purple-100"}
          border-r border-pink-200/40
          transform transition-transform duration-300 z-50
          ${isMobile ? (open ? "translate-x-0" : "-translate-x-full") : "translate-x-0 md:static md:block"}
        `}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Logo + Close Button */}
            <div className="flex items-center justify-between md:px-10 relative">
              <img
                src={logo}
                alt="Logo"
                className="
                  w-46 h-32 px-6 ml-6 m-4     
                  lg:w-80 lg:h-52 lg:px-4 lg:-m-2 lg:pt-2 lg:ml-4
                "
              />
              {isMobile && (
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 bg-pink-600 hover:bg-pink-500 text-white p-2 rounded-full shadow-md"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="px-3 -mt-6 flex-1">
              {menuItems.map(({ icon: Icon, label, path, count }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-2 mb-2 text-sm md:text-base font-medium rounded-xl transition-all duration-300 transform hover:scale-105
                    ${isActive
                        ? "text-white bg-gradient-to-r from-pink-400 to-purple-400 shadow-md"
                        : "text-gray-700 hover:text-white hover:bg-pink-200/50 hover:shadow-sm backdrop-blur-sm"
                    }`
                  }
                  onClick={() => isMobile && setOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`p-2 md:p-3 rounded-lg mr-3 transition-colors duration-300
                          ${isActive ? "bg-white/20" : "bg-white/10 group-hover:bg-white/20"}`}
                      >
                        <Icon className={`w-4 h-4 md:w-5 md:h-5`} />
                      </div>
                      <span className="font-medium tracking-wide">{label}</span>

                      {count !== undefined && count > 0 && (
                        <span className="ml-auto bg-white/30 text-gray-800 text-xs md:text-sm font-semibold px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                          {count}
                        </span>
                      )}

                      {isActive && <div className="ml-2 w-2 h-2 bg-white rounded-full opacity-80"></div>}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t p-4">
            <LogoutButton className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg" />
          </div>
        </div>
      </aside>

      {isMobile && !open && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-pink-600 text-white rounded-lg shadow-lg"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6 md:h-7 md:w-7" />
        </button>
      )}
    </>
  );
};

export default TailorSidebar;
