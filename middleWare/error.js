const ErrorHandaner = require("../utils/errorHandeler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong Mongo DB Error
  if (err.name === "CastError") {
    const message = `Resource not Found. Invalid ${err.path}`;
    err = new ErrorHandaner(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
