const Review = require("../models/reviewModal");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, createOne } = require("./handlerFactory");

exports.getAllReviews = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setTourUsersIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);
exports.createReview = createOne(Review)


