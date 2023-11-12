const path = require("path");
const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globlErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRouter");
const viewRouter = require("./routes/viewRouter");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// serving Static files
app.use(express.static(path.join(__dirname, "public")));

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//Router
app.use("/api/v1/tours", tourRouter);
app.use("/", viewRouter);

// handlong unhandled routes  
app.all("*", (req, res, next) => {
  next(new AppError(`this path ${req.originalUrl} is not found.`));
});

app.use(globlErrorHandler);

module.exports = app;
