const catchAsyncError = require("../utils/chachAsyncError");
const ErrorHandaner = require("../utils/errorHandeler");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEMail = require("../utils/sendMail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, avtar, cPassword } = req.body;

  if (password !== cPassword) {
    return next(
      new ErrorHandaner("Password Does not Match with Confirm Pasword", 400)
    );
  }

  if (!name || !email || !password) {
    return next(new ErrorHandaner("Please Fill All the Required Field", 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(avtar, {
    folder: "e_com/avtar",
    // width: 150,
    // crop: "scale",
  });

  const findUser = await User.findOne({ email: email });

  if (findUser) {
    return next(
      new ErrorHandaner(
        "Email is Already Exist. Please Try another Email Id.",
        400
      )
    );
  }
  const user = await User.create({
    name,
    email,
    password,
    avtar: {
      publicId: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

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
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/resetpassword/${resetToken}`;

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

// Update Password
exports.updatPassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confPassword } = req.body;

  if (!oldPassword || !newPassword || !confPassword) {
    return next(new ErrorHandaner("Fill All The Fields", 400));
  }
  if (newPassword !== confPassword) {
    return next(
      new ErrorHandaner("Password and Confirm Password is not Match", 400)
    );
  }

  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatch = await user.comparePassword(oldPassword);

  if (!isPasswordMatch) {
    return next(
      new ErrorHandaner("Old Password is incorrect Kindly please Check.", 400)
    );
  }

  user.password = newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Update Profile
exports.updatUserProfile = catchAsyncError(async (req, res, next) => {
  const { name, email, avtar } = req.body;

  const newUserData = {
    name: name,
    email: email,
  };

  if (avtar !== "") {
    const user = await User.findById(req.user.id);
    const imgId = user.avtar.publicId;

    await cloudinary.v2.uploader.destroy(imgId);

    const myCloud = await cloudinary.v2.uploader.upload(avtar, {
      folder: "e_com/avtar",
      // width: 150,
      // crop: "scale",
    });

    newUserData.avtar = {
      publicId: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// get all Users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    totalUser: users.length,
    users,
  });
});

// get single Users
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const { userID } = req.params;

  if (!userID) {
    return next(new ErrorHandaner("Fill The User ID.", 400));
  }

  const users = await User.findById(userID);

  if (!users) {
    return next(new ErrorHandaner("User Not Found.", 404));
  }

  res.status(200).json({
    success: true,
    users,
  });
});

// Update User Role
exports.UpdateUserRole = catchAsyncError(async (req, res, next) => {
  const { userID, role } = req.body;

  if (!userID) {
    return next(new ErrorHandaner("Fill The User ID.", 400));
  }

  const user = await User.findByIdAndUpdate(
    userID,
    { role: role },
    { new: true, runValidators: true, useFindAndModify: false }
  );

  if (!user) {
    return next(new ErrorHandaner("User Not Found.", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete User
exports.deletUser = catchAsyncError(async (req, res, next) => {
  const { userID } = req.params;
  if (!userID) {
    return next(new ErrorHandaner("Please Fill The Id", 404));
  }

  const user = await User.findById(userID);

  if (!user) {
    return next(new ErrorHandaner(`User Not Found by this id: ${userID}`, 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Delete Successful",
    user,
  });
});
