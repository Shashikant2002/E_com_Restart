const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const errorMidddleWare = require("./middleWare/error");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// For Server Testing
app.get("/", (req, res) => {
  res.status(200).json({ Message: "Successful" });
});
//Routes
const productRotue = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");

app.use("/api/v1", productRotue);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);

// Middlewere for Error
app.use(errorMidddleWare);

module.exports = app;
