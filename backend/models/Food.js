const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },
    size: {
      type: Number,
      min: 1,
      max: 5000,
      default: 1,
    },
    calories: {
      type: Number,
      required: [true, "Please enter calories intake"],
      min: 1,
      max: 5000,
    },
    meal: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snacks"],
      default: "snacks",
    },
    dateEaten: {
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

module.exports = mongoose.model("Food", FoodSchema);
