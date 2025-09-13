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
// } from "lucide-react";
// import LogoutButton from "../../component/LogoutButton"; 
// import herhinessLogo from "../../assets/herhinesslogo.png"; // 👈 your uploaded logo

// const AdminSidebar = () => {
//   const menuItems = [
//     { icon: BarChart3, label: "Dashboard", path: "/admin/dashboard" },
//     { icon: Users, label: "Staff Management", path: "/admin/staff" },
//     { icon: Users, label: "Customers", path: "/admin/customers" },
//     { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
//     { icon: Package, label: "Inventory", path: "/admin/inventory" },
//     { icon: ClipboardList, label: "Task Manager", path: "/admin/tasks" },
//     { icon: DollarSign, label: "Payments", path: "/admin/payments" },
//     { icon: FileText, label: "Reports", path: "/admin/reports" },
//   ];

//   return (
//     <div className="w-64 bg-gradient-to-b from-white to-pink-50 border-r border-gray-200 h-screen  flex-col justify-between shadow-lg">
//       <div>
//         {/* Logo / Branding */}
//         <div className="p-6 flex items-center space-x-3">
//           <img
//             src={herhinessLogo}
//             alt="Her&tness Logo"
//             className="object-contain rounded-md shadow-sm"
//           />
//           {/* <div>
//             <h1 className="text-xl font-bold text-pink-600">Her&tness</h1>
//             <p className="text-sm text-gray-500">Boutique Admin</p>
//           </div> */}
//         </div>

//         {/* Navigation */}
//         <nav className="mt-4">
//           {menuItems.map(({ icon: Icon, label, path }) => (
//             <NavLink
//               key={path}
//               to={path}
//               className={({ isActive }) =>
//                 `flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
//                   isActive
//                     ? "text-pink-600 bg-pink-100 shadow-sm"
//                     : "text-gray-600 hover:text-pink-600 hover:bg-gray-100"
//                 }`
//               }
//             >
//               <Icon className="w-5 h-5 mr-3" />
//               {label}
//             </NavLink>
//           ))}
//         </nav>
//       </div>

//       {/* Logout Button (bottom) */}
//       <div className="mb-6 px-4">
//         <LogoutButton />
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;




import React from "react";
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
import herhinessLogo from "../../assets/herhinesslogo.png";

const AdminSidebar = () => {
  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Staff Management", path: "/admin/staff" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Package, label: "Inventory", path: "/admin/inventory" },
    { icon: ClipboardList, label: "Task Manager", path: "/admin/tasks" },
    { icon: DollarSign, label: "Payments", path: "/admin/payments" },
    { icon: FileText, label: "Reports", path: "/admin/reports" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 via-purple-50 to-pink-50 border-r border-purple-200/50 h-screen flex flex-col justify-between shadow-lg relative overflow-hidden">
      {/* Decorative background elements - much lighter */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 -left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-pink-200/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-purple-100/30 to-pink-100/30 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Logo / Branding */}
        <div className="p-6 flex flex-col items-center space-y-4 border-b border-purple-200/30">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-xl blur opacity-50"></div>
            <img
              src={herhinessLogo}
              alt="Her Hiness Logo"
              className="relative w-32 h-auto object-contain rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 bg-white/50 p-2"
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              Boutique Admin
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Management Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group flex items-center px-4 py-4 mb-3 text-base font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25 transform scale-105"
                    : "text-gray-700 hover:text-gray-900 hover:bg-white/70 hover:shadow-md backdrop-blur-sm border border-purple-100/50 bg-white/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2.5 rounded-lg mr-4 transition-all duration-300 ${
                    isActive 
                      ? "bg-white/20 shadow-sm" 
                      : "bg-purple-100/50 group-hover:bg-purple-200/60 border border-purple-200/30"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold tracking-wide text-base">{label}</span>
                  {isActive && (
                    <div className="ml-auto w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button (bottom) */}
      <div className="relative z-10 mb-6 px-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-200/40 shadow-sm">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;