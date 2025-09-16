// import React from "react";
// import { X } from "lucide-react";
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
//   CheckCircle,
// } from "lucide-react";
// import LogoutButton from "../../component/LogoutButton"; 

// export default function TailorSidebar({ open, setOpen }) {
//   const menuItems = [
//     { icon: BarChart3, label: "Dashboard", path: "/tailor/dashboard" },
//     { icon: FileText, label: "New Tasks", path: "/tailor/new-tasks" },
//     { icon: Clock, label: "In-Progress", path: "/tailor/in-progress-tasks" },
//     { icon: CheckCircle, label: "Completed", path: "/tailor/completed-tasks" },
//   ];

//   return (
//     <>
//       {/* Overlay - only on mobile */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg z-50 transform transition-transform duration-300 
//         ${open ? "translate-x-0" : "-translate-x-full"} 
//         md:translate-x-0 md:static md:block`}
//       >
//         {/* Close Button - only mobile */}
//         <div className="flex justify-end p-4 md:hidden">
//           <button onClick={() => setOpen(false)}>
//             <X className="h-6 w-6 text-gray-700" />
//           </button>
//         </div>

//         {/* Logo / Heading */}
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-bold text-pink-600">Her Hiness Boutique</h2>
//           <p className="text-sm text-gray-500">Tailor Panel</p>
//         </div>

//         {/* Menu Items */}
//         <nav className="p-4 space-y-2">
//           {menuItems.map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.path}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
//                   isActive
//                     ? "bg-pink-100 text-pink-600 font-medium"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`
//               }
//             >
//               <item.icon className="h-5 w-5" />
//               {item.label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Logout Button (bottom) */}
//       <div className="mb-6 px-4">
//         <LogoutButton />
//       </div>
//       </aside>
//     </>
//   );
// }

import React from "react";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { BarChart3, FileText, Clock, CheckCircle } from "lucide-react";
import LogoutButton from "../../component/LogoutButton";
import logo from "../../assets/logo.png";

export default function TailorSidebar({ open, setOpen }) {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/tailor/dashboard" },
    { icon: FileText, label: "New Tasks", path: "/tailor/new-tasks" },
    { icon: Clock, label: "In-Progress", path: "/tailor/in-progress-tasks" },
    { icon: CheckCircle, label: "Completed", path: "/tailor/completed-tasks" },
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
          <div className="hidden lg:block p-4 flex justify-center">
            <img
              src={logo}
              alt="Her Hiness Logo"
              className="w-80 h-32 ml-8 object-contain rounded"
            />
          </div>

          {/* Navigation */}
          <nav className="-mt-6 px-3 flex-1">
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
          <div className="border-t p-4">
            <LogoutButton className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
}
