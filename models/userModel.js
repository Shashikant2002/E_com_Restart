const mongoose = require("mongoose");
const validator = require("validator");

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

  images: {
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

module.exports = mongoose.model("User", userSchema);
