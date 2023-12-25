const User = require("../models/userModal");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { getOne } = require("./handlerFactory");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not a image please upload only image", 400), false);
  }
};
const upload = multer({
  fileFilter: multerFilter,
  storage: multerStorage,
});
exports.uploadPhoto = upload.single("photo");

const filteredObj = (body, ...allowFields) => {
  const newObj = {};
  Object.keys(body).forEach((field) => {
    if (allowFields.includes(field)) newObj[field] = body[field];
  });
  return newObj;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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
  console.log(req.body);
  console.log(req.file);
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

exports.getUser = getOne(User);
