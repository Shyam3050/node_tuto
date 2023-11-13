const AppError = require("../utils/appError");

function handleDupFieldsDB(err) {
  const errMsg = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${errMsg} please use another name`;
  return new AppError(message, 400)
}

function handelCastErrDB(err) {
  const message = `invalid ${err.path} and value ${err.value}`;
  return new AppError(message, 400);
}

function sendErrDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}
function sendErrPrd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Sometime went wrong",
    });
  }
}
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.static || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handelCastErrDB(error);
    if (error.code === 11000) error = handleDupFieldsDB(error);
    sendErrPrd(error, res);
  }

  next();
};
