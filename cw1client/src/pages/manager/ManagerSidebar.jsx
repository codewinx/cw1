// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   ShoppingCart,
//   Users,
//   Package,
//   ClipboardList,
//   DollarSign,
//   FileText,
//   BarChart3,
//   Clock,
//   CheckCircle
// } from "lucide-react";

// const ManagerSidebar = () => {
//   const menuItems = [
//     { icon: BarChart3, label: "Dashboard", path: "/manager/dashboard" },

//     // { icon: ClipboardList, label: "Tasks", path: "/cutter/CutterTasks" },
//     //  { icon: Clock, label: "Pending Tasks", path: "/cutter/Pending-Tasks" },
//     //   { icon: CheckCircle, label: "Completed Tasks", path: "/cutter/Completed-Tasks" }
    
//   ];

//   return (
//     <div className="w-64 bg-white border-r border-gray-200 h-screen">
//       {/* Logo / Branding */}
//       <div className="p-6">
//         <div className="flex items-center space-x-3">
//           <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-sm">H</span>
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">Her&tness</h1>
//             <p className="text-sm text-gray-500">Boutique Cutter</p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="mt-6">
//         {menuItems.map(({ icon: Icon, label, path }) => (
//           <NavLink
//             key={path}
//             to={path}
//             className={({ isActive }) =>
//               `flex items-center gap-3 mt-2 px-6 py-3 text-sm font-medium transition-colors ${
//                 isActive
//                   ? "text-pink-500 bg-pink-50 border-r-2 border-pink-500"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//               }`
//             }
//           >
//             <Icon className="w-5 h-5 mr-3" />
//             {label}
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default ManagerSidebar;


// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   BarChart3,
//   Users,
//   Package,
//   ClipboardList,
//   DollarSign,
//   FileText
// } from "lucide-react";

// const ManagerSidebar = () => {
//   const menuItems = [
//     { icon: BarChart3, label: "Dashboard", path: "/manager/dashboard" },
//     { icon: Users, label: "Staff", path: "/manager/staff" },
//     { icon: Package, label: "Inventory", path: "/manager/inventory" },
//     { icon: ClipboardList, label: "Orders", path: "/manager/orders" },
//     { icon: DollarSign, label: "Sales", path: "/manager/sales" },
//     { icon: FileText, label: "Reports", path: "/manager/reports" }
//   ];

//   return (
//     <div className="w-64 bg-white border-r border-gray-200 h-screen">
//       {/* Logo / Branding */}
//       <div className="p-6">
//         <div className="flex items-center space-x-3">
//           <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
//             <span className="text-white font-bold text-sm">H</span>
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">Her&tness</h1>
//             <p className="text-sm text-gray-500">Manager Panel</p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="mt-6">
//         {menuItems.map(({ icon: Icon, label, path }) => (
//           <NavLink
//             key={path}
//             to={path}
//             className={({ isActive }) =>
//               `flex items-center gap-3 mt-2 px-6 py-3 text-sm font-medium transition-colors ${
//                 isActive
//                   ? "text-pink-500 bg-pink-50 border-r-2 border-pink-500"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//               }`
//             }
//           >
//             <Icon className="w-5 h-5 mr-3" />
//             {label}
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default ManagerSidebar;
import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Users,
  ShoppingCart,
  Scissors,
  ListChecks,
  Hand,
  Shirt,
} from "lucide-react";

const ManagerSidebar = () => {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/manager/dashboard" },
    { icon: Users, label: "Tasks", path: "/manager/task" },
    { icon: ShoppingCart, label: "In-progress Tasks", path: "/manager/in-progress tasks" },
    { icon: Scissors, label: "Completed Tasks", path: "/manager/completedtasks" },
    { icon: Hand, label: "Reassign Tasks", path: "/manager/reassigntasks" },
    { icon: Shirt, label: "Checking Tasks", path: "/manager/checkingtasks" },
    { icon: ListChecks, label: "Order Management", path: "/manager/ordermanagement" },
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-white via-pink-50 to-pink-100 border-r border-gray-200 shadow-lg h-screen flex flex-col">
      {/* Logo / Branding */}
      <div className="p-6 border-b border-pink-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-400 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 text-transparent bg-clip-text">
              Her&tness
            </h1>
            <p className="text-sm text-gray-500 tracking-wide">Manager Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 mx-4 mt-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "text-white bg-gradient-to-r from-pink-500 to-rose-400 shadow-md"
                  : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Branding */}
      <div className="p-4 border-t border-pink-200 text-xs text-center text-gray-500">
        © 2025 Her&tness
      </div>
    </div>
  );
};

export default ManagerSidebar;

