const express = require("express");
const tourController = require("./../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route("/top-5-cheap")
  .get(tourController.alisTopTour, tourController.getAllTour);

router
  .route("/")
  .get(protect, tourController.getAllTour)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    protect,
    restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
