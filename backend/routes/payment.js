const express = require("express");
const {
  createOrder,
  validatePayment,
  refundPayment,
} = require("../controllers/payment");
const router = express.Router();

router.post("/order", createOrder);
router.post("/validate", validatePayment);
router.post("/refund/:paymentID", refundPayment);

module.exports = router;
