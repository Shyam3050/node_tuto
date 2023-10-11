const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRouter");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//Router
app.use("/api/v1/tours", tourRouter);

module.exports = app;
