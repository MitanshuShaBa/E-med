const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Medicine", medicineSchema);
