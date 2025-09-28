import React, { useEffect, useState } from "react";
import {
  fetchCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} from "../../api/customer";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [selectedCustomer, setSelectedCustomer] = useState(null); // for Eye button modal

  // ✅ Fetch all customers
  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers", error);
      setCustomers([]);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // ✅ Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Edit customer
  const handleEdit = (customer) => {
    setEditingCustomer(customer._id);
    setFormData({ name: customer.name, email: customer.email });
  };

  // ✅ Update customer
  const handleUpdate = async (id) => {
    try {
      await updateCustomer(id, formData);
      setEditingCustomer(null);
      setFormData({ name: "", email: "" });
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
        setSelectedCustomer(null); // close modal if open
        loadCustomers();
      } catch (error) {
        console.error("Error deleting customer", error);
      }
    }
  };

  // ✅ Handle Eye button click
  const handleView = async (id) => {
    try {
      const data = await getCustomerById(id);
      setSelectedCustomer(data);
    } catch (error) {
      console.error("Error fetching customer details", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer Management</h2>

      <table
        border="1"
        cellPadding="10"
        style={{ marginTop: "20px", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone No.</th>
            <th>Address</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(customers) && customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer._id}>
                <td>
                  {editingCustomer === customer._id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.name
                  )}
                </td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>
                  {editingCustomer === customer._id ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    customer.email
                  )}
                </td>
                <td>
                  {editingCustomer === customer._id ? (
                    <>
                      <button onClick={() => handleUpdate(customer._id)}>
                        Save
                      </button>
                      <button onClick={() => setEditingCustomer(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleView(customer._id)}>
                        👁 View
                      </button>
                      <button onClick={() => handleEdit(customer)}>
                        ✏ Edit
                      </button>
                      <button onClick={() => handleDelete(customer._id)}>
                        🗑 Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Modal for viewing details */}
      {selectedCustomer && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "30%",
            background: "white",
            padding: "20px",
            border: "1px solid #ccc",
            zIndex: 1000,
          }}
        >
          <h3>Customer Details</h3>
          <p>
            <strong>Name:</strong> {selectedCustomer.customer.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedCustomer.customer.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedCustomer.customer.phone}
          </p>
          <p>
            <strong>Address:</strong> {selectedCustomer.customer.address}
          </p>
          <p>
            <strong>Gender:</strong> {selectedCustomer.customer.gender}
          </p>

          <h4>Orders:</h4>
          {selectedCustomer.orders.length > 0 ? (
            <ul>
              {selectedCustomer.orders.map((order) => (
                <li key={order._id}>
                  {order.orderNo} – {order.service?.name} – {order.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found</p>
          )}

          {/* ✅ Edit & Delete inside modal */}
          <div style={{ marginTop: "15px" }}>
            <button
              onClick={() => handleEdit(selectedCustomer.customer)}
              style={{ marginRight: "10px" }}
            >
              ✏ Edit
            </button>
            <button
              onClick={() => handleDelete(selectedCustomer.customer._id)}
              style={{ marginRight: "10px", color: "red" }}
            >
              🗑 Delete
            </button>
            <button onClick={() => setSelectedCustomer(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
