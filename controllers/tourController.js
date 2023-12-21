const Tour = require("../models/tourModal");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { deleteOne, updateOne, createOne, getOne } = require("./handlerFactory");

exports.alisTopTour = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name, price,difficulty, ratingsAverage, summary";
  next();
};

exports.getAllTour = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const allTours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: allTours.length,
    data: {
      tour: allTours,
    },
  });
});

exports.getTour = getOne(Tour, "reviews");
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);
exports.createTour = createOne(Tour);
