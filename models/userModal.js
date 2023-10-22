const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell you name"],
  },
  email: {
    type: String,
    required: [true, "Email should unique"],
    unique: [true, "email is already have"],
    lowecase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "please provide password"],
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm password"],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
    },
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
