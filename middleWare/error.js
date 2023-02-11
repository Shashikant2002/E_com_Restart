const ErrorHandaner = require("../utils/errorHandeler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong Mongo DB Error
  if (err.name === "CastError") {
    const message = `Resource not Found. Invalid ${err.path}`;
    err = new ErrorHandaner(message, 400);
  }

  // Mongoose Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyvalue)} Entered`;
  }

  //Wrong jwt token Error
  if (err.name === "jsonWebTokenError") {
    const message = `json web token is invalid try again`;
    err = new ErrorHandaner(message, 400);
  }

  //jwt Expire Error
  if (err.name === "tokenExpireError") {
    const message = `Json Web Token is expired`;
    err = new ErrorHandaner(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
