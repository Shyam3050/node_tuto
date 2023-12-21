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
router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setTourUsersIds, createReview);

router
  .route("/:id")
  .delete(authController.restrictTo("user", "admin"), deleteReview)
  .patch(authController.restrictTo("user", "admin"), updateReview);
module.exports = router;
