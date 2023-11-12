const Tour = require("../models/tourModal");

exports.getoverview = async (req, res) => {
  // get all tour data
  const tours = await Tour.find();
 
  // create template

  // render template
  res.status(200).render("overview", {
    title: "All tours",
    tours
  });
};

exports.getTour = (req, res) => {
  res.status(200).render("tour", {
    title: "the forest Hiker",
  });
};
