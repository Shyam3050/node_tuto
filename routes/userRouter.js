const express = require("express");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.saveUser);
router.route("/login").post(authController.login);

module.exports = router;
