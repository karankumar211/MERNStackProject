const Razorpay = require("razorpay");
const crypto = require("crypto");
const orderModel = require("../models/orders"); // Import Order Model
const productModel = require("../models/products"); // Import Product Model

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    // Data from the frontend needed to create the order
    allProduct,
    user,
    amount,
    address,
    phone,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // --- PAYMENT IS VERIFIED ---
    try {
      // 1. Create a new order using your Order Model
      const newOrder = new orderModel({
        allProduct,
        user,
        amount,
        transactionId: razorpay_payment_id,
        address,
        phone,
      });
      const saveOrder = await newOrder.save();

      if (saveOrder) {
        // 2. Update stock for each product size
        for (const item of allProduct) {
          await productModel.updateOne(
            { _id: item.id, "pSizes.size": item.size },
            { $inc: { "pSizes.$.quantity": -item.quantity } }
          );
        }
        return res
          .status(200)
          .json({
            success: true,
            message: "Payment successful and order created",
          });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Error creating order" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = { createOrder, verifyPayment };
