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
    verified: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true, // TODO remove after implementation of payment portal
    },
    status: {
      type: String,
      enum: ["verifying", "processing", "delivering", "completed"],
      default: "verifying",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
