const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot Exceed 30 Character"],
    minLength: [3, "Name Cannot Less Then 3 Character"],
  },

  email: {
    type: String,
    required: [true, "Please Enter Your E-Mail"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },

  password: {
    type: String,
    required: [true, "Please Enter Password"],
    minLength: [8, "Password Cannot less Then 8 Character"],
    select: false,
  },

  avtar: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  role: {
    type: String,
    default: "User",
  },

  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpire: {
    type: Date,
  },
});

// Password not change when we modify a data
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Createing JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPassword = async function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding Reset Password Token to User
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire =
    Date.now() + process.env.RESET_PASSWORD_TOKEN * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
