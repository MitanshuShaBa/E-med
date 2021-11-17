const mongoose = require("mongoose");
const { isInt } = require("validator");

const stockSchema = mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    expiry: {
      type: Date,
    },
    price: {
      type: Number,
      min: 0,
    },
    cost: {
      type: Number,
      min: 0,
    },
    quantity: {
      type: Number,
      validate: {
        validator: (val) => isInt(String(val), { min: 0 }),
        message: "{VALUE} is not a valid quantity",
        isAsync: false,
      },
    },
    isAvailable: {
      type: Boolean,
    },
    isMR: {
      type: Boolean,
    },
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stock", stockSchema);
