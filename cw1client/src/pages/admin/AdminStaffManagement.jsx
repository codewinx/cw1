import React, { useEffect, useState } from "react";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../api/staff";
import { Edit, Trash2, Plus, X, Search, Eye } from "lucide-react";

const AdminStaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Fetch staff
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

  // Handle Create / Update
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

  // Handle Delete
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

  // Reset Form
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

  // Filter staff based on search term
  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      Manager: "bg-purple-100 text-purple-800",
      Cutter: "bg-blue-100 text-blue-800",
      Tailor: "bg-green-100 text-green-800",
      Handworker: "bg-yellow-100 text-yellow-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalVisible(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
        >
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
        />
      </div>

      {/* Staff Table Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map((staff) => (
                <tr
                  key={staff._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {staff.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{staff.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{staff.mobile}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        staff.role
                      )}`}
                    >
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        onClick={() => {
                          setViewingStaff(staff);
                          setIsViewModalVisible(true);
                        }}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => {
                          setEditingStaff(staff);
                          setFormData(staff);
                          setIsModalVisible(true);
                        }}
                        title="Edit Staff"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(staff._id)}
                        title="Delete Staff"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                      <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filteredStaff.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No staff members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => {
                setIsModalVisible(false);
                resetForm();
              }}
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              {editingStaff ? "Edit Staff" : "Add New Staff"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "name", label: "Full Name", type: "text" },
                { name: "email", label: "Email Address", type: "email" },
                { name: "mobile", label: "Mobile Number", type: "text" },
                { name: "salary", label: "Salary", type: "number" },
                { name: "address", label: "Address", type: "text" },
                { name: "starRating", label: "Star Rating (0-5)", type: "number" },
                { name: "experience", label: "Experience (years)", type: "number" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.name] || ""}
                    min={field.name === "starRating" ? 0 : undefined}
                    max={field.name === "starRating" ? 5 : undefined}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                  />
                </div>
              ))}

              {/* Profile Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({
                          ...formData,
                          profileImage: reader.result,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
                {formData.profileImage && (
                  <img
                    src={formData.profileImage}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mt-2 border"
                  />
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                >
                  <option value="">Select Role</option>
                  <option value="Manager">Manager</option>
                  <option value="Cutter">Cutter</option>
                  <option value="Tailor">Tailor</option>
                  <option value="Handworker">Handworker</option>
                </select>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {editingStaff
                    ? "New Password (leave blank to keep old)"
                    : "Password"}
                </label>
                <input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>
            </div>

            {/* Certified Checkbox */}
            <div className="mt-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.certified}
                  onChange={(e) =>
                    setFormData({ ...formData, certified: e.target.checked })
                  }
                  className="w-4 h-4 text-pink-500 bg-gray-100 border-gray-300 rounded focus:ring-pink-300 focus:ring-2"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Certified Professional
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setIsModalVisible(false);
                  resetForm();
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
              >
                {editingStaff ? "Update Staff" : "Add Staff"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalVisible && viewingStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => {
                setIsViewModalVisible(false);
                setViewingStaff(null);
              }}
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              Staff Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {viewingStaff.name || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {viewingStaff.email || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Mobile
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {viewingStaff.mobile || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Role
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {viewingStaff.role || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Salary
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {viewingStaff.salary || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Address
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {viewingStaff.address || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Gender
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {viewingStaff.gender || "N/A"}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Experience
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {viewingStaff.experience || 0} years
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Star Rating
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  ⭐ {viewingStaff.starRating || 0}/5
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Certified
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {viewingStaff.certified ? "✅ Yes" : "❌ No"}
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Profile Image
                </label>
                {viewingStaff.profileImage ? (
                  <img
                    src={viewingStaff.profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaffManagement;
