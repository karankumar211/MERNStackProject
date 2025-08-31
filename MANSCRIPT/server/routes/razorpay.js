const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../controller/razorpayController");

// Route to create a new order
router.post("/orders", createOrder);

// Route to verify the payment
router.post("/verify", verifyPayment);

module.exports = router;
