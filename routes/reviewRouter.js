const express = require("express");
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUsersIds,
} = require("../controllers/reviewController");
const { restrictTo, protect } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setTourUsersIds, createReview);

router
  .route("/:id")
  .delete(protect, deleteReview)
  .patch(updateReview);
module.exports = router;
