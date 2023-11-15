const { promisify } = require("util");
const User = require("../models/userModal");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
}

exports.saveUser = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("please provide password, email", 404));
  }
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email and password", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // getting token check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not loggedin please login to access", 401)
    );
  }
  //verufucation token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    next(new AppError("User no longer exists", 401));
  }
  // check if user changed password after the token was expired

  //grant access to protected route
  req.user = currentUser;
  next();
});
