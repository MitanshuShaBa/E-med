const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      min: 0,
    },
    price: {
      type: Number,
      min: 0,
    },
    cost: {
      type: Number,
      min: 0,
    },
    medicineID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
  },
  { timestamps: true }
);

module.exports = cartItemSchema;
