const User = require("../models/userModal");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

function signToken(id){
  return jwt.sign({ id}, process.env.JWT_SECRET, {
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

  const token =  signToken(newUser._id)
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
  const user = await User.findOne({email}).select('+password');
  console.log(user);
  if(!user || !(await user.correctPassword(password,user.password))){
    return next(new AppError('incorrect email and password', 401))
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};
