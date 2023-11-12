function sendErrDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
}
function sendErrPrd(err, res) {
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }else{
    console.log("ERROR",err);
    res.status(500).json({
      status: 'error',
      message: 'Sometime went wrong'
    })
  }
}
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.static || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrPrd(err, res);
  }
 
  next();
};
