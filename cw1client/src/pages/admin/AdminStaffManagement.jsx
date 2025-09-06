import React, { useEffect, useState } from "react";
import { getAllStaff, createStaff, updateStaff, deleteStaff } from "../../api/staff";
import { Edit, Trash2, Plus, X } from "lucide-react";

const AdminStaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    salary: "",
    address: "",
    gender: "",
    username: "",
    password: "",
    starRating: 0,
    profileImage: "",
    certified: false,
    experience: 0,
  });

  // ✅ Fetch staff
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await getAllStaff();
      setStaffList(res.data);
    } catch (error) {
      alert("❌ Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // ✅ Handle Create / Update
  const handleSave = async () => {
    try {
      if (editingStaff) {
        await updateStaff(editingStaff._id, formData);
        alert("✅ Staff updated successfully");
      } else {
        await createStaff(formData);
        alert("✅ Staff added successfully");
      }

      setIsModalVisible(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      alert(error.response?.data?.message || "❌ Something went wrong");
    }
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;

    try {
      await deleteStaff(id);
      alert("✅ Staff deleted successfully");
      fetchStaff();
    } catch (error) {
      alert("❌ Failed to delete staff");
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      role: "",
      salary: "",
      address: "",
      gender: "",
      username: "",
      password: "",
      starRating: 0,
      profileImage: "",
      certified: false,
      experience: 0,
    });
    setEditingStaff(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Staff Management</h2>

      <button
        onClick={() => {
          resetForm();
          setIsModalVisible(true);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 mb-4"
      >
        <Plus size={18} /> Add Staff
      </button>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Mobile</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Salary</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Experience</th>
              <th className="p-2 border">Certified</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff._id} className="hover:bg-gray-50">
                <td className="p-2 border">{staff.name}</td>
                <td className="p-2 border">{staff.email}</td>
                <td className="p-2 border">{staff.mobile}</td>
                <td className="p-2 border">{staff.role}</td>
                <td className="p-2 border">{staff.salary}</td>
                <td className="p-2 border">{staff.starRating}</td>
                <td className="p-2 border">{staff.experience} yrs</td>
                <td className="p-2 border">{staff.certified ? "✅" : "❌"}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setEditingStaff(staff);
                      setFormData(staff);
                      setIsModalVisible(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(staff._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => {
                setIsModalVisible(false);
                resetForm();
              }}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4">
              {editingStaff ? "Edit Staff" : "Add Staff"}
            </h3>

            <div className="space-y-3">
              {[
                { name: "name", label: "Name", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "mobile", label: "Mobile", type: "text" },
                { name: "salary", label: "Salary", type: "number" },
                { name: "address", label: "Address", type: "text" },
                { name: "starRating", label: "Star Rating (0-5)", type: "number" },
                { name: "profileImage", label: "Profile Image URL", type: "text" },
                { name: "experience", label: "Experience (years)", type: "number" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium">{field.label}</label>
                  <input
                    type={field.type}
                    value={formData[field.name] || ""}
                    min={field.name === "starRating" ? 0 : undefined}
                    max={field.name === "starRating" ? 5 : undefined}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              ))}

              {/* Role */}
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select Role</option>
                  <option value="Manager">Manager</option>
                  <option value="Cutter">Cutter</option>
                  <option value="Tailor">Tailor</option>
                  <option value="Handworker">Handworker</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Certified */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.certified}
                  onChange={(e) =>
                    setFormData({ ...formData, certified: e.target.checked })
                  }
                />
                <label className="text-sm font-medium">Certified</label>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={formData.username || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium">
                  {editingStaff ? "New Password (leave blank to keep old)" : "Password"}
                </label>
                <input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setIsModalVisible(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffManagement;
