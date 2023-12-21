const User = require("../models/userModal");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { getOne } = require("./handlerFactory");

const filteredObj = (body, ...allowFields) => {
  const newObj = {};
  Object.keys(body).forEach((field) => {
    if (allowFields.includes(field)) newObj[field] = body[field];
  });
  return newObj;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next()
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    result: users.length,
    data: users,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: "success",
    message: "deleted successfully",
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // if users post password then push error
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "this route not for update password for update checkout /updatepassword",
        400
      )
    );
  }
  // update password
  const filteredField = filteredObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredField, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

exports.getUser = getOne(User)