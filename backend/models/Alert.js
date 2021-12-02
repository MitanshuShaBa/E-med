const mongoose = require("mongoose");

const alertSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    triggerDate: {
      type: Date,
    },
    triggerQuantity: {
      type: Number,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", alertSchema);
