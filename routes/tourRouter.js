const express = require("express");
const tourController = require("../controllers/tourController");
const reviewRouter = require("../routes/reviewRouter");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();

// router.param('id', tourController.checkID);

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourController.alisTopTour, tourController.getAllTour);

router
  .route("/")
  .get( tourController.getAllTour)
  .post(protect, restrictTo("admin", "lead-guide"), tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch( protect,
    restrictTo("admin", "lead-guide"),tourController.updateTour)
  .delete(
    protect,
    restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

// router
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview);

module.exports = router;
