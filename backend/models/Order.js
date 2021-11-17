const mongoose = require("mongoose");
const CartItem = require("./CartItem");
const { isMobilePhone } = require("validator");

const orderSchema = mongoose.Schema(
  {
    items: [
      {
        type: CartItem,
      },
    ],
    prescriptions: [
      {
        type: String,
        trim: true,
      },
    ],
    address: {
      type: String,
      trim: true,
    },
    patient: {
      type: String,
      trim: true,
    },
    phoneNum: {
      type: Number,
      validate: {
        validator: isMobilePhone,
        message: "{VALUE} is not a valid phone number",
        isAsync: false,
      },
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    seller: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    total: {
      type: Number,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    razorpay_order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "prescriptionRequired",
        "paymentPending",
        "verifying",
        "processing",
        "delivering",
        "completed",
        "cancelled",
        "returned",
      ],
      default: "paymentPending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
