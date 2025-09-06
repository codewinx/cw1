import React, { useState } from "react";
import Modal from "../../component/Modal";
import AdminAddCustomer from "./AdminAddCustomer";
import AdminAddOrder from "./AdminAddOrder";

const AdminDashboard = () => {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setIsCustomerModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          ➕ Add Customer
        </button>

        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          ➕ Add Order
        </button>
      </div>

      {/* Customer Modal */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Add Customer"
      >
        <AdminAddCustomer />
      </Modal>

      {/* Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Add Order"
      >
        <AdminAddOrder />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
