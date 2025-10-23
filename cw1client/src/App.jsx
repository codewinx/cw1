// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Login from "./component/Login";
// import AdminRoutes from "./routes/AdminRoutes";
// import CutterRoutes from "./routes/CutterRoutes";
// import ManagerRoutes from "./routes/ManagerRoutes";

// export default function App() {
//   return (
//     <Routes>
//       {/* Public route */}
//       <Route path="/" element={<Login />} />

//       {/* Admin routes */}
//       <Route path="/*" element={<AdminRoutes />} />

//       {/* Cutter routes */}
//       <Route path="/cutter/*" element={<CutterRoutes />} />

//       {/* Manager routes */}
//    <Route path="/manager/" element={<ManagerRoutes />} />
//     </Routes>
//   );
// }
// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import AdminRoutes from "./routes/AdminRoutes";
import CutterRoutes from "./routes/CutterRoutes";
import TailorRoutes from "./routes/TailorRoutes";
import ManagerRoutes from "./routes/ManagerRoutes";
import HandworkerRoutes from "./routes/HandworkerRoutes";

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Admin routes */}
      <Route path="/*" element={<AdminRoutes />} />

      {/* Cutter routes */}
      <Route path="/cutter/*" element={<CutterRoutes />} />

      {/* Tailor routes */}
      <Route path="/tailor/*" element={<TailorRoutes />} />

      {/* Manager routes */}
      <Route path="/manager/*" element={<ManagerRoutes />} />
    
    
      {/* Handworker routes */}
      <Route path="/handworker/*" element={<HandworkerRoutes />} />
    </Routes>
  );
}
