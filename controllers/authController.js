const User = require("../models/userModal");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

exports.saveUser = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});
