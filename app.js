const path = require("path");
const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globlErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const viewRouter = require("./routes/viewRouter");
const reviewRouter = require("./routes/reviewRouter");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// set security http header
app.use(helmet());

//rate limit
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, wait for an hour",
});
app.use("/api", limiter);

// body parcer reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);
// Data sanitization aginist  NoSql injection

app.use(mongoSanitize());
// Data sanitization against xss
app.use(xss());

// serving Static files
app.use(express.static(path.join(__dirname, "public")));

// pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Router
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/", viewRouter);

// handlong unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`this path ${req.originalUrl} is not found.`, 400));
});

app.use(globlErrorHandler);

module.exports = app;
