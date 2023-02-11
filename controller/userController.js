const catchAsyncError = require("../utils/chachAsyncError");
const ErrorHandaner = require("../utils/errorHandeler");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEMail = require("../utils/sendMail");
const crypto = require("crypto");

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

// Forget Password
exports.forGetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandaner("Enter Your Email.", 402));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandaner("User Not Found", 404));
  }

  //Get Reset Password Token
  const resetToken = await user.getResetPassword();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password Reset Token is:- \n\n ${resetPasswordUrl} \n \n \n if You Have Not Requested this email Ignote it.`;

  try {
    await sendEMail({
      email: user.email,
      subject: "E-Commerce Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Send to ${user.email} Successfully`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandaner(`Error: ${err}`, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorHandaner("Please Fill All Field and Try again.", 404));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandaner(
        "Reset Password Token is invalid or Has been Expired",
        404
      )
    );
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandaner("Password Does not match to password.", 404));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});
