const catchAsyncError = require("../utils/chachAsyncError");
const ErrorHandaner = require("../utils/errorHandeler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUSer = catchAsyncError(async (req, res, next) => {
  const { token } = await req.cookies;

  if (!token) {
    return next(new ErrorHandaner("Please Login And Try Again Later.", 400));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedData.id);
  req.user = user;

  next();
});

exports.authorizeRole = (...Role) => {
  return (req, res, next) => {
    if (!Role.includes(req.user.role)) {
      return next(
        new ErrorHandaner(
          `Role: ${req.user.role} is not allowed to  access this Resource`,
          400
        )
      );
    }

    next();
  };
};
