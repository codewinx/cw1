import React, { useEffect, useState } from "react";
import { getCurrentStaff, updateProfile } from "../../api/cutter";

const CutterProfile = ({ setShowProfile }) => {
  const [cutter, setCutter] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);

  useEffect(() => {
    const fetchCutter = async () => {
      try {
        const data = await getCurrentStaff();
        const cutterStaff = Array.isArray(data)
          ? data.find((staff) => staff.role === "Cutter") || data[0]
          : data;
        setCutter(cutterStaff);
      } catch (err) {
        console.error("Error fetching staff:", err);
      }
    };
    fetchCutter();
  }, []);

  if (!cutter) return <p className="text-center">Loading...</p>;

  const handleChange = (e) => {
    setCutter({ ...cutter, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
      setCutter({
        ...cutter,
        profileImage: URL.createObjectURL(e.target.files[0]), // preview
      });
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("name", cutter.name || "");
      data.append("email", cutter.email || "");
      data.append("mobile", cutter.mobile || "");
      data.append("address", cutter.address || "");
      data.append("gender", cutter.gender || "");

      if (profileImageFile) {
        data.append("profileImage", profileImageFile);
      }

      const res = await updateProfile(data);
      alert("Profile updated successfully!");
      setCutter(res.staff);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => setShowProfile(false)}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button
            className="text-pink-500 hover:text-pink-700 text-lg font-bold"
            onClick={() => setShowProfile(false)}
          >
            ×
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center pt-2 pb-6 px-6 bg-pink-50 relative">
          {/* Edit button */}
          <div className="absolute top-4 right-4">
            {editMode ? (
              <div className="space-x-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm"
              >
                Edit
              </button>
            )}
          </div>

          {/* Profile Image */}
          <div className="relative">
            {cutter.profileImage ? (
              <img
                src={cutter.profileImage}
                alt={cutter.name}
                className="w-28 h-28 rounded-full mb-4 object-cover border-4 border-pink-300 shadow-md"
              />
            ) : (
              <div className="w-28 h-28 bg-pink-400 rounded-full flex items-center justify-center mb-4 shadow-md">
                <span className="text-white text-4xl font-bold">
                  {cutter.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute bottom-0 right-0 bg-white border rounded p-1 text-xs cursor-pointer"
              />
            )}
          </div>

          {/* Name */}
          {editMode ? (
            <input
              type="text"
              name="name"
              value={cutter.name}
              onChange={handleChange}
              className="text-2xl font-extrabold text-pink-700 text-center border-b border-pink-300"
            />
          ) : (
            <h1 className="text-2xl font-extrabold text-pink-700">
              {cutter.name}
            </h1>
          )}
          <p className="text-pink-600 font-medium mt-1">{cutter.role}</p>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-7 mt-2">
          {/* Contact Info */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-pink-100">
            <h2 className="text-lg font-semibold text-pink-600 mb-3 border-b border-pink-200 pb-2">
              Contact Info
            </h2>
            {["email", "mobile", "address"].map((field) => (
              <div key={field} className="flex flex-col mb-2">
                <span className="text-sm text-gray-500">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </span>
                {editMode ? (
                  <input
                    type="text"
                    name={field}
                    value={cutter[field]}
                    onChange={handleChange}
                    className="border-b border-gray-300 focus:outline-none"
                  />
                ) : (
                  <span className="font-medium">{cutter[field]}</span>
                )}
              </div>
            ))}
          </div>

          {/* Professional Info */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-pink-100">
            <h2 className="text-lg font-semibold text-pink-600 mb-3 border-b border-pink-200 pb-2">
              Professional Info
            </h2>

            {/* Experience (read-only) */}
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500">Experience</span>
              <span className="font-medium">{cutter.experience} years</span>
            </div>

            {/* Date of Joining (read-only) */}
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500">Date of Joining</span>
              <span className="font-medium">
                {new Date(cutter.dateOfJoining).toLocaleDateString()}
              </span>
            </div>

            {/* Certified (read-only) */}
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500">Certified</span>
              <span className="font-medium">
                {cutter.certified ? "Yes" : "No"}
              </span>
            </div>

            {/* Gender (editable) */}
            <div className="flex flex-col mb-2">
              <span className="text-sm text-gray-500">Gender</span>
              {editMode ? (
                <select
                  name="gender"
                  value={cutter.gender}
                  onChange={handleChange}
                  className="border-b border-gray-300 focus:outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span className="font-medium">{cutter.gender}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CutterProfile;
