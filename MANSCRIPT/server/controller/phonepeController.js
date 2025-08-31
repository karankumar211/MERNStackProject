const crypto = require("crypto");
const axios = require("axios");

// --- INITIATE PAYMENT ---
const initiatePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const merchantTransactionId = "M" + Date.now();

    const data = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: "MUID" + Date.now(),
      amount: amount * 100, // Amount in paise
      redirectUrl: `http://localhost:3000/payment/status/${merchantTransactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:8000/api/phonepe/callback`,
      mobileNumber: "9999999999", // Should be the user's number
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = process.env.PHONEPE_SALT_INDEX;
    const string = payloadMain + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const UAT_PAY_API_URL =
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    const options = {
      method: "post",
      url: UAT_PAY_API_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    const response = await axios.request(options);
    const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
    res.json({ success: true, redirectUrl: redirectUrl });
  } catch (error) {
    console.error(
      "PhonePe Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .send({ message: "Error initiating payment", success: false });
  }
};

// --- CHECK PAYMENT STATUS ---
const checkPaymentStatus = async (req, res) => {
  const { merchantTransactionId } = req.params;
  const keyIndex = process.env.PHONEPE_SALT_INDEX;

  const string =
    `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
    process.env.PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const UAT_STATUS_API_URL = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`;

  const options = {
    method: "get",
    url: UAT_STATUS_API_URL,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
    },
  };

  try {
    const response = await axios.request(options);
    if (response.data.success === true) {
      // Here you would update your order status in MongoDB
      return res.json({ success: true, message: "Payment Successful" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.error(
      "Status Check Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send({ message: "Error checking status", success: false });
  }
};

module.exports = { initiatePayment, checkPaymentStatus };
