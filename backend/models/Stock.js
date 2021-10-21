const mongoose = require("mongoose");
const { isInt } = require("validator");

const stockSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imgCaption: {
      type: String,
      trim: true,
    },
    imgURLs: [
      {
        type: String,
        trim: true,
      },
    ],
    type: {
      // type of product
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
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
