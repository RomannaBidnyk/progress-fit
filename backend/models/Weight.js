const mongoose = require("mongoose");

const WeightSchema = new mongoose.Schema(
  {
    weight: {
      type: Number,
      required: [true, "Please provide weight"],
      min: 2,
      max: 1000,
    },
    weightOnDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Weight", WeightSchema);
