import React, { useState, useRef } from "react";
import { getPaymentsByOrderNo, addPayment, updatePayment } from "../../api/payment";
import { useReactToPrint } from "react-to-print";

const AdminPayments = () => {
  const [orderNo, setOrderNo] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ amount: "", method: "cash", remarks: "" });

  // 👇 Ref for printable content
  const printRef = useRef();

  const searchOrder = async () => {
    try {
      const data = await getPaymentsByOrderNo(orderNo);
      setOrderData(data.order);
      setPayments(data.payments);
    } catch (err) {
      alert("Order not found");
    }
  };

  const handleAddPayment = async () => {
    const res = await addPayment({ ...newPayment, orderNo });
    setOrderData(res.order);
    setPayments([...payments, res.payment]);
    setNewPayment({ amount: "", method: "cash", remarks: "" });
  };

  const handleUpdatePayment = async (id, updatedPayment) => {
    const res = await updatePayment(id, updatedPayment);
    setOrderData(res.order);
    setPayments(payments.map((p) => (p._id === id ? res.payment : p)));
  };

  // 👇 Print handler
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Order_${orderData?.orderNo}_Receipt`,
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payment Management</h1>

      {/* Search Order */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Enter Order No"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          className="border px-2 py-1"
        />
        <button onClick={searchOrder} className="bg-blue-500 text-white px-4 py-1 rounded">
          Search
        </button>
      </div>

      {/* Printable Section */}
      <div ref={printRef}>
        {/* Order Info */}
        {orderData && (
          <div className="mb-4 p-4 border rounded bg-gray-50">
            <h2 className="font-semibold">Order #{orderData.orderNo}</h2>
            <p>Customer: {orderData.customer?.name}</p>
            <p>Total: ₹{orderData.totalAmount}</p>
            <p>Paid: ₹{orderData.advanceAmount}</p>
            <p>Pending: ₹{orderData.pendingAmount}</p>
          </div>
        )}

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Payment Receipts</h3>
            {payments.map((p) => (
              <div key={p._id} className="border p-2 mb-2 flex justify-between items-center">
                <div>
                  <p>Amount: ₹{p.amount}</p>
                  <p>Method: {p.method}</p>
                  <p>Remarks: {p.remarks}</p>
                </div>
                <button
                  onClick={() =>
                    handleUpdatePayment(p._id, { ...p, remarks: prompt("Edit remarks", p.remarks) })
                  }
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Payment */}
      {orderData && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-semibold mb-2">Add Payment</h3>
          <input
            type="number"
            placeholder="Amount"
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
            className="border px-2 py-1 mr-2"
          />
          <select
            value={newPayment.method}
            onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
            className="border px-2 py-1 mr-2"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="qr">QR</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Remarks"
            value={newPayment.remarks}
            onChange={(e) => setNewPayment({ ...newPayment, remarks: e.target.value })}
            className="border px-2 py-1 mr-2"
          />
          <button onClick={handleAddPayment} className="bg-green-500 text-white px-4 py-1 rounded">
            Add
          </button>
        </div>
      )}

      {/* Print Button */}
      {orderData && (
        <button
          onClick={handlePrint}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
        >
          Print Receipt
        </button>
      )}
    </div>
  );
};

export default AdminPayments;
