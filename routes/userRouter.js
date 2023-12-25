const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("../controllers/userController");
const multer = require("multer");

const upload = multer({
  dest: "public/img/users",
});

const router = express.Router();

router.route("/signup").post(authController.saveUser);
router.route("/login").post(authController.login);
router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetpassword/:token").patch(authController.resetPassword);

router.use(authController.protect);

router.route("/updatepassword").patch(authController.updatepassword);
router
  .route("/updateme")
  .patch(upload.single("photo"), userController.updateMe);
router.route("/deleteme").delete(userController.deleteMe);
router.route("/me").get(userController.getMe, userController.getUser);

module.exports = router;
