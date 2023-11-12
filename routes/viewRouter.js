const express = require("express");
const viewController = require("../controllers/viewController");

const router = express.Router();

router.route("/").get(viewController.getoverview);
router.route("/tour").get(viewController.getTour);

module.exports = router;
