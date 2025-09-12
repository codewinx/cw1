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
    <div className="w-64 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 border-r border-pink-300/20 h-screen flex flex-col justify-between shadow-2xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 -left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Logo / Branding */}
        <div className="p-6 flex flex-col items-center space-y-4 border-b border-pink-300/20">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-30"></div>
            <img
              src={herhinessLogo}
              alt="Her Hiness Logo"
              className="relative w-32 h-auto object-contain rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
              Boutique Admin
            </h1>
            <p className="text-xs text-pink-200/80 font-medium">
              Management Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? "text-white bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/25"
                    : "text-pink-200 hover:text-white hover:bg-white/10 hover:shadow-md backdrop-blur-sm"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${
                    isActive 
                      ? "bg-white/20" 
                      : "bg-white/10 group-hover:bg-white/20"
                  }`}>
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
      </div>

      {/* Logout Button (bottom) */}
      <div className="relative z-10 mb-6 px-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-white">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;