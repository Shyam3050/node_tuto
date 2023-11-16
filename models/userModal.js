const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  role: {
    type: String,
    enum: ["admin", "user", "guide", "lead-guide"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minLength: 8,
    select: false,
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
  passwordResetToken: String,
  passwordResetExp: Date,
});

userSchema.methods.correctPassword = async (currentPassword, userPassword) => {
  return bcrypt.compare(currentPassword, userPassword);
};

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
});

userSchema.methods.createPasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.passwordResetExp = Date.now() + 10 * 60 * 1000;
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
