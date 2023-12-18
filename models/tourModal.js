const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either: easy, medium, difficult",
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  secretTour: {
    type: Boolean,
    default: false,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  },
  startLocation: {
    type: {
      type: String,
      default: "point",
      enum: ["point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  location: [
    {
      type: {
        type: String,
        default: "point",
        enum: ["point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    },
  ],
});
// DOCUMENT MIDDELWARE
// tourSchema.pre("save", function(next) {
//   console.log(this);
//   next();
// });
// tourSchema.post("save", function(next) {
//   console.log("post");
//   next();
// });

// QUERY MIDDELWARE
tourSchema.pre("find", function(n) {
  this.find({ secretTour: { $ne: true } });
  this.shh = "ssss";
  n();
});
tourSchema.post("find", function(doc, n) {
  console.log(doc);
  n();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
