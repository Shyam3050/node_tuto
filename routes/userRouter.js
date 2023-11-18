const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("../controllers/userController")

const router = express.Router();

router.route("/signup").post(authController.saveUser);
router.route("/login").post(authController.login);
router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetpassword/:token").patch(authController.resetPassword);
router.route("/updatepassword").patch(authController.protect, authController.updatepassword)
router.route("/updateme").patch(authController.protect, userController.updateMe)
router.route("/deleteme").delete(authController.protect, userController.deleteMe)


module.exports = router;
