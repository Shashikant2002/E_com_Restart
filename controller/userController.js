const catchAsyncError = require("../utils/chachAsyncError");
const ErrorHandaner = require("../utils/errorHandeler");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, avtar } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandaner("Please Fill All the Required Field", 400));
  }
  const findUser = await User.findOne({ email: email });

  if (findUser) {
    return next(
      new ErrorHandaner(
        "Email is Already Exist. Please Try another Email Id.",
        400
      )
    );
  }
  const user = await User.create({ name, email, password, avtar });

  await sendToken(user, 200, res);
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandaner("Please Fill All the Required Field", 400));
  }

  //checking if avaible Then Login
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new ErrorHandaner("User Does Not Exist! Please Register.", 401)
    );
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandaner("Invalid Email Password", 401));
  }

  await sendToken(user, 200, res);
});

// Logout User

exports.logOutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
});
