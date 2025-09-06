// src/pages/admin/AdminCustomers.jsx
import React, { useEffect, useState } from "react";
import { getCustomers } from "../../api/customer";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers(search); // pass search query
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  // Apply gender filter on client side
  const filteredCustomers = genderFilter
    ? customers.filter((c) => c.gender === genderFilter)
    : customers;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📋 Customer Management</h2>

      {/* 🔍 Search & Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, phone, email, or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />

        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* 📊 Table */}
      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Gender</th>
                <th className="border px-4 py-2">Created By</th>
                <th className="border px-4 py-2">Date Added</th>
                <th className="border px-4 py-2">Orders</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.customerId} className="text-center">
                    <td className="border px-4 py-2">{c.name}</td>
                    <td className="border px-4 py-2">{c.phone}</td>
                    <td className="border px-4 py-2">{c.email}</td>
                    <td className="border px-4 py-2">{c.address}</td>
                    <td className="border px-4 py-2">{c.gender}</td>
                    <td className="border px-4 py-2">{c.createdBy}</td>
                    <td className="border px-4 py-2">
                      {new Date(c.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">{c.orders}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
