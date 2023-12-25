const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/signup").post(authController.saveUser);
router.route("/login").post(authController.login);
router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetpassword/:token").patch(authController.resetPassword);

router.use(authController.protect);

router.route("/updatepassword").patch(authController.updatepassword);
router
  .route("/updateme")
  .patch(userController.uploadPhoto, userController.updateMe);
router.route("/deleteme").delete(userController.deleteMe);
router.route("/me").get(userController.getMe, userController.getUser);

module.exports = router;
