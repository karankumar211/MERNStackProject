const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  checkPaymentStatus,
} = require("../controller/phonepeController");

// Route to initiate payment
router.post("/pay", initiatePayment);

// Route to check payment status
router.get("/status/:merchantTransactionId", checkPaymentStatus);

module.exports = router;
