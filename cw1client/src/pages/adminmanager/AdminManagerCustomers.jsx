import React, { useEffect, useState } from "react";
import {
  fetchCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} from "../../api/admin+manager.js";
import { Edit, Trash2, Eye, X, Search, User, Users, Filter } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // View modal
  const [editingCustomerData, setEditingCustomerData] = useState(null); // Edit modal
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all customers
  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Filter customers based on search and gender
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = !search || 
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search);
    const matchesGender = !genderFilter || customer.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  // ✅ Handle View button
  const handleView = async (id) => {
    try {
      const data = await getCustomerById(id);
      setSelectedCustomer(data);
    } catch (error) {
      console.error("Error fetching customer details", error);
    }
  };

  // ✅ Handle Edit button
  const handleEdit = (customer) => {
    setEditingCustomerData({ ...customer });
  };

  // ✅ Handle Edit input changes
  const handleEditChange = (e) => {
    setEditingCustomerData({
      ...editingCustomerData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Update customer from modal
  const handleUpdate = async () => {
    try {
      await updateCustomer(editingCustomerData._id, {
        name: editingCustomerData.name,
        email: editingCustomerData.email,
        phone: editingCustomerData.phone,
        address: editingCustomerData.address,
      });
      setEditingCustomerData(null);
      loadCustomers();
    } catch (error) {
      console.error("Error updating customer", error);
    }
  };

  // ✅ Delete customer
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        setSelectedCustomer(null);
        setEditingCustomerData(null);
        loadCustomers();
      } catch (error) {
        console.error("Error deleting customer", error);
      }
    }
  };

  const getGenderColor = (gender) => {
    const colors = {
      Male: "bg-blue-100 text-blue-800",
      Female: "bg-pink-100 text-pink-800",
      Other: "bg-purple-100 text-purple-800",
    };
    return colors[gender] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-pink-100 to-purple-100">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {filteredCustomers.length}
              </div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Search Customers
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
              />
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Gender Filter
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all appearance-none"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-green-100 to-green-200">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Male Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.gender === 'Male').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-pink-100 to-pink-200">
              <User className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Female Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.gender === 'Female').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <span className="ml-3 text-gray-600 font-medium">Loading customers...</span>
          </div>
        ) : (
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
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.isArray(filteredCustomers) && filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">
                                {customer.name?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {customer.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getGenderColor(
                            customer.gender
                          )}`}
                        >
                          {customer.gender || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            onClick={() => handleView(customer._id)}
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => handleEdit(customer)}
                            title="Edit Customer"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleDelete(customer._id)}
                            title="Delete Customer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="text-gray-500">
                        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No customers found</h3>
                        <p className="text-sm">Try adjusting your search criteria or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {!loading && filteredCustomers.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="font-medium">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
            <div className="flex gap-4">
              {search && (
                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium">
                  Search: "{search}"
                </span>
              )}
              {genderFilter && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                  Filter: {genderFilter}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setSelectedCustomer(null)}
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-gray-900">Customer Details</h3>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Name</label>
                  <div className="px-4 py-3 bg-white rounded-lg text-gray-900 font-medium">
                    {selectedCustomer.customer.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <div className="px-4 py-3 bg-white rounded-lg text-gray-900">
                    {selectedCustomer.customer.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone</label>
                  <div className="px-4 py-3 bg-white rounded-lg text-gray-900">
                    {selectedCustomer.customer.phone}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Gender</label>
                  <div className="px-4 py-3 bg-white rounded-lg">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getGenderColor(selectedCustomer.customer.gender)}`}>
                      {selectedCustomer.customer.gender}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Address</label>
                <div className="px-4 py-3 bg-white rounded-lg text-gray-900">
                  {selectedCustomer.customer.address}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Orders ({selectedCustomer.orders.length})
              </h4>
              {selectedCustomer.orders.length > 0 ? (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {selectedCustomer.orders.map((order) => (
                    <div key={order._id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{order.orderNo}</p>
                          <p className="text-sm text-gray-600">{order.service?.name}</p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p>No orders found</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEdit(selectedCustomer.customer)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
              >
                Edit Customer
              </button>
              <button
                onClick={() => handleDelete(selectedCustomer.customer._id)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
              >
                Delete Customer
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editingCustomerData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setEditingCustomerData(null)}
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold mb-6 text-gray-900">Edit Customer</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingCustomerData.name}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingCustomerData.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editingCustomerData.phone}
                  onChange={handleEditChange}
                  placeholder="Phone"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editingCustomerData.address}
                  onChange={handleEditChange}
                  placeholder="Address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setEditingCustomerData(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}