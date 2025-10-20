import React, { useEffect, useState } from "react";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../api/admin+manager.js";
import { Edit, Trash2, Plus, X, Search, Eye } from "lucide-react";

// Function to format Aadhar number for display
const formatAadharNumber = (number) => {
  if (!number) return "";
  const cleaned = ("" + number).replace(/\D/g, "");
  return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const AdminManagerStaffManagement = () => {
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
    aadharNo: "",
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
      const aadhar = formData.aadharNo.replace(/\s/g, "");
      if (editingStaff) {
        const staffData = { ...formData, aadharNo: aadhar };
        if (!staffData.password) {
          delete staffData.password;
        }
        await updateStaff(editingStaff._id, staffData);
        alert("✅ Staff updated successfully");
      } else {
        await createStaff({ ...formData, aadharNo: aadhar });
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
      aadharNo: "",
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

  // Handle Aadhar number input change with formatting
  const handleAadharChange = (e) => {
    const { value } = e.target;
    // Remove non-digit characters and spaces
    const cleanedValue = value.replace(/[\s\D]/g, "");
    // Truncate to 12 digits
    const limitedValue = cleanedValue.slice(0, 12);
    setFormData({ ...formData, aadharNo: limitedValue });
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
    setFormData({
      ...staff,
      aadharNo: staff.aadharNo?.replace(/\s/g, "") || "",
    });
    setIsModalVisible(true);
  };

  const handleViewClick = (staff) => {
    setViewingStaff(staff);
    setIsViewModalVisible(true);
  };

  // Filter staff based on search term
  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.aadharNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                  Aadhar No.
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
                    <div className="text-sm text-gray-600">
                      {formatAadharNumber(staff.aadharNo)}
                    </div>
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
                        onClick={() => handleViewClick(staff)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEditClick(staff)}
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
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              {/* Aadhar Number Input Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  value={formatAadharNumber(formData.aadharNo)}
                  onChange={handleAadharChange}
                  maxLength="14"
                  placeholder="e.g., 1234 5678 9012"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Salary
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Star Rating (0-5)
                </label>
                <input
                  type="number"
                  value={formData.starRating}
                  onChange={(e) =>
                    setFormData({ ...formData, starRating: e.target.value })
                  }
                  min="0"
                  max="5"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Experience (years)
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

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
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password {editingStaff && "(Leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalVisible(false);
                  resetForm();
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
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
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingStaff.name}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingStaff.email}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Mobile Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingStaff.mobile}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Aadhar Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatAadharNumber(viewingStaff.aadharNo) || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingStaff.role}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Salary</p>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingStaff.salary}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingStaff.address || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingStaff.gender}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Experience</p>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingStaff.experience} years
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Certified</p>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingStaff.certified ? "Yes" : "No"}
                </p>
              </div>

              {viewingStaff.profileImage && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Profile Image</p>
                  <img
                    src={viewingStaff.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagerStaffManagement;
