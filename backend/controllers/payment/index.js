const Razorpay = require("razorpay");
const hmac_sha256 = require("crypto-js/hmac-sha256");

exports.createOrder = (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: req.body.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: req.body.orderID,
  };

  instance.orders.create(options, function (err, order) {
    // console.log(order);
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.send(order);
  });
};

exports.validatePayment = (req, res) => {
  let generated_signature = hmac_sha256(
    req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id,
    process.env.RAZORPAY_KEY_SECRET
  );
  if (generated_signature == req.body.razorpay_signature) {
    res.send(true);
  } else {
    res.send(false);
  }
};

exports.refundPayment = (req, res) => {
  const { paymentID } = req.params;
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  instance.payments.refund(paymentID, (err, refund) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.send(refund);
  });
};
