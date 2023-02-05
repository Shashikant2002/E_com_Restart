const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const errorMidddleWare = require("./middleWare/error");

app.use(express.json());
app.use(cookieParser());

// For Server Testing
app.get("/", (req, res) => {
  res.status(200).json({ Message: "Successful" });
});
//Routes
const productRotue = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");

app.use("/api/v1", productRotue); 
app.use("/api/v1", userRoute);

// Middlewere for Error
app.use(errorMidddleWare);

module.exports = app;
