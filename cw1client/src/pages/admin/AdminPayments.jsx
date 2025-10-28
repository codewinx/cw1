// import React, { useEffect, useState } from "react";
// import { getPayments, updatePayment, deletePayment } from "../../api/admin";
// import { Pencil, Trash2, Check, X } from "lucide-react";

// export default function AdminManagePayments() {
//   const [payments, setPayments] = useState([]);
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [formData, setFormData] = useState({
//     totalAmount: "",
//     advanceAmount: "",
//     extraAmount: "",
//     note: "",
//     paymentMode: "",
//     status: "",
//   });
//   const [showModal, setShowModal] = useState(false);

//   // 🟢 Fetch all payments
//   const fetchPayments = async () => {
//     try {
//       const data = await getPayments();
//       setPayments(data);
//     } catch (err) {
//       console.error("Error fetching payments:", err);
//     }
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   // 🟡 Handle edit click
//   const handleEdit = (payment) => {
//     setSelectedPayment(payment);
//     setFormData({
//       totalAmount: payment.totalAmount,
//       advanceAmount: payment.advanceAmount,
//       extraAmount: payment.extraCharges?.amount || 0,
//       note: payment.extraCharges?.note || "",
//       paymentMode: payment.paymentMode,
//       status: payment.status,
//     });
//     setShowModal(true);
//   };

//   // 🟢 Handle update
//   const handleUpdate = async () => {
//     try {
//       const updated = {
//         totalAmount: Number(formData.totalAmount),
//         advanceAmount: Number(formData.advanceAmount),
//         extraCharges: {
//           amount: Number(formData.extraAmount),
//           note: formData.note,
//         },
//         paymentMode: formData.paymentMode,
//         status: formData.status,
//       };
//       await updatePayment(selectedPayment._id, updated);
//       alert("✅ Payment updated successfully!");
//       setShowModal(false);
//       fetchPayments();
//     } catch (err) {
//       alert("❌ Error updating payment");
//       console.error(err);
//     }
//   };

//   // 🔴 Handle delete
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this payment?")) return;
//     try {
//       await deletePayment(id);
//       alert("🗑️ Payment deleted successfully!");
//       fetchPayments();
//     } catch (err) {
//       alert("❌ Error deleting payment");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Manage Payments</h1>

//       {/* Payments Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow rounded-lg">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="py-2 px-4">Total</th>
//               <th className="py-2 px-4">Advance</th>
//               <th className="py-2 px-4">Extra</th>
//               <th className="py-2 px-4">Mode</th>
//               <th className="py-2 px-4">Status</th>
//               <th className="py-2 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map((p) => (
//               <tr key={p._id} className="border-t">
//                 <td className="py-2 px-4">₹{p.totalAmount}</td>
//                 <td className="py-2 px-4">₹{p.advanceAmount}</td>
//                 <td className="py-2 px-4">
//                   ₹{p.extraCharges?.amount || 0}{" "}
//                   <span className="text-gray-500 text-sm">{p.extraCharges?.note}</span>
//                 </td>
//                 <td className="py-2 px-4">{p.paymentMode}</td>
//                 <td className="py-2 px-4">
//                   <span
//                     className={`px-2 py-1 rounded text-sm ${
//                       p.status === "Completed"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {p.status}
//                   </span>
//                 </td>
//                 <td className="py-2 px-4 flex gap-2">
//                   <button
//                     onClick={() => handleEdit(p)}
//                     className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   >
//                     <Pencil size={16} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(p._id)}
//                     className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Update Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
//             <h2 className="text-xl font-semibold mb-3">Update Payment</h2>
//             <div className="flex flex-col gap-2">
//               <input
//                 type="number"
//                 placeholder="Total Amount"
//                 value={formData.totalAmount}
//                 onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Advance Amount"
//                 value={formData.advanceAmount}
//                 onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Extra Charges"
//                 value={formData.extraAmount}
//                 onChange={(e) => setFormData({ ...formData, extraAmount: e.target.value })}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Extra Note"
//                 value={formData.note}
//                 onChange={(e) => setFormData({ ...formData, note: e.target.value })}
//                 className="border p-2 rounded"
//               />
//               <select
//                 value={formData.paymentMode}
//                 onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
//                 className="border p-2 rounded"
//               >
//                 <option value="">Select Payment Mode</option>
//                 <option value="Cash">Cash</option>
//                 <option value="UPI">UPI</option>
//                 <option value="Card">Card</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//               </select>
//               <select
//                 value={formData.status}
//                 onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                 className="border p-2 rounded"
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="Completed">Completed</option>
//               </select>
//             </div>

//             <div className="flex justify-end gap-3 mt-4">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="flex items-center gap-1 bg-gray-300 text-gray-700 px-3 py-1 rounded"
//               >
//                 <X size={16} /> Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//               >
//                 <Check size={16} /> Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { getPayments, updatePayment, deletePayment } from "../../api/payment";
import { Pencil, Trash2, Check, X } from "lucide-react";

export default function AdminManagePayments() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    totalAmount: "",
    advanceAmount: "",
    extraAmount: "",
    note: "",
    paymentMode: "",
    status: "",
  });
  const [showModal, setShowModal] = useState(false);

  // 🟢 Fetch all payments
  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 🟡 Handle edit click
  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setFormData({
      totalAmount: payment.totalAmount,
      advanceAmount: payment.advanceAmount,
      extraAmount: payment.extraCharges?.amount || 0,
      note: payment.extraCharges?.note || "",
      paymentMode: payment.paymentMode,
      status: payment.status,
    });
    setShowModal(true);
  };

  // 🟢 Handle update
  const handleUpdate = async () => {
    try {
      const updated = {
        totalAmount: Number(formData.totalAmount),
        advanceAmount: Number(formData.advanceAmount),
        extraCharges: {
          amount: Number(formData.extraAmount),
          note: formData.note,
        },
        paymentMode: formData.paymentMode,
        status: formData.status,
      };
      await updatePayment(selectedPayment._id, updated);
      alert("✅ Payment updated successfully!");
      setShowModal(false);
      fetchPayments();
    } catch (err) {
      alert("❌ Error updating payment");
      console.error(err);
    }
  };

  // 🔴 Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await deletePayment(id);
      alert("🗑️ Payment deleted successfully!");
      fetchPayments();
    } catch (err) {
      alert("❌ Error deleting payment");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Payments</h1>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Extra</th>
              <th className="py-2 px-4">Grand Total</th>
              <th className="py-2 px-4">Advance</th>
              <th className="py-2 px-4">Balance</th>
              <th className="py-2 px-4">Mode</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const extra = p.extraCharges?.amount || 0;
              const grandTotal = (p.totalAmount || 0) + extra;
              const balance = grandTotal - (p.advanceAmount || 0);

              return (
                <tr key={p._id} className="border-t">
                  <td className="py-2 px-4 text-gray-600">{p.orderNo || p._id}</td>
                  <td className="py-2 px-4">₹{p.totalAmount}</td>
                  <td className="py-2 px-4">
                    ₹{extra}{" "}
                    <span className="text-gray-500 text-sm">
                      {p.extraCharges?.note || ""}
                    </span>
                  </td>
                  <td className="py-2 px-4 font-semibold text-blue-700">
                    ₹{grandTotal}
                  </td>
                  <td className="py-2 px-4">₹{p.advanceAmount}</td>
                  <td className="py-2 px-4 font-semibold text-red-600">
                    ₹{balance}
                  </td>
                  <td className="py-2 px-4">{p.paymentMode}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        p.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Update Payment</h2>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                placeholder="Total Amount"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({ ...formData, totalAmount: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Advance Amount"
                value={formData.advanceAmount}
                onChange={(e) =>
                  setFormData({ ...formData, advanceAmount: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Extra Charges"
                value={formData.extraAmount}
                onChange={(e) =>
                  setFormData({ ...formData, extraAmount: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Extra Note"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="border p-2 rounded"
              />
              <select
                value={formData.paymentMode}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMode: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-1 bg-gray-300 text-gray-700 px-3 py-1 rounded"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                <Check size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
