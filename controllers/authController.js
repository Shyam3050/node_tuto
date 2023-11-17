const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../models/userModal");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
}

exports.saveUser = catchAsync(async (req, res) => {
  console.log(req.body.role);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
  });
  console.log(newUser);

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
  //verufication token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    next(new AppError("User no longer exists", 401));
  }

  // check if user changed password after token was issued.
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  //grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you dont have access it", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) next(new AppError("There is no user with this email", 404));

  // generate random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  // send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `forgot your password send to ${resetURL} with patch request, password & confirmpassword`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token valid for 10mins",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "password Reset url sent to your mail",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExp = undefined;
    user.save({ validateBeforeSave: false });
    return next(new AppError("there was some problem try again"), 500);
  }
  next();
});

exports.resetPassword = async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExp: {
      $gt: Date.now(),
    },
  });

  // if token has not expired and there is user set the new password
  if (!user) {
    return next(new AppError("token is invalid expired", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExp = undefined;
  await user.save();
  // update the changed password at property

  // log the user and send jwt

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
};

exports.updatepassword = catchAsync(async (req, res, next) => {
  // get user from collection
  console.log(req.user);
  const user = await User.findById(req.user.id).select("+password");
  console.log(user);
  // check if posted current password is correct
  if (! await user.correctPassword(req.body.currentPassword, user.password)) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  // update password
  user.password = req.body.updatePassword;
  user.confirmPassword = req.body.confirmUpdatePassword;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // log user in send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
