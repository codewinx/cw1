import Customer from "../models/Customer.js";
import Order from "../models/Order.js";   // ✅ Add this

// ✅ Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};
// ✅ Get customer by ID with related orders & payments
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const orders = await Order.find({ customer: id })
      .populate("service")
      .populate("payment");

    res.status(200).json({ customer, orders });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching customer", error });
  }
};


// ✅ Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true, // return updated doc
      runValidators: true, // validate schema rules
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: "Error updating customer", error });
  }
};

// ✅ Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
};
