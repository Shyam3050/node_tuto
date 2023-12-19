const mongoose = require("mongoose");

const reviewModalSchema = mongoose.Schema({
  review: {
    type: String,
    require: [true, "A review cannot be empty"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: [
    {
      type: mongoose.ObjectId,
      ref: "User",
      required: [true, "Review must be belong to user"],
    },
  ],
  tour: [
    {
      type: mongoose.ObjectId,
      ref: "Tour",
      required: [true, "Review must be belong to tour"],
    },
  ],
});

const Review = mongoose.model("Review", reviewModalSchema);

module.exports = Review;
