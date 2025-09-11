import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { gettailorinfo } from "../../api/tailor"; // adjust path if needed
import logo from "./logo.jpg"; // 👈 Import logo.jpg stored in the same folder

export default function TailorHeader({ onMenuClick }) {
  const [staffName, setStaffName] = useState("");

  useEffect(() => {
    const fetchTailorInfo = async () => {
      try {
        const data = await gettailorinfo();
        setStaffName(data?.name || "Staff");
      } catch (error) {
        console.error("Error fetching tailor info:", error);
        setStaffName("Staff");
      }
    };

    fetchTailorInfo();
  }, []);

  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      {/* Hamburger button (mobile only) */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Logo + Welcome line */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-20 w-20 rounded-full" /> 
        <p className="text-sm text-gray-600">Welcome back {staffName}</p>
      </div>

      {/* Right Side (staff name + avatar) */}
      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium">{staffName}</span>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          {staffName ? staffName.charAt(0).toUpperCase() : "S"}
        </div>
      </div>
    </header>
  );
}
