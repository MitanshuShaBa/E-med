const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
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
    productID: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = cartItemSchema;
