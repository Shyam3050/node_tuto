const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

const app = require("./app");
const Tour = require("./models/tourModal");

const allTours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8")
);
console.log(allTours)

const exportAllData = async () => {
  try {
    await Tour.create(allTours);
    console.log("data updated ..");
  } catch {}
};
const deleteAll = async () => {
  try {
    await Tour.deleteMany();
    console.log("all data delete ");
  } catch {}
};

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("db connected...."));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
exportAllData();
// deleteAll()
